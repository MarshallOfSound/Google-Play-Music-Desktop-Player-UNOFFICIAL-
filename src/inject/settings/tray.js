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

$('#show-tray').change((e) => {
  const checked = $(e.currentTarget).is(':checked');
  Emitter.fire('settings:set', {
    key: 'showTray',
    value: checked,
  });

  $('#min-to-tray').attr('disabled', !checked);
  if (!checked) {
    Emitter.fire('settings:set', {
      key: 'minToTray',
      value: false,
    });
  }
});

if (Settings.get('showTray', true)) {
  $('#show-tray').attr('checked', 'checked');
  $('#min-to-tray').removeAttr('disabled');
} else {
  $('#show-tray').removeAttr('checked');
  $('#min-to-tray').attr('disabled', 'disabled');
  Emitter.fire('settings:set', {
    key: 'minToTray',
    value: false,
  });
}
