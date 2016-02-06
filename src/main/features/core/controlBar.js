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
  if (windowID === 1 && Settings.get('minToTray', true)) {
    WindowManager.getByInternalID(windowID).minimize();
    WindowManager.getByInternalID(windowID).setSkipTaskbar(true);
    return;
  }
  WindowManager.getByInternalID(windowID).close();
});
