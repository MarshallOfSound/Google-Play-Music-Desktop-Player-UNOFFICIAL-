import { app, remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

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
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-BR',
};

export default class TranslationProvider implements GPMDP.ITranslationProvider {
  static UNKNOWN: string = 'No Translation Key Found';

  private t: any;
  private _t: any;

  constructor(customLocale?: string) {
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

  query(key: string): string {
    return this.t[key] || this._t[key] || TranslationProvider.UNKNOWN;
  }
}
