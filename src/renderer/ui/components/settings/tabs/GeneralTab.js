import React, { Component, PropTypes } from 'react';
import { requireSettings } from '../../generic/SettingsProvider';

import LocaleSelector from '../LocaleSelector';
import PlatformSpecific from '../../generic/PlatformSpecific';
import SettingsTabWrapper from './SettingsTabWrapper';
import ThemeOptions from '../ThemeOptions';
import ToggleableOption from '../ToggleableOption';

class GeneralTab extends Component {
  static propTypes = {
    theme: PropTypes.bool.isRequired,
  };

  render() {
    const _t = TranslationProvider;
    return (
      <SettingsTabWrapper>
        <ToggleableOption label={TranslationProvider.query('settings-option-min-to-tray')} settingsKey={"minToTray"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-auto-launch')} settingsKey={"auto-launch"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-custom-theme')} settingsKey={"theme"} />
        {
          this.props.theme ? <ThemeOptions /> : null
        }
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-voice-details')} settingsKey={"speechRecognition"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-api-json')} settingsKey={"enableJSON_API"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-api-details')} settingsKey={"playbackAPI"} />
        <ToggleableOption
          label={`${_t.query('settings-option-enable-system-borders')} (${_t.query('settings-option-enable-system-borders-details')})`}
          settingsKey={"nativeFrame"}
        />
        <ToggleableOption label={TranslationProvider.query('settings-option-save-page')} settingsKey={"savePage"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-scroll-lyrics')} settingsKey={"scrollLyrics"} />
        <PlatformSpecific platform="win32">
          <ToggleableOption label={TranslationProvider.query('settings-option-enable-taskbar-progress')} settingsKey={"enableTaskbarProgress"} />
        </PlatformSpecific>
        <LocaleSelector />
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(GeneralTab, ['theme'], {});
