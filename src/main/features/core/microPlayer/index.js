import { MicroPlayerController } from './MicroPlayerController';
import { MicroPlayerSettings } from './MicroPlayerSettings';
import { setAppLoaded } from './_applicationState';

const settings = new MicroPlayerSettings();

/** @type MicroPlayerController | undefined */
let controller;

// Listen for the "app:loaded" and "app:loading" events so that we can track
// the application state, because we need to send the "app:loaded" event to
// the micro player if we open the micro player after the application is loaded.
Emitter.on('app:loaded', () => setAppLoaded(true));
Emitter.on('app:loading', () => setAppLoaded(false));

// Listen for the button in the
// main menu toggling the micro player.
Emitter.on('window:microplayer', () => {
  if (controller !== undefined) {
    controller.dispose();
    controller = undefined;
    settings.enabled = false;
  } else {
    controller = new MicroPlayerController(settings);
    settings.enabled = true;
  }
});

// Open the micro player at startup
// if the setting is enabled.
if (settings.enabled) {
  controller = new MicroPlayerController(settings);
}

// Close the micro player when the main window closes. If we leave
// the micro player open, it will prevent the application from exiting.
WindowManager.getAll('main')[0].on('closed', () => {
  if (controller !== undefined) {
    controller.dispose();
    controller = undefined;
  }
});
