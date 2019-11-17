import { MicroPlayerController } from './MicroPlayerController';
import { MicroPlayerSettings } from './MicroPlayerSettings';
import { setAppLoaded } from './_applicationState';

const settings = new MicroPlayerSettings();

/** @type MicroPlayerController | undefined */
let controller = undefined;

// Listen for the "app:loaded" event because we need to send it to the
// micro player if we open the micro player after that event is fired.
Emitter.on('app:loaded', () => {
  setAppLoaded(true);
});

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
