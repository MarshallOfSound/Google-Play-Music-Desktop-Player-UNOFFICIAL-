$('#auto-launch').change((e) => {
  Emitter.fire('settings:set', {
    key: 'auto-launch',
    value: $(e.currentTarget).is(':checked'),
  });
});

if (Settings.get('auto-launch', false)) {
  $('#auto-launch').attr('checked', 'cheked');
} else {
  $('#auto-launch').removeAttr('checked');
}
