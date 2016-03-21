import './rendererEmitter';
import './core';

import SettingsController from '../main/utils/Settings';
global.Settings = new SettingsController();
Settings.uncouple();

require(`./${process.platform}`);

const waitForBody = setInterval(() => {
  if (document.body) {
    clearInterval(waitForBody);
    require('./windowThemeHandler');
    require('electron').remote.getCurrentWindow().show();

    document.body.classList.toggle('native-frame', Settings.get('nativeFrame'));

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
