import SpeechRecognizer from './SpeechRecognizer';

import playPlaylist from './utils/playPlaylist';

window.wait(() => {
  const speech = new SpeechRecognizer(
                  ['ok player', 'okayplayer', 'hey music', 'yo music'], // Hot Words
                  ['Let\'s', 'can you', 'can you please', 'please'] // Command prefix
                );

  // Play Playlist Handlers
  speech.registerHandler(['play playlist', 'play the playlist'], playPlaylist);

  // Play / Pause Handlers
  let playing = false;
  GPM.on('change:playback', (mode) => playing = (mode === 2));
  speech.registerHandler(['pause', 'pours', 'paws', 'Paul\'s'], () =>
    new Promise((resolve) => {
      if (playing) GPM.playback.playPause();
      resolve();
    })
  );
  speech.registerHandler('play', () =>
    new Promise((resolve) => {
      if (!playing) GPM.playback.playPause();
      resolve();
    })
  );

  // Track Navigation Handlers
  speech.registerHandler(['next', 'forward', 'fast forward'], () =>
    new Promise((resolve) => {
      GPM.playback.forward();
      resolve();
    })
  );

  speech.registerHandler(['back', 'previous', 'rewind', 'start again'], () =>
    new Promise((resolve) => {
      GPM.playback.rewind();
      resolve();
    })
  );

  speech.registerHandler(['this song sucks', 'the song sucks'], () =>
    new Promise((resolve) => {
      GPM.rating.setRating(1);
      resolve();
    })
  );

  // Shuffle Handlers
  speech.registerHandler(['mixitup', 'mix it up',
                          'shuffle', 'shake', 'random'], () =>
    new Promise((resolve) => {
      if (GPM.playback.getShuffle() === window.GMusic.Playback.ALL_SHUFFLE) {
        GPM.playback.toggleShuffle();
      }
      GPM.playback.toggleShuffle();
      GPM.playback.forward();
      resolve();
    })
  );

  speech.registerHandler(['turn shuffle on', 'shuffle on'], () =>
    new Promise((resolve) => {
      if (GPM.playback.getShuffle() === window.GMusic.Playback.NO_SHUFFLE) {
        GPM.playback.toggleShuffle();
      }
      resolve();
    })
  );

  speech.registerHandler(['turn shuffle off', 'shuffle off'], () =>
    new Promise((resolve) => {
      if (GPM.playback.getShuffle() === window.GMusic.Playback.ALL_SHUFFLE) {
        GPM.playback.toggleShuffle();
      }
      resolve();
    })
  );

  // Album Navigation Handlers
  speech.registerHandler(['goto artist', 'go to artist', 'load artist',
                          'navigate to artist'], (artistName) =>
    new Promise((resolve) => {
      if (!artistName) { resolve(); return; }
      window.location = `/music/listen#/artist//${artistName}`;
      resolve('');
    })
  );

  // Desktop Settings Trigger
  speech.registerHandler(['settings', 'open settings', 'show settings',
                          'load settings'], () =>
    new Promise((resolve) => {
      Emitter.fire('window:settings');
      resolve();
    })
  );

  // Volume Controls
  speech.registerHandler(['turn it up', 'bring it up', 'turn the volume up',
                          'make it louder', 'i can\'t here it'], () =>
    new Promise((resolve) => {
      GPM.volume.increaseVolume();
      resolve();
    })
  );

  speech.registerHandler(['turn it down', 'take it down', 'turn the volume down',
                          'make it quieter', 'make it more quiet'], () =>
    new Promise((resolve) => {
      GPM.volume.decreaseVolume();
      resolve();
    })
  );

  speech.registerHandler(['set volume to', 'set the volume to',
                          'make the volume', 'set the volume 2',
                          'set volume 2', 'set volume'], (num) =>
    new Promise((resolve) => {
      const targetVol = parseInt(num, 10);
      if (targetVol) {
        GPM.volume.setVolume(Math.min(Math.max(0, targetVol), 100));
      }
      resolve(num.replace(new RegExp(targetVol.toString() + '%', 'g'), '').trim());
    })
  );

  let origVolume;
  speech.registerHandler(['make it boom', 'make it burn', 'sing it out', 'pump it',
                          'get this party started'], () =>
    new Promise((resolve) => {
      origVolume = origVolume || GPM.volume.getVolume();
      GPM.volume.setVolume(100);
      resolve();
    })
  );

  speech.registerHandler(['shut up', 'mute', 'silence', 'turn this right down',
                          'party is over', 'party\'s over'], () =>
    new Promise((resolve) => {
      origVolume = origVolume || GPM.volume.getVolume();
      GPM.volume.setVolume(0);
      resolve();
    })
  );

  speech.registerHandler(['reset the volume', 'normalize', 'normalise'], () =>
    new Promise((resolve) => {
      GPM.volume.setVolume(origVolume);
      origVolume = null;
      resolve();
    })
  );
});
