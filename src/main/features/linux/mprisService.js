import { app } from 'electron';
import mpris from 'mpris-service';

function mprisService() {
  const mainWindow = WindowManager.getAll('main')[0];

  const player = mpris({
    name: 'google_play_music_desktop_player',
    identity: 'Google Play Music Desktop Player',
    canRaise: true,
    supportedUriSchemes: ['https'],
    supportedMimeTypes: ['audio/mpeg'],
    supportedInterfaces: ['player'],
    desktopEntry: 'google-play-music-desktop-player',
  });

  player.playbackStatus = 'Stopped';
  player.canEditTracks = false;

  player.getPosition = function getPosition() {
    return PlaybackAPI.currentTime().current * 1e3;
  };

  player.on('raise', () => {
    mainWindow.setSkipTaskbar(false);
    mainWindow.show();
  });

  player.on('quit', () => {
    app.quit();
  });

  player.on('play', () => {
    if (!PlaybackAPI.isPlaying()) {
      Emitter.sendToGooglePlayMusic('playback:playPause');
    }
  });

  player.on('pause', () => {
    if (PlaybackAPI.isPlaying()) {
      Emitter.sendToGooglePlayMusic('playback:playPause');
    }
  });

  player.on('playpause', () => {
    Emitter.sendToGooglePlayMusic('playback:playPause');
  });

  player.on('next', () => {
    Emitter.sendToGooglePlayMusic('playback:nextTrack');
  });

  player.on('previous', () => {
    Emitter.sendToGooglePlayMusic('playback:previousTrack');
  });

  player.on('stop', () => {
    Emitter.sendToGooglePlayMusic('playback:stop');
    player.playbackStatus = 'Stopped';
  });

  player.on('volume', (volume) => {
    Emitter.sendToGooglePlayMusic('execute:gmusic', {
      namespace: 'volume',
      method: 'setVolume',
      args: [Math.round(volume * 100)],
    });
  });

  player.on('position', (data) => {
    Emitter.sendToGooglePlayMusic('playback:seek', data.position / 1e3);
  });

  player.on('seek', (offset) => {
    const currentTime = PlaybackAPI.currentTime().current;
    const requestedTime = currentTime + (offset / 1e3);
    Emitter.sendToGooglePlayMusic('playback:seek', requestedTime);
  });

  PlaybackAPI.on('change:track', (newSong) => {
    player.canSeek = true;
    player.canPlay = true;
    player.canPause = true;
    player.canGoPrevious = true;
    player.canGoNext = true;
    player.metadata = {
      'mpris:artUrl': newSong.albumArt.replace('=s90', '=s300'),
      'mpris:length': PlaybackAPI.currentTime().total * 1e3,
      'xesam:asText': (newSong.lyrics || ''),
      'xesam:title': newSong.title,
      'xesam:album': newSong.album,
      'xesam:artist': [newSong.artist],
    };
  });


  let lastPosition = 0;
  PlaybackAPI.on('change:time', (time) => {
    const newPosition = time.current * 1e3;

    if (Math.abs(lastPosition - newPosition) > 2e6) {
      // this event fires continuously, so only send the seeked signal when
      // time jumps more than 2s.
      player.seeked(newPosition);
    }

    lastPosition = newPosition;
  });

  PlaybackAPI.on('change:state', (playbackState) => {
    // DEV: We skip stopped here because PlaybackAPI only shuttles true/false from GPM
    player.playbackStatus = (playbackState) ? 'Playing' : 'Paused';
  });

  PlaybackAPI.on('change:volume', (volume) => {
    player.volume = volume / 100;
  });
}

mprisService();
