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


Emitter.on('audiooutput:set', (event, deviceId) => {
  document.querySelectorAll('audio')[0].setSinkId(deviceId);
});
