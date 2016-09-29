(<any>window).wait(() => {
  // Simulate a user interaction event every hour
  setInterval(() => GPM.volume.setVolume(GPM.volume.getVolume()), 3600000);
});
