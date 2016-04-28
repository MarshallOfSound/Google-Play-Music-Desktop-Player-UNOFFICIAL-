window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.which === 70) {
    document.querySelector('.top.material-one-google input').focus();
  }
}, false);
