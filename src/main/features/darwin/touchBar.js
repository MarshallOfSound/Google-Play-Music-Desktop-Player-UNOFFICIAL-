import { app, TouchBar } from 'electron';
import path from 'path';

const { TouchBarButton, TouchBarSlider, TouchBarSpacer } = TouchBar;

let playing = false;
let play;
let mainWindow;
let mediaSlider;
let renderTouchBar = () => {};

const mediaControls = `${__dirname}/../../../assets/img/media_controls/`;

const _play = () => new TouchBarButton({
  icon: path.resolve(`${mediaControls}${(playing ? 'pause' : 'play')}.png`),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:playPause');
  },
});

const _trackButton = (search) => {
  const trackButton = new TouchBarButton({
    icon: path.resolve(`${mediaControls}${search}.png`),
    click: () => {
      Emitter.sendToGooglePlayMusic(`playback:${search}Track`);
    },
  });
  return trackButton;
};

const _mediaSlider = (time) => {
  const touchBar = new TouchBarSlider({
    value: time.current,
    maxValue: time.total,
    change: (newValue) => {
      Emitter.sendToGooglePlayMusic('playback:seek', newValue);
    },
  });
  return touchBar;
};

const _thumbsUp = () => new TouchBarButton({
  label: '👍',
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsUp');
  },
});

const _thumbsDown = () => new TouchBarButton({
  label: '👎',
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsDown');
  },
});


const _getTouchBar = () => {
  const prevTrack = _trackButton('previous');
  play = _play();
  const nextTrack = _trackButton('next');

  // media slider
  const time = PlaybackAPI.currentTime();
  mediaSlider = _mediaSlider(time);

  const thumbsUp = _thumbsUp();
  const thumbsDown = _thumbsDown();

  const touchBar = new TouchBar([
    prevTrack,
    play,
    nextTrack,
    new TouchBarSpacer({ size: 'small' }),
    mediaSlider,
    new TouchBarSpacer({ size: 'small' }),
    thumbsUp,
    thumbsDown,
  ]);

  return touchBar;
};

renderTouchBar = () => {
  mainWindow = WindowManager.getAll('main')[0];
  if (mainWindow) {
    mainWindow.setTouchBar(_getTouchBar());
  } else {
    // Something went wrong
    app.quit();
  }
};

app.on('browser-window-focus', renderTouchBar);

PlaybackAPI.on('change:state', (nextState) => {
  playing = nextState;
  play.icon = path.resolve(`${mediaControls}${(playing ? 'pause' : 'play')}.png`);
});

PlaybackAPI.on('change:time', ({ current }) => {
  if (mediaSlider) {
    mediaSlider.value = current;
  }
});
