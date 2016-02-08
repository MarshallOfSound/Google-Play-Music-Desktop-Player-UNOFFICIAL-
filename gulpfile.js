const _ = require('lodash');
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const packager = require('electron-packager');
const spawn = require('child_process').spawn;
const replace = require('gulp-replace');

const grunt = require('gulp-grunt');

const paths = {
  internalScripts: ['src/**/*.js'],
  externalScripts: ['node_modules/gmusic.js/dist/gmusic.min.js',
                    'node_modules/gmusic-theme.js/dist/gmusic-theme.min.js',
                    'node_modules/gmusic-mini-player.js/dist/gmusic-mini-player.min.js'],
  utilityScripts: ['node_modules/jquery/dist/jquery.min.js',
                    'node_modules/materialize-css/dist/js/materialize.min.js',
                    'node_modules/materialize-css/extras/noUiSlider/nouislider.min.js'],
  html: 'src/public_html/**/*.html',
  less: 'src/assets/less/**/*.less',
  fonts: ['node_modules/materialize-css/dist/font/**/*',
          '!node_modules/materialize-css/dist/font/material-design-icons/*',
          'node_modules/material-design-icons-iconfont/dist/fonts/**/*'],
  images: ['src/assets/icons/**/*', 'src/assets/img/**/*'],
};

const packageJSON = require('./package.json');
const defaultPackageConf = {
  dir: '.',
  name: packageJSON.productName,
  'build-version': packageJSON.version,
  version: packageJSON.dependencies['electron-prebuilt'].substr(1),
  platform: 'all',
  arch: 'all',
  'app-bundle-id': packageJSON.name,
  'app-version': packageJSON.version,
  icon: './build/assets/img/main',
  out: './dist/',
  overwrite: true,
  prune: true,
  ignore: 'dist/.*',
};

const cleanGlob = (glob) => {
  return () => {
    return gulp.src(glob, { read: false })
      .pipe(clean({ force: true }));
  };
};

gulp.task('clean', cleanGlob(['./build', './dist']));
gulp.task('clean-dist-win', cleanGlob(`./dist/${packageJSON.productName}-win32-ia32`));
gulp.task('clean-dist-darwin', cleanGlob(`./dist/${packageJSON.productName}-darwin-ia32`));
gulp.task('clean-external', cleanGlob('./build/external.js'));
gulp.task('clean-material', cleanGlob('./build/assets/material'));
gulp.task('clean-utility', cleanGlob('./build/assets/util'));
gulp.task('clean-html', cleanGlob('./build/public_html'));
gulp.task('clean-internal', cleanGlob(['./build/*.js', './build/**/*.js', '!./build/assets/**/*']));
gulp.task('clean-fonts', cleanGlob('./build/assets/font'));
gulp.task('clean-less', cleanGlob('./build/assets/css'));
gulp.task('clean-images', cleanGlob('./build/assets/img'));

gulp.task('external', ['clean-external'], () => {
  return gulp.src(paths.externalScripts)
    .pipe(concat('external.js'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('materialize-js', ['clean-material'], () => {
  return gulp.src('node_modules/materialize-css/dist/js/materialize.min.js')
    .pipe(gulp.dest('./build/assets/material'));
});

gulp.task('utility-js', ['clean-utility'], () => {
  return gulp.src(paths.utilityScripts)
    .pipe(gulp.dest('./build/assets/util'));
});

gulp.task('html', ['clean-html'], () => {
  return gulp.src(paths.html)
    .pipe(gulp.dest('./build/public_html'));
});

gulp.task('transpile', ['clean-internal'], () => {
  gulp.src(paths.internalScripts)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .on('error', (err) => { console.error(err); }) // eslint-disable-line
    .pipe(replace(/process\.env\.(.+)\;/gi, (envCall, envKey) => {
      return `'${process.env[envKey]}'`;
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('fonts', ['clean-fonts'], () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/assets/font'));
});

gulp.task('less', ['clean-less'], () => {
  gulp.src(paths.less)
    .pipe(less())
    .on('error', (err) => { console.error(err); }) // eslint-disable-line
    .pipe(cssmin())
    .pipe(concat('core.css'))
    .pipe(gulp.dest('./build/assets/css'));
});

// Copy all static images
gulp.task('images', ['clean-images'], () => {
  return gulp.src(paths.images)
    .pipe(gulp.dest('./build/assets/img/'));
});

// Rerun the task when a file changes
gulp.task('watch', ['build'], () => {
  gulp.watch(paths.internalScripts, ['transpile']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.less, ['less']);
});

gulp.task('package:win', ['clean-dist-win', 'build'], (done) => {
  packager(_.extend({}, defaultPackageConf, { platform: 'win32', arch: 'ia32' }), done);
});

gulp.task('make:win', ['package:win'], (done) => {
  grunt.tasks()['grunt-build:win32'](done);
});

gulp.task('package:darwin', ['clean-dist-darwin', 'build'], (done) => {
  packager(_.extend({}, defaultPackageConf, { platform: 'darwin' }), done);
});

gulp.task('make:darwin', ['package:darwin'], (done) => {
  const pathEscapedName = packageJSON.productName.replace(/ /gi, '\ ');
  const child = spawn('zip', ['-r', '-y',
    `${pathEscapedName}.zip`,
    `${pathEscapedName}.app`],
    {
      cwd: `./dist/${packageJSON.productName}-darwin-x64`,
    });

  console.log(`Zipping "${packageJSON.productName}.app"`); // eslint-disable-line

  // spit stdout to screen
  child.stdout.on('data', (data) => { process.stdout.write(data.toString()); });


  // Send stderr to the main console
  child.stderr.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  child.on('close', (code) => {
    console.log('Finished zipping with code ' + code); // eslint-disable-line
    done();
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'transpile', 'images']);
gulp.task('build', ['external', 'materialize-js', 'utility-js', 'transpile', 'images', 'less',
                    'fonts', 'html']);
gulp.task('package', ['package:win', 'package:darwin']);
