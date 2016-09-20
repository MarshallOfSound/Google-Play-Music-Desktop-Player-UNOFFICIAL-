import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import SettingsProvider from '../generic/SettingsProvider';

class SettingsString extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  onChange = (event) => {
    clearTimeout(this.save);
    const newValue = event.target.value;
    this.save = setTimeout(() => {
      this.props.setSetting(this.props.settingsKey, newValue);
    }, 500);
  }

  render() {
    return (
      <TextField
        floatingLabelText={this.props.label}
        defaultValue={this.props[this.props.settingsKey]}
        onChange={this.onChange}
        style={{
          marginTop: 4,
        }}
      />
    );
  }
}


export default class StringOption extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
  };

  render() {
    const inputProps = {
      label: this.props.label,
      settingsKey: this.props.settingsKey,
    };

    return (
      <SettingsProvider component={SettingsString} componentProps={inputProps} keys={[this.props.settingsKey]} defaults={{}} />
    );
  }
}
