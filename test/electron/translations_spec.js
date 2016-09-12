// Pre-run
import { app } from 'electron';
import chai from 'chai';
import chaiFs from 'chai-fs';
import fs from 'fs';
import path from 'path';

// Actual Test Imports
import TranslationProvider from '../../build/_locales/_provider';

chai.use(chaiFs);
chai.should();

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

  it('should default to en-US if the current locale does not exist', () => {
    const _getLocale = app.getLocale;
    app.getLocale = () => 'zb-FQ';
    provider = new TranslationProvider();
    provider.t.should.be.deep.equal(provider._t);
    app.getLocale = _getLocale;
  });


  const files = fs.readdirSync(path.resolve('./src/_locales'));
  const baseKeys = Object.keys(JSON.parse(fs.readFileSync(path.resolve('./src/_locales/en-US.json'), 'utf8')));

  files.forEach((file) => {
    if (/.*\.json$/gi.test(file)) {
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

        it('shouldn\'t have extra translation keys compared to en-US', () => {
          const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          Object.keys(locale).forEach((key) => {
            baseKeys.should.contain(key);
          });
        });
      });
    }
  });
});
