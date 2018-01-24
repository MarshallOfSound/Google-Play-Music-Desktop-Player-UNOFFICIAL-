import { BrowserWindow } from 'electron';
import { LastFmNode } from 'lastfm';
import path from 'path';

import { LASTFM_API_KEY, LASTFM_API_SECRET } from '../../constants';

const lastfm = new LastFmNode({
  api_key: LASTFM_API_KEY,
  secret: LASTFM_API_SECRET,
  useragent: 'GPMDP',
});

const getLastFMToken = () =>
  new Promise((resolve, reject) => {
    lastfm.request('auth.getToken')
      .on('success', (json) => {
        resolve(json.token);
      })
      .on('error', () => {
        reject();
      });
  });

const authLastFMToken = (token) =>
  new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      center: true,
      show: false,
      autoHideMenuBar: true,
      frame: Settings.get('nativeFrame'),
      icon: path.resolve(`${__dirname}/../../../assets/img/main.${(process.platform === 'win32' ? 'ico' : 'png')}`), // eslint-disable-line
      title: 'Last.FM',
      webPreferences: {
        nodeIntegration: false,
        preload: path.resolve(`${__dirname}/../../../renderer/lastFM.js`),
      },
    });
    authWindow.setMenu(null);
    authWindow.loadURL(`http://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&token=${token}`);
    Emitter.once('lastfm:auth_result', (event, accepted) => {
      if (accepted.result) {
        resolve(token);
      } else {
        reject();
      }
    });
  });

export const getLastFMSession = () =>
  new Promise((resolve, reject) => {
    if (global.lastFMSession && Settings.get('lastFMKey')) {
      resolve(global.lastFMSession);
    } else if (Settings.get('lastFMKey')) {
      global.lastFMSession = lastfm.session({
        key: Settings.get('lastFMKey'),
        user: Settings.get('lastFMUser'),
      });
      resolve(global.lastFMSession);
    } else {
      getLastFMToken()
        .then((token) => authLastFMToken(token))
        .then((token) => {
          lastfm.session({
            token,
          })
            .on('success', (session) => {
              global.lastFMSession = session;
              Settings.set('lastFMKey', session.key);
              Settings.set('lastFMUser', session.user);
              resolve(session);
            })
            .on('error', reject);
        })
        .catch(reject);
    }
  });

// const resetLastFM = () => {
//   Settings.set('lastFMKey', null);
//   Settings.set('lastFMUser', null);
//   delete global.lastFMSession;
//   getLastFMSession();
// };

export const updateNowPlaying = (track, artist, album, duration) => {
  if (Settings.get('lastFMKey')) {
    getLastFMSession()
      .then((session) => {
        lastfm.update('nowplaying', session, {
          track,
          artist,
          album,
          duration,
        }).on('error', (err) => Logger.error('LASTFM ERROR', err));
      })
      .catch((err) => Logger.error('LASTFM ERROR', err));
  }
};

export const updateScrobble = (track, artist, album, timestamp, duration) => {
  if (Settings.get('lastFMKey')) {
    getLastFMSession()
      .then((session) => {
        lastfm.update('scrobble', session, {
          track,
          artist,
          album,
          timestamp,
          duration,
        }).on('error', (err) => Logger.error('LASTFM ERROR', err));
      })
      .catch((err) => Logger.error('LASTFM ERROR', err));
  }
};

export const heartSong = (love, track, artist, album) => {
  if (Settings.get('lastFMKey') && Settings.get('lastFMMapThumbToHeart')) {
    getLastFMSession()
      .then((session) => {
        lastfm.request(`track.${love ? 'love' : 'unlove'}`, {
          track,
          artist,
          album,
          sk: session.key,
        }).on('error', (err) => Logger.error('LASTFM ERROR', err));
      })
      .catch((err) => Logger.error('LASTFM ERROR', err));
  }
};

Emitter.on('lastfm:auth', () => {
  getLastFMSession()
    .then(() => {
      Emitter.sendToAll('lastfm:authcomplete', { result: true });
    })
    .catch(() => {
      Emitter.sendToAll('lastfm:authcomplete', { result: false });
    });
});

let currentRating = {};
Emitter.on('change:track', (event, details) => {
  currentRating = {};
  // Last.fm isn't accepting 'Unknown Album'
  const album = details.album === 'Unknown Album' ? undefined : details.album;
  updateNowPlaying(details.title, details.artist, album, Math.round(details.duration / 1000));
});

Emitter.on('change:track:scrobble', (event, details) => {
  if (details.duration > 30 * 1000) { // Scrobble only tracks longer than 30 seconds
    const album = details.album === 'Unknown Album' ? undefined : details.album;
    updateScrobble(details.title, details.artist, album, details.timestamp, Math.round(details.duration / 1000));
  }
});

PlaybackAPI.on('change:rating', (newRating) => {
  const currentSong = PlaybackAPI.currentSong(true);
  setTimeout(() => {
    if (JSON.stringify(currentSong) === JSON.stringify(PlaybackAPI.currentSong(true))) {
      if (newRating.liked && !currentRating.liked) {
        heartSong(true, currentSong.title, currentSong.artist, currentSong.album);
      }
      if (!newRating.liked && currentRating.liked) {
        heartSong(false, currentSong.title, currentSong.artist, currentSong.album);
      }
      currentRating = Object.assign({}, newRating);
    }
  });
});
