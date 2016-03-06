import { app } from 'electron';

app.on('activate', () => {
  const mainWindow = WindowManager.getAll('main')[0];
  if (mainWindow) {
    mainWindow.show();
  } else {
    // Something went wrong
    app.quit();
  }
});
