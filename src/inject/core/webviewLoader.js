import { remote } from 'electron';

const webview = document.querySelector('webview');

if (webview) {
  let once = true;
  webview.addEventListener('did-start-loading', () => {
    if (once) {
      once = false;
      webview.src = Settings.get('lastPage', 'https://play.google.com/music/listen');
      document.body.setAttribute('loading', 'loading');
    }
  });

  const savePage = (url) => {
    Emitter.fire('settings:set', {
      key: 'lastPage',
      value: url.url,
    });
  };

  webview.addEventListener('dom-ready', () => {
    setTimeout(() => {
      document.body.removeAttribute('loading');
      webview.focus();
      webview.addEventListener('did-navigate', savePage);
      webview.addEventListener('did-navigate-in-page', savePage);

      window.addEventListener('beforeunload', () => {
        remote.getCurrentWindow().removeAllListeners();
      });
      remote.getCurrentWindow().on('focus', () => {
        webview.focus();
      });
    }, 400);
  });
}
