import './goToURL';
import './uninstall';
import './updateAvailable';
import './appDetails';
import './lyrics';

// Anything that requires the DOM needs to go here as of Electron 0.36.6
document.addEventListener('DOMContentLoaded', () => {
  require('./webviewLoader');
  require('./control-bar');
});
