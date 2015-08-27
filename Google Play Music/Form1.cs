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

namespace Google_Play_Music
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeForm();

            this.Size = new Size(1080, 720);
            this.Icon = Properties.Resources.Icon1;
            this.Text = "Google Music Player";
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
            Cef.Initialize(settings);

            webBrowser1 = new CefSharp.WinForms.ChromiumWebBrowser("http://play.google.com/music/listen")
            {
                // Use this to inject our theming and modding javascript code
                ResourceHandlerFactory = new GPMResouceHandlerFactory(),
                // Stop that silly right click menu appearing
                MenuHandler = new NoMenuHandler()
            };

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

        private void Form1_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            // Make sure we unhook once the form closes
            gkh.unhook();
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
    public bool HasHandlers
    {
        get
        {
            return true;
        }
    }

    public ResourceHandler GetResourceHandler(IWebBrowser browser, IRequest request)
    {
        if (Regex.Match(request.Url, @"polymer_srcs.js", RegexOptions.IgnoreCase).Success)
        {
            Debug.WriteLine("Injected JS into response");
            using (WebClient webClient = new WebClient())
            {
                string data = Google_Play_Music.Properties.Resources.dark_theme;
                return ResourceHandler.FromStream(new MemoryStream(Encoding.UTF8.GetBytes(webClient.DownloadString(request.Url) + data)), webClient.ResponseHeaders["Content-Type"]);
            }
        }
        return null;
    }

    public void RegisterHandler(string url, ResourceHandler handler)
    {
        // Do nothing
    }

    public void UnregisterHandler(string url)
    {
        // Do nothing
    }
}

public class NoMenuHandler : IMenuHandler
{
    public bool OnBeforeContextMenu(IWebBrowser browser, IContextMenuParams param)
    {
        return false;
    }
}