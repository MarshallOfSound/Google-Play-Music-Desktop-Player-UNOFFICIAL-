import { app, BrowserWindow } from 'electron';
import { argv } from 'yargs';
import path from 'path';
import ua from 'universal-analytics';
import uuid from 'uuid';
import winston from 'winston';

import configureApp from './main/configureApp';
import generateBrowserConfig from './main/configureBrowser';
import { positionOnScreen } from './_util';

import EmitterClass from './main/utils/Emitter';
import SettingsClass from './main/utils/Settings';
import WindowManagerClass from './main/utils/WindowManager';
import PlaybackAPIClass from './main/utils/PlaybackAPI';
import I3IpcHelperClass from './main/utils/I3IpcHelper';

import './inject/generic/translations';

import handleStartupEvent from './squirrel';

import { updateShortcuts } from './main/utils/_shortcutManager';

app.setAppUserModelId('com.marshallofsound.gpmdp.core');
updateShortcuts();

(() => {
  if (handleStartupEvent()) {
    return;
  }

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow = null;

  // DEV: Make the app single instance
  const shouldQuit = app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
      if (app.dock && app.dock.show) app.dock.show();
    }
  });

  if (shouldQuit) {
    app.quit();
    return;
  }

  if (process.env.TEST_SPEC) {
    global.Settings = new SettingsClass('.test', true);
  } else {
    global.Settings = new SettingsClass();
  }

  global.DEV_MODE = process.env['TEST_SPEC'] || argv.development || argv.dev; // eslint-disable-line
  if (Settings.get('START_IN_DEV_MODE', false)) {
    global.DEV_MODE = true;
    Settings.set('START_IN_DEV_MODE', false);
  }

  // Initialize the logger with some default logging levels.
  const defaultFileLogLevel = 'info';
  const defaultConsoleLogLevel = global.DEV_MODE ? 'debug' : 'error';
  global.Logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        filename: path.resolve(app.getPath('userData'), 'gpmdp.log'),
        level: defaultFileLogLevel,
        maxsize: 5000000,
        maxfiles: 2,
      }),
      new (winston.transports.Console)({
        level: defaultConsoleLogLevel,
      }),
    ],
  });

  Logger.info('Application started.');

  configureApp(app);

  global.Emitter = new EmitterClass();
  global.WindowManager = new WindowManagerClass();
  global.PlaybackAPI = new PlaybackAPIClass();

  // UA for GA
  // This is for user reporting
  Settings.set('uuid', Settings.get('uuid', uuid.v4()));
  const user = ua('UA-44220619-5', Settings.get('uuid'));
  setInterval((function sendPageView() {
    user.pageview('/').send();
    return sendPageView;
  }()), 60000 * 5);

  // Replace the logger's levels with those from settings.
  Logger.transports.console.level = Settings.get('consoleLogLevel', defaultConsoleLogLevel);
  Logger.transports.file.level = Settings.get('fileLogLevel', defaultFileLogLevel);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {
    mainWindow = new BrowserWindow(generateBrowserConfig());
    global.mainWindowID = WindowManager.add(mainWindow, 'main');

    const position = Settings.get('position');
    const inBounds = positionOnScreen(position);

    let size = Settings.get('size');
    size = size || [1200, 800];

    mainWindow.setSize(...size);
    if (position && inBounds) {
      mainWindow.setPosition(...position);
    } else {
      mainWindow.center();
    }

    if (Settings.get('maximized', false)) {
      mainWindow.maximize();
    }

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/public_html/index.html`);
    require('./main/features');
    require('./old_win32');

    // Proxy window events through IPC to solve 'webContents destroyed' errors
    const proxyWindowEvent = (name) => {
      mainWindow.on(name, (...args) => Emitter.sendToGooglePlayMusic(`BrowserWindow:${name}`, ...args));
    };
    proxyWindowEvent('app-command');
    proxyWindowEvent('swipe');
    proxyWindowEvent('scroll-touch-begin');
    proxyWindowEvent('scroll-touch-end');

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
      PlaybackAPI.reset();
    });

    // setup i3 listener
    const I3IpcHelper = new I3IpcHelperClass();
    I3IpcHelper.setupEventListener();
  });

  app.on('before-quit', () => {
    Logger.info('Application exiting...');
    global.quiting = true;
  });
})();
