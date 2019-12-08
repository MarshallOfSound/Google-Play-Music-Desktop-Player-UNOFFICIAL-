import { exec } from 'child_process';
import gulp from 'gulp';
import packager from 'electron-packager';
import electronInstaller from 'gpmdp-electron-winstaller';
import electronWindowsStore from 'electron-windows-store';
import fs from 'fs';
import nodePath from 'path';
import { buildRelease, defaultPackageConf } from './common';
import { cleanDistWin } from '../clean';

const packageJSON = require('../../package.json');


const winstallerConfig = {
  appDirectory: `dist/${packageJSON.productName}-win32-ia32`,
  outputDirectory: 'dist/installers/win32',
  authors: packageJSON.author.name,
  exe: `${packageJSON.productName}.exe`,
  description: packageJSON.productName,
  title: packageJSON.productName,
  owners: packageJSON.author.name,
  name: 'GPMDP_3',
  noMsi: true,
  certificateFile: '.cert.pfx',
  certificatePassword: process.env.SIGN_CERT_PASS,
  // DEV: When in master we should change this to point to github raw url
  iconUrl: 'https://www.samuelattard.com/img/gpmdp_setup.ico',
  setupIcon: 'build/assets/img/main.ico',
  loadingGif: 'build/assets/img/installing.gif',
};

if (!process.env.GPMDP_DONT_BUILD_DELTAS) {
  winstallerConfig.remoteReleases = 'https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-';
}

if (process.env.APPVEYOR) {
  delete winstallerConfig.remoteReleases;
}

function windowsSignFile(filePath, signDigest) {
  return new Promise((resolve) => {
    console.log(`Signing file: "${filePath}"\nWith digest: ${signDigest}`);
    exec(
    `vendor\\signtool sign /f ".cert.pfx" /p ${process.env.SIGN_CERT_PASS} /td ${signDigest} /fd ${signDigest} /tr "http://timestamp.digicert.com" /v /as "${filePath}"`, {},
      () => {
        setTimeout(() => {
          setTimeout(resolve, 500);
        });
      }
    );
  });
}

// gulp.task('package:win', gulp.series('clean-dist-win', 'build-release'), (done) => {
function _packageWin(done) {
  packager(_.extend({}, defaultPackageConf, { platform: 'win32', arch: 'ia32' })).then(() => {
    setTimeout(() => {
      const packageExePath = `dist/${packageJSON.productName}-win32-ia32/${packageJSON.productName}.exe`;
      windowsSignFile(packageExePath, 'sha1')
      .then(() => windowsSignFile(packageExePath, 'sha256'))
      .then(() => done());
    }, 1000);
  }).catch((err) => done(err));
}

// gulp.task('make:win', gulp.series('package:win'), (done) => {
function _makeWin(done) {
  electronInstaller(winstallerConfig)
  .then(() => {
    const installerExePath = `dist/installers/win32/${packageJSON.productName}Setup.exe`;
    windowsSignFile(installerExePath, 'sha1')
    .then(() => windowsSignFile(installerExePath, 'sha256'))
    .then(() => done());
  })
  .catch((err) => done(err));
}

// gulp.task('make:win:uwp', gulp.series('package:win'), (done) => {
function _makeWinUwp(done) {
  electronWindowsStore({
    containerVirtualization: false,
    inputDirectory: nodePath.resolve(__dirname, `dist/${packageJSON.productName}-win32-ia32`),
    outputDirectory: nodePath.resolve(__dirname, 'dist/uwp'),
    flatten: true,
    packageVersion: `${packageJSON.version}.0`,
    packageName: 'GPMDP',
    packageDisplayName: 'GPMDP',
    packageDescription: packageJSON.description,
    packageExecutable: `app\\${packageJSON.productName}.exe`,
    publisher: 'CN=E800FCD7-1562-414E-A4AC-F1BA78F4A060',
    publisherDisplayName: 'Samuel Attard',
    assets: 'build\\assets\\img\\assets',
    devCert: nodePath.resolve(__dirname, '.uwp.pfx'),
    signtoolParams: ['/p', process.env.SIGN_CERT_PASS],
    finalSay: () => new Promise((resolve) => {
      const manifestPath = nodePath.resolve(__dirname, 'dist/uwp/pre-appx/appxmanifest.xml');
      const manifest = fs.readFileSync(manifestPath, 'utf8').replace('<Identity Name="GPMDP"', '<Identity Name="24619SamuelAttard.GPMDP"');
      fs.writeFileSync(manifestPath, manifest);
      resolve();
    }),
  }).then(() => done()).catch(done);
}

const packageWin = gulp.series(cleanDistWin, buildRelease, _packageWin);
const makeWin = gulp.series(packageWin, _makeWin);
const makeWinUWP = gulp.series(packageWin, _makeWinUwp);

export {
  packageWin,
  makeWin,
  makeWinUWP,
};
