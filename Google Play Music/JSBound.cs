using CefSharp;
using System;
using System.Drawing;
using System.Threading;
using System.Windows.Forms;

namespace Google_Play_Music
{
    class JSBound
    {
        private CoreMusicApp mainForm;

        public JSBound(CoreMusicApp parent)
        {
            mainForm = parent;
            mainForm.FormClosing += (o, e) =>
            {
                try {
                    alert.currentStep = 99999;
                } catch (Exception)
                {
                    // Just ignore it
                }
            };
        }

        public void dragStart()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.dragStart();
            });
        }

        private Size size;

        public void goMini()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.fadeInOut(() =>
                {
                    size = mainForm.ClientSize;
                    mainForm.Padding = new Padding(1);
                    mainForm.ClientSize = new Size(300, 300);
                    mainForm.FormBorderStyle = FormBorderStyle.None;
                    mainForm.MaximizeBox = false;
                    mainForm.reposition(Screen.FromControl(mainForm));
                    var task = mainForm.webBrowser1.EvaluateScriptAsync("document.querySelectorAll('html')[0].setAttribute('class', 'mini');");
                    task.Wait();
                    return 1;
                });
            });
        }

        public void goBig()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.fadeInOut(() =>
                {
                    mainForm.ClientSize = size;
                    mainForm.FormBorderStyle = FormBorderStyle.Sizable;
                    mainForm.MaximizeBox = true;
                    var task = mainForm.webBrowser1.EvaluateScriptAsync("document.querySelectorAll('html')[0].setAttribute('class', '');");
                    task.Wait();
                    return 1;
                });
            });
        }

        private SongAlert alert = null;

        // Fired from javascript when a different song starts playing
        public void songChangeEvent(string song, string artist, string album, string url)
        {
            new Thread(() =>
            {
                // If the alert box already exists we need to kill it
                // Trick the timer into thinking it is over
                if (alert != null)
                {
                    alert.currentStep = 99999;
                }
                alert = new SongAlert(song, artist, album, url);

                alert.Shown += (sender, e) => {
                    // Hacky work around to allow non blocking Application.run whilst maintaining TopMost
                    Control.CheckForIllegalCrossThreadCalls = false;
                    alert.Owner = mainForm;
                    Control.CheckForIllegalCrossThreadCalls = true;
                    alert.TopMost = true;
                };

                alert.FormClosing += new FormClosingEventHandler(Song_Alert_Close);

                Application.Run(alert);
            }).Start();
        }

        // When the SongAlert closes set it to null in this scope so we know
        private void Song_Alert_Close(object sender, FormClosingEventArgs e)
        {
            // We must handle an unsafe thread disposal here so that the parent forms Dispose method does not cause cross thread errors
            Control.CheckForIllegalCrossThreadCalls = false;
            alert.Dispose();
            Control.CheckForIllegalCrossThreadCalls = true;
            alert = null;
        }
    }
}
