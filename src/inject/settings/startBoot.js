$('#start-on-boot').change((e) => {
  Emitter.fire('settings:set', {
    key: 'startOnBoot',
    value: $(e.currentTarget).is(':checked'),
  });
});

if (Settings.get('startOnBoot', true)) {
  $('#start-on-boot').attr('checked', 'cheked');
} else {
  $('#start-on-boot').removeAttr('checked');
}
