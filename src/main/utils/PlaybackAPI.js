import app from 'app';
import fs from 'fs';
import mkdirp from 'mkdirp';

const os = require('os');

const environment = process.env;

class PlaybackAPI {
  constructor() {
    const DIR = app.getPath('userData');
    this.PATH = `${DIR}/playback.json`;
    const OLD_DIR = (environment.APPDATA ||
      (process.platform === 'darwin' ? environment.HOME + '/Library/Preferences' : os.homedir())) +
      '/GPMDP_STORE';
    const OLD_PATH = `${OLD_DIR}/playback.json`;

    this.reset();
    if (fs.existsSync(OLD_PATH)) {
      fs.renameSync(OLD_PATH, this.PATH);
      fs.rmdir(OLD_DIR, function () {});
    } else if (!fs.existsSync(this.PATH)) {
      mkdirp(DIR);
      this._save();
    }

    this._ev = {};

    this._hook();
  }

  _hook() {
    Emitter.on('change:song', (event, details) => {
      this.setPlaybackSong(details.title, details.artist, details.album, details.art);
    });

    Emitter.on('playback:isPlaying', this.setPlaying.bind(this, true));
    Emitter.on('playback:isPaused', this.setPlaying.bind(this, false));
    Emitter.on('playback:isStopped', this.setPlaying.bind(this, false));

    Emitter.on('change:playback-time', (event, timeObj) => {
      this.setTime(timeObj.current, timeObj.total);
    });
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
      time: {
        current: 0,
        total: 0,
      },
      songLyrics: null,
    };
    this._save();
  }

  _save() {
    if (Settings.get('enableJSONApi', true)) {
      fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
    }
  }

  setPlaying(isPlaying) {
    this.data.playing = isPlaying;
    this._fire('change:state', isPlaying);
    this._save();
  }

  setPlaybackSong(title, artist, album, albumArt) {
    this.data.song = {
      title,
      artist,
      album,
      albumArt,
    };
    this.data.songLyrics = null;
    this._fire('change:song', this.data.song);
    this._fire('change:lyrics', this.data.songLyrics);
    this._save();
  }

  setPlaybackSongLyrics(lyricString) {
    this.data.songLyrics = lyricString;
    this._fire('change:lyrics', this.data.songLyrics);
    this._save();
  }

  setTime(current, total) {
    const totalTime = total || this.data.time.total;
    this.data.time = {
      current,
      total: totalTime,
    };
    this._fire('change:time', this.data.time);
    this._save();
  }

  isPlaying() {
    return this.data.playing;
  }

  currentSong() {
    return this.data.playing ? this.data.song : null;
  }

  currentSongLyrics() {
    return this.data.playing ? this.data.songLyrics : null;
  }

  currentTime() {
    return this.data.time;
  }

  on(what, fn) {
    this._ev[what] = this._ev[what] || [];
    this._ev[what].push(fn);
  }

  _fire(what, arg) {
    this._ev[what] = this._ev[what] || [];
    this._ev[what].forEach((fn) => {
      fn(arg);
    });
  }
}

export default PlaybackAPI;
