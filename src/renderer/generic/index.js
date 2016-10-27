import { remote } from 'electron';
import '../rendererEmitter';
import './core';

import SettingsController from '../../main/utils/Settings';

if (process.env['TEST_SPEC']) { // eslint-disable-line
  global.Settings = new SettingsController('.test', true);
} else {
  global.Settings = new SettingsController();
}
Settings.uncouple();

require(`./${process.platform}`);
require('./translations');

process.env['NODE_ENV'] = remote.getGlobal('DEV_MODE') ? 'development' : 'production'; // eslint-disable-line

document.addEventListener('DOMContentLoaded', () => {
  require('./windowThemeHandler');

  const nativeFrameAtLaunch = Settings.get('nativeFrame');

  document.body.classList.toggle('native-frame', nativeFrameAtLaunch);

  Emitter.on('window:fullscreen', (event, state) => {
    if (nativeFrameAtLaunch) return;
    if (state.state) document.body.classList.add('native-frame');
    if (!state.state) document.body.classList.remove('native-frame');
  });

  document.addEventListener('dragover', (event) => {
    event.preventDefault();
    return false;
  }, false);

  document.addEventListener('drop', (event) => {
    event.preventDefault();
    return false;
  }, false);
});
