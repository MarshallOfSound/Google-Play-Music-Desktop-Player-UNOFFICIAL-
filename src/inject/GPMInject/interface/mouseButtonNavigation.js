import { remote } from 'electron';

const bWindow = remote.getCurrentWindow();

const handleAppCommand = (e, cmd) => {
  if (cmd === 'browser-backward') {
    remote.getCurrentWebContents().goBack();
  } else if (cmd === 'browser-forward') {
    remote.getCurrentWebContents().goForward();
  }
};

window.addEventListener('beforeunload', () => {
  bWindow.removeListener('app-command', handleAppCommand);
});
bWindow.on('app-command', handleAppCommand);
