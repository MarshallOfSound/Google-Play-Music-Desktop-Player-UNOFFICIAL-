$('#playback-api').change((e) => {
  Emitter.fire('playbackapi:toggle', { state: $(e.currentTarget).is(':checked') });
});

if (Settings.get('playbackAPI', false)) {
  $('#playback-api').attr('checked', true);
} else {
  $('#playback-api').removeAttr('checked');
}
