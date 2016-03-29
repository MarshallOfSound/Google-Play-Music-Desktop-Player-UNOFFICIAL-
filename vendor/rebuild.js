'use strict';

const spawn = require('child_process').spawn;

console.log('Rebuilding native modules for electron'); // eslint-disable-line

let script_name;

switch (process.platform) {
  case 'win32':
    script_name = 'rebuild.bat';
    break;
  case 'darwin':
    script_name = './rebuild_null.sh'
    break;
  default:
    script_name = './rebuild.sh';
    break;
}

module.exports = (override_name) =>
  new Promise((resolve, reject) => {
    const build = spawn(override_name || script_name, {
      cwd: __dirname,
    });

    build.stdout.on('data', (data) => {
      console.log(data.toString()); // eslint-disable-line
    });

    build.stderr.on('data', (data) => {
      console.error(data.toString()); // eslint-disable-line
    });

    build.on('exit', () => {
      console.log('Rebuild complete');  // eslint-disable-line
      resolve();
    });

    build.on('error', (err) => {
      console.error(err.toString()); // eslint-disable-line
    });
  });

process.argv.forEach((arg) => {
  if (arg === '--instant') {
    module.exports();
  }
});
