'use strict'; // eslint-disable-line

const path = require('path');
const rimraf = require('rimraf');
const spawn = require('child_process').spawn;

let scriptName;

switch (process.platform) {
  case 'win32':
    scriptName = 'rebuild.bat';
    break;
  case 'darwin':
    scriptName = './rebuild_null.sh';
    break;
  default:
    scriptName = './rebuild.sh';
    break;
}

let a = 0;

const badYarn = {
  win32: [''],
  darwin: ['dbus', 'll-keyboard-hook-win', 'mouse-forward-back'],
  linux: [''],
};

module.exports = (overrideName) =>
  new Promise((resolve) => {
    // Yarn clean up
    if (badYarn[process.platform]) {
      badYarn[process.platform].forEach(packageName => {
        console.info(`Removing bad module: ${packageName}`);
        rimraf.sync(path.resolve(__dirname, '../node_modules', packageName));
      });
    }
    resolve();
  }).then(() =>
    new Promise((resolve, reject) => {
      console.log('Rebuilding native modules for electron'); // eslint-disable-line
      const build = spawn(overrideName || scriptName, {
        cwd: __dirname,
      });

      build.stdout.on('data', (data) => {
        console.log(data.toString()); // eslint-disable-line
      });

      build.stderr.on('data', (data) => {
        console.error(data.toString()); // eslint-disable-line
      });

      build.on('exit', (code) => {
        if (code === 0) {
          console.log('Rebuild complete');  // eslint-disable-line
          resolve();
        } else {
          console.error('Rebuild failed');
          let retry = false;
          process.argv.forEach((arg) => {
            if (arg === '--retry') {
              retry = true;
            }
          });
          if (retry && a === 0) {
            a++;
            console.info('Retrying in 60 seconds');
            global.tID = setTimeout(() => {
              module.exports();
            }, 60000);
          } else {
            process.exit(1);
            reject();
          }
        }
      });

      build.on('error', (err) => {
        console.error(err.toString()); // eslint-disable-line
      });
    })
  );

process.argv.forEach((arg) => {
  if (arg === '--instant') {
    module.exports();
  }
});
