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

Settings.onChange('alarmTime', (newAlarmTime) => {
  clearTimeout(timer);
  if (newAlarmTime) {
    const alarmOption = Settings.get('alarmOption', 'normal');
    timer = setTimeout(() => {
      if (alarmOption === 'fade') {
        Emitter.sendToGooglePlayMusic('playback:play:fade');
      } else {
        Emitter.sendToGooglePlayMusic('playback:play:smooth');
      }
      Settings.set('alarmTime', null);
    }, timeUntil(newAlarmTime));
  }
});

Settings.onChange('alarmDuration', (newDuration) => {
  clearTimeout(timer);
  if (newDuration) {
    const alarmOption = Settings.get('alarmOption', 'normal');
    timer = setTimeout(() => {
      if (alarmOption === 'fade') {
        Emitter.sendToGooglePlayMusic('playback:play:fade');
      } else {
        Emitter.sendToGooglePlayMusic('playback:play:smooth');
      }
      Settings.set('alarmDuration', null);
    }, newDuration);
  }
});
