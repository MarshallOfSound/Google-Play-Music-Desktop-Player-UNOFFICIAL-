import React, { Component } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import AudioDeviceSelector from '../AudioDeviceSelector';
import ToggleableOption from '../ToggleableOption';

export default class PlaybackTab extends Component {
  render() {
    return (
      <SettingsTabWrapper>
        <AudioDeviceSelector />
        <ToggleableOption label={TranslationProvider.query('settings-option-skip-bad-songs')} settingsKey={"skipBadSongs"} />
      </SettingsTabWrapper>
    );
  }
}
