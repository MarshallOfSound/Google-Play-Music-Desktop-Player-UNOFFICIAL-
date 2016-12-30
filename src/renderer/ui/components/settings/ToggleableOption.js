import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

import SettingsProvider from '../generic/SettingsProvider';

class SettingsCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hintLabel: PropTypes.string,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  onChange = (event, isChecked) => {
    this.props.setSetting(this.props.settingsKey, isChecked);
  }

  render() {
    const label = (
      <span>
        {this.props.label}
        {this.props.hintLabel
          ? <span className="settings-toggle-hint-label" style={{ color: this.context.muiTheme.palette.disabledColor }}>{this.props.hintLabel}</span>
          : null}
      </span>
    );

    return (
      <Checkbox
        label={label}
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
