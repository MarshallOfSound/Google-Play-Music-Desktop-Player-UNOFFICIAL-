import { remote } from 'electron';

let mode;
(<any>window).wait(() => {
  mode = (<any>window).GMusic.PlaybackStatus.STOPPED;
  GPM.on('change:playback', (newMode) => {
    mode = newMode;
  });
});

Emitter.on('playback:previousTrack', () => {
  GPM.playback.rewind();
});

Emitter.on('playback:playPause', () => {
  GPM.playback.playPause();
});

Emitter.on('playback:play:smooth', () => {
  const originalVolume = GPM.volume.getVolume();
  GPM.volume.setVolume(0);
  if (!GPM.playback.isPlaying()) {
    GPM.playback.playPause();
  }
  let i = 0;
  const FADE_SPEED = 500;
  const fadeIn = setInterval(() => {
    GPM.volume.setVolume(i * (originalVolume / FADE_SPEED));
    i++;
    if (i >= FADE_SPEED) {
      clearInterval(fadeIn);
    }
  }, 20);
});

Emitter.on('playback:nextTrack', () => {
  GPM.playback.forward();
});

Emitter.on('playback:stop', () => {
  if (mode === (<any>window).GMusic.PlaybackStatus.PLAYING) {
    GPM.playback.playPause();
  }
});

Emitter.on('playback:thumbsUp', () => {
  if (!remote.getGlobal('PlaybackAPI').data.song.title) return;
  new (<any>window).Notification('You just liked', { // eslint-disable-line
    body: remote.getGlobal('PlaybackAPI').data.song.title,
    icon: remote.getGlobal('PlaybackAPI').data.song.albumArt,
  });
  GPM.rating.setRating(5);
});

Emitter.on('playback:thumbsDown', () => {
  if (!remote.getGlobal('PlaybackAPI').data.song.title) return;
  new (<any>window).Notification('You just disliked', { // eslint-disable-line
    body: remote.getGlobal('PlaybackAPI').data.song.title,
    icon: remote.getGlobal('PlaybackAPI').data.song.albumArt,
  });
  GPM.rating.setRating(1);
});

Emitter.on('playback:increaseVolume', () => {
  GPM.volume.increaseVolume();
});

Emitter.on('playback:decreaseVolume', () => {
  GPM.volume.decreaseVolume();
});

Emitter.on('playback:miniEnable', () => {
  GPM.mini.enable();
});

Emitter.on('playback:miniDisable', () => {
  GPM.mini.disable();
});
