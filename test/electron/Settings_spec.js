// Pre-run
import chai from 'chai';
import chaiFs from 'chai-fs';
import fs from 'fs';

// Actual Test Imports
import Settings from '../../build/main/utils/Settings';
import initialSettings from '../../build/main/utils/_initialSettings';

const expect = chai.expect;
chai.use(chaiFs);
chai.should();


describe('Settings', () => {
  let fired;
  let settings;

  beforeEach(() => {
    settings = new Settings('test');
    fired = [];
    global.Emitter = {
      fire: (...args) => fired.push(args),
      sendToAll: () => {},
      sendToGooglePlayMusic: () => {},
    };
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

  it('should fire change functions when a setting key is changed', () => {
    let hookCalled = false;
    settings.onChange('test_key', (newValue) => {
      hookCalled = true;
      newValue.should.be.equal('test_value_2');
      settings.get('test_key', 'null').should.be.equal('test_value_2');
    });
    settings.set('test_key', 'test_value_2');
    hookCalled.should.be.equal(true);
  });

  it('should not fire change function on position key when another key is changed', () => {
    let hookCalled = false;
    settings.onChange('test_key', () => {
      hookCalled = true;
    });
    settings.set('position', 'test_value_2');
    hookCalled.should.be.equal(false);
  });

  it.skip('should retry when loading JSON failed', (done) => {
    const errorCalls = [];
    fs.writeFileSync(settings.PATH, 'BAD_JSON');
    global.Logger = {
      error: (...args) => errorCalls.push(args),
    };
    settings._load();
    setTimeout(() => {
      errorCalls.forEach((errorCall) => {
        errorCall[0].should.be.equal('Failed to load settings JSON file, retrying in 10 milliseconds');
      });
      errorCalls.length.should.be.gt(2);
      fs.writeFileSync(settings.PATH, '{"foo_key":"bar_value"}');
      settings.get('foo_key', 'default').should.be.equal('default');
      setTimeout(() => {
        settings.get('foo_key', 'default').should.be.equal('bar_value');
        done();
      }, 40);
    }, 35);
  });

  it.skip('should eventually stop retrying when loading JSON failed', (done) => {
    const errorCalls = [];
    fs.writeFileSync(settings.PATH, 'BAD_JSON');
    global.Logger = {
      error: (...args) => errorCalls.push(args),
    };
    settings._load();
    setTimeout(() => {
      errorCalls.forEach((errorCall, index) => {
        if (index < errorCalls.length - 2) errorCall[0].should.be.equal('Failed to load settings JSON file, retrying in 10 milliseconds');
        if (index === errorCalls.length - 1) errorCall[0].should.be.equal('Failed to load settings JSON file, giving up and resetting');
      });
      errorCalls.length.should.be.gt(2);
      fs.writeFileSync(settings.PATH, '{"foo_key":"bar_value"}');
      settings.get('foo_key', 'default').should.be.equal('default');
      setTimeout(() => {
        settings.get('foo_key', 'default').should.be.equal('default');
        done();
      }, 40);
    }, 125);
  });

  it('should instantly save when calling _save with force parameter', () => {
    settings.data = {};
    settings.set('foo_key', 'bar_value');
    settings.set('foo_key2', 'bar_value2');
    JSON.parse(fs.readFileSync(settings.PATH), 'utf8').should.not.have.property('foo_key');
    JSON.parse(fs.readFileSync(settings.PATH), 'utf8').should.not.have.property('foo_key2');
    settings._save(true);
    JSON.parse(fs.readFileSync(settings.PATH), 'utf8').should.have.property('foo_key');
    JSON.parse(fs.readFileSync(settings.PATH), 'utf8').should.have.property('foo_key2');
  });

  it('should delete the file when destroying', () => {
    fs.existsSync(settings.PATH).should.be.equal(true);
    settings.destroy();
    fs.existsSync(settings.PATH).should.be.equal(false);
  });

  it('should delete the file and not error when destroying multiple times', () => {
    fs.existsSync(settings.PATH).should.be.equal(true);
    settings.destroy();
    fs.existsSync(settings.PATH).should.be.equal(false);
    settings.destroy();
    fs.existsSync(settings.PATH).should.be.equal(false);
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

    it('should send the set event to the main process when setting a value', () => {
      settings.set('foo', 'bar');
      fired[0][0].should.be.equal('settings:set');
      fired[0][1].should.be.deep.equal({ key: 'foo', value: 'bar' });
    });

    it('should load settings created from other processes each fetch', (done) => {
      const settings2 = new Settings('test');
      settings2.set('test_key', 'test_value');
      setTimeout(() => {
        settings.get('test_key').should.be.equal('test_value');
        done();
      }, 300);
    });

    it('should not delete the file when calling destroy', () => {
      fs.existsSync(settings.PATH).should.be.equal(true);
      settings.destroy();
      fs.existsSync(settings.PATH).should.be.equal(true);
    });
  });

  afterEach(() => {
    if (settings && settings.destroy) {
      settings.destroy();
      settings = null;
    }
  });
});
