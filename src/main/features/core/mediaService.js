import mediaService from 'electron-media-service';

mediaService.startService();

const meta = {};

PlaybackAPI.on('change:track', (track) => {
  Object.assign(meta, track);

  mediaService.setMetaData(meta);
});

PlaybackAPI.on('change:time', ({ current, total }) => {
  meta.currentTime = current;
  meta.duration = total;

  mediaService.setMetaData(meta);
});

PlaybackAPI.on('change:state', (playing) => {
  meta.state = playing ? 'playing' : 'paused';

  mediaService.setMetaData(meta);
});

let seekTimer;

mediaService.on('play', () => {
  if (meta.state !== 'playing') {
    const play = () => Emitter.sendToGooglePlayMusic('playback:playPause');
    if (seekTimer) {
      seekTimer.tagAlong = play;
    } else {
      play();
    }
  }
});

mediaService.on('pause', () => {
  if (meta.state === 'playing') {
    Emitter.sendToGooglePlayMusic('playback:playPause');
  }
});

mediaService.on('stop', () => {
  Emitter.sendToGooglePlayMusic('playback:stop');
});

mediaService.on('playPause', () => {
  Emitter.sendToGooglePlayMusic('playback:playPause');
});

mediaService.on('next', () => {
  Emitter.sendToGooglePlayMusic('playback:nextTrack');
});

mediaService.on('previous', () => {
  Emitter.sendToGooglePlayMusic('playback:previousTrack');
});

mediaService.on('seek', (to) => {
  clearTimeout(seekTimer);
  seekTimer = setTimeout(() => {
    Emitter.sendToGooglePlayMusic('playback:seek', to);
    if (seekTimer.tagAlong) seekTimer.tagAlong();
    seekTimer = null;
  }, 500);
});
