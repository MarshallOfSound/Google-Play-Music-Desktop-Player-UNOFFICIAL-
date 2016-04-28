const parseURL = (url) => {
  if (!/https\:\/\/play\.google\.com\/music\/listen/g.test(url)) return;
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
