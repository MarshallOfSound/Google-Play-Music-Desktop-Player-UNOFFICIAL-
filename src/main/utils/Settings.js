import fs from 'fs';
import _ from 'lodash';
import mkdirp from 'mkdirp';
import initalSettings from './initialSettings';

const os = require('os');

const environment = process.env;

class Settings {
  constructor(jsonPrefix, wipeOldData) {
    const DIR = (environment.APPDATA ||
      (process.platform === 'darwin' ? environment.HOME + '/Library/Preferences' : os.homedir())) +
      '/GPMDP_STORE';
    this.PATH = `${DIR}/${(jsonPrefix || '')}.settings.json`;
    this.data = initalSettings;
    this.lastSync = 0;

    if (fs.existsSync(this.PATH) && !wipeOldData) {
      this._load();
    } else {
      mkdirp.sync(DIR);
      this._save(true);
    }
    this.coupled = true;
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

  set(key, value) {
    if (this.coupled) {
      this.data[key] = value;
      this._save();
    }
  }

  _load() {
    const userSettings = JSON.parse(fs.readFileSync(this.PATH, 'utf8'));
    this.data = _.extend({}, initalSettings, userSettings);
  }

  _save(force) {
    const now = (new Date).getTime();
    // During some save events (like resize) we need to queue the disk writes
    // so that we don't blast the disk every millisecond
    if ((now - this.lastSync > 250 || force)) {
      fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 4));
    } else {
      if (this.saving) clearTimeout(this.saving);
      this.saving = setTimeout(this._save.bind(this), 275);
    }
    this.lastSync = now;
  }
}

export default Settings;
