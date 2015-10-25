using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        private void checkForUpdates()
        {
            HttpWebRequest wrGETURL = (HttpWebRequest)WebRequest.Create("https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases");
            wrGETURL.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)";
            StreamReader strRead;
            try
            {
                strRead = new StreamReader(wrGETURL.GetResponse().GetResponseStream());
            }
            catch (WebException)
            {
                return;
            }

            try
            {
                dynamic JSON = JsonConvert.DeserializeObject(strRead.ReadToEnd());
                string version = JSON[0].tag_name;
                string downloadURL = JSON[0].assets[0].browser_download_url;
                string changeLog = JSON[0].body;
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
                                Close();
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
}
