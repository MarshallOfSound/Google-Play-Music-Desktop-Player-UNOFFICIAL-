using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;

namespace Google_Play_Music.Utilities
{
    class Updater
    {
        // Singleton
        private static Updater instance;

        // Events
        public delegate void UpdateStatusChangeHandler(object sender, UpdateStatusEventArgs e);
        public event UpdateStatusChangeHandler OnStateChange;

        private void SetState(State state)
        {
            SetState(state, 0);
        }

        private void SetState(State state, int downloadProgress)
        {
            Updater.state = state;
            // Make sure someone is listening to event
            if (OnStateChange == null) return;

            UpdateStatusEventArgs args = new UpdateStatusEventArgs(state, downloadProgress);
            OnStateChange(this, args);
        }

        // Public Vars
        public static State state = State.PENDING;
        public static int DownloadProgress = 0;
        public bool Ignore = false;

        private Updater()
        {
            SetState(State.PENDING);
            this.OnStateChange += (sender, e) =>
            {
                if (e.State == State.READY && !Ignore)
                {
                    DownloadComplete();
                }
            };
        }

        public static Updater Instance(CoreMusicApp parent)
        {
            Updater.parent = parent;
            if (instance == null)
            {
                instance = new Updater();
            }
            return instance;
        }

        // Vars
        private static CoreMusicApp parent;
        private GithubRelease update;
        private Asset updateAsset;
        private static bool is64BitProcess = (IntPtr.Size == 8);

        private GithubRelease SelectLatestRelease(List<GithubRelease> releaseList, bool isBeta)
        {
            Version minimumVersion = new Version(0, 0, 0);
            GithubRelease latestRelease = releaseList[0];
            releaseList.ForEach((release) =>
            {
                Version tmpVersion = new Version(release.tag_name);
                if (minimumVersion < tmpVersion)
                {
                    if (release.prerelease == isBeta || isBeta)
                    {
                        minimumVersion = tmpVersion;
                        latestRelease = release;
                    }
                }
            });
            return latestRelease;
        }

        public bool CheckForUpdates()
        {
            // If we aren't pending a check, don't check anything...
            if (state != State.PENDING)
            {
                return false;
            }
            SetState(State.CHECKING);
            try
            {
                WebClient fetcher = (new WebClient());
                fetcher.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)");
                var APIResponse = fetcher.DownloadString("https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases");
                List<GithubRelease> releaseList = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<List<GithubRelease>>(APIResponse);
                GithubRelease latestRelease = this.SelectLatestRelease(releaseList, Properties.Settings.Default.BetaStream);
                this.update = latestRelease;
                bool isBetter = new Version(latestRelease.tag_name) > new Version(CoreMusicApp.CURRENT_VERSION);
                if (!isBetter) {
                    SetState(State.PENDING);
                }
                return isBetter;
            }
            catch (Exception e)
            {
                // Something went wrong while fetching from the GitHub API
                SetState(State.PENDING);
                return false;
            }
        }

        public void StartDownload()
        {
            SetState(State.DOWNLOADING);
            // If update hasn't been set, stop here and now
            if (update == null)
            {
                return;
            }
            updateAsset = null;
            foreach (Asset releaseAsset in update.assets)
            {
                Regex Test64Bit = new Regex(@"x64");
                Match is64Bit = Test64Bit.Match(releaseAsset.browser_download_url);
                if (is64Bit.Success && is64BitProcess)
                {
                    updateAsset = releaseAsset;
                }
                else if (!is64Bit.Success && !is64BitProcess)
                {
                    updateAsset = releaseAsset;
                }
            }
            if (updateAsset == null)
            {
                SetState(State.PENDING);
                return;
            }
            string filePath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\GPMDP\Updates\Google.Play.Music.Desktop.Player.Update." + update.tag_name + ".exe";
            (new FileInfo(filePath)).Directory.Create();
            DownloadFile(updateAsset.browser_download_url, filePath, updateAsset.size);
        }

        private void DownloadFile(string url, string path, int remoteSize)
        {
            // First we should check if the file is already available locally, silly to download twice
            if (File.Exists(path))
            {
                int existingSize = (int)new FileInfo(path).Length;
                // Possibly should modify this to be a MD5 check or something
                if (remoteSize == existingSize)
                {
                    SetState(State.READY);
                    return;
                }
            }
            // If we don't have it... we should download it
            WebClient downloader = new WebClient();
            downloader.DownloadFileCompleted += (send, e) =>
            {
                SetState(State.READY);
            };
            downloader.DownloadProgressChanged += (send, e) =>
            {
                DownloadProgress = e.ProgressPercentage;
                SetState(State.DOWNLOADING, e.ProgressPercentage);
            };
            downloader.DownloadFileAsync(new Uri(url), path);
        }

        private void DownloadComplete()
        {
            UpdateDialog dialog = new UpdateDialog(update.body, CoreMusicApp.CURRENT_VERSION, update.tag_name);
            Point middleOfParent = new Point(parent.Location.X + (parent.Size.Width / 2), parent.Location.Y + (parent.Size.Height / 2));
            dialog.Location = new Point(middleOfParent.X - (dialog.Width / 2), middleOfParent.Y - (dialog.Height / 2));
            var result = dialog.ShowDialog(parent);
            dialog.Dispose();
            if (result == DialogResult.Yes)
            {
                Install();
            } else if (result == DialogResult.Cancel)
            {
                Ignore = true;
            }
        }

        public void Install()
        {
            parent.Invoke((MethodInvoker)delegate
            {
                parent.GPMBrowser.GetBrowser().CloseBrowser(true);
                parent.Close();
                parent.Dispose();
                Process.Start(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\GPMDP\Updates\Google.Play.Music.Desktop.Player.Update." + update.tag_name + ".exe");
            });
        }
    }

    public class GithubRelease
    {
        public List<Asset> assets { get; set; }
        public string body { get; set; }
        public bool prerelease { get; set; }
        public string tag_name { get; set; }
    }

    public class Asset
    {
        public string browser_download_url { get; set; }
        public int size { get; set; }
    }

    public enum State
    {
        // Waiting for the next update check interval
        PENDING = 0,
        // Currently checking if an update is available
        CHECKING = 1,
        // Downloading an update
        DOWNLOADING = 2,
        // Ready to install an update
        READY = 3,
    };

    public class UpdateStatusEventArgs : EventArgs
    {
        public State State { get; private set; }
        public int DownloadProgress { get; private set; }
        
        public UpdateStatusEventArgs(State state, int downloadProgress)
        {
            State = state;
            DownloadProgress = downloadProgress;
        }
    }
}
