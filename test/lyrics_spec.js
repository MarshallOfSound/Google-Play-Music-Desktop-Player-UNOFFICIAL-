// Pre-run
import chai from 'chai';

chai.should();

// Mock expected globals
global.PlaybackAPI = {
  on: () => {},
};

// Actual Test Imports
const resolveLyrics = require('../build/main/features/core/lyrics').resolveLyrics;

describe('Lyrics', () => {
  it('should resolve when given a valid song object', (done) => {
    resolveLyrics({
      title: 'Out of the Woods',
      artist: 'Taylor Swift',
      album: '1989',
    })
      .then((lyrics) => {
        lyrics.should.be.a('string');
        done();
      })
      .catch(() => done(new Error('Failed to fetch lyrics in this test')));
  });

  it('should fail when given an invalid song object', (done) => {
    resolveLyrics({
      title: 'Out of the Sticks',
      artist: 'Swiftlor Taytay',
      album: '1782',
    })
      .then((lyrics) => {
        lyrics.should.be.equal(null);
        done();
      })
      .catch(() => done());
  });

  it('should not contain any script tags when resolved', (done) => {
    resolveLyrics({
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      album: 'Whenever You Need Somebody',
    })
      .then((lyrics) => {
        /<script/g.test(lyrics).should.be.equal(false);
        done();
      })
      .catch(() => done(new Error('Failed to fetch lyrics in this test')));
  });
});
