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
  constructor() {
    let locale = eApp.getLocale();
    locale = localeLinks[locale] || locale || 'en-US';
    let localePath = path.resolve(`${__dirname}/${locale}.json`);
    if (!fs.existsSync(localePath)) {
      localePath = path.resolve(`${__dirname}/en-US.json`);
    }

    this.t = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  }

  query(key) {
    return this.t[key] || 'No Translation Key Found';
  }
}
