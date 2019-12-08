import gulp from 'gulp';
import { paths } from './config';
import { transpile, html, images, less, locales } from './build';

// Rerun the task when a file changes
export function watch() {
  gulp.watch(paths.internalScripts, transpile);
  gulp.watch(paths.html, html);
  gulp.watch(paths.images, images);
  gulp.watch(paths.less, less);
  gulp.watch(paths.locales, locales);
}
