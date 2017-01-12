'use strict'; // eslint-disable-line

const fs = require('pn/fs');
const iconGen = require('icon-gen');
const Jimp = require('jimp');
const mkdirp = require('mkdirp');
const path = require('path');
const svg2png = require('svg2png');

const basePath = path.resolve(__dirname, '..', 'src/assets/icons/svg');
const targetPath = path.resolve(__dirname, '..', 'build/assets/img');

mkdirp.sync(basePath);
mkdirp.sync(targetPath);

const fileMappings = {
  vector_logo: [{ name: 'main', width: 1024, height: 1024 }, { name: 'assets/SampleAppx.44x44', width: 44, height: 44 },
                { name: 'assets/SampleAppx.50x50', width: 50, height: 50 }, { name: 'assets/SampleAppx.150x150', width: 150, height: 150 },
                { name: 'assets/SampleAppx.310x310', width: 310, height: 310 }, { name: 'assets/SampleAppx.310x150', width: 310, height: 150 }],
  vector_logo_tray: [{ name: 'main_tray', width: 1024, height: 1024 }, { name: 'main_tray_s', width: 128, height: 128 }],
  vector_logo_tray_transparent: [{ name: 'main_tray_transparent_s', width: 128, height: 128 }],
};

const types = [null, 'playing', 'paused'];

module.exports = (cb) => {
  let i = 0;
  let counter = 0;
  const doIcons = () => {
    i++;
    if (i === 10) {
      const jimpOutFiles = ['main_tray_black_s', 'main_tray_white_s', 'macTemplate@5x', 'macTemplate@2x', 'macTemplate'];

      const done = () => {
        counter++;
        if (counter === (jimpOutFiles.length * 3) + 1) return cb();
      };

      let p = Promise.resolve();
      // Generate ico and icns files
      if (!fs.existsSync(path.resolve(targetPath, 'main.ico'))) {
        p = iconGen(path.resolve(basePath, 'vector_logo.svg'), targetPath, {
          type: 'svg',
          names: {
            ico: 'main',
            icns: 'main',
          },
          modes: ['ico'],
        });
      }
      p.then(() => done());

      types.forEach((type) => {
        const typeTargetPath = type ? path.resolve(targetPath, type) : targetPath;
        let srcJimpFile = path.resolve(targetPath, 'main_tray_transparent_s.png');
        if (type) {
          srcJimpFile = path.resolve(targetPath, type, 'main_tray_transparent_s.png');
        }

        // Generate white and macOS images
        jimpOutFiles.forEach((outFileName) => {
          Jimp.read(srcJimpFile, (err, lenna) => {
            if (err) throw err;
            const brightness = (/black/g.test(outFileName)) ? -1 : 1;
            const image = lenna[/mac/g.test(outFileName) ? 'greyscale' : 'brightness'](/mac/g.test(outFileName) ? undefined : brightness);
            if (/mac/g.test(outFileName)) {
              if (/@2x/g.test(outFileName)) {
                image.resize(38, 38);
              } else if (/@5x/g.test(outFileName)) {
                image.resize(95, 95);
              } else {
                image.resize(19, 19);
              }
            }
            image.write(path.resolve(typeTargetPath, `${outFileName}.png`), done);
          });
        });
      });
    }
  };
  // Generate all dem tray icons
  types.forEach((type) => {
    const typeTargetPath = type ? path.resolve(targetPath, type) : targetPath;
    mkdirp.sync(typeTargetPath);

    Object.keys(fileMappings).forEach((srcFile) => {
      fileMappings[srcFile].forEach((targetFile) => {
        const filePath = path.resolve(basePath, `${srcFile}${type ? `_${type}` : ''}.svg`);
        if (!fs.existsSync(filePath)) return;
        fs.readFile(filePath)
            .then((src) => svg2png(src, { width: targetFile.width, height: targetFile.height }))
            .then(buffer => {
              mkdirp.sync(path.dirname(path.resolve(typeTargetPath, `${targetFile.name}.png`)));
              return fs.writeFile(path.resolve(typeTargetPath, `${targetFile.name}.png`), buffer);
            })
            .then(doIcons.bind(this, type, typeTargetPath))
            .catch(e => console.error(e));
      });
    });
  });
};

if (process.argv.some(arg => arg === '--instant')) {
  module.exports(() => console.log('Generated Images'));
}
