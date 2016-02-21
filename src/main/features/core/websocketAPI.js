import { Server as WebSocketServer } from 'ws';

let server;
let oldTime = {};

PlaybackAPI.on('change:song', (newSong) => {
  if (server && server.broadcast) {
    server.broadcast('song', newSong);
  }
});
PlaybackAPI.on('change:state', (newState) => {
  if (server && server.broadcast) {
    server.broadcast('playState', newState);
  }
});
PlaybackAPI.on('change:time', (timeObj) => {
  if (server && server.broadcast) {
    if (JSON.stringify(timeObj) !== JSON.stringify(oldTime)) {
      oldTime = timeObj;
      server.broadcast('time', timeObj);
    }
  }
});
PlaybackAPI.on('change:lyrics', (newLyrics) => {
  if (server && server.broadcast) {
    server.broadcast('lyrics', newLyrics);
  }
});

const enableAPI = () => {
  try {
    server = new WebSocketServer({ port: 5672 });
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

      ws.channel('playState', PlaybackAPI.isPlaying());
      if (PlaybackAPI.currentSong()) {
        ws.channel('song', PlaybackAPI.currentSong());
        ws.channel('time', PlaybackAPI.currentTime());
        ws.channel('lyrics', PlaybackAPI.currentSongLyrics());
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
