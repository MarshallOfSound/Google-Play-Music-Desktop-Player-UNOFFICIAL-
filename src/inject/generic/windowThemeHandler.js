if (window.$ && window.$.ajax) {
  require('./customWindowThemeHandler');

  Emitter.on('settings:change:theme', (event, state) => {
    if (!state) {
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

  Emitter.on('window:updateTitle', (event, newTitle) => {
    const titleBar = document.querySelector('.darwin-title-bar .title');
    if (titleBar) {
      titleBar.innerHTML = newTitle;
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
    const darwinTitleBar = `[theme][light] .darwin-title-bar{background-color:${color}}`;
    const header = `[theme][light] .dialog .window-title{background:${color}}`;
    const lyricsProgress = `
[theme][full] #lyrics_bar{background:${color} !important}
[theme][light] #lyrics_progress{background:${color} !important}
[theme][full] #lyrics_progress{background:#222326 !important}`; // @darkprimary
    style.html(border + titleBar + darwinTitleBar + header + lyricsProgress);
    document.body.setAttribute('loaded', 'loaded');
  };
  redrawTheme();
  Emitter.on('theme:updateColor', (event, customColor) => {
    redrawTheme(customColor);
  });
}
