let sleepTimer;

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

Settings.onChange('sleep', (newDate) => {
  clearTimeout(sleepTimer);
  if (newDate) {
    sleepTimer = setTimeout(() => {
      Emitter.sendToGooglePlayMusic('playback:stop');
      Settings.set('sleep', null);
    }, timeUntil(newDate));
  }
});
