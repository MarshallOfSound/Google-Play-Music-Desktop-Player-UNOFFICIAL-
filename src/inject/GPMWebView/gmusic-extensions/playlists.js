class Track {
  constructor(trackArr) {
    this.id = trackArr[0];
    this.title = trackArr[1];
    this.albumArt = trackArr[2];
    this.artist = trackArr[3];
    this.album = trackArr[4];

    this.duration = trackArr[13];
    this.playCount = trackArr[22];
  }
}

class Playlist {
  constructor(playlistObject, id) {
    this.id = id;
    this.name = playlistObject.Oh.replace(/ playlist$/g, '');
    this.tracks = playlistObject.items.map((track) => new Track(track.Pf.Lc));
  }
}

class GMusicPlaylistController {
  constructor() {
    this.emitter = null;
    this._playlists = window.APPCONTEXT.Go.h[0].Hi;
    this._watchPlaylistObject();
  }

  _watchPlaylistObject() {
    window.APPCONTEXT.Go.h[0].addEventListener('E', () => {
      this.emitter.emit('change:playlists', this.getAll());
    });
  }

  getAll() {
    return Object.keys(this._playlists).filter((key) =>
      key !== 'queue' && key !== 'all' && this._playlists[key].ha.type === 'pl'
    ).map((key) => {
      const playlist = this._playlists[key];
      return new Playlist(playlist, key);
    });
  }

  getController() {
    const that = this;
    return {
      getAll: function() { // eslint-disable-line
        return that.getAll();
      },
      hook: function() { // eslint-disable-line
        that.emitter = this;
      },
      _navigate: function(playlist, cb) { // eslint-disable-line
        window.location.hash = `/pl/${escape(playlist.id)}`;
        const waitForPage = setInterval(() => {
          const info = document.querySelector('.material-container-details');
          if (info && info.querySelector('.title').innerText === playlist.name) {
            clearInterval(waitForPage);
            if (cb && typeof cb === 'function') cb();
          }
        }, 10);
      },
      play: function(playlist, cb) { // eslint-disable-line
        this.playlists._navigate(playlist, () => {
          document.querySelector('.material-container-details [data-id="play"]').click();
        });
      },
      playWithTrack: function(playlist, track) { // eslint-disable-line
        this.playlists._navigate(playlist, () => {
          const songPlayButton = document.querySelector(`.song-row[data-id="${track.id}"] [data-id="play"]`);
          if (songPlayButton) songPlayButton.click();
        });
      },
    };
  }
}

const controller = new GMusicPlaylistController();

window.GMusic._protoObj.playlists = controller.getController();
