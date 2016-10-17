/* eslint-disable no-unused-expressions */
// Pre-run
import chai, { expect } from 'chai';
import EventEmitter from 'events';
import fs from 'fs';
import { given, givenAsync } from 'mocha-testdata';

// Actual Test Imports
import PlaybackAPIClass from '../../build/main/utils/PlaybackAPI';

const instantGPMIPCEvents = [
  'change:track',
  'playback:isPlaying',
  'playback:isPaused',
  'playback:isStopped',
  'change:playback-time',
];

const throttledGPMIPCEvents = [
  'change:rating',
  'change:shuffle',
  'change:repeat',
  'change:playlists',
  'change:queue',
  'change:search-results',
  'change:library',
];

const gpmIpcEvents = [].concat(instantGPMIPCEvents).concat(throttledGPMIPCEvents);

const playbackAPIEventMap = {
  'playback:isPlaying': 'change:state',
  'playback:isPaused': 'change:state',
  'playback:isStopped': 'change:state',
  'change:playback-time': 'change:time',
};

const isPublic = (ipcEventName) => {
  switch (ipcEventName) {
    case 'change:playlists':
    case 'change:library':
    case 'change:queue':
    case 'change:search-results':
      return false;
    default:
      return true;
  }
};

let jsonAPIEnabled = false;

chai.should();

describe.only('PlaybackAPI', () => {
  let PlaybackAPI;

  const mockAndGenerate = () => {
    // Test Emitter
    global.Emitter = new EventEmitter();
    Emitter.sendToWindowsOfName = () => {};
    PlaybackAPI = new PlaybackAPIClass('test');
  };

  before(() => {
    // Mock Settings
    global.Settings = {
      get: (key, defaultValue) => {
        switch (key) {
          case 'enableJSON_API':
            return jsonAPIEnabled;
          default:
            return defaultValue;
        }
      },
    };
  });

  beforeEach(mockAndGenerate);

  it('should not store data in a JSON file', () => {
    fs.existsSync(PlaybackAPI.PATH).should.be.false;
  });

  const shouldUpdatePropTest = (propName, propMethodName, expectedNewValue, ...newValueArgs) => {
    it(`should update the ${propName} when setting with ${propMethodName}()`, () => {
      if (newValueArgs.length === 0) {
        newValueArgs = [expectedNewValue]; // eslint-disable-line
      }
      expect(PlaybackAPI[propName](true)).to.be.not.deep.equal(expectedNewValue);
      PlaybackAPI[propMethodName](...newValueArgs);
      PlaybackAPI[propName](true).should.be.deep.equal(expectedNewValue);
    });
  };

  shouldUpdatePropTest('getRating', '_setRating', { liked: true, disliked: false }, '5');
  shouldUpdatePropTest('getRating', '_setRating', { liked: false, disliked: true }, '1');
  shouldUpdatePropTest('getLibrary', '_setLibrary', 'NEW_VALUE');
  shouldUpdatePropTest('isPlaying', '_setPlaying', true);
  shouldUpdatePropTest('currentSong', '_setPlaybackSong', { title: '', artist: '', album: '', albumArt: '' }, '', '', '', '');
  shouldUpdatePropTest('getPlaylists', '_setPlaylists', ['foo', 'bar']);
  shouldUpdatePropTest('getQueue', '_setQueue', ['dumb', 'queue']);
  shouldUpdatePropTest('currentSongLyrics', '_setPlaybackSongLyrics', 'LA LA LA, Epic Lyrics');
  shouldUpdatePropTest('currentShuffle', '_setShuffle', 'NEW_SHUFFLE_MODE');
  shouldUpdatePropTest('currentRepeat', '_setRepeat', 'NEVER BEFORE SEEN REPEAT MODE');
  shouldUpdatePropTest('getResults', '_setResults', 'No results here :)');
  shouldUpdatePropTest('currentTime', '_setTime', { current: 100, total: 200 }, 100, 200);

  describe('when creating a new PlaybackAPI', () => {
    given(gpmIpcEvents).it('should hook into GPM IPC event: ', (ipcEventName) => {
      expect(Emitter._events[ipcEventName]).to.be.ok;
    });

    describe('when recieving events from GPM', () => {
      givenAsync(gpmIpcEvents).it('should proxy GPM IPC events to PlaybackAPI events', (done, ipcEventName) => {
        PlaybackAPI.on(playbackAPIEventMap[ipcEventName] || ipcEventName, (param) => {
          expect(param).to.not.be.equal(undefined);
          expect(typeof param === 'object' || typeof param === 'boolean').to.be.true;
          done();
        });
        Emitter.emit(ipcEventName, {}, { albumArt: '' });
      });
    });
  });

  describe('when the JSON API is enabled', () => {
    before(() => {
      jsonAPIEnabled = true;
    });

    beforeEach(mockAndGenerate);

    it('should store data in a JSON file', () => {
      fs.existsSync(PlaybackAPI.PATH).should.be.true;
      require(PlaybackAPI.PATH).should.be.a('object');
    });

    givenAsync(
      gpmIpcEvents.filter(isPublic)
    ).it('should update the JSON file with each GPM event', (done, ipcEventName) => {
      const originalJSON = JSON.parse(fs.readFileSync(PlaybackAPI.PATH, 'utf8'));
      Emitter.emit(ipcEventName, {}, ipcEventName === 'change:rating' ? '5' : { albumArt: '', current: 100 });
      setTimeout(() => {
        if (ipcEventName !== 'playback:isPaused' && ipcEventName !== 'playback:isStopped') {
          originalJSON.should.not.be.deep.equal(JSON.parse(fs.readFileSync(PlaybackAPI.PATH, 'utf8')));
        }
        done();
      }, 100);
    });

    after(() => {
      jsonAPIEnabled = false;
    });
  });

  after(() => {
    if (fs.existsSync(PlaybackAPI.PATH)) fs.unlinkSync(PlaybackAPI.PATH);
  });
});
