import fs from 'fs';
import mkdirp from 'mkdirp';

const os = require('os');
const environment = process.env;

// Resolve config directory

let DIR;
switch (process.platform) {
  case 'linux':
    DIR = os.homedir() + '/.GPMDP_STORE';
    break;
  case 'darwin':
    DIR = environment.HOME + '/Library/Preferences/GPMDP_STORE'
    break;
  default:
    DIR = environment.APPDATA + '/GPMDP_STORE';
}

if (!fs.existsSync(DIR)) {
  mkdirp(DIR);
}

export default DIR;
