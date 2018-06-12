import _ from 'lodash';
import { remote } from 'electron';

global.isGPM = true;

require('../../generic');

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
require('./runtime');

const service = Settings.get('service');
const serviceReady = () => {
  if (service === 'youtube-music') {
    return document.querySelector('.ytmusic-player-bar') && document.querySelector('video');
  }
  // Google Play Music
  return document.querySelector('#material-vslider') && document.querySelectorAll('audio')[1];
};

// DEV: We need to wait for the page to load sufficiently before we can load
//      gmusic.js and its child libraries
const waitForExternal = setInterval(() => {
  if (serviceReady()) {
    clearInterval(waitForExternal);

    if (service === 'youtube-music') {
      const YTMusic = require('ytmusic.js');
      window.GMusic = YTMusic;
      window.GPM = new YTMusic();
      // TODO: Implement theming support
      window.GPMTheme = {
        updateTheme() {},
        enable() {},
        disable() {},
      };
    } else {
      const GMusic = require('gmusic.js');
      window.GMusic = GMusic;
      // Google Play Music
      require('gmusic-ui.js')(GMusic);
      require('gmusic-mini-player.js')(GMusic);
      const GMusicTheme = require('gmusic-theme.js');

      window.GPM = new GMusic();
      window.GPMTheme = new GMusicTheme();
    }

    /*
    Move to magical file
    */
    if (window.GPM.search) {
      window.GPM.search.performSearchAndPlayResult = (searchText, result) => {
        window.GPM.search.performSearch(searchText)
          .then(() => window.GPM.search.playResult(result));
      };
    }

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
        Logger.error('Emitter fn() threw exception.', e.stack);
      }
    });
    // TODO: This never took off, comment out for now
    // Settings.set('gpmdp_connect_email', window.gbar._CONFIG[0][10][5]);
  }
}, 10);

if (remote.getGlobal('DEV_MODE')) window.__devtron = { require, process };
