import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';

import SettingsProvider from '../generic/SettingsProvider';

const { PropTypes } = React

class SettingsCheckbox extends React.Component<{
  label: string
  settingsKey: string
  setSetting: Function
}, {}> {
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


export default class ToggleableOption extends React.Component<{
  label: string
  settingsKey: string
}, {}> {
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
