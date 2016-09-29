import * as $ from 'jquery';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { requireSettings } from './SettingsProvider';

const { PropTypes } = React;

class LyricsViewer extends React.Component<GPMDP.UI.ThemedComponentProps, { visible: boolean }> {
  lyricsHandler: (event: Event, lyrics: string) => void;
  stateHandler: (event: Event, isPlaying: boolean) => void;
  timeHandler: (event: Event, newTime: GPMDP.TrackTime) => void;
  scrollSettingsHandler: (event: Event, shouldScroll: boolean) => void;
  startAnimating: () => void;

  static propTypes = {
    theme: PropTypes.bool.isRequired,
    themeColor: PropTypes.string.isRequired,
    themeType: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      visible: false,
    };
  }

  // I hate this so much
  // But I also don't know how to do this with React so meh
  // TODO: Clean this rubbish up
  componentDidMount() {
    let animate = false;
    let animationTimer;
    let noLyricsTimer;
    let jumpDetect;
    let isPlaying = false;

    // Handle new lyrics strings
    this.lyricsHandler = (e: Event, lyrics: string) => {
      if (!lyrics) {
        $(findDOMNode(this)).find('#lyrics').html('<h1><span is="translation-key">lyrics-loading-message</span></h1>');
        $(findDOMNode(this)).find('#lyrics p').stop();
        animate = false;
        clearTimeout(noLyricsTimer);
        noLyricsTimer = setTimeout(() => {
          $(findDOMNode(this)).find('#lyrics').html('<h1><span is="translation-key">lyrics-failed-message</span></h1>');
        }, 4000);
      } else {
        clearTimeout(noLyricsTimer);
        const scroll = Settings.get('scrollLyrics', true);
        const lyricsHTML = lyrics.replace(/\n/g, '<br />');
        $(findDOMNode(this)).find('#lyrics').html(`<p ${scroll ? 'data-scroll' : ''}>${lyricsHTML}</p>`);
        animate = scroll;
      }
    };
    // Handle playing and pausing
    this.stateHandler = (e: Event, remoteIsPlaying: boolean) => {
      isPlaying = remoteIsPlaying;
      if (!isPlaying) return $(findDOMNode(this)).find('#lyrics p').stop();
      animate = Settings.get('scrollLyrics', true);
    };
    // Handle time progression of a song
    this.timeHandler = (e: Event, timeObj: GPMDP.TrackTime) => {
      $(findDOMNode(this)).find('#lyrics_bar').width(`${(timeObj.total === 0 ? 0 : timeObj.current / timeObj.total) * 100}%`);
      let jumped = false;
      if (Math.abs(timeObj.current - jumpDetect) > 1000 && $(findDOMNode(this)).find('#lyrics p').attr('data-scroll')) {
        animate = true;
        jumped = true;
      }

      jumpDetect = timeObj.current;
      if (!isPlaying || !animate || !timeObj.total || !$(findDOMNode(this)).find('#lyrics p').get(0)) return;
      const lyricsP = $(findDOMNode(this)).find('#lyrics p');
      const maxHeight = parseInt(lyricsP.get(0).scrollHeight.toString(), 10);
      const viewPortHeight = parseInt(lyricsP.innerHeight().toString(), 10);
      const waitTime = (viewPortHeight / maxHeight) * timeObj.total * 0.3;
      const actualWaitTime = Math.max(0, waitTime - timeObj.current);
      clearTimeout(animationTimer);
      if (jumped) {
        lyricsP.stop();
        lyricsP.scrollTop(maxHeight * (Math.max(0, timeObj.current - actualWaitTime) / timeObj.total));
      }
      animationTimer = setTimeout(() => {
        lyricsP.stop().animate({
          scrollTop: maxHeight - viewPortHeight,
        }, timeObj.total - timeObj.current - actualWaitTime - waitTime, 'linear');
      }, actualWaitTime);
      animate = false;
    };

    this.scrollSettingsHandler = (e: Event, state: boolean) => {
      const lyricsP = $(findDOMNode(this)).find('#lyrics p');
      animate = state;
      if (state) {
        lyricsP.attr('data-scroll', 'on');
      } else {
        lyricsP.removeAttr('data-scroll');
        clearTimeout(animationTimer);
        lyricsP.stop();
      }
    };

    this.startAnimating = () => {
      animate = true;
    };

    this._hook();
  }

  componentWillUnmount() {
    this._unhook();
  }

  _hook() {
    Emitter.on('lyrics:show', this.show);
    Emitter.on('PlaybackAPI:change:lyrics', this.lyricsHandler);
    Emitter.on('PlaybackAPI:change:state', this.stateHandler);
    Emitter.on('PlaybackAPI:change:time', this.timeHandler);
    Emitter.on('settings:set:scrollLyrics', this.scrollSettingsHandler);

    window.addEventListener('resize', this.startAnimating);
  }

  _unhook() {
    Emitter.off('lyrics:show', this.show);
    Emitter.off('PlaybackAPI:change:lyrics', this.lyricsHandler);
    Emitter.off('PlaybackAPI:change:state', this.stateHandler);
    Emitter.off('PlaybackAPI:change:time', this.timeHandler);
    Emitter.off('settings:set:scrollLyrics', this.scrollSettingsHandler);

    window.removeEventListener('resize', this.startAnimating);
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  show = () => {
    this.setState({
      visible: true,
    });
  }

  render() {
    const barStyle: {
      backgroundColor?: string;
    } = {};
    const progressStyle: {
      backgroundColor?: string;
    } = {};
    if (this.props.theme) {
      if (this.props.themeType === 'FULL') {
        progressStyle.backgroundColor = this.props.themeColor;
      } else {
        barStyle.backgroundColor = this.props.themeColor;
        progressStyle.backgroundColor = '#222326';
      }
    }
    return (
      <div id="lyrics_back" className={this.state.visible ? 'vis' : ''} onClick={this.hide}>
        <div id="lyrics_container">
          <div id="lyrics">
            <h1>
              {TranslationProvider.query('lyrics-no-song-message')}
            </h1>
          </div>
          <div id="shadow"></div>
        </div>
        <div id="lyrics_progress" style={progressStyle}>
          <div id="lyrics_bar" className="lyrics-progress" style={barStyle}></div>
        </div>
      </div>
    );
  }
}

export default requireSettings(LyricsViewer, ['theme', 'themeColor', 'themeType']);
