let pauseAfter = false;

window.addEventListener('load', () => {
  GPM.on('change:song', () => {
    if (pauseAfter) {
      GPM.playback.playPause();
      Emitter.fireAtGoogle('pauseAfter:hide', null);
    }
  });
});

Emitter.on('pauseAfter:show', () => {
  if (!pauseAfter) {
    window.showToast(`Pausing after this song.`, true,
    `Don\'t pause after this song`, Settings.get('themeColor'),
    (event) => {
      Emitter.fireAtGoogle('pauseAfter:hide', null);
      event.preventDefault();
      return false;
    },
    (toast) => {
      pauseAfter = true;
      Emitter.on('pauseAfter:hide', () => {
        pauseAfter = false;
        toast.hide();
      });
    });
  }
});
