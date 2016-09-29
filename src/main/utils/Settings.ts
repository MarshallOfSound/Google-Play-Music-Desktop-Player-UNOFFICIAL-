import * as fs from 'fs';
import * as _ from 'lodash';
import initalSettings from './_initialSettings';
import createJSON from './_jsonCreator';

class Settings implements GPMDP.ISettings {
  public PATH: string;
  private data: any;
  private lastSync: number;
  private coupled: boolean;
  private _hooks: any;
  private saving: number;

  public __TEST__ = false;

  constructor(jsonPrefix: string = '', wipeOldData: boolean = false) {
    this.PATH = createJSON(`${jsonPrefix}.settings`);
    this.data = _.assign({}, initalSettings);
    this.lastSync = 0;

    if (fs.existsSync(this.PATH) && !wipeOldData) {
      this._load();
    } else {
      this._save(true);
      // DEV: Handle windows users running as admin...
      fs.chmodSync(this.PATH, '777');
    }
    this.coupled = true;

    this._hooks = {};
  }

  uncouple() {
    this.coupled = false;
  }

  get(key: string, defaultValue: any = null) {
    if (!this.coupled) {
      this._load();
    }
    return typeof this.data[key] === 'undefined' ? defaultValue : this.data[key];
  }

  onChange(key: string, fn: (newValue: any, key: string) => void) {
    this._hooks[key] = this._hooks[key] || [];
    this._hooks[key].push(fn);
  }

  set(key: string, value: any) {
    if (this.coupled) {
      const valChanged = this.data[key] !== value;
      this.data[key] = value;
      if (this._hooks[key] && valChanged) {
        this._hooks[key].forEach((hookFn) => hookFn(value, key));
      }
      if (!['position', 'size', 'mini-position', 'mini-size'].includes(key)) {
        Emitter.sendToAll(`settings:change:${key}`, value, key);
        Emitter.sendToGooglePlayMusic(`settings:change:${key}`, value, key);
      }
      this._save();
    } else {
      Emitter.fire('settings:set', {
        key,
        value,
      });
    }
  }

  _load(retryCount: number = 5) {
    let userSettings;
    try {
      userSettings = JSON.parse(fs.readFileSync(this.PATH, 'utf8'));
    } catch (e) {
      if (retryCount > 0) {
        setTimeout(this._load.bind(this, retryCount - 1), 10);
        if (global.Logger) Logger.error('Failed to load settings JSON file, retyring in 10 milliseconds');
        return;
      }
      userSettings = {};
      if (global.Logger) Logger.error('Failed to load settings JSON file, giving up and resetting');
    }
    this.data = _.extend({}, initalSettings, userSettings);
  }

  _save(force: boolean = false) {
    const now = (new Date()).getTime();
    // During some save events (like resize) we need to queue the disk writes
    // so that we don't blast the disk every millisecond
    if ((now - this.lastSync > 250 || force)) {
      if (this.data) {
        try {
          fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
        } catch (e) {
          if (this.saving) clearTimeout(this.saving);
          this.saving = setTimeout(this._save.bind(this), 275);
        }
      }
      if (this.saving) clearTimeout(this.saving);
    } else {
      if (this.saving) clearTimeout(this.saving);
      this.saving = setTimeout(this._save.bind(this), 275);
    }
    this.lastSync = now;
  }

  destroy() {
    this.data = null;
    if (this.coupled && fs.existsSync(this.PATH)) fs.unlinkSync(this.PATH);
  }
}

export default Settings;
