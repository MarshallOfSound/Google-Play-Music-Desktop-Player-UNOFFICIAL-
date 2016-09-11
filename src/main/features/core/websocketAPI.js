import { app } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import uuid from 'uuid';
import { spawnSync } from 'child_process';
import WebSocket, { Server as WebSocketServer } from 'ws';

import getPluginManager from './plugins';

let server;
let oldTime = {};
let uniqID = uuid.v4();

let runas = () => {};
if (process.platform === 'win32') {
  runas = require('runas');
}

let mdns;
try {
  mdns = require('mdns');
} catch (e) {
  Logger.error('Failed to load bonjour with error: %j', e);
  console.error('Bonjour is required to use Chromecast Support or to enable ZeroConf for the PlaybackAPI'); // eslint-disable-line
  if (process.platform === 'win32') {
    console.error('On windows you need to install Bonjour Print Services'); // eslint-disable-line
  } else if (process.platform === 'darwin') {
    console.error('One macOS Bonjour should "just work" so if you see this you have much bigger problems'); // eslint-disable-line
  } else {
    console.error('On linux you need to install "avahi"'); // eslint-disable-line
  }
  if (process.platform === 'win32') {
    Emitter.sendToWindowsOfName('main', 'bonjour-install');
  }
}

const changeEvents = ['track', 'state', 'rating', 'lyrics', 'shuffle', 'repeat', 'playlists', 'queue', 'search-results', 'library'];
const API_VERSION = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/../../../../package.json`))).apiVersion;

let ad;
let authCode = Math.floor(Math.random() * 9999);
authCode = '0000'.substr(0, 4 - authCode.length) + authCode;

changeEvents.forEach((channel) => {
  PlaybackAPI.on(`change:${channel}`, (newValue) => {
    if (server && server.broadcast) {
      server.broadcast(channel === 'state' ? 'playState' : channel, newValue);
    }
  });
});

const settingsChangeEvents = ['themeColor', 'theme', 'themeType'];

settingsChangeEvents.forEach((channel) => {
  Settings.onChange(channel, (newValue) => {
    if (server && server.broadcast) {
      server.broadcast(`settings:${channel}`, newValue);
    }
  });
});

PlaybackAPI.on('change:time', (timeObj) => {
  if (server && server.broadcast) {
    if (JSON.stringify(timeObj) !== JSON.stringify(oldTime)) {
      oldTime = timeObj;
      server.broadcast('time', timeObj);
    }
  }
});

const requireCode = (ws) => {
  authCode = Math.floor(Math.random() * 9999).toString();
  authCode = '0000'.substr(0, 4 - authCode.length) + authCode;
  // DEV: Always be 000 when testing
  authCode = Settings.__TEST__ ? '0000' : authCode;
  Emitter.sendToWindowsOfName('main', 'show:code_controller', {
    authCode,
  });
  ws.json({
    channel: 'connect',
    payload: 'CODE_REQUIRED',
  });
};

const enableAPI = () => {
  let portOpen = true;
  if (process.platform === 'win32') {
    const testResult = spawnSync(
      'netsh',
      ['advfirewall', 'firewall', 'show', 'rule', 'name=GPMDP\ PlaybackAPI'] // eslint-disable-line
    );
    portOpen = testResult.status === 0;
  }
  if (!portOpen) {
    Emitter.once('openport:confirm', () => {
      runas(
        'netsh',
        [
          'advfirewall', 'firewall', 'add', 'rule', 'name=GPMDP\ PlaybackAPI', // eslint-disable-line
          'dir=in', 'action=allow', 'protocol=TCP', 'localport=5672',
        ],
        {
          admin: true,
        });
    });
    Emitter.sendToWindowsOfName('main', 'openport:request');
  }
  server = new WebSocketServer({
    host: process['env'].GPMDP_API_HOST || '0.0.0.0', // eslint-disable-line
    port: global.API_PORT || process['env'].GPMDP_API_PORT || 5672, // eslint-disable-line
  }, () => {
    if (ad) {
      ad.stop();
      ad = null;
    }

    try {
      ad = mdns.createAdvertisement(mdns.tcp('GPMDP'), global.API_PORT || process['env'].GPMDP_API_PORT || 5672, { // eslint-disable-line
        name: os.hostname(),
        txtRecord: {
          API_VERSION,
        },
      });

      ad.start();
    } catch (e) {
      Logger.error('Could not initialize bonjour service with error: %j', e);
    }
    if (ad) ad.on('error', () => {});

    server.broadcast = (channel, data) => {
      server.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;
        client.channel(channel, data);
      });
    };

    server.on('connection', (websocket) => {
      const ws = websocket;

      ws.json = (obj) => {
        ws.send(JSON.stringify(obj));
      };
      ws.channel = (channel, obj) => {
        ws.json({
          channel,
          payload: obj,
        });
      };

      ws.on('message', (data) => {
        try {
          const command = JSON.parse(data);
          if (command.namespace && command.method) {
            const args = command.arguments || [];
            // Attempt to handle client connectection and authorization
            if (command.namespace === 'connect' && command.method === 'connect') {
              if (Settings.get('authorized_devices', []).indexOf(args[1]) > -1) {
                Emitter.sendToGooglePlayMusic('register_controller', {
                  name: args[0],
                });
                ws.authorized = true;
              } else if (args[1] === authCode) {
                const code = uuid.v4();
                Settings.set('authorized_devices', Settings.get('authorized_devices', []).concat([code]));
                Emitter.sendToWindowsOfName('main', 'hide:code_controller');
                ws.json({
                  channel: 'connect',
                  payload: code,
                });
              } else {
                requireCode(ws);
              }
              return;
            }
            if (command.namespace === 'plugin' && command.method === 'install' && args.length === 1 && global.DEV_MODE) {
              getPluginManager().install(args[0]);
              return;
            }
            // Attempt to execute the globa magical controller
            if (!Array.isArray(args)) {
              throw Error('Bad arguments');
            }
            if (!ws.authorized) {
              requireCode(ws);
              return;
            }
            Emitter.sendToGooglePlayMusic('execute:gmusic', {
              namespace: command.namespace,
              method: command.method,
              requestID: command.requestID || uniqID,
              args,
            });
            if (typeof command.requestID !== 'undefined') {
              Emitter.once(`execute:gmusic:result_${command.requestID}`, (event, result) => {
                ws.json(result);
              });
            }
            uniqID = uuid.v4();
          } else {
            throw Error('Bad command');
          }
        } catch (err) {
          console.log(err);
          Logger.error('WebSocketAPI Error: Invalid message recieved', { err, data });
        }
      });

      // Send initial PlaybackAPI Values
      ws.channel('API_VERSION', API_VERSION);
      ws.channel('playState', PlaybackAPI.isPlaying());
      ws.channel('shuffle', PlaybackAPI.currentShuffle());
      ws.channel('repeat', PlaybackAPI.currentRepeat());
      ws.channel('queue', PlaybackAPI.getQueue());
      ws.channel('search-results', PlaybackAPI.getResults());
      if (PlaybackAPI.currentSong(true)) {
        ws.channel('track', PlaybackAPI.currentSong(true));
        ws.channel('time', PlaybackAPI.currentTime());
        ws.channel('lyrics', PlaybackAPI.currentSongLyrics(true));
      }
      if (!Settings.__TEST__) {
        settingsChangeEvents.forEach((channel) => {
          ws.channel(`settings:${channel}`, Settings.get(channel));
        });
      }
      // We send library and playlists last as they take a while to stringify
      ws.channel('playlists', PlaybackAPI.getPlaylists());
      ws.channel('library', PlaybackAPI.getLibrary());
    });
  });

  server.on('error', () => {
    Emitter.sendToWindowsOfName('main', 'error', {
      title: 'Could not start Playback API',
      message: 'The playback API attempted (and failed) to start on port 5672.  Another application is probably using this port',  // eslint-disable-line
    });
    server = null;
  });
};

Emitter.on('playbackapi:toggle', (event, state) => {
  if (!state.state && server) {
    server.close();
    server = null;
  }
  if (state.state) {
    if (!server) {
      enableAPI();
    }
  } else if (ad) {
    ad.stop();
    ad = null;
  }
  Settings.set('playbackAPI', state.state);
});

app.on('will-quit', () => {
  if (server) {
    server.close();
    server = null;
  }
});

if (Settings.get('playbackAPI', false)) {
  enableAPI();
}
