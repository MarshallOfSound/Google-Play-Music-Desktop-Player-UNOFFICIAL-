import GMusicTheme from 'gmusic-theme.js';

// Hack the crap out of GMusicTheme
Object.assign(GMusicTheme.prototype, {
  _drawLogo: () => {},
  _refreshStyleSheet: () => {},
  disable: () => {},
  enable: () => {},
  redrawTheme: () => {},
  updateTheme: () => {},
});

let customColor = Settings.get('themeColor');
let themeType = Settings.get('themeType', 'FULL');
let styles = '';

const hackedGPMTheme = new GMusicTheme();

const customStyle = document.createElement('style');
document.body.appendChild(customStyle);

const redrawCustomStyles = () => {
  hackedGPMTheme.updateTheme({
    type: themeType,
    backHighlight: '#1a1b1d',
    foreSecondary: customColor,
  });
  customStyle.innerHTML = hackedGPMTheme.substituteColors(styles);
};

Emitter.on('theme:updateColor', (event, newCustomColor) => {
  customColor = newCustomColor;
  redrawCustomStyles();
});

Emitter.on('theme:updateType', (event, newThemeType) => {
  themeType = newThemeType;
  redrawCustomStyles();
});

Emitter.on('LoadMainAppCustomStyles', (event, newStyles) => {
  styles = newStyles;
  redrawCustomStyles();
});

redrawCustomStyles();
Emitter.fire('FetchMainAppCustomStyles');
