import { Server as WebSocketServer } from 'ws';

let server;
let oldTime = {};

const changeEvents = ['song', 'state', 'rating', 'lyrics', 'shuffle', 'repeat'];

changeEvents.forEach((channel) => {
  PlaybackAPI.on(`change:${channel}`, (newValue) => {
    if (server && server.broadcast) {
      server.broadcast(channel === 'state' ? 'playState' : channel, newValue);
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

const enableAPI = () => {
  try {
    server = new WebSocketServer({ port: global.API_PORT || process['env'].GPMDP_API_PORT || 5672 }); // eslint-disable-line
  } catch (e) {
    // Do nothing
  }

  if (server) {
    server.broadcast = (channel, data) => {
      server.clients.forEach((client) => {
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
            if (!Array.isArray(args)) {
              throw Error('Bad arguments');
            }
            Emitter.sendToGooglePlayMusic('execute:gmusic', {
              namespace: command.namespace,
              method: command.method,
              args,
            });
          } else {
            throw Error('Bad command');
          }
        } catch (err) {
          Logger.error('WebSocketAPI Error: Invalid message recieved', { err, data });
        }
      });

      ws.channel('playState', PlaybackAPI.isPlaying());
      ws.channel('shuffle', PlaybackAPI.currentShuffle());
      ws.channel('repeat', PlaybackAPI.currentRepeat());
      if (PlaybackAPI.currentSong(true)) {
        ws.channel('song', PlaybackAPI.currentSong(true));
        ws.channel('time', PlaybackAPI.currentTime());
        ws.channel('lyrics', PlaybackAPI.currentSongLyrics(true));
      }
    });
  } else {
    Emitter.sendToWindowsOfName('main', 'error', {
      title: 'Could not start Playback API',
      message: 'The playback API attempted (and failed) to start on port 5672.  Another application is probably using this port',  // eslint-disable-line
    });
  }
};

Emitter.on('playbackapi:toggle', (event, state) => {
  if (server) {
    server.close();
    server = null;
  }
  if (state.state) {
    enableAPI();
  }
  Settings.set('playbackAPI', state.state);
});

if (Settings.get('playbackAPI', false)) {
  enableAPI();
}
