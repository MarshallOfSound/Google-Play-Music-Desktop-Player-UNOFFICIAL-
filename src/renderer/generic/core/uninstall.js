Emitter.on('uninstall:request', () => {
  $('#confirmUninstall').openModal({
    dismissible: false,
    complete: () => {
      Emitter.fire('uninstall:confirm');
    },
  });
});
