import { ipcMain } from 'electron';
import _ from 'lodash';

class Emitter {
  constructor() {
    ipcMain.on('passback', (event, details) => {
      this.sendToGooglePlayMusic(details.event, ...details.details);
    });

    ipcMain.on('passback:main', (event, details) => {
      this.sendToWindowsOfName('main', details.event, ...details.details);
    });

    ipcMain.on('passback:all', (event, details) => {
      this.sendToAll(details.event, ...details.details);
    });
  }

  _send(window, event, ...details) {
    if (!details || details.length === 0) {
      details = [{}]; // eslint-disable-line
    }
    if (window.webContents.isLoading()) {
      window.webContents.once('did-stop-loading', () => {
        this._send(window, event, ...details);
      });
    } else {
      window.webContents.send(event, ...details);
    }
  }

  sendToWindow(windowID, event, ...details) {
    const window = WindowManager.get(windowID);
    if (window) {
      this._send(window, event, ...details);
    }
  }

  sendToWindowsOfName(name, event, ...details) {
    const windows = WindowManager.getAll(name);
    _.forEach(windows, (window) => {
      if (window) {
        this._send(window, event, ...details);
      }
    });
  }

  sendToAll(event, ...details) {
    _.forIn(WindowManager.IDMap, (index, ID) => {
      const window = WindowManager.getByInternalID(ID);
      if (window) {
        this._send(window, event, ...details);
      }
    });
  }

  sendToGooglePlayMusic(event, ...details) {
    this.sendToWindowsOfName('main', 'passthrough', {
      event,
      details,
    });
  }

  executeOnWindow(windowID, fn, ...args) {
    let fnString = fn.toString();
    fnString = `(${fnString}).apply(window, ${JSON.stringify(args)})`;
    this.sendToWindow(windowID, 'execute', {
      fn: fnString,
    });
  }

  on(what, fn) {
    ipcMain.on(what, fn);
  }

  once(what, fn) {
    ipcMain.once(what, fn);
  }

  off(what, fn) {
    ipcMain.removeListener(what, fn);
  }
}

export default Emitter;
