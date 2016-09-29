import { ipcMain } from 'electron';
import * as _ from 'lodash';

class Emitter implements GPMDP.IMainEmitter {
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

  private send(window: Electron.BrowserWindow, event: string, ...details) {
    if (!details || details.length === 0) {
      details = [{}]; // eslint-disable-line
    }
    if (window.webContents.isLoading()) {
      window.webContents.once('did-stop-loading', () => {
        this.send(window, event, ...details);
      });
    } else {
      window.webContents.send(event, ...details);
    }
  }

  sendToWindow(windowID: symbol, event: string, ...details) {
    const window = WindowManager.get(windowID);
    if (window) {
      this.send(window, event, ...details);
    }
  }

  sendToWindowsOfName(name: string, event: string, ...details) {
    const windows = WindowManager.getAll(name);
    _.forEach(windows, (window) => {
      if (window) {
        this.send(window, event, ...details);
      }
    });
  }

  sendToAll(event: string, ...details) {
    _.forIn(WindowManager.IDMap, (index: number, ID) => {
      const window = WindowManager.getByInternalID(ID);
      if (window) {
        this.send(window, event, ...details);
      }
    });
  }

  sendToGooglePlayMusic(event: string, ...details) {
    this.sendToWindowsOfName('main', 'passthrough', {
      event,
      details,
    });
  }

  executeOnWindow(windowID: symbol, fn: Function, ...args) {
    let fnString = fn.toString();
    fnString = `(${fnString}).apply(window, ${JSON.stringify(args)})`;
    this.sendToWindow(windowID, 'execute', {
      fn: fnString,
    });
  }

  on(what: string, fn: Electron.IpcMainEventListener) {
    ipcMain.on(what, fn);
  }

  once(what: string, fn: Electron.IpcMainEventListener) {
    ipcMain.once(what, fn);
  }

  fire(what: string, ...args) {
    throw new Error('You can\'t use "Emitter.fire" from the main process');
  }
}

export default Emitter;
