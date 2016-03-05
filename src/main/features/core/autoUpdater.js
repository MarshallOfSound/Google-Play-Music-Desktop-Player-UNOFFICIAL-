import { app, autoUpdater } from 'electron';
import http from 'http';

let platform = 'win';
if (process.platform === 'darwin') {
  platform = 'osx';
}

const setUpAutoUpdate = () => {
  try {
    autoUpdater.setFeedURL(`http://update.googleplaymusicdesktopplayer.com/update/${platform}/${app.getVersion()}`);

    autoUpdater.on('checking-for-update', () => {
      // Do something
    });

    autoUpdater.on('update-available', () => {
      // Do something
    });

    autoUpdater.on('update-not-available', () => {
      setTimeout(() => {
        autoUpdater.checkForUpdates();
      }, 300000);
    });

    let update = false;
    autoUpdater.on('update-downloaded', () => {
      Emitter.sendToAll('update:available');
      update = true;
    });

    Emitter.on('update:trigger', () => {
      if (update) {
        autoUpdater.quitAndInstall();
      }
    });

    Emitter.on('update:wait', () => {
      setTimeout(() => {
        Emitter.sendToAll('update:available');
      }, 12000);
    });

    autoUpdater.checkForUpdates();
  } catch (e) {
    Settings.set('woahError', e);
  }
};

const checkUpdateServer = () => {
  http.get('http://update.googleplaymusicdesktopplayer.com', () => {
    setUpAutoUpdate();
  }).on('error', () => {
    console.log('################### !! Update server down !! ##################'); // eslint-disable-line
    setTimeout(checkUpdateServer, 120000);
  });
};

checkUpdateServer();
