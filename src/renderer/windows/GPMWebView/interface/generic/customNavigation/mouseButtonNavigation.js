import { remote } from 'electron';

const handleAppCommand = (e, cmd) => {
  if (cmd === 'browser-backward') {
    remote.getCurrentWebContents().goBack();
  } else if (cmd === 'browser-forward') {
    remote.getCurrentWebContents().goForward();
  }
};

const handleSwipeCommand = (e, direction) => {
  if (direction === 'left') {
    remote.getCurrentWebContents().goBack();
  } else if (direction === 'right') {
    remote.getCurrentWebContents().goForward();
  }
};

let scrolling = false;
let scrollingShouldNav = 0;
const NAV_VELOCITY = 100;

const startScroll = () => { scrolling = true; };
const endScroll = () => {
  scrolling = false;
  if (scrollingShouldNav) {
    if (scrollingShouldNav > 0) {
      remote.getCurrentWebContents().goForward();
    } else {
      remote.getCurrentWebContents().goBack();
    }
    scrollingShouldNav = 0;
  }
};

window.addEventListener('mousewheel', (e) => {
  if (e.deltaX > NAV_VELOCITY && scrolling) {
    scrollingShouldNav = 1;
  } else if (e.deltaX < -1 * NAV_VELOCITY && scrolling) {
    scrollingShouldNav = -1;
  }
});

Emitter.on('BrowserWindow:app-command', (e, ...args) => handleAppCommand(...args));
Emitter.on('BrowserWindow:swipe', (e, ...args) => handleSwipeCommand(...args));
Emitter.on('BrowserWindow:scroll-touch-begin', (e, ...args) => startScroll(...args));
Emitter.on('BrowserWindow:scroll-touch-end', (e, ...args) => endScroll(...args));

if (process.platform === 'linux') {
  const mouse = require('mouse-forward-back');

  mouse.register((button) => {
    if (button === 'back') {
      remote.getCurrentWebContents().goBack();
    } else if (button === 'forward') {
      remote.getCurrentWebContents().goForward();
    }
  }, remote.getCurrentWindow().getNativeWindowHandle());
}
