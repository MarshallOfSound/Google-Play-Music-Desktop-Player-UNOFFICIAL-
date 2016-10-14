import React, { Component } from 'react';

import ColorPicker from '../components/settings/ColorPicker';
import WindowContainer from '../components/generic/WindowContainer';

export default class ColorWheelPage extends Component {
  render() {
    return (
      <WindowContainer title={TranslationProvider.query('title-color-picker')}>
        <ColorPicker />
      </WindowContainer>
    );
  }
}
