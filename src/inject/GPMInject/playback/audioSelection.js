import _ from 'lodash';

Emitter.on('audiooutput:fetch', () => {
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      Emitter.fireAtAll('audiooutput:list', _.transform(devices, (final, device) => {
        final.push({
          deviceId: device.deviceId,
          label: device.label,
          kind: device.kind,
        });
      }, []));
    });
});

export const setAudioDevice = (id) => {
  let count = 0;
  return new Promise((resolve, reject) => {
    const trySet = setInterval(() => {
      document.querySelectorAll('audio')[0].setSinkId(id)
        .then(() => { clearInterval(trySet); resolve(); })
        .catch(() => { count++; if (count > 10000) { reject(); } }); // eslint-disable-line
    }, 50);
  });
};

Emitter.on('audiooutput:set', (event, deviceId) => {
  setAudioDevice(deviceId);
});
