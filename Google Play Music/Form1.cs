using CefSharp;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using Utilities;
using Microsoft.WindowsAPICodePack.Taskbar;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using Newtonsoft.Json;

namespace Google_Play_Music
{
    public partial class Form1 : Form
    {

        private const string CURRENT_VERSION = "1.3.4";

        public Form1()
        {
            InitializeForm();

            this.Size = new Size(1080, 720);
            this.Icon = Properties.Resources.Icon1;
            this.Text = "Google Music Player";

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
                            this.BeginInvoke(new MethodInvoker(Close));
                        }).Start();
                        return;
                    }
                }
            } catch (Exception)
            {
                // Something went wrong while fetching from the GitHub API
            }
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
            prevTrackButton.Click += prevTrackButton_Click;

            nextTrackButton = new ThumbnailToolBarButton(Properties.Resources.NextTrack, "Next Track");
            nextTrackButton.Click += nextTrackButton_Click;


            playPauseButton = new ThumbnailToolBarButton(Properties.Resources.Play, "Play / Pause");
            playPauseButton.Click += playPauseButton_Click;

            TaskbarManager.Instance.ThumbnailToolBars.AddButtons(this.Handle, prevTrackButton, playPauseButton, nextTrackButton);
        }

        private void prevTrackButton_Click(object sender,
ThumbnailButtonClickedEventArgs e)
        {
            this.prevTrack();
        }

        private void nextTrackButton_Click(object sender,
ThumbnailButtonClickedEventArgs e)
        {
            this.nextTrack();
        }

        private void playPauseButton_Click(object sender,
ThumbnailButtonClickedEventArgs e)
        {
            this.playPause();
        }

        // CefSharp configuration
        private CefSharp.WinForms.ChromiumWebBrowser webBrowser1;
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
                MenuHandler = new NoMenuHandler()
            };
            webBrowser1.RegisterAsyncJsObject("csharpinterface", this);

            webBrowser1.Dock = DockStyle.Fill;

            Controls.AddRange(new Control[] {
            webBrowser1 });

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

        private SongAlert alert = null;

        // Fired from javascript when a different song starts playing
        public void songChangeEvent(string song, string artist, string album, string url)
        {
            new Thread(() =>
            {
                // If the alert box already exists we need to kill it
                // Trick the timer into thinking it is over
                if (alert != null)
                {
                    alert.currentStep = 99999;
                }
                alert = new SongAlert(song, artist, album, url);
                alert.FormClosing += new FormClosingEventHandler(Song_Alert_Close);
                Application.Run(alert);
            }).Start();
        }

        // When the SongAlery closes set it to null in this scope so we know
        private void Song_Alert_Close(object sender, FormClosingEventArgs e)
        {
            alert = null;
        }

        private void Form1_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            try {
                // Make sure we unhook once the form closes
                if (gkh != null)
                {
                    gkh.unhook();
                }
                alert.currentStep = 99999;
            } catch (Exception) {
                // Do nothing
            }
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
    }
}

public class GPMResouceHandlerFactory : IResourceHandlerFactory
{

    public IResourceHandler GetResourceHandler(IWebBrowser browserControl, IBrowser browser, IFrame frame, IRequest request)
    {
        if (Regex.Match(request.Url, @"polymer_srcs.js", RegexOptions.IgnoreCase).Success)
        {
            Debug.WriteLine("Injected JS into response");
            using (WebClient webClient = new WebClient())
            {
                // These are the JS files to inject into GPM
                string dark_theme = Google_Play_Music.Properties.Resources.dark_theme;
                string custom_interface = Google_Play_Music.Properties.Resources.custom_interface;
                return ResourceHandler.FromStream(new MemoryStream(Encoding.UTF8.GetBytes(webClient.DownloadString(request.Url) + dark_theme + custom_interface)), webClient.ResponseHeaders["Content-Type"]);
            }
        }
        return null;
    }
    public bool HasHandlers
    {
        get
        {
            return true;
        }
    }
}

public class NoMenuHandler : IContextMenuHandler
{
    public bool OnBeforeContextMenu(IWebBrowser browser, IContextMenuParams param)
    {
        return false;
    }

    public void OnBeforeContextMenu(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters, IMenuModel model)
    {
        model.Clear();
    }

    public bool OnContextMenuCommand(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters, CefMenuCommand commandId, CefEventFlags eventFlags)
    {
        return false;
    }

    public void OnContextMenuDismissed(IWebBrowser browserControl, IBrowser browser, IFrame frame)
    {
        // Do nothing
    }
}