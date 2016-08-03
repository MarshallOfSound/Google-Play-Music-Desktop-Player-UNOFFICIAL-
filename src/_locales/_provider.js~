import { app, remote } from 'electron';
import fs from 'fs';
import path from 'path';

const eApp = app || remote.app;

const localeLinks = {
  'en-029': 'en-US',
  'en-AU': 'en-US',
  'en-BZ': 'en-US',
  'en-CA': 'en-US',
  'en-GB': 'en-US',
  'en-IE': 'en-US',
  'en-IN': 'en-US',
  'en-JM': 'en-US',
  'en-MY': 'en-US',
  'en-NZ': 'en-US',
  'en-PH': 'en-US',
  'en-SG': 'en-US',
  'en-TT': 'en-US',
  'en-ZA': 'en-US',
  'en-ZW': 'en-US',
};

export default class TranslationProvider {
  constructor(customLocale) {
    let locale = eApp.getLocale();
    const _tPath = path.resolve(`${__dirname}/en-US.json`);
    locale = customLocale || localeLinks[locale] || locale || 'en-US';
    let localePath = path.resolve(`${__dirname}/${locale}.json`);
    if (!fs.existsSync(localePath)) {
      localePath = _tPath;
    }

    this._t = JSON.parse(fs.readFileSync(_tPath, 'utf8'));
    this.t = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  }

  query(key) {
    return this.t[key] || this._t[key] || TranslationProvider.UNKNOWN;
  }
}

TranslationProvider.UNKNOWN = 'No Translation Key Found';
