import { remote } from 'electron';

const mainWindow = remote.getCurrentWindow();
const webContents = mainWindow.webContents;
const MINI_SIZE = 310;

let oldSize;

window.wait(() => {
  window.GPM.mini.on('enable', () => {
    Emitter.fire('mini', { state: true });
    oldSize = remote.getCurrentWindow().getSize();
    mainWindow.setSize(MINI_SIZE, MINI_SIZE);
    mainWindow.setMaximumSize(MINI_SIZE, MINI_SIZE);
    webContents.executeJavaScript('document.body.setAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
  });

  window.GPM.mini.on('disable', () => {
    Emitter.fire('mini', { state: false });
    mainWindow.setMaximumSize(0, 0);
    mainWindow.setSize(...oldSize);
    webContents.executeJavaScript('document.body.removeAttribute("mini", "mini")');
    remote.getCurrentWebContents().setZoomFactor(1);
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
