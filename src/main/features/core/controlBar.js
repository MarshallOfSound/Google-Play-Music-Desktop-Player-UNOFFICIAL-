Emitter.on('window:minimize', (event, windowID) => {
  WindowManager.getByInternalID(windowID).minimize();
});

Emitter.on('window:maximize', (event, windowID) => {
  const window = WindowManager.getByInternalID(windowID);
  if (window.isMaximized()) {
    WindowManager.getByInternalID(windowID).unmaximize();
  } else {
    WindowManager.getByInternalID(windowID).maximize();
  }
});

Emitter.on('window:close', (event, windowID) => {
  const winToClose = WindowManager.getByInternalID(windowID);
  if (winToClose) {
    winToClose.close();
  }
});

const mainWindow = WindowManager.getAll('main')[0];
mainWindow.on('close', (event) => {
  if ((Settings.get('minToTray', true) || process.platform === 'darwin') && !global.quiting) {
    global.wasMaximized = Settings.get('maximized', false);
    if (process.platform !== 'darwin') {
      mainWindow.minimize();
      mainWindow.setSkipTaskbar(true);
    } else {
      if (PlaybackAPI.isPlaying() && !Settings.get('minToTray', true)) {
        Emitter.sendToGooglePlayMusic('playback:playPause');
      }
      mainWindow.hide();
    }
    event.preventDefault();
    return;
  }
});
