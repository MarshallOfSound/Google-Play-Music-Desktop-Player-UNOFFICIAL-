// Pre-run
import chai from 'chai';
import chaiSinon from 'sinon-chai';
import sinon from 'sinon';
import WebSocket from 'ws';

const expect = chai.expect;

chai.use(chaiSinon);
chai.should();

// Test Classes
import Emitter from '../build/main/utils/Emitter';
import PlaybackAPI from '../build/main/utils/PlaybackAPI';

// Moch the required Settings API
global.Settings = {
  get: (key, def) => {
    if (key === 'playbackAPI') {
      return true;
    }
    return def;
  },
};
global.Emitter = new Emitter();
global.PlaybackAPI = new PlaybackAPI();

describe('WebSocketAPI', () => {
  beforeEach(() => {
    global.PlaybackAPI.reset();
    require('../build/main/features/core/websocketAPI');
  });

  it('should start a WebSocket server on port 5672', (done) => {
    const ws = new WebSocket('ws://localhost:5672');
    ws.on('open', done);
    ws.on('error', () => done(new Error('Failed to connect to the WebSocket')));
  });

  describe('when connected', () => {
    let ws;
    let spy;

    beforeEach(() => {
      ws = new WebSocket('ws://localhost:5672');
      spy = sinon.spy();
    });

    const wait = (fn) =>
      (done) => {
        ws.on('open', () => setTimeout(() => {
          fn(done);
        }, 50));
        ws.on('message', (msg) => spy(JSON.parse(msg)));
      };

    it('should send the player control states on connect', wait((done) => {
      spy.should.have.callCount(6); // eslint-disable-line
      spy.getCall(0).args[0].channel.should.be.equal('playState');
      spy.getCall(1).args[0].channel.should.be.equal('shuffle');
      spy.getCall(2).args[0].channel.should.be.equal('repeat');
      spy.getCall(3).args[0].channel.should.be.equal('song');
      spy.getCall(4).args[0].channel.should.be.equal('time');
      spy.getCall(5).args[0].channel.should.be.equal('lyrics');
      done();
    }));

    it('should send the correct initial player control values', wait((done) => {
      spy.should.have.callCount(6); // eslint-disable-line
      // playState
      spy.getCall(0).args[0].payload.should.be.equal(false);
      // shuffle
      spy.getCall(1).args[0].payload.should.be.equal('NO_SHUFFLE');
      // repeat
      spy.getCall(2).args[0].payload.should.be.equal('NO_REPEAT');
      // song
      spy.getCall(3).args[0].payload.should.have.property('title');
      spy.getCall(3).args[0].payload.should.have.property('artist');
      spy.getCall(3).args[0].payload.should.have.property('album');
      expect(spy.getCall(3).args[0].payload.title).to.be.equal(null);
      expect(spy.getCall(3).args[0].payload.artist).to.be.equal(null);
      expect(spy.getCall(3).args[0].payload.album).to.be.equal(null);
      // time
      spy.getCall(4).args[0].payload.should.have.property('current');
      spy.getCall(4).args[0].payload.should.have.property('total');
      spy.getCall(4).args[0].payload.current.should.be.equal(0);
      spy.getCall(4).args[0].payload.total.should.be.equal(0);
      // lyrics
      expect(spy.getCall(5).args[0].payload).to.be.equal(null);
      done();
    }));

    describe('when PlaybackAPI values change', () => {
      beforeEach((done) => {
        ws.on('open', () => {
          setTimeout(() => {
            spy = sinon.spy();
            done();
          }, 50);
        });
      });

      const waitForResponse = (tests) => {
        setTimeout(tests, 50);
      };

      const shouldUpdateTest = (channel, updateMethodName, newValueArgs, expectedValue) => {
        it(`should update the ${channel} value`, (done) => {
          if (Array.isArray(newValueArgs)) {
            global.PlaybackAPI[updateMethodName](...newValueArgs);
          } else {
            global.PlaybackAPI[updateMethodName](newValueArgs);
          }
          waitForResponse(() => {
            spy.getCall(0).args[0].channel.should.be.equal(channel);
            spy.getCall(0).args[0].payload.should.be.deep.equal(expectedValue || newValueArgs);
            done();
          });
        });
      };

      shouldUpdateTest('playState', '_setPlaying', true);
      shouldUpdateTest('shuffle', '_setShuffle', 'ALL_SHUFFLE');
      shouldUpdateTest('repeat', '_setRepeat', 'SINGLE_REPEAT');
      shouldUpdateTest('song', '_setPlaybackSong',
        ['songTitle', 'songArtist', 'songAlbum', 'songArt'],
        {
          title: 'songTitle',
          artist: 'songArtist',
          album: 'songAlbum',
          albumArt: 'songArt',
        });
      shouldUpdateTest('time', '_setTime', [100, 101], { current: 100, total: 101 });
      shouldUpdateTest('lyrics', '_setPlaybackSongLyrics', 'LA LA LA DOO WOP');
    });
  });
});
