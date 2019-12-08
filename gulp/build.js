import gulp from 'gulp';
import babel from 'gulp-babel';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import gulpless from 'gulp-less';
import cssmin from 'gulp-cssmin';
import rasterImages from '../vendor/svg_raster';

import {
  cleanHtml,
  cleanFonts,
  cleanImages,
  cleanInternal,
  cleanLess,
  cleanLocales,
} from './clean';

import { paths } from './config';

function handleError(err) {
  // Print the plugin that the error came from so that you don't
  // have to go searching through the error message to find it.
  if (err.plugin) {
    console.error(`Error in '${err.plugin}':`); // eslint-disable-line
  }

  console.error(err); // eslint-disable-line

  // We *must* emit 'end', otherwise, when watching, the task
  // will never repeat. Note that this function is not an
  // arrow function so that the correct `this` is used here.
  this.emit('end');
}


// Run clean-html first
function _html() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('./build/public_html'));
}

// clean-internal first
function _transpile() {
  return gulp.src(paths.internalScripts)
  .pipe(babel())
  .on('error', handleError)
  .pipe(
    replace(
      /process\.env\.([a-zA-Z_]+)?( |,|;|\))/gi,
      (envCall, envKey, closer) => `'${process.env[envKey]}'${closer}`
    )
  )
  .pipe(gulp.dest('./build/'));
}

function _locales() {
  return gulp.src(paths.locales)
    .pipe(gulp.dest('./build/_locales'));
}

function _fonts() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/assets/fonts'));
}

function _styles() {
  return gulp.src(paths.less)
    .pipe(gulpless())
    .on('error', handleError)
    .pipe(cssmin())
    .pipe(concat('core.css'))
    .pipe(gulp.dest('./build/assets/css'));
}

function _staticImages() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('./build/assets/img/'));
}

function _images(done) {
  rasterImages(done);
}

export const html = gulp.series(cleanHtml, _html);
export const transpile = gulp.series(cleanInternal, _transpile);
export const locales = gulp.series(cleanLocales, _locales);
export const fonts = gulp.series(cleanFonts, _fonts);
export const less = gulp.series(cleanLess, _styles);
export const staticImages = gulp.series(cleanImages, _staticImages);
export const images = gulp.series(cleanImages, _staticImages, _images);
