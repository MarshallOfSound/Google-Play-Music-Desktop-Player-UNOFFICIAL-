import gulp from 'gulp';

import { images, staticImages, less, fonts, html, locales, transpile } from './gulp/build';
import { packageWin, makeWin, makeWinUWP } from './gulp/package/windows';
import { packageDarwin, makeDarwin, dmgDarwin } from './gulp/package/darwin';
import {
  rpmLinux,
  debLinux,
  packageLinux,
  packageLinux32,
  packageLinux64,
  rpmLinux32,
  rpmLinux64,
  debLinux32,
  debLinux64,
  makeLinux,
  makeLinuxDeb,
  makeLinuxRpm,
} from './gulp/package/linux';
import { watch as watchFiles } from './gulp/watch';
import {
  clean,
  cleanDistWin,
  cleanDistDarwin,
  cleanDistLinux32,
  cleanDistLinux64,
  cleanHtml,
  cleanInternal,
  cleanFonts,
  cleanLess,
  cleanImages,
  cleanLocales,
} from './gulp/clean';

const build = gulp.parallel(transpile, images, less, fonts, html, locales);
build.description = 'Build all the things!';

const watch = gulp.series(build, watchFiles);
watch.description = 'Build and watch for things to rebuild, then rebuild.';

const main = gulp.parallel(watch, transpile, images);

const packageApp = gulp.parallel(packageWin, packageDarwin, packageLinux);

export {
  build,
  watch,
  images,
  staticImages,
  less,
  fonts,
  html,
  locales,
  transpile,
  clean,
  cleanDistWin,
  cleanDistDarwin,
  cleanDistLinux32,
  cleanDistLinux64,
  cleanHtml,
  cleanInternal,
  cleanFonts,
  cleanLess,
  cleanImages,
  cleanLocales,
  packageApp,
  packageWin,
  makeWin,
  makeWinUWP,
  packageDarwin,
  makeDarwin,
  dmgDarwin,
  rpmLinux,
  debLinux,
  packageLinux,
  packageLinux32,
  packageLinux64,
  rpmLinux32,
  rpmLinux64,
  debLinux32,
  debLinux64,
  makeLinux,
  makeLinuxDeb,
  makeLinuxRpm,
};

export default main;
