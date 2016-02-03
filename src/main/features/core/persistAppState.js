const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

const _save = () => {
  Settings.set('position', mainWindow.getPosition());
  Settings.set('size', mainWindow.getSize());
};

mainWindow.on('move', _save);
mainWindow.on('resize', _save);
