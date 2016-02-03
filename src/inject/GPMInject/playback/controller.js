Emitter.on('playback:previousTrack', () => {
  window.GPM.playback.rewind();
});

Emitter.on('playback:playPause', () => {
  window.GPM.playback.playPause();
});

Emitter.on('playback:nextTrack', () => {
  window.GPM.playback.forward();
});
