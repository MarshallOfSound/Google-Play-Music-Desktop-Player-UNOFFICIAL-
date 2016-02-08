Emitter.on('update:available', () => {
  $('#confirmUpdate').openModal({
    dismissible: false,
  });
});

window.addEventListener('load', () => {
  $('#confirmUpdateButton').click(() => {
    Emitter.fire('update:trigger');
  });

  $('#waitUpdateButton').click(() => {
    Emitter.fire('update:wait');
  });
});
