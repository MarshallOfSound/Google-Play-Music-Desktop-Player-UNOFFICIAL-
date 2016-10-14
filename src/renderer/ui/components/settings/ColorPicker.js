import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';

import { requireSettings } from '../generic/SettingsProvider';

class ColorPicker extends Component {
  static propTypes = {
    themeColor: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  changeThemeColor = (newColor) => {
    this.props.setSetting('themeColor', newColor.hex);
  }

  render() {
    return (
      <ChromePicker
        color={this.props.themeColor}
        disableAlpha
        onChangeComplete={this.changeThemeColor}
      />
    );
  }
}

export default requireSettings(ColorPicker, ['themeColor'], {});
