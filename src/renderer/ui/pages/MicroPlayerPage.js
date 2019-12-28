import React, { Component } from 'react';

import LoadingSpinner from '../components/generic/LoadingSpinner';
import JoinedText from '../components/generic/JoinedText';
import RatingButton from '../components/generic/RatingButton';

const ALBUM_ART_PLACEHOLDER = 'https://www.samuelattard.com/img/gpm_placeholder.jpg';

const INITIAL_STATE = {
  loading: true,
  stopped: true,
  playing: false,
  thumbsUp: false,
  thumbsDown: false,
  hasTrack: false,
  artist: undefined,
  album: undefined,
  track: undefined,
  albumArt: ALBUM_ART_PLACEHOLDER,
  albumArtWidth: 0,
};

function goToPreviousTrack() {
  Emitter.fireAtGoogle('playback:previousTrack');
}

function togglePlay() {
  Emitter.fireAtGoogle('playback:playPause');
}

function goToNextTrack() {
  Emitter.fireAtGoogle('playback:nextTrack');
}

function toggleThumbsUp() {
  Emitter.fireAtGoogle('playback:toggleThumbsUp');
}

function toggleThumbsDown() {
  Emitter.fireAtGoogle('playback:toggleThumbsDown');
}

function showFullWindow() {
  Emitter.fireAtAll('micro:showMainWindow');
}

function getAlbumArtUrl(track) {
  let url;

  if (track && track.albumArt) {
    // YouTube Music will initially use its own URL as the album art,
    // and since that's not an image URL, a "broken" image is shown
    // (https://github.com/gmusic-utils/ytmusic.js/issues/13).
    // Work around this by ignoring the album art if it starts with the
    // YouTube Music URL so that we use the placeholder image instead.
    if (!track.albumArt.startsWith('https://music.youtube.com/')) {
      url = track.albumArt;
    }
  }

  return url || ALBUM_ART_PLACEHOLDER;
}

export default class MicroPlayer extends Component {
  constructor(...args) {
    super(...args);

    /** @type [string, Function][] */
    this._listeners = [];

    this.state = Object.assign({}, INITIAL_STATE);

    this._albumArtElement = undefined;

    this._updateAlbumArtWidth = () => {
      if (this._albumArtElement) {
        // Make the album art square by setting the
        // width equal to the element's height.
        this.setState({ albumArtWidth: this._albumArtElement.clientHeight });
      }
    };
  }

  componentDidMount() {
    // Reset everything if the player reloads, which
    // happens when switching between GPM and YTM modes.
    this._listen('app:loading', () => this.setState(INITIAL_STATE));

    this._listen('app:loaded', () => {
      // The album art is hidden while loading, so once
      // the state has been updated, the album art will
      // be visible, and we'll need to update its width.
      this.setState({ loading: false }, () => this._updateAlbumArtWidth());
    });

    this._listen('playback:isPlaying', () => this.setState({ stopped: false, playing: true }));
    this._listen('playback:isPaused', () => this.setState({ stopped: false, playing: false }));
    this._listen('playback:isStopped', () => this.setState({ stopped: true, playing: false }));

    this._listen('PlaybackAPI:change:rating', (event, rating) => {
      this.setState({ thumbsUp: rating.liked, thumbsDown: rating.disliked });
    });

    this._listen('PlaybackAPI:change:track', (event, track) => {
      this.setState({
        hasTrack: !!track,
        artist: (track && track.artist) || undefined,
        album: (track && track.album) || undefined,
        track: (track && track.title) || undefined,
        albumArt: getAlbumArtUrl(track),
      });
    });

    // Listen for changes to the window's size so that we can update
    // the width of the album art to keep that element square. We'll
    // also need to do an initial update of the album art's width.
    window.addEventListener('resize', this._updateAlbumArtWidth);
    this._updateAlbumArtWidth();

    // Emit an event to let the micro player event adapter know
    // that we are ready. The adapter will then send us the some
    // events to get our state in sync with the playback state.
    Emitter.fireAtAll('micro:ready');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateAlbumArtWidth);

    this.listeners.forEach(([event, fn]) => {
      Emitter.off(event, fn);
    });
  }

  _listen(event, listener) {
    Emitter.on(event, listener);
    this._listeners.push([event, listener]);
  }

  render() {
    return (
      <div className="micro-player">
        <div className={`info ${(this.state.hasTrack ? '' : 'no-track')} ${this.state.loading ? 'loading' : ''}`}>
          <div
            className="album-art"
            style={{ width: this.state.albumArtWidth }}
            ref={element => (this._albumArtElement = element)}
          >
            <img src={this.state.albumArt} alt={`${this.state.artist} - ${this.state.track}`} />
          </div>

          <JoinedText
            className="info-group sm"
            text={[this.state.artist, this.state.track]}
            textClassNames={['artist', 'track']}
          />

          <div className="info-group lg">
            <div className="track">{this.state.track}</div>
            <JoinedText
              className="artist-album"
              text={[this.state.artist, this.state.album]}
              textClassNames={['artist', 'album']}
            />
          </div>

          <div className="no-track-message">
            {TranslationProvider.query('micro-no-track-message')}
          </div>

          <div className="loader-container">
            <LoadingSpinner size={4} />
            <div className="loading-label">
              {TranslationProvider.query('micro-loading')}
            </div>
          </div>

          <div className="micro-drag-handle" />
        </div>

        <div className="controls">
          <div>
            <RatingButton
              type="like"
              translationKey="playback-label-thumbs-up"
              checked={this.state.thumbsUp}
              disabled={!this.state.hasTrack}
              onClick={toggleThumbsUp}
            />

            <RatingButton
              type="dislike"
              translationKey="playback-label-thumbs-down"
              checked={this.state.thumbsDown}
              disabled={!this.state.hasTrack}
              onClick={toggleThumbsDown}
            />
          </div>

          <div>
            <button
              onClick={goToPreviousTrack}
              className="previous"
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-previous-track')}
            >
              <i className="material-icons">skip_previous</i>
            </button>

            <button
              onClick={togglePlay}
              className="play-pause"
              disabled={this.state.stopped}
              title={TranslationProvider.query('playback-label-play-pause')}
            >
              <i className="material-icons">{this.state.playing ? 'pause_circle_filled' : 'play_circle_filled'}</i>
            </button>

            <button
              onClick={goToNextTrack}
              className="next"
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-next-track')}
            >
              <i className="material-icons">skip_next</i>
            </button>
          </div>

          <div>
            <button
              onClick={showFullWindow}
              className="show-main-window"
              title={TranslationProvider.query('micro-show-main-window')}
            >
              <i className="material-icons">open_in_new</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
