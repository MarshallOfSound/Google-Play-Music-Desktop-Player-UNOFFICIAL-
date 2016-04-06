import { remote } from 'electron';
import _ from 'lodash';

// we throttle this function because of a bug in gmusic.js
// ratings are received multiple times here in a couple of ms
// to avoid play pause to be called 5+ times we throttle it to 500ms max
window.addEventListener('load', _.throttle(() => {
  remote.getGlobal('PlaybackAPI').on('change:song', (song) => {
    if (remote.getGlobal('PlaybackAPI').currentPauseAfter()) {
      try {
        GPM.playback.playPause();
        remote.getGlobal('PlaybackAPI')._setPauseAfter(false);
      }
      catch(err) {
        if (err.name !== 'ReferenceError') { //calling GPM throws a ReferenceError for whatever reason, but it works, so...
          throw err
        }
      }
    }
  });
}, 500));
