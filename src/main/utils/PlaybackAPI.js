import fs from 'fs';
import mkdirp from 'mkdirp';

const environment = process.env;

class PlaybackAPI {
  constructor() {
    const DIR = (environment.APPDATA ||
      (process.platform === 'darwin' ? environment.HOME + '/Library/Preferences' : '/var/local')) +
      '/GPMDP_STORE';
    this.PATH = `${DIR}/playback.json`;

    this.reset();

    if (!fs.existsSync(this.PATH)) {
      mkdirp(DIR);
      this._save();
    }

    this._hook();
  }

  _hook() {
    Emitter.on('change:song', (event, details) => {
      this.setPlaybackSong(details.title, details.artist, details.album, details.art);
    });

    Emitter.on('playback:isPlaying', this.setPlaying.bind(this, true));
    Emitter.on('playback:isPaused', this.setPlaying.bind(this, false));
    Emitter.on('playback:isStopped', this.setPlaying.bind(this, false));
  }

  reset() {
    this.data = {
      playing: false,
      song: {
        title: null,
        artist: null,
        album: null,
        albumArt: null,
      },
    };
    this._save();
  }

  setPlaying(isPlaying) {
    this.data.playing = isPlaying;
    this._save();
  }

  setPlaybackSong(title, artist, album, albumArt) {
    this.data.song = {
      title,
      artist,
      album,
      albumArt,
    };
    this._save();
  }

  _save() {
    fs.writeFileSync(this.PATH, JSON.stringify(this.data));
  }
}

export default PlaybackAPI;
