import { screen } from 'electron';
import path from 'path';

export default () => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const defaultHeight = (screenSize.height * 3) / 4;
  const defaultWidth = (screenSize.width * 3) / 4;


  const baseConfig = {
    width: Settings.get('width', defaultWidth),
    height: Settings.get('height', defaultHeight),
    minWidth: 200,
    minHeight: 200,
    x: Settings.get('X'),
    y: Settings.get('Y'),
    show: false,
    autoHideMenuBar: true,
    frame: Settings.get('nativeFrame'),
    titleBarStyle: Settings.get('nativeFrame') && process.platform === 'darwin' ? 'hidden' : 'default',
    icon: path.resolve(`${__dirname}/../assets/img/main.${(process.platform === 'win32' ? 'ico' : 'png')}`), // eslint-disable-line
    title: 'Google Play Music Desktop Player',
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(`${__dirname}/../renderer/generic/index.js`),
    },
  };

  return baseConfig;
};
