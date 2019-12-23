import { getAppLoaded } from './_applicationState';


/**
 * Gets the event name for the current playback state.
 * @returns {string} The name of the event.
 */
function getCurrentPlaybackStateEvent() {
  if (PlaybackAPI.isPlaying()) {
    return 'playback:isPlaying';
  }

  if (PlaybackAPI.isPaused()) {
    return 'playback:isPaused';
  }

  return 'playback:isStopped';
}

/**
 * Shows the main window.
 */
function showMainWindow() {
  const main = WindowManager.getAll('main')[0];

  if (main) {
    // Make sure the window will be shown in the taskbar. That setting
    // may have been turned off if the window was minimized or hidden.
    main.setSkipTaskbar(false);

    if (main.isMinimized()) {
      // If we just called `show()`, then the window will be shown
      // but, if the window was maximized before it was minimized,
      // it will not be maximized again. Calling `restore()` will
      // return the window to its unminimized state.
      main.restore();
    }

    // On Windows, calling `restore()` will also show and
    // focus the window, but on Linux it won't, so we will
    // always call `show()`. Also call `focus()` because `show()`
    // doesn't cause the window to become active in Linux.
    main.show();
    main.focus();
  }
}

/**
 * Adapter for relaying messages toamd from the micro player window.
 */
export class MicroPlayerEventAdapter {
  /**
   * @constructor
   * @param {Symbol} windowID The ID of the micro player window.
   */
  constructor(windowID) {
    /** @type [object, string, Function][] */
    this._listeners = [];

    [
      'playback:isPlaying',
      'playback:isPaused',
      'playback:isStopped',
    ].forEach((event) => {
      this._addEmitterListener(event, data => Emitter.sendToWindow(windowID, event, data));
    });

    [
      'change:track',
      'change:rating',
    ].forEach((event) => {
      this._addPlaybackListener(event, data => Emitter.sendToWindow(windowID, `PlaybackAPI:${event}`, data));
    });

    // The micro player can't show the main window itself, so it
    // has to send a message to get us to show the main window.
    this._addEmitterListener('micro:showMainWindow', () => showMainWindow());

    // Wait for the micro player window to become ready
    // before we tell it about the initial playback state.
    this._addEmitterListener('micro:ready', () => {
      // The micro player will appear in a "loading" state until the `app:loaded`
      // event is fired. That event is only raised once by the application, so if
      // we are opening the micro player after that event was fired, then we need
      // to send that event to the new window so that it stops showing as loading.
      if (getAppLoaded()) {
        Emitter.sendToWindow(windowID, 'app:loaded');
      }

      // Send messages for the initial state, track and rating.
      Emitter.sendToWindow(windowID, getCurrentPlaybackStateEvent());
      Emitter.sendToWindow(windowID, 'PlaybackAPI:change:rating', PlaybackAPI.getRating());
      Emitter.sendToWindow(windowID, 'PlaybackAPI:change:track', PlaybackAPI.currentSong());
    });
  }

  /**
   *Adds an event listener to the `Emitter` and records the listener for disposal.
   * @param {string} event The event name.
   * @param {Function} listener The event listener to add.
   */
  _addEmitterListener(event, listener) {
    Emitter.on(event, listener);
    this._listeners.push([Emitter, event, listener]);
  }

  /**
   *Adds an event listener to the `PlaybackAPI` and records the listener for disposal.
   * @param {string} event The event name.
   * @param {Function} listener The event listener to add.
   */
  _addPlaybackListener(event, listener) {
    PlaybackAPI.on(event, listener);
    this._listeners.push([PlaybackAPI, event, listener]);
  }

  /**
   * Removes all event listeners.
   */
  dispose() {
    this._listeners.forEach(([source, event, handler]) => {
      source.removeListener(event, handler);
    });

    this._listeners = [];
  }
}
