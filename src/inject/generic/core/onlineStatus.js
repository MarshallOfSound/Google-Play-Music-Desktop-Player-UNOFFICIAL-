window.addEventListener('load', () => {
  if (!navigator.onLine) {
    document.body.classList.add('offline');
  }
});

window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  document.querySelector('webview').reload();
});
