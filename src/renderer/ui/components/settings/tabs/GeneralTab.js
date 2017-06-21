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
    return (
      <SettingsTabWrapper>
        <ToggleableOption label={TranslationProvider.query('settings-option-min-to-tray')} settingsKey={"minToTray"} />
        <PlatformSpecific platform="linux">
          <ToggleableOption label={TranslationProvider.query('settings-option-invert-tray-icon')} settingsKey={"appIconInvert"} />
        </PlatformSpecific>
        <ToggleableOption label={TranslationProvider.query('settings-option-auto-launch')} settingsKey={"auto-launch"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-prevent-display-sleep')} settingsKey={"preventDisplaySleep"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-keep-sidebar-open')} settingsKey={"keepSidebarOpen"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-static-album-art')} settingsKey={"staticAlbumArt"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-custom-theme')} settingsKey={"theme"} />
        {
          this.props.theme ? <ThemeOptions /> : null
        }
        <ToggleableOption
          label={TranslationProvider.query('settings-option-enable-voice')}
          hintLabel={TranslationProvider.query('settings-option-enable-voice-details')}
          settingsKey={"speechRecognition"}
        />
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-api-json')} settingsKey={"enableJSON_API"} />
        <ToggleableOption
          label={TranslationProvider.query('settings-option-enable-api')}
          hintLabel={TranslationProvider.query('settings-option-enable-api-details')}
          settingsKey={"playbackAPI"}
        />
        <ToggleableOption
          label={TranslationProvider.query('settings-option-enable-system-borders')}
          hintLabel={TranslationProvider.query('settings-requires-restart')}
          settingsKey={"nativeFrame"}
        />
        <ToggleableOption label={TranslationProvider.query('settings-option-save-page')} settingsKey={"savePage"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-scroll-lyrics')} settingsKey={"scrollLyrics"} />
        <PlatformSpecific platform="win32">
          <ToggleableOption label={TranslationProvider.query('settings-option-enable-taskbar-progress')} settingsKey={"enableTaskbarProgress"} />
        </PlatformSpecific>
        <PlatformSpecific platform="win32" versionRange=">=10">
          <ToggleableOption
            label={TranslationProvider.query('settings-option-enable-win10-media-service')}
            hintLabel={
              `${TranslationProvider.query('settings-option-enable-win10-media-service-details')}. ${TranslationProvider.query('settings-requires-restart')}`
            }
            settingsKey={"enableWin10MediaService"}
          />
        </PlatformSpecific>
        <PlatformSpecific platform="win32" versionRange=">=10">
          <ToggleableOption
            label={TranslationProvider.query('settings-option-enable-win10-media-service-track-info')}
            hintLabel={TranslationProvider.query('settings-requires-restart')}
            settingsKey={"enableWin10MediaServiceTrackInfo"}
            dependsOnSettingsKey={"enableWin10MediaService"}
          />
        </PlatformSpecific>

        <LocaleSelector />
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(GeneralTab, ['theme'], {});
