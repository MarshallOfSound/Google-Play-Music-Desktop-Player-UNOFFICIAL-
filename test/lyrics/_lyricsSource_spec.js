// Pre-run
import chai from 'chai';
import { givenAsync } from 'mocha-testdata';

chai.should();

// Actual Test Imports
import { validSongs, invalidSongs } from '../testdata/lyrics';

export default (source, format, name) => {
  describe(`with the ${name} Source`, () => {
    givenAsync(...validSongs).it('should resolve when given a valid song object', (done, song) => {
      source(format(song))
        .then((lyrics) => {
          lyrics.should.be.a('string');
          done();
        })
        .catch(() => done(new Error(`Failed to fetch lyrics for song: ${song.title}`)));
    });

    givenAsync(...invalidSongs).it('should fail when given an invalid song object', (done, song) => {
      source(format(song))
        .then((lyrics) => {
          lyrics.should.be.equal(null);
          done();
        })
        .catch(() => done());
    });

    givenAsync(...validSongs).it('should not contain any script tags when resolved', (done, song) => {
      source(format(song))
        .then((lyrics) => {
          /<script/g.test(lyrics).should.be.equal(false);
          done();
        })
        .catch(() => done(new Error('Failed to fetch lyrics in this test')));
    });
  });
};
