import _ from 'lodash';
import { remote } from 'electron';

import '../generic';

// DEV: Hold all Emitter events until the GPM external assets have been loaded.
Emitter.ready = false;
const waitingQueue = [];
window.wait = (fn) => {
  if (Emitter.ready) {
    fn();
  } else {
    waitingQueue.push(fn);
  }
};

// DEV: Polyfill window.open to be shell.openExternal
window.open = (url) => remote.shell.openExternal(url);

require('./playback');
require('./interface');

// DEV: We need to wait for the page to load sufficiently before we can load
//      gmusic.js and its child libraries
const waitForExternal = setInterval(() => {
  if (document.querySelector('#material-vslider')) {
    clearInterval(waitForExternal);
    require('../../assets/external.js');

    window.GPM = new window.GMusic(window);
    window.GPMTheme = new window.GMusicTheme();

    Emitter.ready = true;
    _.forEach(waitingQueue, (fn) => {
      try {
        fn();
      } catch (e) {
        Logger.error('Emitter fn() threw exception.', e);
      }
    });

    // require('./desktopSettingsTrigger');
    // require('./hideUI');
  }
}, 10);
