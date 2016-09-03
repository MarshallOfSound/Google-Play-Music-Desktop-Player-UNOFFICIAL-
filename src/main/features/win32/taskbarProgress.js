let shouldUpdate = Settings.get('enableTaskbarProgress');
let currentlyPlaying = false;
let currentTime = 0;
let totalTime = 1;

const updateTaskbarProgress = () => {
  const win = WindowManager.get(global.mainWindowID);
  if (!win) return;
  if (shouldUpdate) {
    win.setProgressBar(currentTime / totalTime, { mode: currentlyPlaying ? 'normal' : 'paused' });
  } else {
    win.setProgressBar(-1);
  }
};

const updateTaskbarProgressListener = () => {
  shouldUpdate = Settings.get('enableTaskbarProgress');
  updateTaskbarProgress();
  if (!shouldUpdate) {
    const win = WindowManager.get(global.mainWindowID);
    if (win) win.setProgressBar(-1);
  }
};

Settings.onChange('enableTaskbarProgress', updateTaskbarProgressListener);

PlaybackAPI.on('change:time', ({
  current,
  total,
}) => {
  currentTime = current;
  totalTime = total;
  updateTaskbarProgress();
});

PlaybackAPI.on('change:state', (isPlaying) => {
  currentlyPlaying = isPlaying;
  updateTaskbarProgress();
});
