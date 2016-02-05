const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

const _save = () => {
  Settings.set('position', mainWindow.getPosition());
  Settings.set('size', mainWindow.getSize());
};

mainWindow.on('move', _save);
mainWindow.on('resize', _save);

Emitter.on('eq:change', (event, details) => {
  const eq = Settings.get('eq', [1, 1, 1, 1, 1, 1]);
  eq[details.index] = details.value;
  Settings.set('eq', eq);
});

Emitter.on('audiooutput:set', (event, name) => {
  Settings.set('audiooutput', name);
});
