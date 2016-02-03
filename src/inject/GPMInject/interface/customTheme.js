Emitter.on('theme:updateColor', (event, customColor) => {
  window.GPMTheme.updateTheme({
    foreSecondary: customColor,
  });
});

Emitter.on('theme:updateState', (event, state) => {
  if (state.state) {
    window.GPMTheme.enable();
  } else {
    window.GPMTheme.disable();
  }
});

window.wait(() => {
  window.GPMTheme.updateTheme({
    foreSecondary: Settings.get('themeColor'),
  });
  if (Settings.get('theme')) {
    window.GPMTheme.enable();
  } else {
    window.GPMTheme.disable();
  }
});
