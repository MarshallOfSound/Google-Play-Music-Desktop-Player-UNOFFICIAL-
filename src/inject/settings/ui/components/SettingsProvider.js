import React, { Component, PropTypes } from 'react';

export default class SettingsProvider extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object,
    defaults: PropTypes.object.isRequired,
    keys: PropTypes.array.isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);

    const initialState = {};
    props.keys.forEach((settingsKey) => {
      if (typeof props.defaults[settingsKey] !== 'undefined') {
        initialState[settingsKey] = Settings.get(settingsKey, props.defaults[settingsKey]);
      } else {
        initialState[settingsKey] = Settings.get(settingsKey);
      }
    });
    this.state = initialState;
  }

  componentDidMount() {
    this.props.keys.forEach((settingsKey) => {
      Emitter.on(`settings:change:${settingsKey}`, this.handleKeyChange);
    });
  }

  componentWillUnmount() {
    this.props.keys.forEach((settingsKey) => {
      Emitter.off(`settings:change:${settingsKey}`, this.handleKeyChange);
    });
  }

  setSetting(key, value) {
    Emitter.fire('settings:set', {
      key,
      value,
    });
  }

  handleKeyChange = (event, keyValue, keyName) => {
    this.setState({
      [keyName]: keyValue,
    });
  }

  render() {
    const componentProps = this.props.componentProps || {};
    return (
      <this.props.component {...componentProps} {...this.state} setSetting={this.setSetting} />
    );
  }
}

export const requireSettings = (component, settingsArray, settingsDefaults = {}) =>
  class WrappedSettingsProvider extends Component {
    render() {
      return (
        <SettingsProvider component={component} keys={settingsArray} defaults={settingsDefaults} />
      );
    }
  };
