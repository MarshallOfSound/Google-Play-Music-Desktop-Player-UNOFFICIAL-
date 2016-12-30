import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

import SettingsProvider from '../generic/SettingsProvider';

class SettingsCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hintLabel: PropTypes.string,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  onChange = (event, isChecked) => {
    this.props.setSetting(this.props.settingsKey, isChecked);
  }

  render() {
    return (
      <Checkbox
        label={[this.props.label, this.props.hintLabel
          ? <span id="checkbox-hint" style={{ display: 'block', fontSize: '0.75em', color: 'gray' }}>{this.props.hintLabel}</span> : null]}
        checked={this.props[this.props.settingsKey]}
        onCheck={this.onChange}
        style={{
          marginTop: 4,
        }}
        labelStyle={{
          fontSize: 16,
        }}
      />
    );
  }
}


export default class ToggleableOption extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hintLabel: PropTypes.string,
    settingsKey: PropTypes.string.isRequired,
  };

  render() {
    const checkboxProps = {
      label: this.props.label,
      hintLabel: this.props.hintLabel,
      settingsKey: this.props.settingsKey,
    };

    return (
      <SettingsProvider component={SettingsCheckbox} componentProps={checkboxProps} keys={[this.props.settingsKey]} defaults={{}} />
    );
  }
}
