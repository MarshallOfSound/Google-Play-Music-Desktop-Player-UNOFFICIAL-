import React, { Component } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import AudioDeviceSelector from '../AudioDeviceSelector';

export default class AudioTab extends Component {
  render() {
    return (
      <SettingsTabWrapper>
        <AudioDeviceSelector />
      </SettingsTabWrapper>
    );
  }
}
