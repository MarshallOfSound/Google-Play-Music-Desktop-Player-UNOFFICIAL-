import gulp from 'gulp';
import globber from 'glob';
import nodePath from 'path';
import fs from 'fs';
import rebuild from 'electron-rebuild';
import header from 'gulp-header';

const packageJSON = require('../../package.json');

let version = packageJSON.devDependencies.electron;
if (version.substr(0, 1) !== '0' && version.substr(0, 1) !== '1' && version.substr(0, 1) !== '2' && version.substr(0, 1) !== '3') {
  version = version.substr(1);
}

export const defaultPackageConf = {
  appBundleId: packageJSON.name,
  appCategoryType: 'public.app-category.music',
  appCopyright: `Copyright © ${(new Date()).getFullYear()} ${packageJSON.author.name}, All rights reserved.`,
  appVersion: packageJSON.version,
  afterCopy: [
    (buildPath, electronVersion, pPlatform, arch, done) =>
      rebuild({
        buildPath, electronVersion, arch,
      }).then(() => done()).catch(done),
    (buildPath, electronVersion, pPlatform, pArch, done) => {
      const files = globber.sync(nodePath.resolve(buildPath, '**', '*.pdb'))
        .concat(globber.sync(nodePath.resolve(buildPath, '**', '*.obj')))
        .concat(globber.sync(nodePath.resolve(buildPath, '**', '.bin', '**', '*')));
      files.forEach(filePath => fs.unlinkSync(filePath));
      done();
    },
  ],
  arch: 'all',
  asar: true,
  buildVersion: packageJSON.version,
  dir: nodePath.join(__dirname, '../../'),
  icon: `${__dirname}/../../build/assets/img/main`,
  ignore: (path) => {
    const tests = [
      // Ignore git directory
      () => /^\/\.git\/.*/g,
      // Ignore uwp directory
      () => /^\/\uwp\/.*/g,
      // Ignore electron-packager on Docker machines
      () => /^\/electron-packager\//g,
      // Ignore electron
      () => /^\/node_modules\/electron\//g,
      () => /^\/node_modules\/electron$/g,
      // Ignore debug files
      () => /^\/node_modules\/.*\.pdb/g,
      // Ignore native module obj files
      () => /^\/node_modules\/.*\.obj/g,
      // Ignore optional dev modules
      () => /^\/node_modules\/appdmg/g,
      () => /^\/node_modules\/electron-installer-debian/g,
      () => /^\/node_modules\/electron-installer-redhat/g,
      // Ignore symlinks in the bin directory
      () => /^\/node_modules\/.bin/g,
      // Ignore root dev FileDescription
      () => /^\/(vendor|dist|sig|docs|src|test|.cert.pfx|.editorconfig|.eslintignore|.eslintrc|.gitignore|.travis.yml|appveyor.yml|circle.yml|CONTRIBUTING.md|Gruntfile.js|gulpfile.js|ISSUE_TEMPLATE.md|LICENSE|README.md)(\/|$)/g, // eslint-disable-line
    ];
    for (let i = 0; i < tests.length; i++) {
      if (tests[i]().test(path)) {
        return true;
      }
    }
    return false;
  },
  name: packageJSON.productName,
  out: './dist/',
  overwrite: true,
  platform: 'all',
  prune: true,
  electronVersion: version,
  win32metadata: {
    CompanyName: packageJSON.author.name,
    FileDescription: packageJSON.productName,
    ProductName: packageJSON.productName,
    InternalName: packageJSON.productName,
  },
};

const headerText =
`/*!
${packageJSON.productName}
Version: v${packageJSON.version}
API Version: v${packageJSON.apiVersion}
Compiled: ${new Date().toUTCString()}
Copyright (C) ${(new Date()).getFullYear()} ${packageJSON.author.name}
This software may be modified and distributed under the terms of the MIT license.
 */
`;

export function buildRelease() {
  return gulp.src('./build/**/*.js')
    .pipe(header(headerText))
    .pipe(gulp.dest('./build'));
}
