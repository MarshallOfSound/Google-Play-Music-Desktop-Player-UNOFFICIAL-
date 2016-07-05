// Pre-run
import chai from 'chai';
import chaiFs from 'chai-fs';
import fs from 'fs';
import path from 'path';

chai.use(chaiFs);
chai.should();

// Actual Test Imports
import TranslationProvider from '../../build/_locales/_provider';

describe('Translations', () => {
  let provider;

  beforeEach(() => {
    provider = new TranslationProvider();
  });

  it('should resolve a translation key to a string', () => {
    provider.query('label-about').should.be.a('string');
  });

  it('should resolve a valid translation key to a non-default string', () => {
    provider.query('label-about').should.not.be.equal(TranslationProvider.UNKNOWN);
  });

  it('should resolve a invalid translation key to the default string', () => {
    provider.query('label-magical-unicorn').should.be.equal(TranslationProvider.UNKNOWN);
  });


  const files = fs.readdirSync(path.resolve('./src/_locales'));
  const isJSON = /.*\.json$/gi;
  const baseKeys = Object.keys(JSON.parse(fs.readFileSync(path.resolve('./src/_locales/en-US.json'), 'utf8')));

  files.forEach((file) => {
    if (isJSON.test(file)) {
      const filePath = path.resolve(`./src/_locales/${file}`);

      describe(file, () => {
        it('should be valid JSON', () => {
          filePath.should.be.a.file().with.json; // eslint-disable-line
        });

        it('should have the same translation keys as en-US', () => {
          const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          baseKeys.forEach((key) => {
            locale.should.have.property(key);
          });
        });
      });
    }
  });
});
