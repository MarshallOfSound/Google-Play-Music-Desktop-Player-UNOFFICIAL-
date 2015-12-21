using System;
using System.Diagnostics;
using System.Net;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using System.Text.RegularExpressions;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        static bool is64BitProcess = (IntPtr.Size == 8);

        private void CheckForUpdates()
        {
            try
            {
                WebClient fetcher = (new WebClient());
                fetcher.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)");
                var content = fetcher.DownloadString("https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/latest");

                GithubRelease g = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(GithubRelease)).ReadObject(new System.IO.MemoryStream(System.Text.Encoding.Unicode.GetBytes(content))) as GithubRelease;

                string version = g.TagName;
                string changeLog = g.LongPropertyName;
                string downloadUrl32 = "";
                string downloadUrl64 = "";

                foreach (Asset a in g.Assets)
                {
                    Regex test = new Regex(@"x64");
                    Match match = test.Match(a.BrowserDownloadUrl);
                    if (match.Success)
                    {
                        downloadUrl64 = a.BrowserDownloadUrl;
                    }
                    else
                    {
                        downloadUrl32 = a.BrowserDownloadUrl;
                    }
                }

                string downloadUrl = (is64BitProcess ? downloadUrl64 : downloadUrl32);
                if (downloadUrl == "")
                {
                    return;
                }

                // If the newest version is not the current version there must be an update available
                if (version != CURRENT_VERSION)
                {
                    UpdateDialog dialog = new UpdateDialog(changeLog, CURRENT_VERSION, version);
                    var result = dialog.ShowDialog(this);
                    dialog.Dispose();
                    if (result == DialogResult.Yes)
                    {
                        // Download the Resource URL from the GitHub API
                        Process.Start(downloadUrl);
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
            catch (Exception e)
            {
                // Something went wrong while fetching from the GitHub API
                Program.Logger.Error("Error while fetching from GitHub API", e);
            }
        }
    }
    [System.Runtime.Serialization.DataContract]
    public class GithubRelease
    {
        [System.Runtime.Serialization.DataMember(Name = "body", IsRequired = true)]
        public string LongPropertyName { get; set; }
        [System.Runtime.Serialization.DataMember(Name = "tag_name", IsRequired = true)]
        public string TagName { get; set; }
        [System.Runtime.Serialization.DataMember(Name = "assets", IsRequired = true)]
        public List<Asset> Assets { get; set; }
    }

    [System.Runtime.Serialization.DataContract]
    public class Asset
    {
        [System.Runtime.Serialization.DataMember(Name = "browser_download_url", IsRequired = true)]
        public string BrowserDownloadUrl { get; set; }
    }
}
