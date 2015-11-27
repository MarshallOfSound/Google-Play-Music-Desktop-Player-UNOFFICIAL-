using Gma.System.MouseKeyHook;
using System.Collections.Generic;
using System.Windows.Forms;

namespace Google_Play_Music
{
    partial class CoreMusicApp
    {
        private IKeyboardMouseEvents globalKeyMouseHook;

        private void RegisterKeyHooks()
        {
            globalKeyMouseHook = Hook.GlobalEvents();
            globalKeyMouseHook.MouseDownExt += (send, e) => {
                if (!ApplicationIsActivated()) return;
                switch (e.Button)
                {
                    case MouseButtons.XButton1:
                        navigateBackBrowser();
                        break;
                    case MouseButtons.XButton2:
                        navigateForwardBrowser();
                        break;
                }
            };
            globalKeyMouseHook.KeyDown += new KeyEventHandler(gkh_KeyDown);
            globalKeyMouseHook.KeyUp += new KeyEventHandler(gkh_KeyUp);
            FormClosed += (send, e) =>
            {
                globalKeyMouseHook.Dispose();
            };
        }

        private bool controlDown = false;
        // Due to the syncronous (and slow) nature of the SetZoomLevel method on a CefBrowser object
        // We wait until the previous zoom is finished before allowing a new zoom to be requested
        private bool zoomInProgress = false;

        void gkh_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.MediaPlayPause:
                    this.playPause();
                    break;
                case Keys.MediaStop:
                    this.playPause();
                    break;
                case Keys.MediaNextTrack:
                    this.nextTrack();
                    break;
                case Keys.MediaPreviousTrack:
                    this.prevTrack();
                    break;
                // Zooming shortcuts
                case Keys.Control:
                case Keys.ControlKey:
                case Keys.RControlKey:
                case Keys.LControlKey:
                    controlDown = false;
                    break;
                case Keys.Oemplus:
                case Keys.Add:
                    if (controlDown && ApplicationIsActivated() && !zoomInProgress)
                    {
                        zoomInProgress = true;
                        ZoomInBrowser();
                        e.Handled = true;
                        zoomInProgress = false;
                    }
                    break;
                case Keys.OemMinus:
                case Keys.Subtract:
                    if (controlDown && ApplicationIsActivated() && !zoomInProgress)
                    {
                        zoomInProgress = true;
                        ZoomOutBrowser();
                        e.Handled = true;
                        zoomInProgress = false;
                    }
                    break;
                case Keys.D0:
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
            if (new List<Keys> { Keys.Control, Keys.ControlKey, Keys.RControlKey, Keys.LControlKey }.Contains(e.KeyCode))
            {
                controlDown = true;
            }
            e.Handled = false;
        }
    }
}
