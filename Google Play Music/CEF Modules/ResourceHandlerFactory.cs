using CefSharp;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace Google_Play_Music
{
    class GPMResouceHandlerFactory : IResourceHandlerFactory
    {
        private bool firstJSOnly = false;
        public IResourceHandler GetResourceHandler(IWebBrowser browserControl, IBrowser browser, IFrame frame, IRequest request)
        {
            // Every time we request the main GPM page allow another JS injection
            if (Regex.Match(request.Url, @"^http[s]?://play\.google\.com/music/listen", RegexOptions.IgnoreCase).Success)
            {
                firstJSOnly = true;
            }
            if (Regex.Match(request.Url, @"\.js", RegexOptions.IgnoreCase).Success && Regex.Match(request.Url, @"http", RegexOptions.IgnoreCase).Success && firstJSOnly)
            {
                firstJSOnly = false;
                using (WebClient webClient = new WebClient())
                {
                    // These are the JS files to inject into GPM
                    string custom_interface = Properties.Resources.custom_interface;

                    return ResourceHandler.FromStream(new MemoryStream(Encoding.UTF8.GetBytes(
                        webClient.DownloadString(request.Url) + ";document.addEventListener('DOMContentLoaded', function () {" +
                            "window.OBSERVER = setInterval(function() { if (document.getElementById('material-vslider')) { clearInterval(window.OBSERVER); " +
                            Properties.Resources.gmusic_min + Properties.Resources.gmusic_theme_min + Properties.Resources.gmusic_mini_player_min +
                            this.getInitCode() +
                            custom_interface +
                        "}}, 10);});")), webClient.ResponseHeaders["Content-Type"]);
                }
            }
            return null;
        }

        private string getInitCode()
        {
            Color c = Properties.Settings.Default.CustomColor;
            string custom_color = "#" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2");

            bool controlsOnHover = Properties.Settings.Default.HoverControls;
            string controlsOnHoverJS = "window.hoverControls = " + controlsOnHover.ToString().ToLower() + ";";

            string init_GPM = "window.GPM = new window.GMusic(window);";
            string init_mini;
            if (Properties.Settings.Default.HoverControls)
            {
                 init_mini = "window.GPM.mini.showControlsWhen('hover');";
            } else
            {
                init_mini = "window.GPM.mini.showControlsWhen('always');";
            }

            string init_GPM_Theme = "window.theme = new window.GMusicTheme({foreSecondary: '" + custom_color + "'});";
            if (Properties.Settings.Default.CustomTheme)
            {
                init_GPM_Theme += "window.theme.enable();";
            }

            string show_GPM_app = "csharpinterface.showApp();";

            return controlsOnHoverJS + init_GPM + init_mini + init_GPM_Theme + show_GPM_app;
        }

        public bool HasHandlers
        {
            get
            {
                return true;
            }
        }
    }
}
