import { remote } from 'electron';

const mainWindow = remote.getCurrentWindow();
const webContents = mainWindow.webContents;
const MINI_SIZE = 310;

let mini = false;
let oldSize;

const I3IpcHelper = remote.getGlobal('I3IpcHelper');

window.wait(() => {
  if (Settings.get('miniAlwaysShowSongInfo', false)) {
    document.body.setAttribute('controls', 'controls');
  }

  window.GPM.mini.on('enable', () => {
    I3IpcHelper.setFloating(true);
    Emitter.fire('mini', { state: true });
    oldSize = remote.getCurrentWindow().getSize();
    mainWindow.setSize(MINI_SIZE, MINI_SIZE);
    mainWindow.setMaximumSize(MINI_SIZE, MINI_SIZE);
    webContents.executeJavaScript('document.body.setAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
    remote.getCurrentWindow().setAlwaysOnTop(Settings.get('miniAlwaysOnTop', false));
    mini = true;
  });

  window.GPM.mini.on('disable', () => {
    I3IpcHelper.setFloating(false);
    Emitter.fire('mini', { state: false });
    // DEV: Set max size to be massive
    //      Same reason as specified in Electron src
    //        --> https://github.com/atom/electron/blob/master/atom/browser/native_window_views.cc
    mainWindow.setMaximumSize(99999999, 999999999);
    mainWindow.setSize(...oldSize);
    webContents.executeJavaScript('document.body.removeAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
    remote.getCurrentWindow().setAlwaysOnTop(false);
    mini = false;
  });
});

let nextZoom;
Emitter.on('set:zoom', (event, factor) => {
  if (nextZoom) {
    clearTimeout(nextZoom);
  }
  nextZoom = setTimeout(() => {
    remote.getCurrentWebContents().setZoomFactor(factor);
  }, 5);
});

Emitter.on('miniAlwaysShowSongInfo', (event, state) => {
  if (state.state) {
    document.body.setAttribute('controls', 'controls');
  } else {
    document.body.removeAttribute('controls');
  }
});
Emitter.on('miniAlwaysOnTop', (event, state) => {
  if (mini) {
    remote.getCurrentWindow().setAlwaysOnTop(state.state);
  }
});
