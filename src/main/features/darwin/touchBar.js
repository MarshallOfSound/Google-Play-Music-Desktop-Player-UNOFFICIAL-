import { app, TouchBar } from 'electron';
import path from 'path';

const { TouchBarButton, TouchBarSpacer } = TouchBar;

const mediaControls = path.resolve(__dirname, '../../../assets/img/media_controls');

const playPauseButton = new TouchBarButton({
  icon: path.resolve(mediaControls, 'play.png'),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:playPause');
  },
});
const updatePlayPauseButton = (isPlaying) => {
  playPauseButton.icon = path.resolve(mediaControls, `${isPlaying ? 'pause' : 'play'}.png`);
};

const previousButton = new TouchBarButton({
  icon: path.resolve(mediaControls, 'previous.png'),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:previousTrack');
  },
});
const nextButton = new TouchBarButton({
  icon: path.resolve(mediaControls, 'next.png'),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:nextTrack');
  },
});

const thumbsUpButton = new TouchBarButton({
  icon: path.resolve(mediaControls, 'thumb_up.png'),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsUp');
  },
});
const thumbsDownButton = new TouchBarButton({
  icon: path.resolve(mediaControls, 'thumb_down.png'),
  click: () => {
    Emitter.sendToGooglePlayMusic('playback:toggleThumbsDown');
  },
});
const updateThumbButtons = (liked, disliked) => {
  thumbsUpButton.icon = path.resolve(mediaControls, `${liked ? 'filled_' : ''}thumb_up.png`);
  thumbsDownButton.icon = path.resolve(mediaControls, `${disliked ? 'filled_' : ''}thumb_down.png`);
};

const touchBar = new TouchBar({
  items: [
    previousButton,
    playPauseButton,
    nextButton,
    new TouchBarSpacer({ size: 'small' }),
    thumbsUpButton,
    thumbsDownButton,
  ],
});

let attached = false;
const renderTouchBar = () => {
  const mainWindow = WindowManager.getAll('main')[0];
  if (mainWindow && !attached) {
    attached = true;
    mainWindow.setTouchBar(touchBar);
  }
};

app.on('browser-window-focus', renderTouchBar);

PlaybackAPI.on('change:state', (isPlaying) => {
  updatePlayPauseButton(isPlaying);
});

PlaybackAPI.on('change:rating', (newRating) => {
  updateThumbButtons(newRating.liked, newRating.disliked);
});
