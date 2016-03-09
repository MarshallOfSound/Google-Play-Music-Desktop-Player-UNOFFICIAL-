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
      },
    },
    { type: 'separator' },
    {
      label: 'Play / Pause',
      click: () => Emitter.sendToGooglePlayMusic('playback:playPause'),
    },
    {
      label: 'Previous Track',
      click: () => Emitter.sendToGooglePlayMusic('playback:previousTrack'),
    },
    {
      label: 'Next Track',
      click: () => Emitter.sendToGooglePlayMusic('playback:nextTrack'),
    },
    { type: 'separator' },
    {
      label: 'Thumbs Up',
      click: () => Emitter.sendToGooglePlayMusic('playback:thumbsUp'),
    },
    {
      label: 'Thumbs Down',
      click: () => Emitter.sendToGooglePlayMusic('playback:thumbsDown'),
    },
    { type: 'separator' },
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


// Tray icon toggle action (windows, linux)
function toggleMainWindow() {
  // the mainWindow variable will be GC'd
  // we must find the window ourselves
  const win = WindowManager.getAll('main')[0];

  if (win.isMinimized()) {
    win.setSkipTaskbar(false);
    win.show();
  } else {
    // Hide to tray, if configured
    if (Settings.get('minToTray', true)) {
      win.minimize();
      win.setSkipTaskbar(true);
    }
  }
}

appIcon.setToolTip('Google Play Music');

switch (process.platform) {
  case 'darwin': // <- actually means OS-X
    // No toggle action, use the context menu.
    break;
  case 'linux':
  case 'freebsd': // <- for the hipsters
  case 'sunos':   // <- in case someone runs this in a museum
    appIcon.on('click', toggleMainWindow);
    break;
  case 'win32': // <- it's win32 also on 64-bit Windows
    appIcon.on('double-click', toggleMainWindow);
    break;
  default:
    // impossible case to satisfy Linters
}


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
