using CefSharp;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
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
                    mainForm.GPMBrowser.EvaluateScriptAsync("document.querySelectorAll('html')[0].classList.add('mini'); window.miniButton = true;");
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
                    mainForm.GPMBrowser.EvaluateScriptAsync("window.origHeight = document.body.clientHeight; document.querySelectorAll('html')[0].classList.remove('mini'); window.miniButton = true; document.body.offsetHeight; document.body.offsetHeight; window.checkHeight = setInterval(function() {if (window.origHeight < document.body.clientHeight) { clearInterval(window.checkHeight); for (var k = 0; k < 30; k++) { window.dispatchEvent(new Event('resize')); }}}, 10)");
                    TaskEx.Delay(400).Wait();
                    return 1;
                });
            });
        }

        public void setPlaybackStatus(bool isPlaying)
        {
            PlaybackAPI.Instance.UpdatePlaybackStatus(isPlaying);
        }

        public void setThumbbarToPlay()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.playPauseButton.Icon = Properties.Resources.Play;
            });
        }

        public void setThumbbarToPause()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.playPauseButton.Icon = Properties.Resources.Pause;
            });
        }

        public void showApp()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                mainForm.ShowApp();
            });
        }

        // Fired from javascript when a different song has been playing for over half it's duration. (As according to last.fm's scrobbling spec)
        public void songScrobbleRequest(string song, string artist, string album, int timestamp)
        {
            try
            {
                new LastFM().scrobbleTrack(artist, song, timestamp).Wait();
            }
            catch (Exception e)
            {
                // last.fm not authenticated
            }
        }

        private SongAlert alert = null;

        // Fired from javascript when a different song starts playing
        public void songChangeEvent(string song, string album, string artist, string url)
        {
            PlaybackAPI.Instance.UpdateCurrentSong(song, album, artist, url);

            mainForm.Invoke((MethodInvoker)delegate
            {
                // Update the title to show the current song
                mainForm.Text = song + " - " + artist;
            });

            // If no desktop notifications just stop here :)
            if (!Properties.Settings.Default.DesktopNotifications)
            {
                return;
            }
            try {
                // If the alert box already exists we need to kill it
                // Trick the timer into thinking it is over
                if (alert != null)
                {
                    alert.currentStep = 99999;
                }

                // GUI tasks should be run on a GUI thread
                mainForm.Invoke((MethodInvoker) async delegate
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
            } catch
            {
                // This try catch is to prevent application crashes when a user spams the forward / back track button
                // The AsyncJSBind in CEFSharp can't handle the amount of communication and throws a NullPointer
                // TODO: Check CEF progress on this issue
            }
            try
            {
                new LastFM().updateNowPlaying(artist, song).Wait();
            } catch (Exception e)
            {
                // last.fm not authenticated
            }
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

        private SettingsDialog settings;

        public void showSettings()
        {
            mainForm.Invoke((MethodInvoker)delegate
            {
                if (settings == null)
                {
                    settings = new SettingsDialog(mainForm);
                }
                settings.open(mainForm.Location.X + (mainForm.Size.Width / 2), mainForm.Location.Y + (mainForm.Size.Height / 2));
            });
        }
    }
}
