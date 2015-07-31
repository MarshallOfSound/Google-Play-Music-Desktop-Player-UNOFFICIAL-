using CefSharp;
using CefSharp.WinForms.Internals;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using Utilities;

namespace Google_Play_Music
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeForm();

            this.Size = new Size(1080, 720);
            this.Icon = Google_Play_Music.Properties.Resources.Icon1;
        }

        private CefSharp.WinForms.ChromiumWebBrowser webBrowser1;
        private globalKeyboardHook gkh = new globalKeyboardHook();

        private void InitializeForm()
        {
            CefSharp.CefSettings settings = new CefSharp.CefSettings();
            settings.CachePath = @"cache";
            CefSharp.Cef.Initialize(settings);

            webBrowser1 = new CefSharp.WinForms.ChromiumWebBrowser("http://play.google.com/music/listen");
            webBrowser1.MenuHandler = new NoMenuHandler();

            webBrowser1.Dock = DockStyle.Fill;

            Controls.AddRange(new Control[] {
            webBrowser1 });

            gkh.HookedKeys.Add(Keys.MediaPlayPause);
            gkh.KeyDown += new KeyEventHandler(gkh_KeyDown);
            gkh.KeyUp += new KeyEventHandler(gkh_KeyUp);

            webBrowser1.NavStateChanged += OnBrowserLoadingStateChanged;
        }

        void gkh_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode.ToString() == "MediaPlayPause")
            {
                webBrowser1.EvaluateScriptAsync("(function() {document.querySelectorAll('[data-id=play-pause]')[0].click()})()");
            }
            e.Handled = false;
        }

        void gkh_KeyDown(object sender, KeyEventArgs e)
        {
            e.Handled = false;
        }

        private void OnBrowserLoadingStateChanged(object sender, NavStateChangedEventArgs args)
        {
            if (!args.IsLoading)
            {
                Debug.WriteLine("Loading Done");
                webBrowser1.EvaluateScriptAsync("(function() {window.onload = function() {" +
                    "document.querySelectorAll('.gb_rb.gb_Ta.gb_r')[0].setAttribute('style', 'position: relative;top: -500px;');" +
                    "document.querySelectorAll('.gb_ga.gb_Ta.gb_r.gb_ma.gb_ja')[0].setAttribute('style', 'position: relative;top: -500px;');" +
                    "}})()");
            }
        }
    }
}

public class NoMenuHandler : IMenuHandler
{
    public bool OnBeforeContextMenu(IWebBrowser browser, IContextMenuParams param)
    {
        return false;
    }
}