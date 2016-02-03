window.wait(() => {
  window.GPM.on('change:playback', (mode) => {
    switch (mode) {
      case window.GMusic.Playback.STOPPED:
        Emitter.fire('playback:isStopped');
        break;
      case window.GMusic.Playback.PAUSED:
        Emitter.fire('playback:isPaused');
        break;
      case window.GMusic.Playback.PLAYING:
        Emitter.fire('playback:isPlaying');
        break;
      default:
        break;
    }
  });
});
