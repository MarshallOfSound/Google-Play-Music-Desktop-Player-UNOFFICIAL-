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
                    if (alert != null)
                    {
                        alert.currentStep = 99999;
                    }
                } catch (Exception)
                {
                    // Just ignore it
                }
            };
        }

        public void lightTheme()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.lightTheme();
            });
        }

        public void darkTheme()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.darkTheme();
            });
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
                    mainForm.Padding = new Padding(2);
                    mainForm.ClientSize = new Size(300, 300);
                    mainForm.MaximizeBox = false;
                    mainForm.reposition(Screen.FromControl(mainForm));
                    mainForm.MaximumSize = new Size(300, 300);
                    var task = mainForm.webBrowser1.EvaluateScriptAsync("document.querySelectorAll('html')[0].setAttribute('class', 'mini');");
                    task.Wait();
                    mainForm.handleZoom = true;
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
                    mainForm.webBrowser1.SetZoomLevel(0);
                    mainForm.MaximumSize = new Size();
                    mainForm.ClientSize = size;
                    mainForm.Padding = new Padding(2, 24, 2, 2);
                    mainForm.MaximizeBox = true;
                    mainForm.reposition(Screen.FromControl(mainForm));
                    var task = mainForm.webBrowser1.EvaluateScriptAsync("document.querySelectorAll('html')[0].setAttribute('class', '');");
                    task.Wait();
                    mainForm.handleZoom = false;
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
                try {
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
                } catch
                {
                    // This try catch is to prevent application crashes when a user spams the forward / back track button
                    // The AsyncJSBind in CEFSharp can't handle the amount of communication and throws a NullPointer
                    // TODO: Check CEF progress on this issue
                }
            }).Start();
        }

        // When the SongAlert closes set it to null in this scope so we know
        private void Song_Alert_Close(object sender, FormClosingEventArgs e)
        {
            // We must handle an unsafe thread disposal here so that the parent forms Dispose method does not cause cross thread errors
            // But first we have to check if the handle is created yet, if it isn't we attach to the HandleCreated event
            if (alert.IsHandleCreated)
            {
                Control.CheckForIllegalCrossThreadCalls = false;
                alert.Dispose();
                Control.CheckForIllegalCrossThreadCalls = true;
                alert = null;
            } else
            {
                alert.HandleCreated += (send, ev) =>
                {
                    Control.CheckForIllegalCrossThreadCalls = false;
                    alert.Dispose();
                    Control.CheckForIllegalCrossThreadCalls = true;
                    alert = null;
                };
            }
        }
    }
}
