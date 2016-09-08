import { darkBlack, white } from 'material-ui/styles/colors';
import { darken } from 'material-ui/utils/colorManipulator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default (themeEnabled, themeColor, themeType) => {
  const themePalette = {};

  let primaryColor = '#FF5722';
  let textColor = darkBlack;
  let alternateTextColor = white;

  if (themeEnabled) {
    primaryColor = themeColor;
    if (themeType === 'FULL') {
      textColor = white;
      alternateTextColor = darkBlack;
    } else {
      primaryColor = themeColor;
    }
  }
  themePalette.primary1Color = primaryColor;
  themePalette.primary2Color = darken(primaryColor, 0.2);
  themePalette.textColor = textColor;
  themePalette.alternateTextColor = alternateTextColor;

  const muiTheme = getMuiTheme({ palette: themePalette });

  if (themeEnabled && themeType === 'FULL') {
    muiTheme.tabs.backgroundColor = '#121212';
    muiTheme.tabs.textColor = white;
    muiTheme.tabs.selectedTextColor = themeColor;
    muiTheme.inkBar.backgroundColor = themeColor;
  } else {
    muiTheme.inkBar.backgroundColor = white;
  }

  return muiTheme;
};
