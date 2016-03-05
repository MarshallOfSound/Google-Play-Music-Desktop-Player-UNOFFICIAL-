const webview = document.querySelector('webview');

if (webview) {
  let once = true;
  webview.addEventListener('did-start-loading', () => {
    if (once) {
      once = false;
      document.body.setAttribute('loading', 'loading');
    }
  });

  webview.addEventListener('dom-ready', () => {
    setTimeout(() => {
      document.body.removeAttribute('loading');
    }, 400);
  });
}
