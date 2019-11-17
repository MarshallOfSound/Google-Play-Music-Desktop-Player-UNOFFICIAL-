import path from 'path';
import { BrowserWindow } from 'electron';
import { MicroPlayerEventAdapter } from './MicroPlayerEventAdapter';
import { MicroPlayerBoundsManager } from './MicroPlayerBoundsManager';

/**
 * Handles opening and closing the micro player.
 */
export class MicroPlayerController {
  /**
   * @constructor
   * @param {import('./MicroPlayerSettings').MicroPlayerSettings} settings The settings to use.
   */
  constructor(settings) {
    this._settings = settings;

    this._window = this._createWindow(settings);
    this._windowID = WindowManager.add(this._window, 'micro_player');

    this._events = new MicroPlayerEventAdapter(this._windowID);
    this._bounds = new MicroPlayerBoundsManager(this._window, this._settings);

    // Show the window now that the bounds manager
    // has ensured it's fully on screen.
    this._window.showInactive();

    // Prevent the window from being closed. This prevents the user from
    // being able to close the window without turning the setting off. We will
    // remove this handler before we need to programatically close the window.
    this._preventClose = (e) => e.preventDefault();
    this._window.on('close', this._preventClose);
  }

  /**
   * Creates the micro player window.
   * @returns {BrowserWindow} The window.
   */
  _createWindow(settings) {
    const [width, height] = settings.size;

    const window = new BrowserWindow({
      width,
      height,
      minWidth: 160,
      minHeight: 20,
      maxHeight: 60,
      autoHideMenuBar: true,
      frame: false,
      hasShadow: false,
      titleBarStyle: 'hidden',
      title: 'Google Play Music Desktop Player - Micro Player',

      // Set `thickFrame` to false to allow resizing below a hard limit that's
      // applied by something when running on Windows. Doesn't have any effect
      // at the moment because the version of Electon being used is quite old.
      // (https://github.com/electron/electron/issues/20183).
      thickFrame: false,

      // Same color as the background color of the
      // main window when using the default theme.
      backgroundColor: '#fafafa',

      // Don't show the window yet. It will be shown
      // after we ensure that it's positioned on screen.
      show: false,

      // Don't allow the micro player to be closed. It can only
      // be closed by turning the setting off through the UI.
      closable: false,

      // The micro player has a maximum size and should always be visible,
      // so don't allow it to be minimized, maximized or shown full screen.
      fullscreenable: false,
      minimizable: false,
      maximizable: false,

      webPreferences: {
        nodeIntegration: true,
        preload: path.resolve(`${__dirname}/../../../../renderer/generic/index.js`),
      },
    });

    // Always show the micro player on top because it's designed to be
    // put at the top or bottom of the screen and be always visible.
    // Note: For some reason setting it to be always on top immediately
    // doesn't work on Linux, but setting it on the next tick does.
    setTimeout(() => window.setAlwaysOnTop(true), 0);

    window.loadURL(`file://${__dirname}/../../../../public_html/micro_player.html`);

    return window;
  }

  /**
   * Closes the window and removes event listeners.
   */
  dispose() {
    // The micro player window is not closable to prevent the user
    // from closing it without turning the setting off. But when
    // it's not closable you can't event close it programatically,
    // so we need to make the window closable before we close it.
    this._window.setClosable(true);

    // Remove our 'close' event listener that
    // prevents the window from being closed.
    this._window.removeListener('close', this._preventClose);
    WindowManager.close(this._windowID);

    this._events.dispose();
    this._bounds.dispose();
  }
}
