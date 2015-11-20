using System;
using System.Diagnostics;
using System.Net;
using System.Collections.Generic;
using System.Threading;
using System.Windows.Forms;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        private void checkForUpdates()
        {
            try
            {
                WebClient fetcher = (new WebClient());
                fetcher.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)");
                var content = fetcher.DownloadString("https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/latest");
                GithubRelease g = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<GithubRelease>(content);
                string version = g.tag_name;
                string changeLog = g.body;
                string downloadURL = g.assets[0].browser_download_url;

                // If the newest version is not the current version there must be an update available
                if (version != CURRENT_VERSION)
                {
                    UpdateDialog dialog = new UpdateDialog(changeLog, CURRENT_VERSION, version);
                    var result = dialog.ShowDialog(this);
                    dialog.Dispose();
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
                                GPMBrowser.IsBrowserInitializedChanged += (res, se) =>
                                {
                                    if (GPMBrowser.IsBrowserInitialized)
                                    {
                                        Close();
                                    }
                                };
                            };
                        }).Start();
                        return;
                    }
                }
            }
            catch (Exception)
            {
                // Something went wrong while fetching from the GitHub API
            }
        }
    }

    public class GithubRelease
    {
        public string body { get; set; }
        public string tag_name { get; set; }
        public List<Asset> assets { get; set; }
    }

    public class Asset
    {
        public string browser_download_url { get; set; }
    }
}
