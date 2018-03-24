import { MediaPlaybackStatus, MediaPlaybackType, SystemMediaTransportControlsButton } from '@nodert-win10/windows.media';
import { BackgroundMediaPlayer } from '@nodert-win10/windows.media.playback';
import { RandomAccessStreamReference } from '@nodert-win10/windows.storage.streams';
import { Uri } from '@nodert-win10/windows.foundation';

const Controls = BackgroundMediaPlayer.current.systemMediaTransportControls;

Controls.isChannelDownEnabled = false;
Controls.isChannelUpEnabled = false;
Controls.isFastForwardEnabled = false;
Controls.isNextEnabled = true;
Controls.isPauseEnabled = true;
Controls.isPlayEnabled = true;
Controls.isPreviousEnabled = true;
Controls.isRecordEnabled = false;
Controls.isRewindEnabled = false;
Controls.isStopEnabled = true;
if (!Settings.get('enableWin10MediaServiceTrackInfo')) {
  Controls.isEnabled = false;
}
Controls.playbackStatus = MediaPlaybackStatus.closed;
Controls.displayUpdater.type = MediaPlaybackType.music;

Controls.displayUpdater.musicProperties.title = 'Google Play Music Desktop Player';
Controls.displayUpdater.musicProperties.artist = TranslationProvider.query('playback-os-no-track-playing');
Controls.displayUpdater.update();

Controls.on('buttonpressed', (sender, eventArgs) => {
  switch (eventArgs.button) {
    case SystemMediaTransportControlsButton.play:
      if (!GPM.playback.isPlaying()) GPM.playback.playPause();
      break;
    case SystemMediaTransportControlsButton.pause:
      if (GPM.playback.isPlaying()) GPM.playback.playPause();
      break;
    case SystemMediaTransportControlsButton.stop:
      if (GPM.playback.isPlaying()) GPM.playback.playPause();
      break;
    case SystemMediaTransportControlsButton.next:
      Emitter.fireAtGoogle('playback:nextTrack');
      // GPM.playback.forward();
      break;
    case SystemMediaTransportControlsButton.previous:
      Emitter.fireAtGoogle('playback:previousTrack');
      // GPM.playback.rewind();
      break;
    default:
      break;
  }
});

window.wait(() => {
  GPM.on('change:playback', (mode) => {
    if (mode === 0) {
      Controls.playbackStatus = MediaPlaybackStatus.stopped;
    } else if (mode === 1) {
      Controls.playbackStatus = MediaPlaybackStatus.paused;
    } else {
      Controls.playbackStatus = MediaPlaybackStatus.playing;
    }
  });

  GPM.on('change:track', (track) => {
    Controls.displayUpdater.musicProperties.title = track.title;
    Controls.displayUpdater.musicProperties.artist = track.artist;
    Controls.displayUpdater.musicProperties.albumTitle = track.album;
    Controls.displayUpdater.thumbnail = RandomAccessStreamReference.createFromUri(new Uri(track.albumArt.replace('=s90-c-e100', '')));

    Controls.displayUpdater.update();
  });
});
