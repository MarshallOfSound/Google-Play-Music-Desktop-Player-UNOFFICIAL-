import React, { Component, PropTypes } from 'react';
import { requireSettings } from './SettingsProvider';

import PlatformSpecific from './PlatformSpecific';
import SettingsTab from './SettingsTab';
import ToggleableOption from './ToggleableOption';

class GeneralTab extends Component {
  static propTypes = {
    theme: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <SettingsTab>
        <ToggleableOption label={TranslationProvider.query('settings-option-min-to-tray')} settingsKey={"minToTray"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-auto-launch')} settingsKey={"auto-launch"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-custom-theme')} settingsKey={"theme"} />
        {
          this.props.theme ? null : null
        }
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-voice-details')} settingsKey={"speechRecognition"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-api-json')} settingsKey={"enableJSON_API"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-api-details')} settingsKey={"playbackAPI"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-system-borders-details')} settingsKey={"nativeFrame"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-save-page')} settingsKey={"savePage"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-scroll-lyrics')} settingsKey={"scrollLyricss"} />
        <PlatformSpecific platform="win32">
          <ToggleableOption label={TranslationProvider.query('settings-option-enable-taskbar-progress')} settingsKey={"enableTaskbarProgress"} />
        </PlatformSpecific>
      </SettingsTab>
    );
  }
}

export default requireSettings(GeneralTab, ['theme'], {});
