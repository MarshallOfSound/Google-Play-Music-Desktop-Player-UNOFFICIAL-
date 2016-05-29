import { remote } from 'electron';

const webview = document.querySelector('webview');

if (webview) {
  let once = true;
  const targetPage = Settings.get('lastPage', 'https://play.google.com/music/listen');
  document.body.setAttribute('loading', 'loading');

  webview.addEventListener('did-stop-loading', () => {
    if (once) {
      once = false;
      document.querySelector('webview').executeJavaScript(`window.location = "${targetPage}"`);
      setTimeout(() => {
        document.body.removeAttribute('loading');
      }, 300);
    }
  });

  const savePage = (param) => {
    const url = param.url || param;
    if (!/https?:\/\/play\.google\.com\/music/g.test(url)) return;
    Emitter.fire('settings:set', {
      key: 'lastPage',
      value: url,
    });
  };

  webview.addEventListener('dom-ready', () => {
    setTimeout(() => {
      webview.focus();
      webview.addEventListener('did-navigate', savePage);
      webview.addEventListener('did-navigate-in-page', savePage);

      const focusWebview = () => {
        document.querySelector('webview::shadow object').focus();
      };
      window.addEventListener('beforeunload', () => {
        remote.getCurrentWindow().removeListener('focus', focusWebview);
      });
      remote.getCurrentWindow().on('focus', focusWebview);
    }, 700);
  });
}
