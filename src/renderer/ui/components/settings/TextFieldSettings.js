import React, { Component, PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import TextField from 'material-ui/TextField';

import SettingsProvider from '../generic/SettingsProvider';

class TField extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
    dependsOnSettingsKey: PropTypes.string,
    placeholder: PropTypes.string,
  };

  onChange = (event, value) => {
    this.props.setSetting(this.props.settingsKey, value);
  }

  render() {
    const { dependsOnSettingsKey } = this.props;
    if (dependsOnSettingsKey && !this.props[dependsOnSettingsKey]) {
      return null;
    }

    return (
      <TextField
        id={`test-field-for-${this.props.settingsKey}`}
        label={this.props.label}
        value={Settings.get(this.props.settingsKey, '')}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
      />
    );
  }
}

const ThemedTField = muiThemeable()(TField);

export default class TextFieldSettings extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    dependsOnSettingsKey: PropTypes.string,
    placeholder: PropTypes.string,
  };

  render() {
    const textFieldProps = {
      label: this.props.label,
      settingsKey: this.props.settingsKey,
      dependsOnSettingsKey: this.props.dependsOnSettingsKey,
      placeholder: this.props.placeholder,
    };
    const keys = [this.props.settingsKey];
    if (this.props.dependsOnSettingsKey) {
      keys.push(this.props.dependsOnSettingsKey);
    }
    return (
      <SettingsProvider component={ThemedTField} componentProps={textFieldProps} keys={keys} defaults={{}} />
    );
  }
}
