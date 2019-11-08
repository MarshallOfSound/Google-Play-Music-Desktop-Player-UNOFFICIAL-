import { app, remote } from 'electron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

const environment = process.env;

export default function (fileName) {
  const targetFileName = process.windowsStore ? `${fileName}-uwp` : fileName;
  const DIR = path.resolve(`${(app ? app.getPath('userData') : remote.require('electron').app.getPath('userData'))}/json_store`); // eslint-disable-line

  const PATH = `${DIR}/${targetFileName}.json`;

  const OLD_DIR = (environment.APPDATA || // eslint-disable-line
    (process.platform === 'darwin' ? environment.HOME + '/Library/Preferences' : os.homedir())) + // eslint-disable-line
    '/GPMDP_STORE';

  const OLD_PATH = `${OLD_DIR}/${targetFileName}.json`;

  if (!fs.existsSync(DIR)) {
    mkdirp.sync(DIR);
  }

  if (fs.existsSync(OLD_PATH)) {
    // Move old to new if new does not exist
    if (!fs.existsSync(PATH)) {
      fs.renameSync(OLD_PATH, PATH);
    }
    // Delete old dir if it is empty
    if (fs.readdirSync(OLD_DIR).length === 0) {
      fs.rmdirSync(OLD_DIR);
    }
  }

  return PATH;
}
