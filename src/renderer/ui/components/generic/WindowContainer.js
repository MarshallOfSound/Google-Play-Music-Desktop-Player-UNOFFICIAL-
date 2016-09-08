import { remote } from 'electron';
import React, { Component, PropTypes } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PlatformSpecific from './PlatformSpecific';
import { requireSettings } from './SettingsProvider';
import generateTheme from '../../utils/theme';

class WindowContainer extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    confirmClose: PropTypes.func,
    isMainWindow: PropTypes.bool,
    title: PropTypes.string.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      nativeFrame: Settings.get('nativeFrame'),
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

  minWindow = () => {
    Emitter.fire('window:minimize', remote.getCurrentWindow().id);
  }

  maxWindow = () => {
    Emitter.fire('window:maximize', remote.getCurrentWindow().id);
  }

  closeWindow = () => {
    if (this.props.isMainWindow && this.props.confirmClose && Settings.get('warnMinToTray', true) && Settings.get('minToTray', true)) {
      this.props.confirmClose();
    } else {
      Emitter.fire('window:close', remote.getCurrentWindow().id);
    }
  }

  render() {
    const muiTheme = generateTheme(this.state.theme, this.state.themeColor, this.state.themeType);

    const fadedBackground = {};
    if (this.state.theme && this.state.themeType === 'FULL') {
      fadedBackground.backgroundColor = '#121212';
      fadedBackground.color = '#FAFAFA';
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <section className="window-border" style={{ borderColor: muiTheme.tabs.backgroundColor }}>
          <PlatformSpecific platform="darwin">
            <header className="darwin-title-bar" style={{ backgroundColor: muiTheme.tabs.backgroundColor }}>
              <div className="title">{this.props.title}</div>
            </header>
          </PlatformSpecific>
          <header className="title-bar" style={{ backgroundColor: muiTheme.tabs.backgroundColor }}>
            <div className="drag-handle"></div>
            <div className="controls">
              {
                ['min', 'max', 'close'].map((action) => (
                  <div key={action} className="control" onClick={this[`${action}Window`]}>
                    <img src={`../assets/img/control_bar/${action}.png`} alt={action} />
                  </div>
                ))
              }
            </div>
          </header>
          {
            this.props.isMainWindow ?
            (
              <main className="embedded-player-container" style={fadedBackground}>
                {
                  this.props.children
                }
              </main>
            ) :
            (
              <main className="dialog">
                <div className="window-title" style={{ backgroundColor: muiTheme.tabs.backgroundColor }}>
                  {this.props.title}
                </div>
                <div className="window-main" style={fadedBackground}>
                  {
                    this.props.children
                  }
                </div>
              </main>
            )
          }
        </section>
      </MuiThemeProvider>
    );
  }
}

export default requireSettings(WindowContainer, ['theme', 'themeColor', 'themeType']);
