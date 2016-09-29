import * as _ from 'lodash';
import { remote } from 'electron';
import * as GMusic from 'gmusic.js';
import * as GMusicUI from 'gmusic-ui.js';
import * as GMusicMiniPlayer from 'gmusic-mini-player.js';
import * as GMusicTheme from 'gmusic-theme.js';

(<any>global).isGPM = true;

require('../../generic');

// Initialize the global Logger to forward to the main process.
(<any>window).Logger = remote.getGlobal('Logger');
Logger.debug('Renderer process logger initialized.');

// DEV: Hold all Emitter events until the GPM external assets have been loaded.
Emitter.ready = false;
const waitingQueue = [];
(<any>window).wait = (fn) => {
  if (Emitter.ready) {
    fn();
  } else {
    waitingQueue.push(fn);
  }
};

// DEV: Polyfill window.open to be shell.openExternal
(<any>window).open = (url) => remote.shell.openExternal(url);

require('./playback');
require('./interface');
require('./chromecast');

// DEV: We need to wait for the page to load sufficiently before we can load
//      gmusic.js and its child libraries
const waitForExternal = setInterval(() => {
  if (document.querySelector('#material-vslider')) {
    clearInterval(waitForExternal);
    GMusicUI(GMusic);
    GMusicMiniPlayer(GMusic);

    (<any>window).GMusic = GMusic;
    (<any>window).GMusicTheme = GMusicTheme;

    (<any>window).GPM = new GMusic();
    (<any>window).GPMTheme = new (<any>window).GMusicTheme();

    /*
    Move to magical file
    */
    GPM.search.performSearchAndPlayResult = (searchText, result) => {
      return GPM.search.performSearch(searchText)
        .then(() => GPM.search.playResult(result));
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
        Logger.error('Emitter fn() threw exception.', e.stack);
      }
    });
  }
}, 10);
