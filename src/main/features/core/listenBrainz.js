import { Client } from 'listenbrainz';

const getListenPayloadFromData = (listenType, track, artist, album, listenedAt) => {
  const payload = {
    track_metadata: {
      artist_name: artist,
      track_name: track,
    },
  };

  if (album) {
    payload.track_metadata.release_name = album;
  }

  if (listenedAt) {
    payload.listened_at = listenedAt;
  }

  return {
    listen_type: listenType,
    payload: [payload],
  };
};

const updateNowPlaying = (track, artist, album) => {
  if (!Settings.get('listenBrainzUserToken')) {
    return;
  }

  const client = new Client(Settings.get('listenBrainzUserToken'));
  const payload = getListenPayloadFromData('playing_now', track, artist, album);
  client.submitListen(payload)
    .catch((err) => {
      Logger.error('LISTENBRAINZ ERROR', err);
    });
};

const updateListens = (track, artist, album, timestamp) => {
  if (!Settings.get('listenBrainzUserToken')) {
    return;
  }

  const client = new Client(Settings.get('listenBrainzUserToken'));
  const payload = getListenPayloadFromData('single', track, artist, album,
    timestamp);
  client.submitListen(payload)
    .catch((err) => {
      Logger.error('LISTENBRAINZ ERROR', err);
    });
};

Emitter.on('change:track', (event, details) => {
  // ListenBrainz recommends that album is sent that way
  const album = details.album === 'Unknown Album' ? undefined : details.album;
  updateNowPlaying(details.title, details.artist, album);
});

Emitter.on('change:track:scrobble', (event, details) => {
  if (details.duration > 30 * 1000) { // Scrobble only tracks longer than 30 seconds
    const album = details.album === 'Unknown Album' ? undefined : details.album;
    updateListens(details.title, details.artist, album, details.timestamp);
  }
});
