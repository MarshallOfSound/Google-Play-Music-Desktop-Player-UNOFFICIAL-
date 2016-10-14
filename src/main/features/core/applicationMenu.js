import { app, Menu, shell } from 'electron';
import { showDesktopSettings } from './desktopSettings';

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          focusedWindow.reload();
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (() => {
          if (process.platform === 'darwin') return 'Ctrl+Command+F';
          return 'F11';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            focusedWindow.send('window:fullscreen', { state: focusedWindow.isFullScreen() });
          }
        },
      },
      {
        label: 'Go to URL',
        accelerator: 'CmdOrCtrl+Shift+G',
        click: () => {
          Emitter.sendToWindowsOfName('main', 'gotourl');
        },
      },
      {
        label: 'Show Lyrics (Beta)',
        accelerator: 'CmdOrCtrl+Shift+L',
        click: () => {
          Emitter.sendToWindowsOfName('main', 'lyrics:show');
        },
      },
    ],
  },
  {
    label: 'Playback',
    submenu: [
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
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        type: 'separator',
      },
      {
        label: 'Full Size Player',
        type: 'radio',
        checked: true,
        accelerator: 'CmdOrCtrl+Shift+Alt+L',
        click: () => Emitter.sendToGooglePlayMusic('playback:miniDisable'),
      },
      {
        label: 'Mini Player',
        type: 'radio',
        accelerator: 'CmdOrCtrl+Shift+Alt+M',
        click: () => Emitter.sendToGooglePlayMusic('playback:miniEnable'),
      },
      {
        type: 'separator',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: () => {
          Emitter.sendToWindowsOfName('main', 'about');
        },
      },
      {
        label: 'Issues',
        click: () => shell.openExternal('https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues'),
      },
      {
        label: 'Donate',
        click: () => shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=23CZGASL6XMLJ'),
      },
      {
        label: 'Learn More',
        click: () => shell.openExternal('http://www.googleplaymusicdesktopplayer.com'),
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: 'Google Play Music Desktop Player',
    submenu: [
      {
        label: 'About Google Play Music Desktop Player',
        role: 'about',
      },
      {
        label: 'Preferences',
        accelerator: 'Command+,',
        click: () => showDesktopSettings(),
      },
      {
        type: 'separator',
      },
      {
        label: 'Hide',
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => app.quit(),
      },
    ],
  });
  // Window menu.
  template[4].submenu.push(
    {
      type: 'separator',
    },
    {
      label: 'Bring All to Front',
      role: 'front',
    }
  );
}

if (global.DEV_MODE) {
  template[4].submenu.push(
    {
      type: 'separator',
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (() => {
        if (process.platform === 'darwin') return 'Alt+Command+I';
        return 'Ctrl+Shift+I';
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) focusedWindow.toggleDevTools();
      },
    }
  );
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
