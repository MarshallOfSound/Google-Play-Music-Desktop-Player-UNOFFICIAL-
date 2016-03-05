import './core';
if (process.platform === 'darwin' || process.platform === 'win32') {
  require(`./${process.platform}`);
}
