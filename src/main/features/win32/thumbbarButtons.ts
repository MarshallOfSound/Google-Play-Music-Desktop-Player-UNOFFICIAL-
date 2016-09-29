import * as path from 'path';

const browser = WindowManager.getAll('main')[0];
const resetThumbbarButtons = (isPlaying: boolean) => {
  browser.setThumbarButtons([
    {
      tooltip: 'Previous Track',
      icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/previous.png`),
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:previousTrack'),
    },
    {
      tooltip: (isPlaying ? 'Pause' : 'Play'),
      icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/${(isPlaying ? 'pause' : 'play')}.png`), // eslint-disable-line
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:playPause'),
    },
    {
      tooltip: 'Next Track',
      icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/next.png`),
      click: Emitter.sendToGooglePlayMusic.bind(Emitter, 'playback:nextTrack'),
    },
  ]);
};
// DEV: For some reason we need to wait till focus before setting the thumbbarButtons
browser.once('focus', () => {
  resetThumbbarButtons(false);
});

PlaybackAPI.on('change:state', (newState) => {
  resetThumbbarButtons(newState);
});
