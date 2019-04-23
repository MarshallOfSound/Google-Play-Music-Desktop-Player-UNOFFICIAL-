import path from 'path';

export default (app) => {
  if (!process.argv.includes('--disable-smooth-scrolling')) {
    app.commandLine.appendSwitch('enable-smooth-scrolling', '1');
  }
  app.commandLine.appendSwitch('enable-features', 'OverlayScrollbar');
  app.commandLine.appendSwitch('enable-use-zoom-for-dsf', 'false');
  app.commandLine.appendSwitch('disable-gpu', '1');
  // DEV: Enables the HTML5 WebAudio API extensions to allow selection of sinkId
  //      --> Choosing audio output device
  app.commandLine.appendSwitch('enable-experimental-web-platform-features', '1');

  // Required for 5.1 sound support
  if (Settings.get('trySupportedChannelLayouts', false)) {
    app.commandLine.appendSwitch('try-supported-channel-layouts', '1');
  }

  if (process.platform !== 'darwin' && !process.argv.includes('--enable-gpu')) {
    app.disableHardwareAcceleration();
  }

  if (process.platform === 'darwin' && global.DEV_MODE) {
    app.dock.setIcon(path.resolve(__dirname, '..', 'assets/img/main.png'));
  }
};
