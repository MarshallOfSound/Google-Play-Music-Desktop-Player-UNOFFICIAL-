import './rendererEmitter';
import './core';

import SettingsController from '../main/utils/Settings';
global.Settings = new SettingsController();
Settings.uncouple();

require(`./${process.platform}`);

const waitForBody = setInterval(() => {
  if (document.body) {
    clearInterval(waitForBody);
    if (Settings.get('theme')) {
      document.body.setAttribute('theme', 'on');
    }
    require('electron').remote.getCurrentWindow().show();

    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      return false;
    }, false);

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      return false;
    }, false);
  }
}, 10);

Emitter.on('theme:updateState', (event, state) => {
  if (!state.state) {
    document.body.removeAttribute('theme');
  } else {
    document.body.setAttribute('theme', 'on');
  }
});
