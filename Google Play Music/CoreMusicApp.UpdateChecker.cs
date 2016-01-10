using System.Threading;
using System.ComponentModel;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        private void InitializeUpdater()
        {
            updater = Utilities.Updater.Instance(this);
            BackgroundWorker worker = new BackgroundWorker();

            worker.WorkerReportsProgress = true;

            worker.DoWork += new DoWorkEventHandler(
            delegate (object o, DoWorkEventArgs args)
            {
                BackgroundWorker theWorker = o as BackgroundWorker;

                while (true)
                {
                    // Wait 5 seconds before checking, we don't want to blast the popup in their face
                    Thread.Sleep(5000);
                    theWorker.ReportProgress((updater.CheckForUpdates() ? 100 : 1));
                    Thread.Sleep(300000);
                }

            });

            worker.ProgressChanged += new ProgressChangedEventHandler(
            delegate (object o, ProgressChangedEventArgs args)
            {
                if (args.ProgressPercentage == 100)
                {
                    updater.StartDownload();
                }
            });

            worker.RunWorkerAsync();

            FormClosing += (send, e) =>
            {
                // Garbage collect the background worker
                worker.Dispose();
            };
        }
    }
}
