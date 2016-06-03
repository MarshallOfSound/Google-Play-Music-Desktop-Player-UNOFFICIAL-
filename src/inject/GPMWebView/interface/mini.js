import { remote } from 'electron';

const mainWindow = remote.getCurrentWindow();
const webContents = mainWindow.webContents;
const MINI_SIZE = 310;

let mini = false;

window.wait(() => {
  if (Settings.get('miniAlwaysShowSongInfo', false)) {
    document.body.setAttribute('controls', 'controls');
  }
  if (Settings.get('miniUseScrollVolume', false)) {
    window.GPM.mini.setScrollVolume(true);
  }

  window.GPM.mini.on('enable', () => {
    Emitter.fire('mini', { state: true });

	// Restore the mini size/position from settings, otherwise use default size and regular position.
    const miniSize = Settings.get('mini-size', [MINI_SIZE, MINI_SIZE]);
    const miniPosition = Settings.get('mini-position', mainWindow.getPosition());
    mainWindow.setSize(...miniSize);
    mainWindow.setPosition(...miniPosition);

    mainWindow.setMaximumSize(MINI_SIZE, MINI_SIZE);
    webContents.executeJavaScript('document.body.setAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
    remote.getCurrentWindow().setAlwaysOnTop(Settings.get('miniAlwaysOnTop', false));
    mini = true;
  });

  window.GPM.mini.on('disable', () => {
    Emitter.fire('mini', { state: false });
    // DEV: Set max size to be massive
    //      Same reason as specified in Electron src
    //        --> https://github.com/atom/electron/blob/master/atom/browser/native_window_views.cc
    mainWindow.setMaximumSize(99999999, 999999999);

    // Restore the regular size/position from settings.
    const regularSize = Settings.get('size');
    const regularPosition = Settings.get('position');
    mainWindow.setSize(...regularSize);
    mainWindow.setPosition(...regularPosition);

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
Emitter.on('miniUseScrollVolume', (event, state) => {
  window.GPM.mini.setScrollVolume(state.state);
});
