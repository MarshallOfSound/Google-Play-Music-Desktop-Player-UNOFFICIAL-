import React, { Component, PropTypes } from 'react';

export default class OfflineWarning extends Component {
  static propTypes = {
    navigator: PropTypes.object,
  };

  static defaultProps = {
    navigator: window.navigator,
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      online: props.navigator.onLine,
    };
  }

  componentDidMount() {
    window.addEventListener('online', this._handleOnlineChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this._handleOnlineChange);
  }

  _handleOnlineChange = () => {
    this.setState({
      online: this.props.navigator.onLine,
    });
  }

  render() {
    if (this.state.online) return null;
    return (
      <div className="offline-warning">
        <i className="material-icons left">portable_wifi_off</i>
        <h1>We can't connect to Google Play Music.  Please check your internet connection.</h1>
      </div>
    );
  }
}
