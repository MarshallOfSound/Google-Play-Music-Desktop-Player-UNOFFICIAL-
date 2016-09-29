const customStyle = document.createElement('style');
let customStyleString = '';

Emitter.on('settings:change:themeColor', (event, customColor) => {
  GPMTheme.updateTheme({
    foreSecondary: customColor,
  });
  customStyle.innerHTML = GPMTheme.substituteColors(customStyleString);
});

Emitter.on('settings:change:theme', (event, state) => {
  if (state) {
    GPMTheme.enable();
  } else {
    GPMTheme.disable();
  }
});

Emitter.on('settings:change:themeType', (event, type) => {
  GPMTheme.updateTheme({
    type,
  });
});

Emitter.on('LoadGPMCustomStyles', (event, styleString) => {
  customStyleString = styleString;
  customStyle.innerHTML = GPMTheme.substituteColors(customStyleString);
});
Emitter.fire('FetchGPMCustomStyles');

(<any>window).wait(() => {
  document.body.appendChild(customStyle);
  GPMTheme.updateTheme({
    type: Settings.get('themeType', 'FULL'),
    backHighlight: '#1a1b1d',
    foreSecondary: Settings.get('themeColor'),
  });
  if (Settings.get('theme')) {
    GPMTheme.enable();
  } else {
    GPMTheme.disable();
  }
});
