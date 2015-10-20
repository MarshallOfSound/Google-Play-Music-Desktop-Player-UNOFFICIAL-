using CefSharp;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using Utilities;
using Microsoft.WindowsAPICodePack.Taskbar;
using System.Net;
using System.IO;
using System.Threading;
using Newtonsoft.Json;
using System.Runtime.InteropServices;
using MaterialSkin;
using MaterialSkin.Controls;

namespace Google_Play_Music
{
    public partial class CoreMusicApp : MaterialForm
    {

        private const string CURRENT_VERSION = "1.5.0";
        private MaterialSkinManager skin;

        public CoreMusicApp()
        {
            Icon = Properties.Resources.MainIcon;
            Text = "Google Music Player";
            StartPosition = FormStartPosition.Manual;
            BackColor = Color.Black;
            // Stop the form disapearing
            MinimumSize = new Size(100, 100);

            skin = MaterialSkinManager.Instance;
            skin.AddFormToManage(this);
            if (Properties.Settings.Default.CustomTheme)
            {
                darkTheme();
            }
            else
            {
                lightTheme();
            }

            // Handle smaller mini player by changing the browser zoom level
            ResizeEnd += new EventHandler(ResizeEnd_ZoomHandler);

            // Initially go to Maxi
            restoreMaxiState();

            // Setup the Web Browser
            InitializeForm();

            // Don't forget to save all our settings
            FormClosed += (send, ev) =>
            {
                if (mini)
                {
                    saveMiniState();
                } else
                {
                    saveMaxiState();
                }
                Properties.Settings.Default.Save();
            };


            // Check for updates on the Github Release API
            HttpWebRequest wrGETURL = (HttpWebRequest)WebRequest.Create("https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases");
            wrGETURL.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)";
            StreamReader strRead;
            try {
                strRead = new StreamReader(wrGETURL.GetResponse().GetResponseStream());
            } catch (WebException)
            {
                return;
            }

            try {
                dynamic JSON = JsonConvert.DeserializeObject(strRead.ReadToEnd());
                string version = JSON[0].tag_name;
                string downloadURL = JSON[0].assets[0].browser_download_url;
                // If the newest version is not the current version there must be an update available
                if (version != CURRENT_VERSION)
                {
                    var result = MessageBox.Show("There is an update available for this player, do you want to download it now?", "Update Available", MessageBoxButtons.YesNo, MessageBoxIcon.Information);
                    if (result == DialogResult.Yes)
                    {
                        // Download the Resource URL from the GitHub API
                        Process.Start(downloadURL);
                        // Let the form finish initialising before closing it through an asyncronous method invoker
                        // Prevents strange garbage collection
                        new Thread(() =>
                        {
                            Load += (send, ev) =>
                            {
                                Close();
                            };
                        }).Start();
                        return;
                    }
                }
            } catch (Exception)
            {
                // Something went wrong while fetching from the GitHub API
            }
        }

        public void lightTheme()
        {
            Properties.Settings.Default.CustomTheme = false;
            skin.Theme = MaterialSkinManager.Themes.LIGHT;
            skin.ColorScheme = new ColorScheme(Primary.Orange800, Primary.Orange800, Primary.Orange800, Accent.Lime700, TextShade.WHITE);
        }

        public void darkTheme()
        {
            Properties.Settings.Default.CustomTheme = true;
            skin.Theme = MaterialSkinManager.Themes.DARK;
            skin.ColorScheme = new ColorScheme((Primary)0x444444, (Primary)0x444444, (Primary)0x444444, Accent.Lime700, TextShade.BLACK);
        }

        // Media Functions
        private void playPause()
        {
            webBrowser1.EvaluateScriptAsync("(function() {document.querySelectorAll('[data-id=play-pause]')[0].click()})()");
        }

        private void prevTrack()
        {
            webBrowser1.EvaluateScriptAsync("(function() {document.querySelectorAll('[data-id=rewind]')[0].click()})()");
        }

        private void nextTrack()
        {
            webBrowser1.EvaluateScriptAsync("(function() {document.querySelectorAll('[data-id=forward]')[0].click()})()");
        }

