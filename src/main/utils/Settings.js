import fs from 'fs';
import _ from 'lodash';
import initalSettings from './_initialSettings';
import createJSON from './_jsonCreator';

class Settings {
  constructor(jsonPrefix, wipeOldData) {
    this.PATH = createJSON(`${jsonPrefix || ''}.settings`);
    this.data = Object.assign({}, initalSettings);
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

  get(key, defaultValue = null) {
    if (!this.coupled) {
      this._load();
    }
    return typeof this.data[key] === 'undefined' ? defaultValue : this.data[key];
  }

  onChange(key, fn) {
    this._hooks[key] = this._hooks[key] || [];
    this._hooks[key].push(fn);
  }

  offChange(key, fn) {
    this._hooks[key] = this._hooks[key] || [];
    this._hooks[key] = this._hooks[key].filter((tFn) => tFn !== fn);
  }

  set(key, value) {
    if (this.coupled) {
      const valChanged = this.data[key] !== value;
      this.data[key] = value;
      if (this._hooks[key] && valChanged) {
        this._hooks[key].forEach((hookFn) => hookFn(value));
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

  _load(retryCount = 5) {
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

  _save(force) {
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
    fs.unlinkSync(this.PATH);
  }
}

export default Settings;
