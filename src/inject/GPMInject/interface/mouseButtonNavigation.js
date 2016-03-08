import { remote } from 'electron';

const window = remote.getCurrentWindow();
const webContents = remote.getCurrentWebContents();

window.on('app-command', (e, cmd) => {
  if (cmd === 'browser-backward') {
    webContents.goBack();
  } else if (cmd === 'browser-forward') {
    webContents.goForward();
  }
});
