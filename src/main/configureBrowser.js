import { screen } from 'electron';
import path from 'path';
import os from 'os';
import semver from 'semver';

export default () => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const defaultHeight = screenSize.height * 3 / 4;
  const defaultWidth = screenSize.width * 3 / 4;


  const baseConfig = {
    width: Settings.get('width', defaultWidth),
    height: Settings.get('height', defaultHeight),
    x: Settings.get('X'),
    y: Settings.get('Y'),
    show: false,
    frame: false,
    icon: path.resolve('./build/assets/img/main.png'),
    fullscreen: false,
    title: 'Nucleus Player',
    nodeIntegration: true,
    'web-preferences': {
      preload: path.resolve('./build/inject/generic.js'),
    },
  };

  // DEV: OS specific options
  if (process.platform === 'darwin') {
    if (semver.satisfies(os.release(), '>=14.0.0')) {
      // baseConfig.frame = true;
      // baseConfig.titleBarStyle = 'hidden-inset';
    }
  } else if (process.platform === 'win32') {
    // baseConfig['web-preferences'] = {
    //   preload: path.resolve('./build/js/inject/windowsNotifications.js'),
    // };
  }
  return baseConfig;
};
