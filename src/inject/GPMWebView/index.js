import _ from 'lodash';
import { remote } from 'electron';

import '../generic';

// Initialize the global Logger to forward to the main process.
window.Logger = remote.getGlobal('Logger');
Logger.debug('Renderer process logger initialized.');

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
require('./chromecast');

// DEV: We need to wait for the page to load sufficiently before we can load
//      gmusic.js and its child libraries
const waitForExternal = setInterval(() => {
  if (document.querySelector('#material-vslider')) {
    clearInterval(waitForExternal);
    window.GMusic = require('gmusic.js');
    require('gmusic-ui.js');
    require('gmusic-mini-player.js');
    require('gmusic-theme.js');

    window.GPM = new window.GMusic(window);
    window.GPMTheme = new window.GMusicTheme();

    /*
    Move to magical file
    */
    window.GPM.search.performSearchAndPlayResult = (searchText, result) => {
      window.GPM.search.performSearch(searchText)
        .then(() => window.GPM.search.playResult(result));
    };

    /*
    Fix scrollbars
    */
    remote.getCurrentWebContents().insertCSS(
      '::-webkit-scrollbar,::shadow ::-webkit-scrollbar{width:9px;background:0 0}::-webkit-scrollbar-track,::shadow ::-webkit-scrollbar-track{background-color:rgba(0,0,0,.25)}::-webkit-scrollbar-track:hover,::shadow ::-webkit-scrollbar-track:hover{background-color:rgba(0,0,0,.35)}::-webkit-scrollbar-track:active,::shadow ::-webkit-scrollbar-track:active{background-color:rgba(0,0,0,.25)}::-webkit-scrollbar-thumb,::shadow ::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.3);border-radius:0}::-webkit-scrollbar-thumb:hover,::shadow ::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,.4)}::-webkit-scrollbar-thumb:active,::shadow ::-webkit-scrollbar-thumb:active{background-color:rgba(0,0,0,.4)}' // eslint-disable-line
    );

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
