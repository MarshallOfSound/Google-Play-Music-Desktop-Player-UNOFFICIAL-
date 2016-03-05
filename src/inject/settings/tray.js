$('#min-to-tray').change((e) => {
  Emitter.fire('settings:set', {
    key: 'minToTray',
    value: $(e.currentTarget).is(':checked'),
  });
});

if (Settings.get('minToTray', true)) {
  $('#min-to-tray').attr('checked', 'checked');
} else {
  $('#min-to-tray').removeAttr('checked');
}
