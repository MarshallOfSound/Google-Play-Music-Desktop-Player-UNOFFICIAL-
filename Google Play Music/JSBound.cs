using CefSharp;
using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using log4net.Core;

namespace Google_Play_Music
{
    internal class JSBound
    {
        private CoreMusicApp mainForm;

        public JSBound(CoreMusicApp parent)
        {
            mainForm = parent;
            mainForm.FormClosing += (o, e) =>
            {
                try
                {
                    if (alert != null)
                    {
                        alert.currentStep = 99999;
                    }
                }
                catch (Exception)
                {
                    // Just ignore it
                }
            };
            // When the parent form is deactivated (focus is lost) we must activate the notification to ensure it stays in focus

        }

        public void setInitialZoom()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.GPMBrowser.SetZoomLevel(Properties.Settings.Default.MaxiZoomLevel);
            });
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

        public void goMini()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.fadeInOut(() =>
                {
                    mainForm.saveMaxiState();
                    mainForm.restoreMiniState();
                    mainForm.GPMBrowser.EvaluateScriptAsync("document.querySelectorAll('html')[0].setAttribute('class', 'mini'); window.miniButton = true;");
                    TaskEx.Delay(400).Wait();
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
                    mainForm.saveMiniState();
                    mainForm.restoreMaxiState();
                    mainForm.GPMBrowser.EvaluateScriptAsync("window.origHeight = document.body.clientHeight; document.querySelectorAll('html')[0].setAttribute('class', ''); window.miniButton = true; document.body.offsetHeight; document.body.offsetHeight; window.checkHeight = setInterval(function() {console.log('check'); if (window.origHeight < document.body.clientHeight) { clearInterval(window.checkHeight); for (var k = 0; k < 30; k++) { window.dispatchEvent(new Event('resize')); }}}, 10)");
                    TaskEx.Delay(400).Wait();
                    return 1;
                });
            });
        }

        // Fired from javascript when a different song has been playing for over half it's duration. (As according to last.fm's scrobbling spec)
        public void songScrobbleRequest(string song, string artist, string album, int timestamp)
        {
            try
            {
                if (LastFM.GetInstance().IsAuthenticated())
                {
                    LastFM.GetInstance().ScrobbleTrack(artist, song, album, timestamp).Wait();
                }
            }
            catch (Exception e)
            {
                // last.fm not authenticated
                Program.Logger.Error(String.Format("Error while attempting to scrobble song:'{0}' artist:'{1}' album:'{2}' timestamp:'{3}'", song, artist, album, timestamp), e);
            }
        }

        private SongAlert alert = null;

        // Fired from javascript when a different song starts playing
        public void songChangeEvent(string song, string album, string artist, string url)
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                // Update the title to show the current song
                mainForm.Text = song + " - " + artist;
            });

            // If no desktop notifications, don't show the screen
            if (Properties.Settings.Default.DesktopNotifications)
            {
                try
                {
                    // If the alert box already exists we need to kill it
                    // Trick the timer into thinking it is over
                    if (alert != null)
                    {
                        alert.currentStep = 99999;
                    }

                    // GUI tasks should be run on a GUI thread
                    mainForm.Invoke((MethodInvoker)async delegate
                    {
                        // Wait for the alert box to dispose of it self
                        await TaskEx.Run(delegate
                        {
                            while (alert != null) ;
                        });
                        alert = new SongAlert(song, album, artist, url);
                        alert.FormClosing += new FormClosingEventHandler(Song_Alert_Close);
                        alert.Show();
                    });
                }
                catch (Exception e)
                {
                    // This try catch is to prevent application crashes when a user spams the forward / back track button
                    // The AsyncJSBind in CEFSharp can't handle the amount of communication and throws a NullPointer
                    // TODO: Check CEF progress on this issue
                    Program.Logger.Debug(String.Format("Error while attempting to show the SongAlert - song:'{0}' artist:'{1}' album:'{2}' url:'{3}'", song, artist, album, url), e);
                }
            }

            try
            {
                if (LastFM.GetInstance().IsAuthenticated())
                {
                    LastFM.GetInstance().UpdateNowPlaying(artist, song, album).Wait();
                }
            }
            catch (Exception e)
            {
                // last.fm not authenticated
                Program.Logger.Error(String.Format("Error while attempting to update LastFM change song - song:'{0}' artist:'{1}' album:'{2}' url:'{3}'", song, artist, album, url), e);
            }
        }

        // When the SongAlert closes set it to null in this scope so we know
        private void Song_Alert_Close(object sender, EventArgs e)
        {
            // We must handle an unsafe thread disposal here so that the parent forms Dispose method does not cause cross thread errors
            // But first we have to check if the handle is created yet, if it isn't we attach to the HandleCreated event
            if (alert.IsHandleCreated)
            {
                // If the current thread is not the UI thread, then push the action to the UI thread.
                if (alert.InvokeRequired)
                {
                    // Move the action to the UI thread.
                    alert.BeginInvoke(new EventHandler(Song_Alert_Close));
                }
                else
                {
                    alert.Dispose();
                    alert = null;
                }
            }
            else
            {
                // Based on previous intent, the Handle is required to be created but since the alert is closing, we need to dispose of the alert as soon as the handle is created for the alert.
                alert.HandleCreated += new EventHandler(Song_Alert_Close);
            }
        }

        private SettingsDialog settings;

        public void showSettings()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                if (settings == null)
                {
                    settings = new SettingsDialog(mainForm);
                }
                DialogResult test = settings.open(mainForm.Location.X + (mainForm.Size.Width / 2), mainForm.Location.Y + (mainForm.Size.Height / 2));
                if (test == DialogResult.Abort)
                {
                    if (mainForm.mini)
                    {
                        mainForm.restoreMiniState();
                    }
                    else
                    {
                        mainForm.restoreMaxiState();
                    }

                    settings.Dispose();
                    mainForm.GPMBrowser.GetBrowser().CloseBrowser(true);
                    mainForm.Close();
                    mainForm.Dispose();

                    // mainForm.GPMBrowser.Delete();
                    Cef.Shutdown();
                    string path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/GPMDP";
                    System.IO.DirectoryInfo downloadedMessageInfo = new DirectoryInfo(path);

                    foreach (FileInfo file in downloadedMessageInfo.GetFiles())
                    {
                        file.Delete();
                    }
                    foreach (DirectoryInfo dir in downloadedMessageInfo.GetDirectories())
                    {
                        dir.Delete(true);
                    }
                }
            });
        }
    }
}
