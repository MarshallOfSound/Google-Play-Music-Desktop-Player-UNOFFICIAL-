import { remote } from 'electron';

const parseURL = (url) => {
  if (url === 'DEV_MODE') {
    const ok = confirm('You have instructed GPMDP to start in Dev Mode the next ' + // eslint-disable-line
            'time it launches.  Please be careful and only continue if you know ' +
            'what you are doing or have been told what to do by a project maintainer.');
    if (!ok) return;
    Emitter.fire('settings:set', {
      key: 'START_IN_DEV_MODE',
      value: true,
    });
    // Give Settings time to flush to the FS
    setTimeout(() => {
      remote.app.quit();
    }, 500);
  } else if (url === 'DEBUG_INFO') {
    Emitter.fire('generateDebugInfo');
  }
  if (!/https:\/\/play\.google\.com\/music\/listen/g.test(url)) return;
  document.querySelector('webview').executeJavaScript(`window.location = "${url}"`);
};

window.addEventListener('load', () => {
  if (!window.$) return;

  const modal = $('#goToURL');
  const URLInput = modal.find('input');
  const URLButton = modal.find('a');

  Emitter.on('gotourl', () => {
    modal.openModal({
      dismissible: true,
    });
    URLInput.focus();
  });

  URLButton.click(() => {
    parseURL(URLInput.val());
  });

  URLInput.on('keydown', (e) => {
    if (e.which !== 13) return;
    modal.closeModal();
    parseURL(URLInput.val());
  });
});
