import _ from 'lodash';
import gulp from 'gulp';
import packager from 'electron-packager';
import { spawn } from 'child_process';
import { defaultPackageConf, buildRelease } from './common';
import { cleanDistLinux32, cleanDistLinux64 } from '../clean';
const packageJSON = require('../../package.json');

function _packageLinux(arch) {
  if (process.env.GPMDP_SKIP_PACKAGE) return () => {};
  return packager(_.extend({}, defaultPackageConf, { platform: 'linux', arch }));
}

const generateGulpLinuxDistroTask = (prefix, name, arch) => {
  const fn = (done) => {
    const tool = require(`electron-installer-${name}`);

    const defaults = {
      bin: packageJSON.productName,
      dest: `dist/installers/${name}`,
      depends: ['libappindicator1', 'avahi-daemon'],
      maintainer: `${packageJSON.author.name} <${packageJSON.author.email}>`,
      homepage: packageJSON.homepage,
      icon: 'build/assets/img/main.png',
      categories: ['AudioVideo', 'Audio'],
      section: 'sound',
    };

    let pkgArch = 'i386';
    if (arch === '64') {
      pkgArch = (prefix === 'rpm' ? 'x86_64' : 'amd64');
    }

    tool(_.extend({}, defaults, {
      src: `dist/${packageJSON.productName}-linux-${arch === '32' ? 'ia32' : 'x64'}`,
      arch: pkgArch,
    }), (err) => {
      console.log(`${arch}bit ${prefix} package built`); // eslint-disable-line
      if (err) return done(err);
      done();
    });
  };
  fn.displayName = `${prefix}Linux${arch}`;
  return fn;
};

const zipTask = (makeName, cwd, what) => {
  const fn = (done) => {
    const child = spawn('zip', ['-r', '-y', 'installers.zip', '.'], { cwd });
    console.log(`Zipping ${what}`); // eslint-disable-line
    child.stdout.on('data', () => {});
    child.stderr.on('data', () => {});
    child.on('close', (code) => {
      console.log(`Finished zipping ${what} with code: ${code}`); // eslint-disable-line
      done();
    });
  };
  fn.displayName = makeName;
  return fn;
};

const packageLinux32 = gulp.series(cleanDistLinux32, buildRelease, _packageLinux('ia32'));
const packageLinux64 = gulp.series(cleanDistLinux64, buildRelease, _packageLinux('amd64'));

const packageLinux = gulp.series(packageLinux32, packageLinux64);

const rpmLinux32 = generateGulpLinuxDistroTask('rpm', 'redhat', '32');
const rpmLinux64 = generateGulpLinuxDistroTask('rpm', 'redhat', '64');
const debLinux32 = generateGulpLinuxDistroTask('deb', 'debian', '32');
const debLinux64 = generateGulpLinuxDistroTask('deb', 'debian', '64');

const rpmLinux = gulp.series(rpmLinux32, rpmLinux64);
const debLinux = gulp.series(debLinux32, debLinux64);

const makeLinuxBoth = zipTask('linux:both', './dist/installers', 'all the Linux Installers');
const _makeLinuxDeb = zipTask('linux:deb', './dist/installers/debian', 'the Debian Packages');
const _makeLinuxRpm = zipTask('linux:rpm', './dist/installers/redhat', 'the Redhat (Fedora) Packages');

const makeLinux = gulp.series(debLinux, rpmLinux, makeLinuxBoth);
const makeLinuxDeb = gulp.series(debLinux, _makeLinuxDeb);
const makeLinuxRpm = gulp.series(rpmLinux, _makeLinuxRpm);

export {
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
