import chai from 'chai';
import fetch from 'node-fetch';
import https from 'https';

chai.should();

describe('Update Server', () => {
  it('should be online', (done) => {
    https.get('https://update.gpmdp.xyz', () => done())
      .on('error', () => done(new Error('Update server was unreachable')));
  });

  it('should return JSON from the api URL', (done) => {
    fetch('https://update.gpmdp.xyz/api/versions')
      .then((resp) => resp.json())
      .then((json) => {
        json.should.be.a('array');
        json.length.should.be.at.least(4); // There should be at lest 4 versions
        done();
      })
      .catch(() => done(new Error('Failed to access the update server API')));
  });
});
