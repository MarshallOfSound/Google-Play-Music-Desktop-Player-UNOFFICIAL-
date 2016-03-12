import { remote } from 'electron';

const bWindow = remote.getCurrentWindow();

window.addEventListener('beforeunload', bWindow.removeAllListeners());
bWindow.on('app-command', (e, cmd) => {
  if (cmd === 'browser-backward') {
    remote.getCurrentWebContents().goBack();
  } else if (cmd === 'browser-forward') {
    remote.getCurrentWebContents().goForward();
  }
});