        // Task Bar Media Controls
        private ThumbnailToolBarButton prevTrackButton;
        private ThumbnailToolBarButton nextTrackButton;
        private ThumbnailToolBarButton playPauseButton;

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            prevTrackButton = new ThumbnailToolBarButton(Properties.Resources.PrevTrack, "Previous Track");
            prevTrackButton.Click += (send, ev) =>
            {
                this.prevTrack();
            };

            nextTrackButton = new ThumbnailToolBarButton(Properties.Resources.NextTrack, "Next Track");
            nextTrackButton.Click += (send, ev) =>
            {
                this.nextTrack();
            };


            playPauseButton = new ThumbnailToolBarButton(Properties.Resources.Play, "Play / Pause");
            playPauseButton.Click += (send, ev) =>
            {
                this.playPause();
            };

            TaskbarManager.Instance.ThumbnailToolBars.AddButtons(this.Handle, prevTrackButton, playPauseButton, nextTrackButton);
        }

        // CefSharp configuration
        public CefSharp.WinForms.ChromiumWebBrowser webBrowser1;
        private static globalKeyboardHook gkh;

        private void InitializeForm()
        {
            CefSettings settings = new CefSharp.CefSettings();
            settings.CachePath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/GPMDP";
            settings.WindowlessRenderingEnabled = true;
            settings.CefCommandLineArgs.Add("enable-smooth-scrolling", "1");
            settings.CefCommandLineArgs.Add("enable-overlay-scrollbar", "1");
            settings.CefCommandLineArgs.Add("enable-npapi", "1");
            Cef.Initialize(settings);

            webBrowser1 = new CefSharp.WinForms.ChromiumWebBrowser("http://play.google.com/music/listen")
            {
                // Use this to inject our theming and modding javascript code
                ResourceHandlerFactory = new GPMResouceHandlerFactory(),
                // Stop that silly right click menu appearing
                MenuHandler = new GPMMenuHandler()
            };
            webBrowser1.RegisterAsyncJsObject("csharpinterface", new JSBound(this));

            webBrowser1.Dock = DockStyle.Fill;

            Controls.Add(webBrowser1);

            gkh = new globalKeyboardHook();

            // Don't let the Garbage Man interfere
            GC.KeepAlive(gkh);

            // Global Hotkey Listener
            gkh.HookedKeys.Add(Keys.MediaPlayPause);
            gkh.HookedKeys.Add(Keys.MediaNextTrack);
            gkh.HookedKeys.Add(Keys.MediaPreviousTrack);
            gkh.HookedKeys.Add(Keys.MediaStop);
            gkh.KeyDown += new KeyEventHandler(gkh_KeyDown);
            gkh.KeyUp += new KeyEventHandler(gkh_KeyUp);
        }

        public Boolean handleZoom = false;

        private void ResizeEnd_ZoomHandler(object sender, EventArgs e)
        {
            if (handleZoom)
            {
                setZoomRatio();
            }
        }

        private void setZoomRatio()
        {
            // The mini player must always be a square
            int D = Math.Max(ClientSize.Width, ClientSize.Height);
            ClientSize = new Size(D, D);
            double ratio = D / 300.0;
            // Browser zoom level formula is [percentage] = 1.2 ^ [zoom level]
            // So we reverse to get [zoom level] = Log[percentage] / Log[1.2]
            double factor = Math.Log10(ratio) / Math.Log10(1.2);
            webBrowser1.SetZoomLevel(factor);
        }

        void gkh_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode.ToString())
            {
                case "MediaPlayPause":
                    this.playPause();
                    break;
                case "MediaStop":
                    this.playPause();
                    break;
                case "MediaNextTrack":
                    this.nextTrack();
                    break;
                case "MediaPreviousTrack":
                    this.prevTrack();
                    break;
            }
            e.Handled = false;
        }

        void gkh_KeyDown(object sender, KeyEventArgs e)
        {
            e.Handled = false;
        }

        public void fadeInOut(Func<int> call)
        {
            System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
            timer.Interval = 2;
            int currentStep = 0;
            int fadeSteps = 20;
            int totalSteps = fadeSteps * 2 + 16;
            Boolean runTick = true;
            timer.Tick += (arg1, arg2) =>
            {
                if (runTick)
                {
                    currentStep++;
                    if (currentStep <= fadeSteps)
                    {
                        Opacity = ((double)(fadeSteps - currentStep) / fadeSteps);
                    }
                    else if (currentStep == fadeSteps + 1)
                    {
                        runTick = false;
                        call();
                        runTick = true;
                    }
                    else if (currentStep <= totalSteps)
                    {
                        Opacity = ((double)(fadeSteps - totalSteps + currentStep)) / fadeSteps;
                    }
                    else
                    {
                        timer.Stop();
                        timer.Dispose();
                    }
                }
            };
            timer.Start();
        }

        public void dragStart()
        {
            // This function fakes a window drag start
            // It is triggered from the boundJS object
            ReleaseCapture();
            SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
        }

        private Point topLeft(Size currentSize, Screen s)
        {
            Point loc = s.WorkingArea.Location;
            int X = (s.WorkingArea.Width / 2) - (currentSize.Width / 2) + loc.X;
            int Y = (s.WorkingArea.Height / 2) - (currentSize.Height / 2) + loc.Y;
            return new Point((X > 0 ? X : 0), (Y > 0 ? Y : 0));
        }

        private Point topLeft(Size currentSize)
        {
            return topLeft(currentSize, Screen.PrimaryScreen);
        }

        private Point topleft()
        {
            return topLeft(Size, Screen.PrimaryScreen);
        }

        private Boolean onScreen(Point p)
        {
            Screen[] screens = Screen.AllScreens;
            foreach (Screen screen in screens)
            {
                if (screen.WorkingArea.Contains(p))
                {
                    return true;
                }
            }
            return false;
        }

        private Boolean mini = false;

        public void restoreMaxiState()
        {
            mini = false;
            // Maxi form settings
            Padding = new Padding(2, 24, 2, 2);
            if (webBrowser1 != null)
            {
                webBrowser1.SetZoomLevel(0);
            }
            MaximumSize = new Size();
            MaximizeBox = true;
            handleZoom = false;
            // Restore Maxi size and pos
            Size savedSize = Properties.Settings.Default.MaxiSize;
            Point savedPoint = Properties.Settings.Default.MaxiPoint;
            if (savedSize.Height == -1 && savedSize.Width == -1)
            {
                savedSize = new Size(1080, 720);
            }
            savedPoint = (onScreen(savedPoint) ? savedPoint : new Point(-1, -1));
            if (savedPoint.X == -1 && savedPoint.Y == -1)
            {
                savedPoint = topLeft(savedSize);
            }
            Location = savedPoint;
            Size = savedSize;
        }

        public void restoreMiniState()
        {
            mini = true;
            // Mini form settings
            Padding = new Padding(2);
            ClientSize = new Size(300, 300);
            MaximizeBox = false;
            MaximumSize = new Size(300, 300);
            handleZoom = true;

            // Restore Mini size and pos
            Size savedSize = Properties.Settings.Default.MiniSize;
            Point savedPoint = Properties.Settings.Default.MiniPoint;
            savedPoint = (onScreen(savedPoint) ? savedPoint : new Point(-1, -1));
            if (savedSize.Height == -1 && savedSize.Width == -1)
            {
                savedSize = new Size(300, 300);
            }
            if (savedPoint.X == -1 && savedPoint.Y == -1)
            {
                savedPoint = topLeft(savedSize);
            }
            Location = savedPoint;
            Size = savedSize;
            setZoomRatio();
        }

        public void saveMaxiState()
        {
            Properties.Settings.Default.MaxiSize = Size;
            Properties.Settings.Default.MaxiPoint = Location;
        }

        public void saveMiniState()
        {
            Properties.Settings.Default.MiniSize = Size;
            Properties.Settings.Default.MiniPoint = Location;
        }
    }
}