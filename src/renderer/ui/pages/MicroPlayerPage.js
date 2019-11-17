import React, { Component } from 'react';

const ALBUM_ART_PLACEHOLDER = 'https://www.samuelattard.com/img/gpm_placeholder.jpg';

export default class MicroPlayer extends Component {
  constructor(...args) {
    super(...args);

    /** @type [string, Function][] */
    this._listeners = [];

    this.state = {
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
    this._listen('app:loaded', () => {
      this.setState({ loading: false }, () => {
        // The album art is hidden while loading, so once
        // the state has been updated, the album art will
        // be visible, and we'll need to update its width.
        this._updateAlbumArtWidth();
      });
    });

    this._listen('playback:isPlaying', () => {
      this.setState({ stopped: false, playing: true });
    });

    this._listen('playback:isPaused', () => {
      this.setState({ stopped: false, playing: false });
    });

    this._listen('playback:isStopped', () => {
      this.setState({ stopped: true, playing: false });
    });

    this._listen('PlaybackAPI:change:rating', (event, rating) => {
      this.setState({ thumbsUp: rating.liked, thumbsDown: rating.disliked });
    });

    this._listen('PlaybackAPI:change:track', (event, track) => {
      if (track) {
        this.setState({
          hasTrack: true,
          artist: track.artist,
          album: track.album,
          track: track.title,
          albumArt: track.albumArt || ALBUM_ART_PLACEHOLDER,
        });
      } else {
        this.setState({
          hasTrack: false,
          artist: undefined,
          album: undefined,
          track: undefined,
          albumArt: ALBUM_ART_PLACEHOLDER,
        });
      }
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

  goToPreviousTrack() {
    Emitter.fireAtGoogle('playback:previousTrack');
  }

  togglePlay() {
    Emitter.fireAtGoogle('playback:playPause');
  }

  goToNextTrack() {
    Emitter.fireAtGoogle('playback:nextTrack');
  }

  toggleThumbsUp() {
    Emitter.fireAtGoogle('playback:toggleThumbsUp');
  }

  toggleThumbsDown() {
    Emitter.fireAtGoogle('playback:toggleThumbsDown');
  }

  showFullWindow() {
    Emitter.fireAtAll('micro:showMainWindow');
  }

  render() {
    return (
      <div className="micro-player">
        <div className={`info ${(this.state.hasTrack ? '' : 'no-track')} ${this.state.loading ? 'loading' : ''}`}>
          <div
            className="album-art"
            style={{ width: this.state.albumArtWidth }}
            ref={(element) => (this._albumArtElement = element)}
          >
            <img src={this.state.albumArt} role="presentation" />
          </div>

          <div className="info-group sm">
            <span className="artist">{this.state.artist}</span>
            <span className="separator">&nbsp;-&nbsp;</span>
            <span className="track">{this.state.track}</span>
          </div>

          <div className="info-group lg">
            <div className="track">{this.state.track}</div>
            <div className="artist-album">
              <span className="artist">{this.state.artist}</span>
              <span className="separator">&nbsp;-&nbsp;</span>
              <span className="album">{this.state.album}</span>
            </div>
          </div>

          <div className="no-track-message">
            {TranslationProvider.query('micro-no-track-message')}
          </div>

          <div className="loader-container">
            <svg className="circular" viewBox="25 25 50 50">
              <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" />
            </svg>
            <div className="loading-label">
              {TranslationProvider.query('micro-loading')}
            </div>
          </div>

          <div className="micro-drag-handle"></div>
        </div>

        <div className="controls">
          <div>
            <button
              className="like"
              onClick={this.toggleThumbsUp}
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-thumbs-up')}
            >
              {
                /* eslint-disable max-len */

                // "Outline" icons don't exist in the Material Icons font that's
                // used in the other buttons, so we need to use SVGs here.
                this.state.thumbsUp ? (
                  // https://material.io/resources/icons/?icon=thumb_up&style=baseline
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                ) : (
                  // https://material.io/resources/icons/?icon=thumb_up&style=outline
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
                    <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
                  </svg>
                )

                /* eslint-enable max-len */
              }
            </button>

            <button
              className="dislike"
              onClick={this.toggleThumbsDown}
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-thumbs-down')}
            >
              {
                /* eslint-disable max-len */

                // "Outline" icons don't exist in the Material Icons font that's
                // used in the other buttons, so we need to use SVGs here.
                this.state.thumbsDown ? (
                  // https://material.io/resources/icons/?icon=thumb_down&style=baseline
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                  </svg>
                ) : (
                  // https://material.io/resources/icons/?icon=thumb_down&style=outline
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4z" />
                  </svg>
                )

                /* eslint-enable max-len */
              }
            </button>
          </div>

          <div>
            <button
              onClick={this.goToPreviousTrack}
              className="previous"
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-previous-track')}
            >
              <i className="material-icons">skip_previous</i>
            </button>

            <button
              onClick={this.togglePlay}
              className="play-pause"
              disabled={this.state.stopped}
              title={TranslationProvider.query('playback-label-play-pause')}
            >
              <i className="material-icons">{this.state.playing ? 'pause_circle_filled' : 'play_circle_filled'}</i>
            </button>

            <button
              onClick={this.goToNextTrack}
              className="next"
              disabled={!this.state.hasTrack}
              title={TranslationProvider.query('playback-label-next-track')}
            >
              <i className="material-icons">skip_next</i>
            </button>
          </div>

          <div>
            <button
              onClick={this.showFullWindow}
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
