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

Emitter.on('theme:updateType', (event, type) => {
  window.GPMTheme.updateTheme({
    type,
  });
});

window.wait(() => {
  window.GPMTheme.updateTheme({
    type: Settings.get('themeType', 'FULL'),
	backHighlight: '#1a1b1d',
    foreSecondary: Settings.get('themeColor'),
  });
  if (Settings.get('theme')) {
    window.GPMTheme.enable();
  } else {
    window.GPMTheme.disable();
  }
});
