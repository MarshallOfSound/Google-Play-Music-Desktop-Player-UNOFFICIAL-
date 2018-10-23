// Pre-run
import chai from 'chai';
import chaiFs from 'chai-fs';
import fs from 'fs';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

// Actual Test Imports
import jsonCreator from '../../build/main/utils/_jsonCreator';

chai.use(chaiFs);
chai.should();

describe('JSONCreator', () => {
  it('should return a valid path', () => {
    const jsonPath = jsonCreator('test');
    jsonPath.should.be.a('string');
    jsonPath.should.have.extname('.json');
  });

  it('should make the required directory structure', () => {
    const jsonPath = jsonCreator('test');
    path.dirname(jsonPath).should.be.a.directory();
  });

  describe('when an old JSON file exists', () => {
    let jsonPath;

    // Old path var
    const oldPath = (process.env.APPDATA || // eslint-disable-line
      (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : os.homedir())) + // eslint-disable-line
      '/GPMDP_STORE';

    beforeEach(() => {
      mkdirp.sync(oldPath);
      fs.writeFileSync(`${oldPath}/test.json`, JSON.stringify({ test: 123 }), 'utf8');
    });

    afterEach(() => {
      if (jsonPath && fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
      }
    });

    it('should preserve the old file', () => {
      jsonPath = jsonCreator('test');
      jsonPath.should.be.a.file();
    });

    it('should preserve the contents of the old file', () => {
      jsonPath = jsonCreator('test');
      jsonPath.should.have.content('{"test":123}');
    });

    it('should delete the old JSON directory', () => {
      jsonPath = jsonCreator('test');

      fs.existsSync(oldPath).should.be.equal(false);
    });
  });
});
