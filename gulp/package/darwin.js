import { spawn } from 'child_process';
import packager from 'electron-packager';
import nodePath from 'path';
import fs from 'fs';
import gulp from 'gulp';
import _ from 'lodash';
import { buildRelease, defaultPackageConf } from './common';

const packageJSON = require('../../package.json');

const appdmgConf = {
  target: `dist/${packageJSON.productName}-darwin-x64/${packageJSON.productName}.dmg`,
  basepath: __dirname,
  specification: {
    title: 'GPMDP',
    icon: `${defaultPackageConf.icon}.icns`,
    background: '../../src/assets/img/dmg.png',
    window: {
      size: {
        width: 600,
        height: 400,
      },
    },
    contents: [
      {
        x: 490, y: 252, type: 'link', path: '/Applications',
      },
      {
        x: 106, y: 252, type: 'file', path: `dist/${packageJSON.productName}-darwin-x64/${packageJSON.productName}.app`,
      },
    ],
  },
};

// gulp.series('clean-dist-darwin', 'build-release')
function _packageDarwin() {
  return packager(_.extend({}, defaultPackageConf, {
    platform: 'darwin',
    osxSign: { identity: 'Developer ID Application: Samuel Attard (S7WPQ45ZU2)' },
  }));
}

// gulp.series('package:darwin')
function _makeDarwin(done) {
  const pathEscapedName = packageJSON.productName.replace(/ /gi, ' ');
  const child = spawn('zip', ['-r', '-y', `${pathEscapedName}.zip`, `${pathEscapedName}.app`],
    {
      cwd: `./dist/${packageJSON.productName}-darwin-x64`,
    });

  console.log(`Zipping "${packageJSON.productName}.app"`); // eslint-disable-line

  child.stdout.on('data', () => {});
  child.stderr.on('data', () => {});
  child.on('close', (code) => {
    console.log('Finished zipping with code ' + code); // eslint-disable-line
    done();
  });
}

// gulp.series('package:darwin')
function _dmgDarwin(done) {
  if (fs.existsSync(nodePath.resolve(__dirname, appdmgConf.target))) {
    fs.unlinkSync(nodePath.resolve(__dirname, appdmgConf.target));
  }
  const dmg = require('appdmg')(appdmgConf);

  dmg.on('finish', () => done());
  dmg.on('error', done);
}

const packageDarwin = gulp.series(buildRelease, _packageDarwin);
const makeDarwin = gulp.series(_packageDarwin, _makeDarwin);
const dmgDarwin = gulp.series(_packageDarwin, _dmgDarwin);

export {
  packageDarwin,
  makeDarwin,
  dmgDarwin,
};
