import { remote } from 'electron';
import '../silent_Notification';

// remote.getCurrentWindow() polyfill?
if (process.platform === 'linux') {
  if (remote.getCurrentWindow() == null) {
    remote.getCurrentWindow = () => remote.BrowserWindow.fromId(1);
  }
}
