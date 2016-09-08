import { remote } from 'electron';

if (remote.getGlobal('DEV_MODE')) {
  try {
    require('devtron').install();
  } catch (e) {
    // Who cares
  }

  window.addEventListener('load', () => {
    const webview = document.querySelector('webview');
    if (!webview) {
      return;
    }
    window.openGPMDevTools = () => {
      webview.openDevTools();
    };
  });
}
