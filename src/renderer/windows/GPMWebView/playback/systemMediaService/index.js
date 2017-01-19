import os from 'os';

if (process.platform === 'win32' && os.release().startsWith('10.') && Settings.get('enableWin10MediaService')) {
  try {
    require('./win10');
  } catch (err) {
    // Ignore, we tried
  }
}
