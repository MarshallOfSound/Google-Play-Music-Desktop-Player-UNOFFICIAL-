import { BrowserWindow } from 'electron';
import { LastFmNode } from 'lastfm';
import path from 'path';

import { LASTFM_API_KEY, LASTFM_API_SECRET } from '../../constants';

const lastfm = new LastFmNode({
  api_key: LASTFM_API_KEY,
  secret: LASTFM_API_SECRET,
  useragent: 'GPMDP',
});

const getLastFMToken = () => {
  return new Promise((resolve, reject) => {
    lastfm.request('auth.getToken')
      .on('success', (json) => {
        resolve(json.token);
      })
      .on('error', () => {
        reject();
      });
  });
};

const authLastFMToken = (token) => {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      center: true,
      show: false,
      autoHideMenuBar: true,
      frame: Settings.get('nativeFrame'),
      nodeIntegration: false,
      icon: path.resolve(`${__dirname}/../../../assets/img/main.png`),
      title: 'Last.FM',
      'web-preferences': {
        preload: path.resolve(`${__dirname}/../../../inject/lastFM.js`),
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
};

export const getLastFMSession = () => {
  return new Promise((resolve, reject) => {
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
        .then((token) => {
          return authLastFMToken(token);
        })
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
};

const resetLastFM = () => {
  Settings.set('lastFMKey', null);
  Settings.set('lastFMUser', null);
  delete global.lastFMSession;
  getLastFMSession();
};

export const updateNowPlaying = (track, artist, album) => {
  if (Settings.get('lastFMKey')) {
    getLastFMSession()
      .then((session) => {
        lastfm.update('nowplaying', session, {
          track,
          artist,
          album,
        })
        .on('error', resetLastFM);
      })
      .catch(resetLastFM);
  }
};

export const updateScrobble = (track, artist, album, timestamp) => {
  if (Settings.get('lastFMKey')) {
    getLastFMSession()
      .then((session) => {
        lastfm.update('scrobble', session, {
          track,
          artist,
          album,
          timestamp,
        })
        .on('error', resetLastFM);
      })
      .catch(resetLastFM);
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

Emitter.on('change:song', (event, details) => {
  updateNowPlaying(details.title, details.artist, details.album);
});

Emitter.on('change:song:scrobble', (event, details) => {
  updateScrobble(details.title, details.artist, details.album, details.timestamp);
});
