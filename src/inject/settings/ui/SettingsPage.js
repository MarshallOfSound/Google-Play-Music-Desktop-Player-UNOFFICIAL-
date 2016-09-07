import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { darkBlack, white } from 'material-ui/styles/colors';
import { Tabs, Tab } from 'material-ui/Tabs';
import { darken } from 'material-ui/utils/colorManipulator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import GeneralTab from './components/tabs/GeneralTab';
import MiniTab from './components/tabs/MiniTab';

const styles = {
  tab: {
    overflow: 'auto',
    flex: 1,
  },
  tabContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
};

export default class SettingsPage extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      theme: Settings.get('theme'),
      themeColor: Settings.get('themeColor'),
      themeType: Settings.get('themeType', 'FULL'),
    };
  }

  componentDidMount() {
    Emitter.on('settings:change:theme', this._themeUpdate);
    Emitter.on('settings:change:themeColor', this._themeColorUpdate);
    Emitter.on('settings:change:themeType', this._themeTypeUpdate);
  }

  componentWillUnmount() {
    Emitter.off('settings:change:theme', this._themeUpdate);
    Emitter.off('settings:change:themeColor', this._themeColorUpdate);
    Emitter.off('settings:change:themeType', this._themeTypeUpdate);
  }

  _themeUpdate = (event, theme) => {
    this.setState({ theme });
  }

  _themeColorUpdate = (event, themeColor) => {
    this.setState({ themeColor });
  }

  _themeTypeUpdate = (event, themeType) => {
    this.setState({ themeType });
  }

  render() {
    const themePalette = {};
    let primaryColor = '#FF5722';
    let textColor = darkBlack;
    let alternateTextColor = white;
    if (this.state.theme) {
      primaryColor = this.state.themeColor;
      if (this.state.themeType === 'FULL') {
        // primaryColor = '#121212';
        textColor = white;
        alternateTextColor = darkBlack;
      } else {
        primaryColor = this.state.themeColor;
      }
    }
    themePalette.primary1Color = primaryColor;
    themePalette.primary2Color = darken(primaryColor, 0.2);
    themePalette.textColor = textColor;
    themePalette.alternateTextColor = alternateTextColor;

    const muiTheme = getMuiTheme({ palette: themePalette });
    if (this.state.theme && this.state.themeType === 'FULL') {
      muiTheme.tabs.backgroundColor = '#121212';
      muiTheme.tabs.textColor = white;
      muiTheme.tabs.selectedTextColor = this.state.themeColor;
      muiTheme.inkBar.backgroundColor = this.state.themeColor;
    } else {
      muiTheme.inkBar.backgroundColor = white;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Tabs style={styles.tabContainer} contentContainerStyle={styles.tab}>
          <Tab label={TranslationProvider.query('title-settings-general')}>
            <GeneralTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-mini')}>
            <MiniTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-lastfm')} />
          <Tab label={TranslationProvider.query('title-settings-hotkeys')} />
          <Tab label={TranslationProvider.query('title-settings-audio')} />
          <Tab label={TranslationProvider.query('title-settings-style')} />
        </Tabs>
      </MuiThemeProvider>
    );
  }
}
