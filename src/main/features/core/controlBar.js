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
  WindowManager.getByInternalID(windowID).close();
});
