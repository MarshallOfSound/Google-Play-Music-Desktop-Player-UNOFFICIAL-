import * as _ from 'lodash';
import { EventEmitter } from 'events';
import * as fs from 'fs';

import createJSON from './_jsonCreator';

class PlaybackAPI extends EventEmitter {
  public PATH: string;
  private data: any;
  private _private_data: any;

  constructor(filePrefix = '') {
    super();

    this.PATH = createJSON(`${filePrefix}playback`);
    this.reset();
    this.save();
    if (Settings.get('enableJSON_API', true)) {
      // DEV: Handle windows users running as admin...
      fs.chmodSync(this.PATH, '777');
    }

    this.hook();
  }

  private hook() {
    Emitter.on('change:track', (event, details) => {
      this.setPlaybackSong(details.title, details.artist, details.album, details.albumArt);
    });

    Emitter.on('playback:isPlaying', this.setPlaying.bind(this, true));
    Emitter.on('playback:isPaused', this.setPlaying.bind(this, false));
    Emitter.on('playback:isStopped', this.setPlaying.bind(this, false));

    Emitter.on('change:playback-time', (event, timeObj) => this.setTime(timeObj.current, timeObj.total));
    // we throttle this function because of a bug in gmusic.js
    // ratings are received multiple times here in a couple of ms
    // to avoid writing the file 5+ times we throttle it to 500ms max
    Emitter.on('change:rating', _.throttle((event, details) => this.setRating(details), 500));
    Emitter.on('change:shuffle', _.throttle((event, mode) => this.setShuffle(mode), 20));
    Emitter.on('change:repeat', _.throttle((event, mode) => this.setRepeat(mode), 20));
    Emitter.on('change:playlists', _.throttle((event, playlists) => this.setPlaylists(playlists), 20));
    Emitter.on('change:queue', _.throttle((event, queue) => this.setQueue(queue), 20));
    Emitter.on('change:search-results', _.throttle((event, results) => this.setResults(results), 20));
    Emitter.on('change:library', _.throttle((event, library) => this.setLibrary(library), 20));
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
    this.save();
  }

  private save() {
    if (Settings.get('enableJSON_API', true)) {
      fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
    }
  }

  private setLibrary(library: GMusic.Library) {
    this._private_data.library = library;
    this.fire('change:library', this._private_data.library);
  }

  private setPlaying(isPlaying: boolean) {
    this.data.playing = isPlaying;
    this.fire('change:state', isPlaying);
    this.save();
  }

  private setPlaybackSong(title: string, artist: string, album: string, albumArt: string) {
    const fullSizeAlbumArt = albumArt.replace(/=s90-c-e100$/g, '');
    this.data.song = {
      title,
      artist,
      album,
      albumArt: fullSizeAlbumArt,
    };
    this.data.songLyrics = null;
    this.fire('change:track', this.data.song);
    this.fire('change:lyrics', this.data.songLyrics);
    this.save();
  }

  private setPlaylists(playlists: GMusic.Playlist[]) {
    this._private_data.playlists = playlists;
    this.fire('change:playlists', this._private_data.playlists);
  }

  private setQueue(queue: GMusic.Track[]) {
    this._private_data.queue = queue;
    this.fire('change:queue', this._private_data.queue);
  }

  private setRating(rating: string) {
    this.data.rating.liked = rating === '5';
    this.data.rating.disliked = rating === '1';
    this.fire('change:rating', this.data.rating);
    this.save();
  }

  setPlaybackSongLyrics(lyricString: string) {
    this.data.songLyrics = lyricString;
    this.fire('change:lyrics', this.data.songLyrics);
    this.save();
  }

  private setShuffle(mode: 'ALL_SHUFFLE' | 'NO_SHUFFLE') {
    this.data.shuffle = mode;
    this.fire('change:shuffle', this.data.shuffle);
    this.save();
  }

  private setRepeat(mode: 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT') {
    this.data.repeat = mode;
    this.fire('change:repeat', this.data.repeat);
    this.save();
  }

  private setResults(results: GMusic.SearchResults) {
    this._private_data.results = results;
    this.fire('change:search-results', this._private_data.results);
  }

  private setTime(current: number, total: number) {
    const totalTime = total || this.data.time.total;
    this.data.time = {
      current,
      total: totalTime,
    };
    this.fire('change:time', this.data.time);
    this.save();
  }

  isPlaying(): boolean {
    return this.data.playing;
  }

  currentRepeat(): 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT' {
    return this.data.repeat;
  }

  currentShuffle(): 'ALL_SHUFFLE' | 'NO_SHUFFLE' {
    return this.data.shuffle;
  }

  currentSong(force): GMusic.Track {
    return (this.data.playing || force) ? this.data.song : null;
  }

  currentSongLyrics(force): string {
    return (this.data.playing || force) ? this.data.songLyrics : null;
  }

  currentTime(): GPMDP.TrackTime {
    return this.data.time;
  }

  getLibrary(): GMusic.Library {
    return this._private_data.library;
  }

  getPlaylists(): GMusic.Playlist[] {
    return this._private_data.playlists;
  }

  getQueue(): GMusic.Track[] {
    return this._private_data.queue;
  }

  getRating(): GPMDP.TrackRating {
    return this.data.rating;
  }

  getResults(): GMusic.SearchResults {
    return this._private_data.results;
  }

  private fire(what: string, arg: any) {
    this.emit(what, arg);
    Emitter.sendToWindowsOfName('main', `PlaybackAPI:${what}`, arg);
  }
}

export default PlaybackAPI;
