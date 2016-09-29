let timer;

const dayTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const millis = date.getMilliseconds();
  return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + millis;
};

const timeUntil = (newDate) => {
  let targetTime = dayTime(new Date(newDate));
  const currentTime = dayTime(new Date());
  if (targetTime < currentTime) {
    targetTime += 24 * 60 * 60 * 1000;
  }
  return targetTime - currentTime;
};

Settings.onChange('alarm', (newDate) => {
  clearTimeout(timer);
  if (newDate) {
    timer = setTimeout(() => {
      Emitter.sendToGooglePlayMusic('playback:play:smooth');
      Settings.set('alarm', null);
    }, timeUntil(newDate));
  }
});
