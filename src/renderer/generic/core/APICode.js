Emitter.on('show:code_controller', (event, data) => {
  $('#APICode').find('#APICodeContainer').text(data.authCode);
  $('#APICode').openModal();
});

Emitter.on('hide:code_controller', () => {
  $('#APICode').closeModal();
});
