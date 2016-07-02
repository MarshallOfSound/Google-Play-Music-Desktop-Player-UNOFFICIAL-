export default (app) => {
  app.commandLine.appendSwitch('enable-smooth-scrolling', '1');
  app.commandLine.appendSwitch('enable-overlay-scrollbar', '1');
  // DEV: Enables the HTML5 WebAudio API extensions to allow selection of sinkId
  //      --> Choosing audio output device
  app.commandLine.appendSwitch('enable-experimental-web-platform-features', '1');

  if (process.platform === 'linux') {
    app.disableHardwareAcceleration();
  }
};
