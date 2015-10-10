using CefSharp;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace Google_Play_Music
{
    class GPMResouceHandlerFactory : IResourceHandlerFactory
    {

        public IResourceHandler GetResourceHandler(IWebBrowser browserControl, IBrowser browser, IFrame frame, IRequest request)
        {
            if (Regex.Match(request.Url, @"polymer_srcs.js", RegexOptions.IgnoreCase).Success)
            {
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
}
