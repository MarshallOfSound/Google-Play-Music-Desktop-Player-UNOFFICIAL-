import { app, remote } from 'electron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

const environment = process.env;

export default function (fileName) {
  const DIR = path.resolve(`${(app ? app.getPath('userData') : remote.require('electron').app.getPath('userData'))}/json_store`); // eslint-disable-line

  const PATH = `${DIR}/${fileName}.json`;

  const OLD_DIR = (environment.APPDATA ||
    (process.platform === 'darwin' ? environment.HOME + '/Library/Preferences' : os.homedir())) +
    '/GPMDP_STORE';

  const OLD_PATH = `${OLD_DIR}/${fileName}.json`;

  if (!fs.existsSync(DIR)) {
    mkdirp.sync(DIR);
  }

  if (fs.existsSync(OLD_PATH)) {
    fs.renameSync(OLD_PATH, PATH);
    fs.rmdir(OLD_DIR, () => {});
  }

  return PATH;
}
