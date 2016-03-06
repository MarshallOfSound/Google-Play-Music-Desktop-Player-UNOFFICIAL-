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

appIcon.setToolTip('Google Play Music');


// Iconified     -> show, to foreground
// In background -> to foreground
// In foreground -> iconify
appIcon.on('click', () => {
  if (process.platform === 'darwin') {
    // Special code for OS-X - Not tested!
    if (!mainWindow.isVisible()) {
      mainWindow.setSkipTaskbar(false);
      mainWindow.show();
    } else {
      if (PlaybackAPI.isPlaying()) {
        Emitter.sendToGooglePlayMusic('playback:playPause');
      }
      mainWindow.hide();
    }
  } else {
    // Windows, Linux
    if (mainWindow.isMinimized() || !mainWindow.isFocused()) {
      // Window in tray, or not focused
      mainWindow.setSkipTaskbar(false);
      mainWindow.show();
    } else {
      mainWindow.minimize();
      mainWindow.setSkipTaskbar(true);
    }
  }
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
