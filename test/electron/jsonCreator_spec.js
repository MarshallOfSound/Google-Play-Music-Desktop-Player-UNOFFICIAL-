// Pre-run
import chai from 'chai';
import chaiFs from 'chai-fs';
import fs from 'fs';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

chai.use(chaiFs);
chai.should();

// Actual Test Imports
import jsonCreator from '../../build/main/utils/_jsonCreator';

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
    // Old path var
    const oldPath = (process.env.APPDATA || // eslint-disable-line
      (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : os.homedir())) + // eslint-disable-line
      '/GPMDP_STORE';

    beforeEach(() => {
      mkdirp.sync(oldPath);
      fs.writeFileSync(`${oldPath}/test.json`, JSON.stringify({ test: 123 }), 'utf8');
    });

    it('should preserve the old file', () => {
      const jsonPath = jsonCreator('test');
      jsonPath.should.be.a.file();
    });

    it('should preserve the contents of the old file', () => {
      const jsonPath = jsonCreator('test');
      jsonPath.should.have.content('{"test":123}');
    });

    it('should delete the old JSON directory', () => {
      jsonCreator('test');

      fs.existsSync(oldPath).should.be.equal(false);
    });
  });
});
