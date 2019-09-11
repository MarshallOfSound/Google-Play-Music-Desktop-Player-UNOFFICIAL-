import { shell } from 'electron';
import _ from 'lodash';

class WindowManager {
  constructor() {
    this.windows = {};
    this.nameReferences = {};
    this.IDMap = {};

    this.focus = [null];
  }

  add(window, name = null) {
    const newID = Symbol();
    this.windows[newID] = window;
    this.IDMap[window.id] = newID;
    window.on('closed', () => {
      delete this.windows[newID];
    });
    window.on('focus', () => {
      const focusIndex = _.findLastIndex(this.focus, (win) => win !== null);
      if (focusIndex && focusIndex >= 0 && this.focus[focusIndex].id !== window.id) {
        this.focus[focusIndex].focus();
      }
    });
    window.on('enter-full-screen', () => {
      window.webContents.send('window:changefullscreen', true);
    });
    window.on('leave-full-screen', () => {
      window.webContents.send('window:changefullscreen', false);
    });
    window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
    if (name) {
      this.nameReferences[name] = this.nameReferences[name] || [];
      this.nameReferences[name].push(newID);
    }
    return newID;
  }

  get(windowID) {
    return this.windows[windowID] || null;
  }

  getByInternalID(internalID) {
    if (this.IDMap[internalID]) {
      return this.windows[this.IDMap[internalID]] || null;
    }
    return null;
  }

  getAll(name) {
    const toReturn = [];
    _.forEach(this.nameReferences[name] || [], (ID) => {
      if (this.get(ID)) {
        toReturn.push(this.get(ID));
      }
    });
    return toReturn;
  }

  forceFocus(window) {
    const index = this.focus.length;
    this.focus.push(window);
    window.on('close', () => {
      this.focus[index] = null;
    });
  }

  close(windowID) {
    if (this.windows[windowID]) {
      this.windows[windowID].close();
    }
  }

  getWindowManagerName() {
    if (process.platform === 'linux') {
      return process.env['XDG_CURRENT_DESKTOP']; // eslint-disable-line
    }
    return undefined;
  }

  getWindowManagerGDMName() {
    if (process.platform === 'linux') {
      return process.env['GDMSESSION']; // eslint-disable-line
    }
    return undefined;
  }
}

export default WindowManager;
