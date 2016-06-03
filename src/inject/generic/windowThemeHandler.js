if (window.$ && window.$.ajax) {
  Emitter.on('theme:updateState', (event, state) => {
    if (!state.state) {
      document.body.removeAttribute('theme');
    } else {
      document.body.setAttribute('theme', 'on');
    }
  });
  Emitter.on('theme:updateType', (event, type) => {
    if (type === 'FULL') {
      document.body.setAttribute('full', 'full');
      document.body.removeAttribute('light');
    } else {
      document.body.removeAttribute('full');
      document.body.setAttribute('light', 'light');
    }
  });

  if (Settings.get('theme')) {
    document.body.setAttribute('theme', 'on');
  }
  if (Settings.get('themeType', 'FULL') === 'FULL') {
    document.body.setAttribute('full', 'full');
  } else {
    document.body.setAttribute('light', 'light');
  }

  const style = $('<style></style>');
  $('body').append(style);
  const redrawTheme = (customColor) => {
    const color = customColor || Settings.get('themeColor');
    const border = `[theme][light] .window-border{border-color:${color}}`;
    const titleBar = `[theme][light] .title-bar{background:${color}}`;
    const header = `[theme][light] .dialog .window-title{background:${color}}`;
    const lyricsProgress = `
[theme][full] #lyrics_bar{background:${color} !important}
[theme][light] #lyrics_progress{background:${color} !important}
[theme][full] #lyrics_progress{background:#222326 !important}`; // @darkprimary
    style.html(border + titleBar + header + lyricsProgress);
    document.body.setAttribute('loaded', 'loaded');
  };
  redrawTheme();
  Emitter.on('theme:updateColor', (event, customColor) => {
    redrawTheme(customColor);
  });
}
