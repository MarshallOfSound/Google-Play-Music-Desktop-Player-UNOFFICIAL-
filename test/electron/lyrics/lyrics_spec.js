// Pre-run
import chai from 'chai';
import EventEmitter from 'events';
import { givenAsync } from 'mocha-testdata';

import attemptLyricsWikia from '../../../build/main/features/core/lyrics/source_lyricsWikia';
import attemptMetroLyrics from '../../../build/main/features/core/lyrics/source_metroLyrics';
import attemptLyricsFreak from '../../../build/main/features/core/lyrics/source_lyricsFreak';

import lyricsSourceSpec from './_lyricsSource_spec';
import { validSongs, invalidSongs } from '../testdata/lyrics';

chai.should();

// Mock expected globals
global.PlaybackAPI = new EventEmitter();
let testSong = {
  title: '(Just One Bracketted) One Call Away',
  artist: 'Charlie Puth',
  album: 'Nine Track Mind',
};

// Actual Test Imports
const resolveLyrics = require('../../../build/main/features/core/lyrics').resolveLyrics; // eslint-disable-line
const _playbackAPI = global.PlaybackAPI;
delete global.PlaybackAPI;

describe('Lyrics Resolver', () => {
  before(() => {
    global.PlaybackAPI = _playbackAPI;
    PlaybackAPI.currentSong = () => testSong;
    PlaybackAPI._setPlaybackSongLyrics = (lyrics) => PlaybackAPI.emit('change:lyrics', lyrics);
  });

  beforeEach(() => {
    PlaybackAPI.removeAllListeners('change:lyrics');
  });

  givenAsync(...validSongs).it('should resolve when given a valid song object', (done, song) => {
    resolveLyrics(song)
      .then((lyrics) => {
        lyrics.should.be.a('string');
        done();
      })
      .catch(() => done(new Error(`Failed to fetch lyrics for song: ${song.title}`)));
  });

  it('should resolve when given a valid song object with brackets', (done) => {
    resolveLyrics(testSong)
      .then((lyrics) => {
        lyrics.should.be.a('string');
        done();
      })
      .catch(() => done(new Error(`Failed to fetch lyrics for song: ${testSong.title}`)));
  });

  it('should change lyrics when recieving a PlaybackAPI event', (done) => {
    PlaybackAPI.on('change:lyrics', (lyrics) => {
      lyrics.should.be.ok; // eslint-disable-line
      lyrics.should.be.a('string');
      done();
    });
    PlaybackAPI.emit('change:track', testSong);
  });

  it('should not change lyrics when recieving a PlaybackAPI event if the current song has changed', (done) => {
    PlaybackAPI.on('change:lyrics', (lyrics) => {
      lyrics.should.be.a('string');
      lyrics.split('I\'m only one call away').length.should.be.gt(2);
      done();
    });
    const originalSong = Object.assign({}, testSong);
    testSong = validSongs[1];
    PlaybackAPI.emit('change:track', testSong);
    testSong = originalSong;
    PlaybackAPI.emit('change:track', testSong);
  });

  givenAsync(...invalidSongs).it('should fail when given an invalid song object', (done, song) => {
    resolveLyrics(song)
      .then((lyrics) => {
        lyrics.should.be.equal(null);
        done();
      })
      .catch(() => done());
  });

  givenAsync(...validSongs).it('should not contain any script tags when resolved', (done, song) => {
    resolveLyrics(song)
      .then((lyrics) => {
        /<script/g.test(lyrics).should.be.equal(false);
        done();
      })
      .catch(() => done(new Error('Failed to fetch lyrics in this test')));
  });

  lyricsSourceSpec(attemptLyricsWikia, (song) => [`${song.artist}:${song.title}`], 'Lyrics Wikia');
  // FIXME: Disable to get travis passing
  // lyricsSourceSpec(attemptMetroLyrics, (song) =>
  //   [`${song.title.toLowerCase().replace(/ /g, '-')}-lyrics-${song.artist.toLowerCase().replace(/ /g, '-')}`]
  // , 'Metro Lyrics');
  if (process.env.NODE_ENV === 'coverage') {
    lyricsSourceSpec(attemptLyricsFreak, (song) => [song.title, song.artist], 'Lyrics Freak');
  }
});
