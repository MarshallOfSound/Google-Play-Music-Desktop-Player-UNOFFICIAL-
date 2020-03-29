import React, { Component } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import ToggleableOption from '../ToggleableOption';

export default class MicroTab extends Component {
  render() {
    return (
      <SettingsTabWrapper>
        <ToggleableOption label={TranslationProvider.query('settings-option-micro-buttons-rating')} settingsKey={"microButtonsRating"} default />
        <ToggleableOption label={TranslationProvider.query('settings-option-micro-buttons-previous')} settingsKey={"microButtonsPrevious"} default />
        <ToggleableOption label={TranslationProvider.query('settings-option-micro-buttons-play-pause')} settingsKey={"microButtonsPlayPause"} default />
        <ToggleableOption label={TranslationProvider.query('settings-option-micro-buttons-next')} settingsKey={"microButtonsNext"} default />
        <ToggleableOption label={TranslationProvider.query('settings-option-micro-buttons-show-main-window')} settingsKey={"microButtonsShowMainWindow"} default />
      </SettingsTabWrapper>
    );
  }
}
