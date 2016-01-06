using CefSharp;
using System;
using System.Drawing;
using System.Windows.Forms;
using Microsoft.WindowsAPICodePack.Taskbar;
using MaterialSkin;
using MaterialSkin.Controls;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace Google_Play_Music
{
    public partial class CoreMusicApp : MaterialForm
    {

        private const string CURRENT_VERSION = "2.0.2";
        private MaterialSkinManager skin;
        private Size rolling_size;
        private Size last_size;

        public CoreMusicApp()
        {
            restoreMaxiState();
            rolling_size = this.ClientSize;
            last_size = this.ClientSize;
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

            // Setup the Web Browser
            InitializeCEF();

            // Don't forget to save all our settings
            FormClosed += (send, ev) =>
            {
                if (mini)
                {
                    saveMiniState();
                } else
                {
                    if (WindowState != FormWindowState.Normal)
                    {
                        WindowState = FormWindowState.Normal;
                    }
                    if (Maximized)
                    {
                        MaximizeWindow(false);
                    }
                    saveMaxiState();
                }
                Properties.Settings.Default.Save();
            };

            // Check for updates on the Github Release API
            checkForUpdates();
            RegisterKeyHooks();
        }

        protected override void WndProc(ref Message m)
        {
            const int WM_NCCALCSIZE = 0x83;
            const int WM_SIZING = 0x0214;
            const int WM_SIZE = 0x0005;
            const int WM_SYSCOMMAND = 0x0112;
            const int SC_RESTORE = 0xF120;

            if (m.Msg == WM_NCCALCSIZE && m.WParam.ToInt32() == 1)
            {
                if (!mini)
                {
                    m.Result = new IntPtr(0xF0);   // Align client area to all borders (Fake borderless)
                    return;
                }
            }
            else if (m.Msg == WM_SIZING && currently_sizing)
            {
                currently_sizing = false;
                if (!mini)
                {
                    ReleaseCapture();
                    return;
                }
            }
            else if (m.Msg == WM_SIZE)
            {
                OnResize(null);
                if (m.WParam == (IntPtr)2)
                {
                    ClientSize = Size;
                    Invalidate();
                    WindowState = FormWindowState.Normal;
                    Size = last_size;
                    MaximizeWindow(true);
                }
                if (rolling_size == null || rolling_size != Size)
                {
                    if (rolling_size != null)
                    {
                        last_size = rolling_size;
                    }
                    rolling_size = Size;
                }
                return;
            }
            else if (m.Msg == WM_SYSCOMMAND && (int)m.WParam == 0xF030)
            {
                MaximizeWindow(true);
                return;
            } else if (m.Msg == NativeMethods.WM_SHOWME)
            {
                if (WindowState == FormWindowState.Minimized)
                {
                    WindowState = FormWindowState.Normal;
                }
                
                bool top = TopMost;
                TopMost = true;
                TopMost = top;
            }
            base.WndProc(ref m);
            if (m.Msg == WM_SYSCOMMAND && (int)m.WParam == SC_RESTORE)
            {
                if (Size != rolling_size)
                {
                    Size = rolling_size;
                }
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
            skin.ColorScheme = new ColorScheme((Primary)0x444444, (Primary)0x444444, (Primary)0x444444, Accent.Lime700, TextShade.WHITE);
        }

        // Media Functions
        private void playPause()
        {
            GPMBrowser.EvaluateScriptAsync("(function() {window.GPM.playback.playPause();})()");
        }

        private void prevTrack()
        {
            GPMBrowser.EvaluateScriptAsync("(function() {window.GPM.playback.rewind();})()");
        }

        private void nextTrack()
        {
            GPMBrowser.EvaluateScriptAsync("(function() {window.GPM.playback.forward();})()");
        }

        private void findFocus()
        {
            GPMBrowser.EvaluateScriptAsync("(function() {document.querySelectorAll('sj-search-box > input')[0].focus()})()");
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
            var tmp = Size;
            Size = tmp;
            double ratio = D / 300.0;
            // Browser zoom level formula is [percentage] = 1.2 ^ [zoom level]
            // So we reverse to get [zoom level] = Log[percentage] / Log[1.2]
            double factor = Math.Log10(ratio) / Math.Log10(1.2);
            GPMBrowser.SetZoomLevel(factor);
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

        public bool ApplicationIsActivated()
        {
            var activatedHandle = GetForegroundWindow();
            if (activatedHandle == IntPtr.Zero)
            {
                return false;       // No window is currently activated
            }

            var procId = Process.GetCurrentProcess().Id;
            int activeProcId;
            GetWindowThreadProcessId(activatedHandle, out activeProcId);

            return activeProcId == procId;
        }


        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern int GetWindowThreadProcessId(IntPtr handle, out int processId);
    }
}