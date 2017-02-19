const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

let mini = false;
Emitter.on('mini', (event, state) => {
  mini = state.state;
  event.returnValue = null; // eslint-disable-line
});

let resizeTimer;

const _save = () => {
  if (!mini) {
    if (mainWindow.isFullScreen()) {
      Settings.set('fullscreen', true);
      return;
    }
    Settings.set('fullscreen', false);

    if (mainWindow.isMaximized()) {
      Settings.set('maximized', true);
    } else {
      Settings.set('maximized', false);
      Settings.set('position', mainWindow.getPosition());
      Settings.set('size', mainWindow.getSize());
    }
  } else {
    Settings.set('mini-position', mainWindow.getPosition());
    Settings.set('mini-size', mainWindow.getContentSize());

    // Keep the mini-player square.
    const dimension = Math.max(...mainWindow.getContentSize());
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => mainWindow.setContentSize(dimension, dimension), 100);
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
  _save();
});
mainWindow.on('unmaximize', _save);
mainWindow.on('enter-full-screen', _save);
mainWindow.on('leave-full-screen', () => setTimeout(_save, 1000));

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
