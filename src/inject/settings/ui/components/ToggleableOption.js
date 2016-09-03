import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

import SettingsProvider from './SettingsProvider';

class SettingsCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  onChange = (event, isChecked) => {
    this.props.setSetting(this.props.settingsKey, isChecked);
  }

  render() {
    return (
      <Checkbox
        label={this.props.label}
        checked={this.props[this.props.settingsKey]}
        onCheck={this.onChange}
      />
    );
  }
}


export default class ToggleableOption extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
  };

  render() {
    const checkboxProps = {
      label: this.props.label,
      settingsKey: this.props.settingsKey,
    };

    return (
      <SettingsProvider component={SettingsCheckbox} componentProps={checkboxProps} keys={[this.props.settingsKey]} defaults={{}} />
    );
  }
}
