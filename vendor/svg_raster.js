const fs = require('pn/fs');
const iconConverter = require('image-to-icon-converter');
const Jimp = require('jimp');
const mkdirp = require('mkdirp');
const path = require('path');
const svg2png = require('svg2png');

const basePath = path.resolve(__dirname, '..', 'src/assets/icons/svg');
const targetPath = path.resolve(__dirname, '..', 'build/assets/img');

mkdirp.sync(basePath);
mkdirp.sync(targetPath);

const fileMappings = {
  vector_logo: [{ name: 'main', width: 1024, height: 1024 }],
  vector_logo_tray: [{ name: 'main_tray', width: 1024, height: 1024 }, { name: 'main_tray_s', width: 128, height: 128 }],
  vector_logo_tray_transparent: [{ name: 'main_tray_transparent_s', width: 128, height: 128 }],
};

const types = [null, 'playing', 'paused'];

export default (cb) => {
  let i = 0;
  let counter = 0;
  const doIcons = () => {
    i++;
    if (i === 10) {
      const jimpOutFiles = ['main_tray_white_s', 'macTemplate@5x', 'macTemplate@2x', 'macTemplate'];

      const done = () => {
        counter++;
        if (counter === jimpOutFiles.length + 2) return cb();
      };

      // Generate ico and icns files
      if (!fs.existsSync(path.resolve(targetPath, 'main.icns'))) {
        setTimeout(() => {
          iconConverter.uploadConvertDownload(fs.createReadStream(path.resolve(targetPath, 'main.png')), 'icns')
            .then((result) => {
              result.pipe(fs.createWriteStream(path.resolve(targetPath, 'main.icns')));
              done();
            })
            .then(() => {
              iconConverter.uploadConvertDownload(fs.createReadStream(path.resolve(targetPath, 'main.png')), 'ico')
                .then((result) => {
                  result.pipe(fs.createWriteStream(path.resolve(targetPath, 'main.ico')));
                  done();
                });
            });
        }, 1000);
      }

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
            const image = lenna[/mac/g.test(outFileName) ? 'greyscale' : 'brightness'](/mac/g.test(outFileName) ? undefined : 1);
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
            .then(buffer => fs.writeFile(path.resolve(typeTargetPath, `${targetFile.name}.png`), buffer))
            .then(doIcons.bind(this, type, typeTargetPath))
            .catch(e => console.error(e));
      });
    });
  });
};
