import { app, Menu, Tray, shell } from 'electron';
import path from 'path';

import { showDesktopSettings } from './desktopSettings';

let appIcon = null;
const mainWindow = WindowManager.getAll('main')[0];

let audioDeviceMenu = [
  {
    label: TranslationProvider.query('label-loading-devices'),
    enabled: false,
  },
];

if (process.platform === 'darwin') {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/macTemplate.png`));
} else {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/main.png`));
}

const setContextMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    { label: TranslationProvider.query('tray-label-show'),
      click: () => {
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
      },
    },
    { type: 'separator' },
    {
      label: TranslationProvider.query('playback-label-play-pause'),
      click: () => Emitter.sendToGooglePlayMusic('playback:playPause'),
    },
    {
      label: TranslationProvider.query('playback-label-previous-track'),
      click: () => Emitter.sendToGooglePlayMusic('playback:previousTrack'),
    },
    {
      label: TranslationProvider.query('playback-label-next-track'),
      click: () => Emitter.sendToGooglePlayMusic('playback:nextTrack'),
    },
    { type: 'separator' },
    {
      label: TranslationProvider.query('playback-label-thumbs-up'),
      click: () => Emitter.sendToGooglePlayMusic('playback:thumbsUp'),
    },
    {
      label: TranslationProvider.query('playback-label-thumbs-down'),
      click: () => Emitter.sendToGooglePlayMusic('playback:thumbsDown'),
    },
    { type: 'separator' },
    {
      label: TranslationProvider.query('tray-label-audio-device'),
      submenu: audioDeviceMenu,
    },
    {
      label: TranslationProvider.query('label-help'),
      role: 'help',
      submenu: [
        {
          label: TranslationProvider.query('label-about'),
          click: () => {
            Emitter.sendToWindowsOfName('main', 'about');
          },
        },
        {
          label: TranslationProvider.query('label-issues'),
          click: () => shell.openExternal('https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues'),
        },
        {
          label: TranslationProvider.query('label-donate'),
          click: () => shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=23CZGASL6XMLJ'),
        },
        {
          label: TranslationProvider.query('label-learn-more'),
          click: () => shell.openExternal('http://www.googleplaymusicdesktopplayer.com'),
        },
      ],
    },
    { label: TranslationProvider.query('label-desktop-settings'), click: () => { showDesktopSettings(); } },
    { type: 'separator' },
    { label: TranslationProvider.query('label-quit'), click: () => { global.quiting = true; app.quit(); } },
  ]);
  appIcon.setContextMenu(contextMenu);
};
setContextMenu();


let wasMaximized = Settings.get('maximized', false);

// Tray icon toggle action (windows, linux)
function toggleMainWindow() {
  // the mainWindow variable will be GC'd
  // we must find the window ourselves
  const win = WindowManager.getAll('main')[0];

  if (win.isMinimized()) {
    win.setSkipTaskbar(false);
    win.show();
    if (wasMaximized) {
      win.maximize();
    }
  } else {
    wasMaximized = win.isMaximized();
    // Hide to tray, if configured
    if (Settings.get('minToTray', true)) {
      win.minimize();
      win.setSkipTaskbar(true);
    }
  }
}

appIcon.setToolTip('Google Play Music Desktop Player');

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
            label = TranslationProvider.query('audio-device-default');
            break;
          case 'communications':
            label = TranslationProvider.query('audio-device-communications');
            break;
          default:
            label = TranslationProvider.query('audio-device-unknown');
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
