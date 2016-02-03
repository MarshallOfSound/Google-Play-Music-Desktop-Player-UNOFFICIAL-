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
  }
}, 10);

Emitter.on('theme:updateState', (event, state) => {
  if (!state.state) {
    document.body.removeAttribute('theme');
  } else {
    document.body.setAttribute('theme', 'on');
  }
});
