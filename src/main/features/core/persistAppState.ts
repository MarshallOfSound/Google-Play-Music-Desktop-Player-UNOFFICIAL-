const mainWindows = WindowManager.getAll('main');
const theMainWindow = mainWindows[0];

let mini = false;
Emitter.on('mini', (event, state) => {
  mini = state.state;
  event.returnValue = null; // eslint-disable-line
});

let resizeTimer;

const _save = () => {
  if (!mini) {
    if (theMainWindow.isMaximized()) {
      Settings.set('maximized', true);
    } else {
      Settings.set('maximized', false);
      Settings.set('position', theMainWindow.getPosition());
      Settings.set('size', theMainWindow.getSize());
    }
  } else {
    Settings.set('mini-position', theMainWindow.getPosition());
    Settings.set('mini-size', theMainWindow.getContentSize());

    // Keep the mini-player square.
    const dimension = Math.max(...theMainWindow.getContentSize());
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => theMainWindow.setContentSize(dimension, dimension), 100);
    Emitter.sendToGooglePlayMusic('set:zoom', dimension / 310);
  }
};

theMainWindow.on('move', _save);
theMainWindow.on('resize', _save);
theMainWindow.on('maximize', (ev) => {
  if (mini) {
    theMainWindow.unmaximize();
    ev.preventDefault();
    return false;
  }
  _save();
});
theMainWindow.on('unmaximize', _save);

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
