import { app, Menu, Tray } from 'electron';
import path from 'path';

import { showDesktopSettings } from './desktopSettings';

let appIcon = null;
const mainWindow = WindowManager.getAll('main')[0];

let audioDeviceMenu = [
  {
    label: 'Loading Devices...',
    enabled: false,
  },
];

if (process.platform === 'darwin') {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/macTemplate.png`));
} else {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/main_tray.png`));
}

const setContextMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show',
      click: () => {
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
        if (app.dock && app.dock.show) app.dock.show();
      },
    },
    {
      label: 'Audio Device',
      submenu: audioDeviceMenu,
    },
    { label: 'Settings', click: () => { showDesktopSettings(); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { global.quiting = true; app.quit(); } },
  ]);
  appIcon.setContextMenu(contextMenu);
};
setContextMenu();

appIcon.setToolTip('Google Play Music');
appIcon.on('double-click', () => {
  mainWindow.setSkipTaskbar(false);
  mainWindow.show();
  if (app.dock && app.dock.show) app.dock.show();
});

// DEV: Keep the icon in the global scope or it gets garbage collected........
global.appIcon = appIcon;

app.on('before-quit', () => {
  appIcon.destroy();
  delete global.appIcon;
  appIcon = null;
});

Emitter.on('audiooutput:list', (event, devices) => {
  audioDeviceMenu = [];
  devices.forEach((device) => {
    if (device.kind === 'audiooutput') {
      let label = device.label;
      if (!label) {
        switch (device.deviceId) {
          case 'default':
            label = 'System Default';
            break;
          case 'communications':
            label = 'System Default Communications';
            break;
          default:
            label = 'Unknown Device';
            break;
        }
      }
      audioDeviceMenu.push({
        label,
        type: 'radio',
        click: () => {
          Emitter.sendToGooglePlayMusic('audiooutput:set', device.deviceId);
          Settings.set('audiooutput', label);
        },
        checked: (label === Settings.get('audiooutput')),
      });
    }
  });
  setContextMenu();
});

Emitter.sendToGooglePlayMusic('audiooutput:fetch');
Emitter.on('audiooutput:set', () => Emitter.sendToGooglePlayMusic('audiooutput:fetch'));
