import fs from 'fs';
import createJSON from './_jsonCreator';
import _ from 'lodash';

class PlaybackAPI {
  constructor() {
    this.PATH = createJSON('playback');
    this.reset();
    this._save();
    if (Settings.get('enableJSONApi', true)) {
      // DEV: Handle windows users running as admin...
      fs.chmodSync(this.PATH, '777');
    }

    this._ev = {};

    this._hook();
  }

  _hook() {
    Emitter.on('change:song', (event, details) => {
      this._setPlaybackSong(details.title, details.artist, details.album, details.art);
    });

    Emitter.on('playback:isPlaying', this._setPlaying.bind(this, true));
    Emitter.on('playback:isPaused', this._setPlaying.bind(this, false));
    Emitter.on('playback:isStopped', this._setPlaying.bind(this, false));

    Emitter.on('change:playback-time', (event, timeObj) => {
      this._setTime(timeObj.current, timeObj.total);
    });
    // we throttle this function because of a bug in gmusic.js
    // ratings are received multiple times here in a couple of ms
    // to avoid writing the file 5+ times we throttle it to 500ms max
    Emitter.on('change:rating', _.throttle((event, details) => {
      this._setRating(details);
    }, 500));

    Emitter.on('change:shuffle', _.throttle((event, mode) => {
      this._setShuffle(mode);
    }), 20);
    Emitter.on('change:repeat', _.throttle((event, mode) => {
      this._setRepeat(mode);
    }), 20);
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
      rating: {
        liked: false,
        disliked: false,
      },
      time: {
        current: 0,
        total: 0,
      },
      songLyrics: null,
      shuffle: 'NO_SHUFFLE',
      repeat: 'NO_REPEAT',
    };
    this._save();
  }

  _save() {
    if (Settings.get('enableJSONApi', true)) {
      fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
    }
  }

  _setPlaying(isPlaying) {
    this.data.playing = isPlaying;
    this._fire('change:state', isPlaying);
    this._save();
  }

  _setPlaybackSong(title, artist, album, albumArt) {
    this.data.song = {
      title,
      artist,
      album,
      albumArt,
    };
    this._resetRating();
    this.data.songLyrics = null;
    this._fire('change:song', this.data.song);
    this._fire('change:lyrics', this.data.songLyrics);
    this._save();
  }

  _setRating(rating) {
    this.data.rating.liked = rating === '5';
    this.data.rating.disliked = rating === '1';
    this._fire('change:rating', this.data.rating);
    this._save();
  }

  _resetRating() {
    this.data.rating.liked = false;
    this.data.rating.disliked = false;
  }

  _setPlaybackSongLyrics(lyricString) {
    this.data.songLyrics = lyricString;
    this._fire('change:lyrics', this.data.songLyrics);
    this._save();
  }

  _setShuffle(mode) {
    this.data.shuffle = mode;
    this._fire('change:shuffle', this.data.shuffle);
    this._save();
  }

  _setRepeat(mode) {
    this.data.repeat = mode;
    this._fire('change:repeat', this.data.repeat);
    this._save();
  }

  _setTime(current, total) {
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

  currentRepeat() {
    return this.data.repeat;
  }

  currentShuffle() {
    return this.data.shuffle;
  }

  currentSong(force) {
    return (this.data.playing || force) ? this.data.song : null;
  }

  currentSongLyrics(force) {
    return (this.data.playing || force) ? this.data.songLyrics : null;
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
