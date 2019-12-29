import React, { Component } from 'react';

import LoadingSpinner from '../components/generic/LoadingSpinner';
import JoinedText from '../components/generic/JoinedText';
import RatingButton from '../components/generic/RatingButton';
import generateTheme from '../utils/theme';

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
  albumArt: null,
  albumArtWidth: 0,
  borderColor: null,
  themeName: '',
  themeColor: '',
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
  if (track && track.albumArt) {
    // YouTube Music will initially use its own URL as the album art,
    // and since that's not an image URL, a "broken" image is shown
    // (https://github.com/gmusic-utils/ytmusic.js/issues/13).
    // Work around this by ignoring the album art if it starts with
    // the YouTube Music URL so that we use the placeholder instead.
    if (!track.albumArt.startsWith('https://music.youtube.com/')) {
      return track.albumArt;
    }
  }

  return null;
}

export default class MicroPlayer extends Component {
  constructor(...args) {
    super(...args);

    /** @type [string, Function][] */
    this._listeners = [];

    // Cache the theme settings. For some reason, if we try to read
    // the settings after receiving a "change" event, sometimes the
    // old settings values are read, which results in the theme in the
    // micro player being out of sync with the rest of the application.
    this.theme = {
      enabled: Settings.get('theme'),
      themeColor: Settings.get('themeColor'),
      themeType: Settings.get('themeType', 'FULL'),
    };

    this.state = Object.assign({}, INITIAL_STATE, this._getThemeState());

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
    this._listen('app:loading', () => this.setState(Object.assign({}, INITIAL_STATE, this._getThemeState())));

    this._listen('app:loaded', () => {
      // The album art is hidden while loading, so once
      // the state has been updated, the album art will
      // be visible, and we'll need to update its width.
      this.setState({ loading: false }, () => this._updateAlbumArtWidth());
    });

    this._listen('playback:isPlaying', () => this.setState({ stopped: false, playing: true }));
    this._listen('playback:isPaused', () => this.setState({ stopped: false, playing: false }));
    this._listen('playback:isStopped', () => this.setState({ stopped: true, playing: false }));

    this._listen('PlaybackAPI:change:rating', (e, rating) => {
      this.setState({ thumbsUp: rating.liked, thumbsDown: rating.disliked });
    });

    this._listen('PlaybackAPI:change:track', (e, track) => {
      this.setState({
        hasTrack: !!track,
        artist: (track && track.artist) || undefined,
        album: (track && track.album) || undefined,
        track: (track && track.title) || undefined,
        albumArt: getAlbumArtUrl(track),
      });
    });

    // Listen for theme changes.
    this._listen('settings:change:theme', (e, data) => this._onThemeChange({ enabled: data }));
    this._listen('settings:change:themeColor', (e, data) => this._onThemeChange({ themeColor: data }));
    this._listen('settings:change:themeType', (e, data) => this._onThemeChange({ themeType: data }));

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

  _onThemeChange(newSettings) {
    this.theme = Object.assign(this.theme, newSettings);
    this.setState(this._getThemeState());
  }

  _getThemeState() {
    let borderColor = '';
    let themeName = '';
    let themeColor = '';

    if (this.theme.enabled) {
      const muiTheme = generateTheme(this.theme.enabled, this.theme.themeColor, this.theme.themeType);
      borderColor = muiTheme.tabs.backgroundColor;
      themeName = (this.theme.themeType === 'FULL') ? 'dark' : 'light';
      themeColor = this.theme.themeColor;
    }

    return { borderColor, themeName, themeColor };
  }

  render() {
    let styles;
    let albumArt;

    // The play/pause button should use the color from the theme, but we
    // can't apply the color directly to the button via a `style` attribute,
    // because when the button is disabled it should be the disabled color.
    // To ensure that occurs, we need to apply the theme color via a CSS class.
    if (this.state.themeColor) {
      styles = (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #micro-player .controls button.play-pause:not([disabled]) {
                color: ${this.state.themeColor};
              }
            `,
          }}
        ></style >
      );
    }

    if (this.state.albumArt) {
      albumArt = <img src={this.state.albumArt} alt={`${this.state.artist} - ${this.state.track}`} />;
    } else {
      /* eslint-disable max-len */
      albumArt = (
        <svg viewBox="0 0 555 556" style={{ fill: this.state.themeColor }}>
          <path d="M206.686 468.569c-13.275-5.416-17.807-34.515-17.916-115.057-.084-61.762 2.84-87.036 11.53-99.666 4.309-6.262 7.035-7.334 18.655-7.334 12.131 0 18.68 1.78 22.897 6.222 8.427 8.879 8.501 9.896 8.138 111.278l-.304 85-2.279 5.635c-4.686 11.59-10.949 14.902-27.981 14.801-5.907-.035-11.64-.43-12.74-.879zm114-.56c-5.709-2.02-11.022-8.12-13.193-15.148-1.685-5.455-1.807-11.844-1.807-94.85 0-82.106.137-89.44 1.759-94.683 2-6.462 5.165-10.673 10.534-14.01 3.382-2.104 4.864-2.306 16.879-2.306 15.927 0 17.005.553 22.578 11.58 4.369 8.645 5.958 16.755 7.922 40.42 2.563 30.878 1.176 115.935-2.259 138.5-1.46 9.589-5.468 22.01-8.391 26-1.41 1.925-3.792 4.042-5.293 4.705-3.876 1.711-23.708 1.568-28.729-.208zm-147.772-19.247c-.87-.963-2.332-4.74-3.25-8.393-1.562-6.225-1.983-6.848-6.677-9.89-4.669-3.025-13.04-12.907-14.797-17.467-.423-1.1-2.328-5.375-4.233-9.5-1.904-4.125-3.768-9.138-4.141-11.14-.453-2.428-1.333-3.811-2.642-4.153-3.033-.793-3.65-3.896-4.398-22.101l-.694-16.894-4.42-5.744c-14.463-18.795-29.672-45.034-31.007-53.49-.79-5.002.256-7.705 7.246-18.73l5.611-8.852-1.608-12.955c-.885-7.126-1.89-13.41-2.234-13.967-.344-.557-2.835-2.132-5.536-3.501-2.702-1.369-5.67-3.647-6.598-5.062-1.489-2.273-1.535-3.178-.393-7.743 2.106-8.415 8.096-23.495 13.374-33.668 18.037-34.768 46.114-61.55 83.686-79.83 29.194-14.202 51.618-19.135 86.983-19.132 30.478.002 49.932 3.336 74 12.686 26.24 10.192 55.958 30.659 73.15 50.378 16.583 19.021 30.695 44.461 36.87 66.469 2.707 9.647 1.95 11.927-5.121 15.41-2.771 1.365-5.433 2.957-5.915 3.538-.482.58-1.641 6.895-2.576 14.031l-1.699 12.976 6.643 10.987c3.653 6.043 6.644 12.147 6.645 13.564.01 8.039-11.145 28.985-26.948 50.606l-8.905 12.183-.71 16.817c-.753 17.836-1.348 20.978-4.169 22.02-2.21.815-3.23 2.27-3.25 4.637-.02 2.57-7.845 20.324-11.087 25.16-2.89 4.309-11.28 12.548-14.577 14.312-1.363.73-2.615 3.308-3.827 7.886-2.37 8.946-3.635 10.302-9.62 10.302-2.632 0-5.068-.458-5.414-1.017-.345-.559.057-5.171.893-10.25 2.6-15.784 3.968-45.638 3.975-86.733.007-41.033-1.508-65.935-4.96-81.5-2.464-11.115-2.494-10.957 2.16-11.298 8.95-.658 11.224 2.157 14.258 17.653l1.684 8.607 7.117 1.365 7.117 1.365 7.383-7.242c4.06-3.983 9.901-9.433 12.978-12.11l5.595-4.87 1.754-16.987 1.754-16.987-5.189-8.173c-26.324-41.462-59.243-69.13-96.509-81.113-34.274-11.02-75.361-10.694-108.578.864-24.224 8.429-41.015 19.43-62.422 40.898-14.713 14.756-19.71 21.024-31.07 38.976l-5.661 8.948 1.758 16.58 1.758 16.582 12.887 12.337c10.5 8.979 7.524 13.368 20.1 10.95l7.214-1.387 2.045-9.98c2.349-11.459 3.6-14.197 7.095-15.526 3.265-1.241 10.088-1.225 10.86.026.333.537-.084 3.299-.927 6.137-4.242 14.282-7.112 60.818-6.173 100.076.857 35.82 2.338 61.36 4.208 72.542.85 5.079 1.262 9.691.916 10.25-1.095 1.772-10.02 1.216-11.782-.733z" />
        </svg>
      );
      /* eslint-enable max-len */
    }

    return (
      <div className={`micro-player ${this.state.themeName}`} style={{ borderColor: this.state.borderColor }}>
        {styles}
        <div className={`info ${(this.state.hasTrack ? '' : 'no-track')} ${this.state.loading ? 'loading' : ''}`}>
          <div
            className="album-art"
            style={{ width: this.state.albumArtWidth }}
            ref={element => (this._albumArtElement = element)}
          >
            {albumArt}
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
