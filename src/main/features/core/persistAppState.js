const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

let mini = false;
Emitter.on('mini', (event, state) => {
  mini = state.state;
});

const _save = () => {
  if (!mini) {
    Settings.set('position', mainWindow.getPosition());
    Settings.set('size', mainWindow.getSize());
  } else {
    const dimension = Math.max(...mainWindow.getSize());
    mainWindow.setSize(dimension, dimension);
    Emitter.sendToGooglePlayMusic('set:zoom', dimension / 310);
  }
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
