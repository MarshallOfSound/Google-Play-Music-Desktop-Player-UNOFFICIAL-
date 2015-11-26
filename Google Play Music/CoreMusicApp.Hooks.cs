using System;
using System.Collections.Generic;
using System.Windows.Forms;
using Utilities;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        private static globalKeyboardHook gkh;

        private void RegisterKeyHooks()
        {
            gkh = new globalKeyboardHook();

            // Don't let the Garbage Man interfere
            GC.KeepAlive(gkh);

            // Global Hotkey Listener
            gkh.HookedKeys.Add(Keys.MediaPlayPause);
            gkh.HookedKeys.Add(Keys.MediaNextTrack);
            gkh.HookedKeys.Add(Keys.MediaPreviousTrack);
            gkh.HookedKeys.Add(Keys.MediaStop);
            gkh.HookedKeys.Add(Keys.Control);
            gkh.HookedKeys.Add(Keys.ControlKey);
            gkh.HookedKeys.Add(Keys.RControlKey);
            gkh.HookedKeys.Add(Keys.LControlKey);
            gkh.HookedKeys.Add(Keys.Oemplus);
            gkh.HookedKeys.Add(Keys.Add);
            gkh.HookedKeys.Add(Keys.OemMinus);
            gkh.HookedKeys.Add(Keys.Subtract);
            gkh.HookedKeys.Add(Keys.D0);
            gkh.KeyDown += new KeyEventHandler(gkh_KeyDown);
            gkh.KeyUp += new KeyEventHandler(gkh_KeyUp);
        }

        private bool controlDown = false;
        // Due to the syncronous (and slow) nature of the SetZoomLevel method on a CefBrowser object
        // We wait until the previous zoom is finished before allowing a new zoom to be requested
        private bool zoomInProgress = false;

        void gkh_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode.ToString())
            {
                case "MediaPlayPause":
                    this.playPause();
                    break;
                case "MediaStop":
                    this.playPause();
                    break;
                case "MediaNextTrack":
                    this.nextTrack();
                    break;
                case "MediaPreviousTrack":
                    this.prevTrack();
                    break;
                // Zooming shortcuts
                case "Control":
                case "ControlKey":
                case "RControlKey":
                case "LControlKey":
                    controlDown = false;
                    break;
                case "Oemplus":
                case "Add":
                    if (controlDown && ApplicationIsActivated() && !zoomInProgress)
                    {
                        zoomInProgress = true;
                        ZoomInBrowser();
                        e.Handled = true;
                        zoomInProgress = false;
                    }
                    break;
                case "OemMinus":
                case "Subtract":
                    if (controlDown && ApplicationIsActivated() && !zoomInProgress)
                    {
                        zoomInProgress = true;
                        ZoomOutBrowser();
                        e.Handled = true;
                        zoomInProgress = false;
                    }
                    break;
                case "D0":
                    if (controlDown && ApplicationIsActivated() && !zoomInProgress)
                    {
                        zoomInProgress = true;
                        ZoomResetBrowser();
                        e.Handled = true;
                        zoomInProgress = false;
                    }
                    break;

            }
            e.Handled = false;
        }

        void gkh_KeyDown(object sender, KeyEventArgs e)
        {
            if (new List<string> { "Control", "ControlKey", "RControlKey", "LControlKey" }.Contains(e.KeyCode.ToString()))
            {
                controlDown = true;
            }
            e.Handled = false;
        }
    }
}
