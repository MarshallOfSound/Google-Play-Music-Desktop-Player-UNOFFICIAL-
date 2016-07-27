// Pre-run
import chai from 'chai';
import chaiFs from 'chai-fs';

// Actual Test Imports
import Settings from '../../build/main/utils/Settings';
import initialSettings from '../../build/main/utils/_initialSettings';

const expect = chai.expect;
chai.use(chaiFs);
chai.should();


describe('Settings', () => {
  let settings;

  beforeEach(() => {
    settings = new Settings('test');
  });

  it('should initialize with default settings', () => {
    settings.data.should.be.deep.equal(initialSettings);
  });

  it('should save a value in the runtime', () => {
    settings.set('test_key', 'test_value');
    settings.get('test_key').should.be.equal('test_value');
  });

  it('should save a value to a file', (done) => {
    settings.set('test_key', 'test_value');

    setTimeout(() => {
      settings = null;
      settings = new Settings('test');
      settings.get('test_key').should.be.equal('test_value');
      done();
    }, 300);
  });

  it('should instantly save to a file with force enabled', () => {
    settings.set('test_key', 'test_value');
    settings._save(true);
    settings = null;
    settings = new Settings('test');
    settings.get('test_key').should.be.equal('test_value');
  });

  describe('when uncoupled', () => {
    beforeEach(() => {
      settings.uncouple();
    });

    it('should NOT save values in the runtime', () => {
      settings.set('test_key', 'test_value');
      expect(settings.get('test_key')).to.be.equal(null);
    });

    it('should NOT save a value to a file', (done) => {
      settings.set('test_key', 'test_value');

      setTimeout(() => {
        settings = null;
        settings = new Settings('test');
        settings.uncouple();
        expect(settings.get('test_key')).to.be.equal(null);
        done();
      }, 300);
    });

    it('should load settings created from other processes each fetch', (done) => {
      const settings2 = new Settings('test');
      settings2.set('test_key', 'test_value');
      setTimeout(() => {
        settings.get('test_key').should.be.equal('test_value');
        done();
      }, 300);
    });
  });

  afterEach(() => {
    if (settings && settings.destroy) {
      settings.destroy();
      settings = null;
    }
  });
});
