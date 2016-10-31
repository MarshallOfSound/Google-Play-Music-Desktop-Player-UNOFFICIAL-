import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

import SettingsTabWrapper from './SettingsTabWrapper';
import { requireSettings } from '../../generic/SettingsProvider';

class LastFMTab extends Component {
  static propTypes = {
    lastFMKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      authState: !!props.lastFMKey ? 2 : 0,
    };
    // authStates
    // 0: Not Authorized
    // 1: Authorizing
    // 2: Authorized
  }

  componentDidMount() {
    Emitter.on('lastfm:authcomplete', (event, success) => {
      if (!success.result) {
        this.setState({
          authState: 0,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const authState = !!nextProps.lastFMKey ? 2 : 0;
    if (this.state.authState !== authState) {
      this.setState({
        authState,
      });
    }
  }

  handleClick = () => {
    switch (this.state.authState) {
      case 1: {
        break;
      }
      case 2: {
        Emitter.fire('settings:set', {
          key: 'lastFMKey',
          value: false,
        });
        break;
      }
      case 0:
      default: {
        this.setState({
          authState: 1,
        });
        Emitter.fire('lastfm:auth');
        break;
      }
    }
  }

  render() {
    const buttonProps = {
      primary: true,
    };
    let authStatus = TranslationProvider.query('lastfm-login-not-authorized');
    if (this.state.authState === 2) {
      buttonProps.label = TranslationProvider.query('lastfm-logout-button-text');
      authStatus = TranslationProvider.query('lastfm-login-authorized');
    } else if (this.state.authState === 0) {
      buttonProps.label = TranslationProvider.query('lastfm-login-button-text');
    } else {
      buttonProps.label = '...';
      buttonProps.disabled = true;
      authStatus = TranslationProvider.query('lastfm-login-authorizing');
    }
    return (
      <SettingsTabWrapper>
        <h5>Last.FM Status: {authStatus}</h5>
        <FlatButton
          label={TranslationProvider.query('button-text-lets-go')}
          {...buttonProps}
          onTouchTap={this.handleClick}
        />
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(LastFMTab, ['lastFMKey'], { lastFMKey: false });
