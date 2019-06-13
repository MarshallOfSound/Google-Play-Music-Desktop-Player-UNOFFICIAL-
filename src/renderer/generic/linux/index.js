import '../silent_Notification';
import { remote } from 'electron';

// remote.getCurrentWindow() polyfill?
if (process.platform === 'linux') {
  if (remote.getCurrentWindow() == null) {
    remote.getCurrentWindow = () => remote.BrowserWindow.fromId(1);
  }
}
