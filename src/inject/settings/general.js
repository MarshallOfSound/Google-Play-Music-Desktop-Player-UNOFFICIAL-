$('#playback-api').change((e) => {
  Emitter.fire('playbackapi:toggle', { state: $(e.currentTarget).is(':checked') });
});

if (Settings.get('playbackAPI', false)) {
  $('#playback-api').attr('checked', true);
} else {
  $('#playback-api').removeAttr('checked');
}

$('#voice-controls').change((e) => {
  Emitter.fire('settings:set', {
    key: 'speechRecognition',
    value: $(e.currentTarget).is(':checked'),
  });
});

if (Settings.get('speechRecognition', false)) {
  $('#voice-controls').attr('checked', true);
} else {
  $('#voice-controls').removeAttr('checked');
}
