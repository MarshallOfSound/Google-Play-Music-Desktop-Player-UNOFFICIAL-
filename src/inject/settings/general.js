$('#playback-api').change((e) => {
  Emitter.fire('playbackapi:toggle', { state: $(e.currentTarget).is(':checked') });
});

if (Settings.get('playbackAPI', false)) {
  $('#playback-api').attr('checked', true);
} else {
  $('#playback-api').removeAttr('checked');
}

const settingsToggle = (elemID, settingsKey, defaultValue = false) => {
  const elem = $(`#${elemID}`);
  elem.change((e) => {
    Emitter.fire('settings:set', {
      key: settingsKey,
      value: $(e.currentTarget).is(':checked'),
    });
  });

  if (defaultValue === null ? Settings.get(settingsKey) : Settings.get(settingsKey, defaultValue)) {
    elem.attr('checked', true);
  } else {
    elem.removeAttr('checked');
  }
};

settingsToggle('json-api', 'enableJSON_API');
settingsToggle('voice-controls', 'speechRecognition');
settingsToggle('native-frame', 'nativeFrame', null);
settingsToggle('save-page', 'savePage', true);
settingsToggle('scroll-lyrics', 'scrollLyrics', true);
settingsToggle('auto-launch', 'auto-launch');
