import { app, autoUpdater } from 'electron';

let platform = 'win';
if (process.platform === 'darwin') {
  platform = 'osx';
}

try {
  autoUpdater.setFeedURL(`http://ut.samuel.ninja:6069/update/${platform}/${app.getVersion()}`);

  autoUpdater.on('checking-for-update', () => {
    // Do something
  });

  autoUpdater.on('update-available', () => {
    // Do something
  });

  autoUpdater.on('update-not-available', () => {
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 300);
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
