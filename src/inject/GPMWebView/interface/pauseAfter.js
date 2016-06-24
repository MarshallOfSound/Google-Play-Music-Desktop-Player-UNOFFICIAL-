let pauseAfter = false;

window.wait(() => {
  GPM.on('change:song', () => {
    if (pauseAfter) {
      GPM.playback.playPause();
      Emitter.fireAtGoogle('pauseAfter:hide', null);
    }
  });
});

Emitter.on('pauseAfter:show', () => {
  if (!pauseAfter) {
    window.showToast(TranslationProvider.query('message-pausing-after-song'), true,
    TranslationProvider.query('message-pausing-after-song-button'), Settings.get('themeColor'),
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
