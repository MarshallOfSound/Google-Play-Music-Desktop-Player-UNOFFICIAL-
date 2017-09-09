window.wait(() => {
  // Simulate a user interaction event every hour
  setInterval(() => GPM.volume.setVolume(GPM.volume.getVolume()), 3600000);

  const originalRequestAnimationFrame = window.requestAnimationFrame;
  let updateSliderFn = null;
  window.requestAnimationFrame = (fn) => {
    if (document.visibilityState !== 'visible') {
      if (!updateSliderFn && fn.toString) {
        const str = fn.toString();
        if (str.includes('(a,b)') && str.includes('max') && str.includes('value')) {
          updateSliderFn = fn;
        }
      }
      if (updateSliderFn === fn) {
        setTimeout(fn, 0);
        return -1;
      }
    }
    return originalRequestAnimationFrame(fn);
  };
});
