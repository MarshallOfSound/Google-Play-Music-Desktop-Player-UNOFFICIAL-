import { app, autoUpdater } from 'electron';
import https from 'https';

let platform = 'win';
if (process.platform === 'darwin') {
  platform = 'osx';
}

const setUpAutoUpdate = () => {
  if (global.DEV_MODE) return;
  try {
    autoUpdater.setFeedURL(`https://update.gpmdp.xyz/update/${platform}/${app.getVersion()}`);

    autoUpdater.on('error', (error) => {
      // Ignore it, errors happen
      Logger.debug('Auto updater error.', error);
    });

    autoUpdater.on('checking-for-update', () => {
      // Do something
      Logger.debug('Auto updater - checking for update...');
    });

    autoUpdater.on('update-available', () => {
      // Do something
      Logger.info('Auto updater - update available.');
    });

    autoUpdater.on('update-not-available', () => {
      Logger.debug('Auto updater - update not available.');
      setTimeout(() => {
        autoUpdater.checkForUpdates();
      }, 300000);
    });

    let update = false;
    autoUpdater.on('update-downloaded', () => {
      Logger.info('Auto updater - update downloaded.');
      Emitter.sendToAll('update:available');
      update = true;
    });

    Emitter.on('update:trigger', () => {
      Logger.info('Auto updater - update triggered.');
      if (update) {
        Logger.info('Auto updater - quitting to install.');
        autoUpdater.quitAndInstall();
      }
    });

    Emitter.on('update:wait', () => {
      setTimeout(() => {
        Emitter.sendToAll('update:available');
      }, 1200000);
    });

    autoUpdater.checkForUpdates();
  } catch (e) {
    Logger.error('Failed to setup auto update.', e);
  }
};

const checkUpdateServer = () => {
  https.get('https://update.gpmdp.xyz', () => {
    setUpAutoUpdate();
  }).on('error', () => {
    Logger.error('################### !! Update server down !! ##################');
    setTimeout(checkUpdateServer, 120000);
  });
};

checkUpdateServer();
