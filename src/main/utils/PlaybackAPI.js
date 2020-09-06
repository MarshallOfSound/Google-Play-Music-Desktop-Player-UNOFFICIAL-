import _ from 'lodash';
import EventEmitter from 'events';
import fs from 'fs';

import createJSON from './_jsonCreator';

class PlaybackAPI extends EventEmitter {
  constructor(filePrefix = '') {
    super();

    this.PATH = createJSON(`${filePrefix}playback`);
    this.reset();
    this._save();
    if (Settings.get('enableJSON_API', true)) {
      // DEV: Handle windows users running as admin...
      fs.chmodSync(this.PATH, '777');
    }

    this._hook();
  }

  _hook() {
    Emitter.on('change:track', (event, details) => {
      this._setPlaybackSong(details.title, details.artist, details.album, details.albumArt);
    });

    Emitter.on('playback:isPlaying', this._setPlaying.bind(this, true));
    Emitter.on('playback:isPaused', this._setPlaying.bind(this, false));
    Emitter.on('playback:isStopped', this._setPlaying.bind(this, false));

    Emitter.on('change:playback-time', (event, timeObj) => this._setTime(timeObj.current, timeObj.total));
    Emitter.on('change:volume', (event, newVolume) => this._setVolume(newVolume));
    // we throttle this function because of a bug in gmusic.js
    // ratings are received multiple times here in a couple of ms
    // to avoid writing the file 5+ times we throttle it to 500ms max
    Emitter.on('change:rating', _.throttle((event, details) => this._setRating(details), 500));
    Emitter.on('change:shuffle', _.throttle((event, mode) => this._setShuffle(mode)), 20);
    Emitter.on('change:repeat', _.throttle((event, mode) => this._setRepeat(mode)), 20);
    Emitter.on('change:playlists', _.throttle((event, playlists) => this._setPlaylists(playlists)), 20);
    Emitter.on('change:queue', _.throttle((event, queue) => this._setQueue(queue)), 20);
    Emitter.on('change:search-results', _.throttle((event, results) => this._setResults(results)), 20);
    Emitter.on('change:library', _.throttle((event, library) => this._setLibrary(library)), 20);
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
      volume: 50,
    };
    this._private_data = {
      playlists: [],
      queue: [],
      results: {
        searchText: '',
        artists: [],
        albums: [],
        tracks: [],
      },
      library: {
        albums: [],
        artists: [],
        tracks: [],
      },
    };
    this._save();
  }

  _save() {
    if (Settings.get('enableJSON_API', true)) {
      try {
        fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
      } catch (e) {
        if (this.saving) clearTimeout(this.saving);
        this.saving = setTimeout(this._save.bind(this), 275);
      }
      if (this.saving) clearTimeout(this.saving);
    }
  }

  _setLibrary(library) {
    this._private_data.library = library;
    this._fire('change:library', this._private_data.library);
  }

  _setPlaying(isPlaying) {
    this.data.playing = isPlaying;
    this._fire('change:state', isPlaying);
    this._save();
  }

  _setPlaybackSong(title, artist, album, albumArt) {
    const fullSizeAlbumArt = albumArt.replace(/=s90-c-e100$/g, '').replace(/=w60-h60-l90-rj$/g, '');
    this.data.song = {
      title,
      artist,
      album,
      albumArt: fullSizeAlbumArt,
    };
    this.data.songLyrics = null;
    this._fire('change:track', this.data.song);
    this._fire('change:lyrics', this.data.songLyrics);
    this._save();
  }

  _setPlaylists(playlists) {
    this._private_data.playlists = playlists;
    this._fire('change:playlists', this._private_data.playlists);
  }

  _setQueue(queue) {
    this._private_data.queue = queue;
    this._fire('change:queue', this._private_data.queue);
  }

  _setRating(rating) {
    this.data.rating.liked = rating === '5';
    this.data.rating.disliked = rating === '1';
    this._fire('change:rating', this.data.rating);
    this._save();
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

  _setResults(results) {
    this._private_data.results = results;
    this._fire('change:search-results', this._private_data.results);
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

  _setVolume(newVolume) {
    this.data.volume = newVolume;
    this._fire('change:volume', newVolume);
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

  getLibrary() {
    return this._private_data.library;
  }

  getPlaylists() {
    return this._private_data.playlists;
  }

  getQueue() {
    return this._private_data.queue;
  }

  getRating() {
    return this.data.rating;
  }

  getResults() {
    return this._private_data.results;
  }

  getVolume() {
    return this.data.volume;
  }

  _fire(what, arg) {
    this.emit(what, arg);
    Emitter.sendToWindowsOfName('main', `PlaybackAPI:${what}`, arg);
  }
}

export default PlaybackAPI;
