import { remote } from 'electron';

let mode;
window.wait(() => {
  mode = window.GMusic.Playback.STOPPED;
  window.GPM.on('change:playback', (newMode) => {
    mode = newMode;
  });
});

Emitter.on('playback:previousTrack', () => {
  window.GPM.playback.rewind();
});

Emitter.on('playback:playPause', () => {
  window.GPM.playback.playPause();
});

Emitter.on('playback:nextTrack', () => {
  window.GPM.playback.forward();
});

Emitter.on('playback:stop', () => {
  if (mode === window.GMusic.Playback.PLAYING) {
    window.GPM.playback.playPause();
  }
});

Emitter.on('playback:thumbsUp', () => {
  if (!remote.getGlobal('PlaybackAPI').data.song.title) return;
  new Notification('You just liked', { // eslint-disable-line
    body: remote.getGlobal('PlaybackAPI').data.song.title,
    icon: remote.getGlobal('PlaybackAPI').data.song.albumArt,
  });
  window.GPM.rating.setRating(5);
});

Emitter.on('playback:thumbsDown', () => {
  if (!remote.getGlobal('PlaybackAPI').data.song.title) return;
  new Notification('You just dis-liked', { // eslint-disable-line
    body: remote.getGlobal('PlaybackAPI').data.song.title,
    icon: remote.getGlobal('PlaybackAPI').data.song.albumArt,
  });
  window.GPM.rating.setRating(1);
});

Emitter.on('playback:increaseVolume', () => {
  window.GPM.volume.increaseVolume();
});

Emitter.on('playback:decreaseVolume', () => {
  window.GPM.volume.decreaseVolume();
});
