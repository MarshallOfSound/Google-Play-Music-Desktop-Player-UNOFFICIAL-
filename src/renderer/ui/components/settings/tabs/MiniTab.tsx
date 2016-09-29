import * as React from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import ToggleableOption from '../ToggleableOption';

export default class MiniTab extends React.Component<{}, {}> {
  render() {
    return (
      <SettingsTabWrapper>
        <ToggleableOption label={TranslationProvider.query('settings-option-mini-ontop')} settingsKey={"miniAlwaysOnTop"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-mini-always-show')} settingsKey={"miniAlwaysShowSongInfo"} />
        <ToggleableOption label={TranslationProvider.query('settings-option-mini-use-scroll-volume')} settingsKey={"miniUseScrollVolume"} />
      </SettingsTabWrapper>
    );
  }
}
