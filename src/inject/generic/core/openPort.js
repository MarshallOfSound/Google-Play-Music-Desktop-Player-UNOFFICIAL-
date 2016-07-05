Emitter.on('openport:request', () => {
  $('#confirmOpenPort').openModal({
    dismissible: false,
  });
  $('#confirmOpenPortButton').one('click', () => {
    Emitter.fire('openport:confirm');
  });
});
