// F == Search
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.which === 70) {
    document.querySelector('.top.material-one-google input').focus();
  }
}, false);

// Command + (1,2,3,4,5...) = Side Nav
if (process.platform === 'darwin') {
  window.addEventListener('keydown', (e) => {
    if (document.activeElement.value === undefined && e.metaKey && e.which >= 49 && e.which <= 54) {
      const index = e.which - 49;
      const navLinks = document.querySelectorAll('#nav a');
      if (index < navLinks.length) {
        navLinks[index].click();
      }
    }
  }, true);
}
