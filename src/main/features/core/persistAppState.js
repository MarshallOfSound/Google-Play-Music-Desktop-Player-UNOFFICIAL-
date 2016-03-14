const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

let mini = false;
Emitter.on('mini', (event, state) => {
  mini = state.state;
});

let resizeTimer;

const _save = () => {
  if (!mini) {
    Settings.set('position', mainWindow.getPosition());
    Settings.set('size', mainWindow.getSize());
  } else {
    Settings.set('mini-position', mainWindow.getPosition());
    Settings.set('mini-size', mainWindow.getSize());

    // Keep the mini-player square.
    const dimension = Math.max(...mainWindow.getSize());
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => mainWindow.setSize(dimension, dimension), 100);
    Emitter.sendToGooglePlayMusic('set:zoom', dimension / 310);
  }
};

mainWindow.on('move', _save);
mainWindow.on('resize', _save);
mainWindow.on('maximize', (ev) => {
  if (mini) {
    mainWindow.unmaximize();
    ev.preventDefault();
    return false;
  }
});

Emitter.on('eq:change', (event, details) => {
  const eq = Settings.get('eq', [1, 1, 1, 1, 1, 1]);
  eq[details.index] = details.value;
  Settings.set('eq', eq);
});

Emitter.on('audiooutput:set', (event, name) => {
  Settings.set('audiooutput', name);
});

Emitter.on('welcomed', (event, version) => {
  Settings.set('welcomed', version);
});
