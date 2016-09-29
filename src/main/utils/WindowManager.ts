import * as _ from 'lodash';

class WindowManagerClass implements GPMDP.IWindowManager {
  private windows: any;
  public IDMap: any;
  private focus: any;
  private nameReferences: any;

  constructor() {
    this.windows = {};
    this.nameReferences = {};
    this.IDMap = {};

    this.focus = [null];
  }

  add(window: Electron.BrowserWindow, name: string = null) {
    const newID = global.Symbol();
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
    if (name) {
      this.nameReferences[name] = this.nameReferences[name] || [];
      this.nameReferences[name].push(newID);
    }
    return newID;
  }

  get(windowID: symbol) {
    return this.windows[windowID] || null;
  }

  getByInternalID(internalID: number) {
    if (this.IDMap[internalID]) {
      return this.windows[this.IDMap[internalID]] || null;
    }
    return null;
  }

  getAll(name: string) {
    const toReturn = [];
    _.forEach(this.nameReferences[name] || [], (ID) => {
      if (this.get(ID)) {
        toReturn.push(this.get(ID));
      }
    });
    return toReturn;
  }

  forceFocus(window: Electron.BrowserWindow) {
    const index = this.focus.length;
    this.focus.push(window);
    window.on('close', () => {
      this.focus[index] = null;
    });
  }

  close(windowID: symbol) {
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

export default WindowManagerClass;
