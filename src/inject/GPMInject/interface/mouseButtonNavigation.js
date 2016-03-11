import { remote } from 'electron';

const window = remote.getCurrentWindow();

window.on('app-command', (e, cmd) => {
  if (cmd === 'browser-backward') {
    remote.getCurrentWebContents().goBack();
  } else if (cmd === 'browser-forward') {
    remote.getCurrentWebContents().goForward();
  }
});
