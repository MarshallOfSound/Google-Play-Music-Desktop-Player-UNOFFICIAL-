window.addEventListener('load', () => {
  if (!navigator.onLine) {
    document.body.classList.add('offline');
  }
});

window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  // DEV: This is currently fired when resuming from sleep
  //      Disabling this line till we can figure it out

  // document.querySelector('webview').reload();
});
