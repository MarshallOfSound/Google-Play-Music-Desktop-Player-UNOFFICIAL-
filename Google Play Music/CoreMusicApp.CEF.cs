using CefSharp;
using System;
using System.Threading.Tasks;
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

            GPMBrowser = new CefSharp.WinForms.ChromiumWebBrowser("https://play.google.com/music/listen")
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

        public void ZoomInBrowser()
        {
            deltaZoomBrowser(1.2);
        }

        public void ZoomOutBrowser()
        {
            deltaZoomBrowser(1 / 1.2);
        }

        public void ZoomResetBrowser()
        {
            Properties.Settings.Default.MaxiZoomLevel = 0;
            GPMBrowser.SetZoomLevel(0);
        }

        private void deltaZoomBrowser(double delta)
        {
            if (!mini)
            {
                Task<double> zoomRatio = GPMBrowser.GetZoomLevelAsync();
                zoomRatio.Wait();
                double currentZoom = zoomRatio.Result;
                double newZoom = Math.Log10(Math.Pow(10, currentZoom) * delta);
                GPMBrowser.SetZoomLevel(newZoom);
                Properties.Settings.Default.MaxiZoomLevel = newZoom;
            }
        }

        public void navigateBackBrowser()
        {
            GPMBrowser.ExecuteScriptAsync("(function() { window.history.back(); })()");
        }

        public void navigateForwardBrowser()
        {
            GPMBrowser.ExecuteScriptAsync("(function() { window.history.forward(); })()");
        }
    }
}
