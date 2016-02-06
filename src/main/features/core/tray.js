import { app, Menu, Tray } from 'electron';
import path from 'path';

import { showDesktopSettings } from './desktopSettings';

let appIcon = null;
const mainWindow = WindowManager.getAll('main')[0];

appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/main_tray.png`));
const contextMenu = Menu.buildFromTemplate([
  { label: 'Show', click: () => { mainWindow.setSkipTaskbar(false); mainWindow.show(); } },
  { label: 'Settings', click: () => { showDesktopSettings(); } },
  { type: 'separator' },
  { label: 'Quit', click: () => { app.quit(); } },
]);
appIcon.setToolTip('Google Play Music');
appIcon.setContextMenu(contextMenu);
appIcon.on('double-click', () => {
  mainWindow.setSkipTaskbar(false);
  mainWindow.show();
});

// DEV: Keep the icon in the global scope or it gets garbage collected........
global.appIcon = appIcon;
