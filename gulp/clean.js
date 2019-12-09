import del from 'del';

const packageJSON = require('../package.json');

const cleanGlob = (taskName, glob, allowSkip) => {
  const fn = () => {
    if (allowSkip && process.env.GPMDP_SKIP_PACKAGE) return;
    return del(glob);
  };
  fn.displayName = taskName;
  return fn;
};


export const clean = cleanGlob('clean', ['./build', './dist']);
export const cleanDistWin = cleanGlob('cleanDistWin', `./dist/${packageJSON.productName}-win32-ia32`);
export const cleanDistDarwin = cleanGlob('cleanDistDarwin', `./dist/${packageJSON.productName}-darwin-ia32`);
export const cleanDistLinux32 = cleanGlob('cleanDistLinux32', `./dist/${packageJSON.productName}-linux-ia32`, true);
export const cleanDistLinux64 = cleanGlob('cleanDistLinux64', `./dist/${packageJSON.productName}-linux-x64`, true);
export const cleanHtml = cleanGlob('cleanHtml', './build/public_html');
export const cleanInternal = cleanGlob('cleanInternal', ['./build/*.js', './build/**/*.js', '!./build/assets/**/*']);
export const cleanFonts = cleanGlob('cleanFonts', './build/assets/fonts');
export const cleanLess = cleanGlob('cleanLess', './build/assets/css');
export const cleanImages = cleanGlob('cleanImages', './build/assets/img');
export const cleanLocales = cleanGlob('cleanLocales', './build/_locales/*.json');
