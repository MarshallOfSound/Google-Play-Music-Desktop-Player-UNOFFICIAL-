import React, { Component, PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Checkbox from 'material-ui/Checkbox';

import SettingsProvider from '../generic/SettingsProvider';

class SettingsCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hintLabel: PropTypes.string,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
    dependsOnSettingsKey: PropTypes.string,
  };

  onChange = (event, isChecked) => {
    this.props.setSetting(this.props.settingsKey, isChecked);
  }

  render() {
    const label = (
      <span>
        {this.props.label}
        {this.props.hintLabel
          ? <span className="settings-toggle-hint-label" style={{ color: this.props.muiTheme.palette.disabledColor }}>{this.props.hintLabel}</span>
          : null}
      </span>
    );
    const { dependsOnSettingsKey } = this.props;
    if (dependsOnSettingsKey && !this.props[dependsOnSettingsKey]) {
      return null;
    }

    return (
      <Checkbox
        label={label}
        checked={!!this.props[this.props.settingsKey]}
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

const ThemedSettingsCheckbox = muiThemeable()(SettingsCheckbox);

export default class ToggleableOption extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hintLabel: PropTypes.string,
    settingsKey: PropTypes.string.isRequired,
    dependsOnSettingsKey: PropTypes.string,
  };

  render() {
    const checkboxProps = {
      label: this.props.label,
      hintLabel: this.props.hintLabel,
      settingsKey: this.props.settingsKey,
      dependsOnSettingsKey: this.props.dependsOnSettingsKey,
    };
    const keys = [this.props.settingsKey];
    if (this.props.dependsOnSettingsKey) {
      keys.push(this.props.dependsOnSettingsKey);
    }
    return (
      <SettingsProvider component={ThemedSettingsCheckbox} componentProps={checkboxProps} keys={keys} defaults={{}} />
    );
  }
}
