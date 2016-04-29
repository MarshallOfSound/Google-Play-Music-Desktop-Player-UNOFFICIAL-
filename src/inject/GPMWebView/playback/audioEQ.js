import _ from 'lodash';

import { setAudioDevice } from './audioSelection';

window.wait(() => {
  const waitForAudio = setInterval(() => {
    if (document.querySelector('audio')) {
      clearInterval(waitForAudio);

      // DEV: We do this here so that we can set the output device before hooking the context
      navigator.mediaDevices.enumerateDevices()
        .then((devices) =>
          new Promise((resolve) => {
            let set = false;
            _.forEach(devices, (device) => {
              if (device.label === Settings.get('audiooutput')) {
                set = true;
                let once = true;
                document.querySelector('audio').addEventListener('playing', () => {
                  if (!once) return;
                  once = false;
                  setAudioDevice(device.deviceId)
                    .then(resolve);
                });
              }
            });
            if (!set) resolve();
          })
        )
        .then(() => {
          // TODO: Uncomment this so that the equalizer works
          // DEV: This doesn't work with audio selection so let's disable it
          // const context = new AudioContext();
          // window.audioFilterContext = context;
          // const mediaElement = document.querySelector('audio');
          // const sourceNode = context.createMediaElementSource(mediaElement);
          // window.audioSourceNode = sourceNode;
          //
          // const GAIN_DB = -40.0;
          // // These are the EQ levels that the android EQ uses
          // const BAND_SPLITS = [60, 230, 910, 4000, 14000];
          //
          // const bands = [];
          //
          // const sum = context.createGain();
          // const mBand = context.createGain();
          //
          // BAND_SPLITS.forEach((UPPER_BAND, index) => {
          //   const band = context.createBiquadFilter();
          //   band.type = (index !== BAND_SPLITS.length - 1 ? 'highshelf' : 'lowshelf');
          //   band.frequency.value = UPPER_BAND;
          //   band.gain.value = GAIN_DB;
          //
          //   const invert = context.createGain();
          //   invert.gain.value = -1.0;
          //   sourceNode.connect(band);
          //   band.connect(invert);
          //   invert.connect(mBand);
          //
          //   const gain = context.createGain();
          //   band.connect(gain);
          //   gain.connect(sum);
          //
          //   gain.gain.value = Settings.get('eq', [1, 1, 1, 1, 1, 1])[bands.length];
          //   bands.push(gain);
          // });
          //
          // sourceNode.connect(mBand);
          //
          // const mGain = context.createGain();
          // mBand.connect(mGain);
          //
          // mGain.connect(sum);
          //
          // sum.connect(context.destination);
          //
          // // TODO: remove
          // window.bands = bands;
          // window.mBand = mBand;
          //
          // Emitter.on('eq:change', (event, details) => {
          //   bands[details.index].gain.value = details.value;
          // });
        });
    }
  }, 10);
});
