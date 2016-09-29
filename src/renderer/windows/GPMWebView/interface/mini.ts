import { remote } from 'electron';

import { positionOnScreen } from '../../../../_util';

const mainWindow = remote.getCurrentWindow();
const webContents = mainWindow.webContents;
const MINI_SIZE = 310;

let mini = false;

(<any>window).wait(() => {
  if (Settings.get('miniAlwaysShowSongInfo', false)) {
    document.body.setAttribute('controls', 'controls');
  }
  GPM.mini.setScrollVolume(Settings.get('miniUseScrollVolume', false));

  let wasMaximized = mainWindow.isMaximized();
  GPM.on('mini:enable', () => {
    Emitter.fireSync('mini', { state: true });

	// Restore the mini size/position from settings, otherwise use default size and regular position.
    const miniSize: number[] = Settings.get('mini-size', [MINI_SIZE, MINI_SIZE]);
    const miniPosition: number[] = Settings.get('mini-position', mainWindow.getPosition());
    mainWindow.setContentSize(miniSize[0], miniSize[1]);
    mainWindow.setSize(mainWindow.getSize()[0], mainWindow.getSize()[1]);
    if (positionOnScreen(miniPosition)) {
      mainWindow.setPosition(miniPosition[0], miniPosition[1]);
    } else {
      mainWindow.center();
    }
    wasMaximized = mainWindow.isMaximized();
    mainWindow.unmaximize();

    // TODO: Re-enable when the root cause of electron/electron#6783 is fixed
    // remote.getCurrentWindow().setMaximumSize(MINI_SIZE + 20, MINI_SIZE + 20);
    remote.getCurrentWindow().setMinimumSize(50, 50);
    webContents.executeJavaScript('document.body.setAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
    remote.getCurrentWindow().setAlwaysOnTop(Settings.get('miniAlwaysOnTop', false));
    mini = true;
  });

  GPM.on('mini:disable', () => {
    Emitter.fire('mini', { state: false });
    remote.getCurrentWindow().setMaximumSize(99999999, 999999999);
    remote.getCurrentWindow().setMinimumSize(200, 200);

    // Restore the regular size/position from settings.
    const regularSize = Settings.get('size');
    const regularPosition = Settings.get('position');
    mainWindow.setSize(regularSize[0], regularSize[1]);
    if (positionOnScreen(regularPosition)) {
      mainWindow.setPosition(regularPosition[0], regularPosition[1]);
    } else {
      mainWindow.center();
    }

    if (wasMaximized) mainWindow.maximize();

    webContents.executeJavaScript('document.body.removeAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
    remote.getCurrentWindow().setAlwaysOnTop(false);
    mini = false;
  });
});

let nextZoom;
Emitter.on('set:zoom', (event, factor: number) => {
  if (nextZoom) {
    clearTimeout(nextZoom);
  }
  nextZoom = setTimeout(() => {
    remote.getCurrentWebContents().setZoomFactor(factor);
  }, 5);
});

Emitter.on('miniAlwaysShowSongInfo', (event, state: GPMDP.BooleanState) => {
  if (state.state) {
    document.body.setAttribute('controls', 'controls');
  } else {
    document.body.removeAttribute('controls');
  }
});
Emitter.on('miniAlwaysOnTop', (event, state: GPMDP.BooleanState) => {
  if (mini) {
    remote.getCurrentWindow().setAlwaysOnTop(state.state);
  }
});
Emitter.on('miniUseScrollVolume', (event, state: GPMDP.BooleanState) => {
  GPM.mini.setScrollVolume(state.state);
});
