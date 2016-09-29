import * as React from 'react';
import { requireSettings } from '../../generic/SettingsProvider';

import PlatformSpecific from '../../generic/PlatformSpecific';
import SettingsTabWrapper from './SettingsTabWrapper';
import ThemeOptions from '../ThemeOptions';
import ToggleableOption from '../ToggleableOption';

const { PropTypes } = React;

class GeneralTab extends React.Component<GPMDP.UI.ThemedComponentProps, {}> {
  static propTypes = {
    theme: PropTypes.bool.isRequired,
  };

  render() {
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
        <ToggleableOption label={TranslationProvider.query('settings-option-enable-system-borders')} settingsKey={"nativeFrame"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-save-page')} settingsKey={"savePage"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-scroll-lyrics')} settingsKey={"scrollLyrics"} />
        <PlatformSpecific platform="win32">
          <ToggleableOption label={TranslationProvider.query('settings-option-enable-taskbar-progress')} settingsKey={"enableTaskbarProgress"} />
        </PlatformSpecific>
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(GeneralTab, ['theme'], {});
