import * as React from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';

import HotkeyInput from '../HotkeyInput';

export default class HotkeyTab extends React.Component<{}, {}> {
  render() {
    return (
      <SettingsTabWrapper>
        <HotkeyInput label={TranslationProvider.query('playback-label-play-pause')} hotkeyAction="playPause" />
        <HotkeyInput label={TranslationProvider.query('playback-label-stop')} hotkeyAction="stop" />
        <HotkeyInput label={TranslationProvider.query('playback-label-previous-track')} hotkeyAction="previousTrack" />
        <HotkeyInput label={TranslationProvider.query('playback-label-next-track')} hotkeyAction="nextTrack" />
        <HotkeyInput label={TranslationProvider.query('playback-label-thumbs-up')} hotkeyAction="thumbsUp" />
        <HotkeyInput label={TranslationProvider.query('playback-label-thumbs-down')} hotkeyAction="thumbsDown" />
        <HotkeyInput label={TranslationProvider.query('playback-label-volume-down')} hotkeyAction="decreaseVolume" />
        <HotkeyInput label={TranslationProvider.query('playback-label-volume-up')} hotkeyAction="increaseVolume" />
      </SettingsTabWrapper>
    );
  }
}
