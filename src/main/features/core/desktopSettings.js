import { BrowserWindow } from 'electron';
import path from 'path';

Emitter.on('window:settings', () => {
  // const mainWindow = WindowManager.getAll('main')[0];
  const desktopSettings = new BrowserWindow({
    width: 800,
    height: 400,
    frame: false,
    show: false,
    nodeIntegration: true,
    icon: path.resolve('./build/assets/img/main.png'),
    title: 'Settings',
    'web-preferences': {
      preload: path.resolve('./build/inject/generic.js'),
    },
  });
  desktopSettings.loadURL(`file://${__dirname}/../../../public_html/desktop_settings.html`);

  WindowManager.add(desktopSettings);
  WindowManager.forceFocus(desktopSettings);
});
