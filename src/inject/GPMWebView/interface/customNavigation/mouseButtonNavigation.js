import { remote } from 'electron';

const bWindow = remote.getCurrentWindow();

const handleAppCommand = (e, cmd) => {
  if (cmd === 'browser-backward') {
    remote.getCurrentWebContents().goBack();
  } else if (cmd === 'browser-forward') {
    remote.getCurrentWebContents().goForward();
  }
};

const handleSwipeCommand = (e, direction) => {
  if (direction === 'left') {
    remote.getCurrentWebContents.goBack();
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

window.addEventListener('beforeunload', () => {
  bWindow.removeListener('app-command', handleAppCommand);
  bWindow.removeListener('swipe', handleSwipeCommand);
  bWindow.removeListener('scroll-touch-begin', startScroll);
  bWindow.removeListener('scroll-touch-end', endScroll);
});

window.addEventListener('mousewheel', (e) => {
  if (e.deltaX > NAV_VELOCITY && scrolling) {
    scrollingShouldNav = 1;
  } else if (e.deltaX < -1 * NAV_VELOCITY && scrolling) {
    scrollingShouldNav = -1;
  }
});

bWindow.on('app-command', handleAppCommand);
bWindow.on('swipe', handleSwipeCommand);
bWindow.on('scroll-touch-begin', startScroll);
bWindow.on('scroll-touch-end', endScroll);

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
