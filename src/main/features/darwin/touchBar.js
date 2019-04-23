import { app, TouchBar } from 'electron';
import path from 'path';

const { TouchBarButton, TouchBarSpacer } = TouchBar;

let playing = false;
let play;
let mainWindow;
let thumbsUp;
let thumbsDown;
let renderTouchBar = () => {};
let { liked, disliked } = PlaybackAPI.getRating();

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

const _thumbsUp = () => new TouchBarButton({
  icon: path.resolve(`${mediaControls}${liked ? 'filled_' : ''}thumb_up.png`),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsUp');
  },
});

const _thumbsDown = () => new TouchBarButton({
  icon: path.resolve(`${mediaControls}${disliked ? 'filled_' : ''}thumb_down.png`),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsDown');
  },
});


const _getTouchBar = () => {
  const prevTrack = _trackButton('previous');
  play = _play();
  const nextTrack = _trackButton('next');

  thumbsUp = _thumbsUp();
  thumbsDown = _thumbsDown();

  const touchBar = new TouchBar([
    prevTrack,
    play,
    nextTrack,
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

PlaybackAPI.on('change:rating', (newRating) => {
  liked = newRating.liked;
  thumbsUp.icon = path.resolve(`${mediaControls}${liked ? 'filled_' : ''}thumb_up.png`);
  disliked = newRating.disliked;
  thumbsDown.icon = path.resolve(`${mediaControls}${disliked ? 'filled_' : ''}thumb_down.png`);
});
