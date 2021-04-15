const DONT_PAUSE = 0;
const PAUSE_NEXT = 1;
const PAUSE_AFTER = 2;

let pauseAfter = DONT_PAUSE;

window.wait(() => {
  GPM.on('change:track', () => {
    if (pauseAfter === PAUSE_NEXT) {
      GPM.playback.playPause();
      // because change:track is sometimes triggered twice in a row, it's good to set pauseAfter here
      // so a track doesn't get playPaused() then immediately playPaused() again.
      pauseAfter = DONT_PAUSE;
      Emitter.fireAtGoogle('pauseAfter:hide', null);
    }
    if (pauseAfter === PAUSE_AFTER) {
      pauseAfter = PAUSE_NEXT;
    }
  });
});

Emitter.on('pauseAfter:show', () => {
  if (pauseAfter === DONT_PAUSE) {
    window.showToast(TranslationProvider.query('message-pausing-after-song'), true,
    TranslationProvider.query('message-pausing-after-song-button'), Settings.get('themeColor'),
    (event) => {
      Emitter.fireAtGoogle('pauseAfter:hide', null);
      event.preventDefault();
      return false;
    },
    (toast) => {
      pauseAfter = PAUSE_NEXT;
      Emitter.on('pauseAfter:hide', () => {
        pauseAfter = DONT_PAUSE;
        toast.hide();
      });
    });
  }
});
