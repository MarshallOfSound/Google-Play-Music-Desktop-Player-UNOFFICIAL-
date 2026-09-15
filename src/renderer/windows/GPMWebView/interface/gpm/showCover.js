Emitter.on('cover:show', () => {
  const hoverIcon = document.querySelector('#hover-icon');
  if (hoverIcon) {
    hoverIcon.click();
  }
});
