import os from 'os';

if (process.platform === 'win32' && os.release().startsWith('10.')) {
  try {
    require('./win10');
  } catch (err) {
    // Ignore, we tried
  }
}
