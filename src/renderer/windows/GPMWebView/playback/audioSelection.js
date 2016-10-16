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

export const setAudioDevice = (audioElem, id, count = 0) =>
  new Promise((resolve, reject) => {
    audioElem.setSinkId(id)
      .then(() => { resolve(); })
      .catch((oops) => { if (count > 10000) { reject(oops); } else { setAudioDevice(id, count + 1).then(resolve).catch((err) => reject(err)); } }); // eslint-disable-line
  });

Emitter.on('audiooutput:set', (event, deviceId) => {
  Array.prototype.forEach.call(document.querySelectorAll('audio:not(.offscreen)'), (audioElem) => {
    let once = true;
    if (audioElem.paused) {
      audioElem.addEventListener('playing', () => {
        if (!once) return;
        once = false;
        setAudioDevice(audioElem, deviceId);
      });
    } else {
      setAudioDevice(audioElem, deviceId);
    }
  });
});
