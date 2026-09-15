// Stop Alt+Space on Windows
if (process.platform === 'win32') {
  window.addEventListener('keydown', (e) => {
    if (document.activeElement.value === undefined && e.altKey && e.which === 32) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}
