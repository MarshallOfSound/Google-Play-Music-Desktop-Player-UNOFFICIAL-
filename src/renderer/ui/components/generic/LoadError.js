import { remote } from 'electron';
import { RaisedButton } from 'material-ui';
import React, { Component, PropTypes } from 'react';

import { requireSettings } from './SettingsProvider';

const RELOAD_INTERVAL = 15;

function reload() {
  remote.getCurrentWindow().reload();
}

class LoadError extends Component {
  static propTypes = {
    reason: PropTypes.string,
    service: PropTypes.string.isRequired,
  };

  static defaultProps = {
    reason: null,
  }

  constructor(...args) {
    super(...args);
    this.state = { countdown: RELOAD_INTERVAL };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.reason !== newProps.reason) {
      // The `reason` property will change. If it now has a value,
      // then start a timer to countdown the automatic reload.
      // If it no longer has a value, then we can stop the timer.
      if (newProps.reason) {
        this.setState({ countdown: RELOAD_INTERVAL });
        this.timer = setInterval(() => this._tick(), 1000);
      } else {
        clearInterval(this.timer);
      }
    }
  }

  _tick() {
    // If the countdown will end, then reload automatically.
    if (this.state.countdown === 1) {
      reload();
    } else {
      this.setState(prev => ({ countdown: prev.countdown - 1 }));
    }
  }

  render() {
    if (!this.props.reason) return null;

    return (
      <div className="load-failed" >
        <div>
          <div className="title">
            {this.props.service === 'youtube-music' ? TranslationProvider.query('player-load-failed-ytm') : TranslationProvider.query('player-load-failed-gpm')}
          </div>

          <div className="reason">
            {this.props.reason}
          </div>

          <RaisedButton
            label={TranslationProvider.query('player-load-failed-retry')}
            primary
            onClick={reload}
          />

          <div className="countdown">
            {TranslationProvider.query('player-load-failed-countdown').replace('$1', this.state.countdown)}
          </div>
        </div>
      </div>
    );
  }
}

export default requireSettings(LoadError, ['service'], {});
