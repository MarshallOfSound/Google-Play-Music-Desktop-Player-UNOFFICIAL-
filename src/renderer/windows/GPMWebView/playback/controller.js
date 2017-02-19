import { remote } from 'electron';

let mode;
window.wait(() => {
  mode = window.GMusic.PlaybackStatus.STOPPED;
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

Emitter.on('playback:play:smooth', () => {
  const originalVolume = window.GPM.volume.getVolume();
  window.GPM.volume.setVolume(0);
  if (!window.GPM.playback.isPlaying()) {
    window.GPM.playback.playPause();
  }
  let i = 0;
  const FADE_SPEED = 500;
  const fadeIn = setInterval(() => {
    window.GPM.volume.setVolume(i * (originalVolume / FADE_SPEED));
    i++;
    if (i >= FADE_SPEED) {
      clearInterval(fadeIn);
    }
  }, 20);
});

Emitter.on('playback:nextTrack', () => {
  window.GPM.playback.forward();
});

Emitter.on('playback:stop', () => {
  if (mode === window.GMusic.PlaybackStatus.PLAYING) {
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
  new Notification('You just disliked', { // eslint-disable-line
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

Emitter.on('playback:miniEnable', () => {
  window.GPM.mini.enable();
});

Emitter.on('playback:miniDisable', () => {
  window.GPM.mini.disable();
});

Emitter.on('playback:infoTrack', () => {
  if (!remote.getGlobal('PlaybackAPI').data.song.title) return;
  new Notification(remote.getGlobal('PlaybackAPI').data.song.title, { // eslint-disable-line
    body: `${remote.getGlobal('PlaybackAPI').data.song.artist} - ${remote.getGlobal('PlaybackAPI').data.song.album}`,
    icon: remote.getGlobal('PlaybackAPI').data.song.albumArt,
  });
});
