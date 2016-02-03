import path from 'path';

const browser = WindowManager.getAll('main')[0];
const resetThumbbarButtons = (isPlaying) => {
  browser.setThumbarButtons([
    {
      tooltip: 'Previous Track',
      icon: path.resolve('./build/assets/img/media_controls/previous.png'),
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:previousTrack'),
    },
    {
      tooltip: (isPlaying ? 'Pause' : 'Play'),
      icon: path.resolve(`./build/assets/img/media_controls/${(isPlaying ? 'pause' : 'play')}.png`),
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:playPause'),
    },
    {
      tooltip: 'Next Track',
      icon: path.resolve('./build/assets/img/media_controls/next.png'),
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:nextTrack'),
    },
  ]);
};
// DEV: For some reason we need to wait till focus before setting the thumbbarButtons
browser.once('focus', () => {
  resetThumbbarButtons(false);
});

Emitter.on('playback:isStopped', resetThumbbarButtons.bind(this, false));
Emitter.on('playback:isPaused', resetThumbbarButtons.bind(this, false));
Emitter.on('playback:isPlaying', resetThumbbarButtons.bind(this, true));
