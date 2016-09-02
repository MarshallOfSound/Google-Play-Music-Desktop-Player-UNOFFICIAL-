let shouldUpdate = Settings.get('enableTaskbarProgress');

const updateTaskbarProgressListener = () => {
  shouldUpdate = Settings.get('enableTaskbarProgress');
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
  if (shouldUpdate) {
    const win = WindowManager.get(global.mainWindowID);
    if (win) win.setProgressBar(current / total);
  }
});
