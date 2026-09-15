const customStyle = document.createElement('style');
let customStyleString = '';

Emitter.on('settings:change:themeColor', (event, customColor) => {
  window.GPMTheme.updateTheme({
    foreSecondary: customColor,
  });
  customStyle.innerHTML = window.GPMTheme.substituteColors(customStyleString);
});

Emitter.on('settings:change:theme', (event, state) => {
  if (state) {
    window.GPMTheme.enable();
  } else {
    window.GPMTheme.disable();
  }
});

Emitter.on('settings:change:themeType', (event, type) => {
  window.GPMTheme.updateTheme({
    type,
  });
  document.querySelector('html').setAttribute('data-theme-type', type);
});

Emitter.on('LoadGPMCustomStyles', (event, styleString) => {
  customStyleString = styleString;
  customStyle.innerHTML = window.GPMTheme.substituteColors(customStyleString);
});
Emitter.fire('FetchGPMCustomStyles');

window.wait(() => {
  document.body.appendChild(customStyle);
  const type = Settings.get('themeType', 'FULL');
  window.GPMTheme.updateTheme({
    type,
    backHighlight: '#1a1b1d',
    foreSecondary: Settings.get('themeColor'),
  });
  document.querySelector('html').setAttribute('data-theme-type', type);
  if (Settings.get('theme')) {
    window.GPMTheme.enable();
  } else {
    window.GPMTheme.disable();
  }
});
