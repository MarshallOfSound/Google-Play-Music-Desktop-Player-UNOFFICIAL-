import { app } from 'electron';
import './darkMode';

app.on('activate', () => {
  const mainWindow = WindowManager.getAll('main')[0];
  if (mainWindow) {
    mainWindow.show();
  } else {
    // Something went wrong
    app.quit();
  }
});

if (Settings.get('fullscreen')) WindowManager.getAll('main')[0].setFullScreen(true);
