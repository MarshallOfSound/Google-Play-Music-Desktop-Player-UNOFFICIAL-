import gulp from 'gulp';

import _ from 'lodash';
import babel from 'gulp-babel';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import cssmin from 'gulp-cssmin';
import { createWindowsInstaller as electronInstaller } from 'electron-winstaller';
import less from 'gulp-less';
import packager from 'electron-packager';
import rebuild from './vendor/rebuild';
import replace from 'gulp-replace';

import { spawn, exec } from 'child_process';

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
let version = packageJSON.dependencies['electron-prebuilt'];
if (version.substr(0, 1) !== '0') {
  version = version.substr(1);
}

const defaultPackageConf = {
  dir: '.',
  name: packageJSON.productName,
  'build-version': packageJSON.version,
  version,
  platform: 'all',
  arch: 'all',
  'app-bundle-id': packageJSON.name,
  'app-version': packageJSON.version,
  icon: './build/assets/img/main',
  out: './dist/',
  overwrite: true,
  prune: true,
  ignore: /^(?!.*node_modules).*\/(vendor|dist|sig|docs|src|.cert.pfx|.eslintignore|.eslintrc|.gitignore|.travis.yml|appveyor.yml|circle.yml|Gruntfile.js|gulpfile.js|ISSUE_TEMPLATE.md|LICENSE|README.md)(\/|$)/g, // eslint-disable-line
  'version-string': {
    CompanyName: packageJSON.author.name,
    LegalCopyright: `Copyright © ${(new Date()).getFullYear()} ${packageJSON.author.name}, All rights reserved.`, // eslint-disable-line
    FileDescription: packageJSON.productName,
    ProductName: packageJSON.productName,
    InternalName: packageJSON.productName,
  },
};

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
  // DEV: After initial 3.0.0 release this should be uncommented
  // TODO: Read DEV above ^^
  remoteReleases: 'https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-',
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
gulp.task('clean-dist-linux', cleanGlob([
  `./dist/${packageJSON.productName}-linux-ia32`,
  `./dist/${packageJSON.productName}-linux-x64`,
]));
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
    .pipe(babel())
    .on('error', (err) => { console.error(err); }) // eslint-disable-line
    .pipe(replace(/process\.env\.(.+)\;/gi, (envCall, envKey) => {
      return `'${process.env[envKey]}'`;
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('fonts', ['clean-fonts'], () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/assets/fonts'));
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
  console.log('Rebuilding ll-keyboard-hook-win'); // eslint-disable-line
  rebuild('rebuild_ia32.bat')
    .then(() => {
      packager(_.extend({}, defaultPackageConf, { platform: 'win32', arch: 'ia32' }), () => {
        setTimeout(() => {
          exec(`vendor\\signtool sign /f ".cert.pfx" /p ${process.env.SIGN_CERT_PASS} /fd sha1 /tr "http://timestamp.geotrust.com/tsa" /v /as "dist/${packageJSON.productName}-win32-ia32/${packageJSON.productName}.exe"`, {}, () => {
            exec(`vendor\\signtool sign /f ".cert.pfx" /p ${process.env.SIGN_CERT_PASS} /fd sha256 /tr "http://timestamp.geotrust.com/tsa" /v /as "dist/${packageJSON.productName}-win32-ia32/${packageJSON.productName}.exe"`, {}, () => {
              done();
            });
          });
        }, 1000);
      });
    });
});

gulp.task('make:win', ['package:win'], (done) => {
  electronInstaller(winstallerConfig)
    .then(() => {
      exec(`vendor\\signtool sign /f ".cert.pfx" /p ${process.env.SIGN_CERT_PASS} /fd sha1 /tr "http://timestamp.geotrust.com/tsa" /v /as "dist/win32/${packageJSON.productName}Setup.exe"`, {}, () => {
        exec(`vendor\\signtool sign /f ".cert.pfx" /p ${process.env.SIGN_CERT_PASS} /fd sha256 /tr "http://timestamp.geotrust.com/tsa" /v /as "dist/win32/${packageJSON.productName}Setup.exe"`, {}, () => {
          done();
        });
      });
    });
});

gulp.task('package:darwin', ['clean-dist-darwin', 'build'], (done) => {
  packager(_.extend({}, defaultPackageConf, { platform: 'darwin', sign: 'Developer ID Application: Samuel Attard (S7WPQ45ZU2)' }), done); // eslint-disable-line
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

gulp.task('package:linux', ['clean-dist-linux', 'build'], (done) => {
  rebuild('./rebuild.sh')
  .then(() => {
    packager(_.extend({}, defaultPackageConf, { platform: 'linux', arch: 'x64' }), () => {
      rebuild('./rebuild_ia32.sh')
      .then(() => {
        packager(_.extend({}, defaultPackageConf, { platform: 'linux', arch: 'ia32' }), done);
      });
    });
  });
});

gulp.task('deb:linux', ['package:linux'], (done) => {
  const debian = require('electron-installer-debian');

  const defaults = {
    bin: packageJSON.productName,
    dest: 'dist/installers/debian',
    depends: ['libappindicator1'],
    maintainer: 'Samuel Attard <samuel.r.attard@gmail.com>',
    homepage: 'http://www.googleplaymusicdesktopplayer.com',
    icon: 'build/assets/img/main.png',
    categories: ['AudioVideo', 'Audio'],
  };

  debian(_.extend({}, defaults, {
    src: `dist/${packageJSON.productName}-linux-ia32`,
    arch: 'i386',
  }), (err) => {
    console.log('32bit deb package built');
    if (err) return done(err);

    debian(_.extend({}, defaults, {
      src: `dist/${packageJSON.productName}-linux-x64`,
      arch: 'amd64',
    }), (err2) => {
      console.log('64bit deb package built');
      if (err2) return done(err2);
      done();
    });
  });
});

gulp.task('rpm:linux', ['package:linux'], (done) => {
  const redhat = require('electron-installer-redhat');

  const defaults = {
    bin: packageJSON.productName,
    dest: 'dist/installers/fedora',
    depends: ['libappindicator1'],
    maintainer: 'Samuel Attard <samuel.r.attard@gmail.com>',
    homepage: 'http://www.googleplaymusicdesktopplayer.com',
    icon: 'build/assets/img/main.png',
    categories: ['AudioVideo', 'Audio'],
  };

  redhat(_.extend({}, defaults, {
    src: `dist/${packageJSON.productName}-linux-ia32`,
    arch: 'i386',
  }), (err) => {
    console.log('32bit rpm package built');
    if (err) return done(err);

    redhat(_.extend({}, defaults, {
      src: `dist/${packageJSON.productName}-linux-x64`,
      arch: 'amd64',
    }), (err2) => {
      console.log('64bit rpm package built');
      if (err2) return done(err2);
      done();
    });
  });
});

gulp.task('make:linux', ['deb:linux', 'rpm:linux'], (done) => {
  // Zip Linux x86
  const child = spawn('zip', ['-r', '-y',
    `installers.zip`,
    `.`],
    {
      cwd: `./dist/installers`,
    });

  console.log(`Zipping the linux Installers`); // eslint-disable-line

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

gulp.task('make:deb', ['deb:linux'], (done) => {
  // Zip Linux x86
  const child = spawn('zip', ['-r', '-y',
    `installers.zip`,
    `.`],
    {
      cwd: `./dist/installers/debian`,
    });

  console.log(`Zipping the linux Installers`); // eslint-disable-line

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

gulp.task('make:rpm', ['rpm:linux'], (done) => {
  // Zip Linux x86
  const child = spawn('zip', ['-r', '-y',
    `installers.zip`,
    `.`],
    {
      cwd: `./dist/installers/fedora`,
    });

  console.log(`Zipping the RPM Installers`); // eslint-disable-line

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
gulp.task('package', ['package:win', 'package:darwin', 'package:linux']);
