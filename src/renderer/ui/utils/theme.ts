import { darkBlack, white } from 'material-ui/styles/colors';
import { darken, emphasize } from 'material-ui/utils/colorManipulator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default (themeEnabled, themeColor, themeType) => {
  const themePalette: any = {};

  let primaryColor = '#FF5722';
  let textColor = darkBlack;
  let alternateTextColor = white;

  if (themeEnabled) {
    primaryColor = themeColor;
    if (themeType === 'FULL') {
      textColor = white;
      alternateTextColor = darkBlack;
      themePalette.canvasColor = '#222326';
    } else {
      primaryColor = themeColor;
    }
  }
  themePalette.primary1Color = primaryColor;
  themePalette.primary2Color = darken(primaryColor, 0.2);
  themePalette.textColor = textColor;
  themePalette.alternateTextColor = alternateTextColor;
  themePalette.disabledColor = emphasize(textColor, 0.5);

  const muiTheme = getMuiTheme({ palette: themePalette });

  (<any>muiTheme).dialog.backgroundColor = white;
  if (themeEnabled && themeType === 'FULL') {
    muiTheme.tabs.backgroundColor = '#222326';
    muiTheme.tabs.textColor = white;
    muiTheme.tabs.selectedTextColor = themeColor;
    muiTheme.inkBar.backgroundColor = themeColor;
    (<any>muiTheme).dialog.backgroundColor = '#121212';
  } else {
    muiTheme.inkBar.backgroundColor = white;
  }
  (<any>muiTheme)._themeColor = themeColor;

  return muiTheme;
};
