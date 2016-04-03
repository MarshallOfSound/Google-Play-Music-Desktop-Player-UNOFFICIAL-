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

window.addEventListener('beforeunload', () => {
  bWindow.removeListener('app-command', handleAppCommand);
  bWindow.removeListener('swipe', handleSwipeCommand);
});
bWindow.on('app-command', handleAppCommand);
bWindow.on('swipe', handleSwipeCommand);

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
