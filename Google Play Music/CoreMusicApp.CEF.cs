using CefSharp;
using System;
using System.Windows.Forms;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        public CefSharp.WinForms.ChromiumWebBrowser GPMBrowser;

        private void InitializeCEF()
        {
            CefSettings settings = new CefSharp.CefSettings();
            settings.CachePath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/GPMDP";
            settings.WindowlessRenderingEnabled = true;
            settings.CefCommandLineArgs.Add("enable-smooth-scrolling", "1");
            settings.CefCommandLineArgs.Add("enable-overlay-scrollbar", "1");
            settings.CefCommandLineArgs.Add("enable-npapi", "1");
            Cef.Initialize(settings);

            GPMBrowser = new CefSharp.WinForms.ChromiumWebBrowser("http://play.google.com/music/listen")
            {
                // Use this to inject our theming and modding javascript code
                ResourceHandlerFactory = new GPMResouceHandlerFactory(),
                // Stop that silly right click menu appearing
                MenuHandler = new GPMMenuHandler()
            };
            GPMBrowser.RegisterAsyncJsObject("csharpinterface", new JSBound(this));

            GPMBrowser.Dock = DockStyle.Fill;

            Controls.Add(GPMBrowser);
        }
    }
}
