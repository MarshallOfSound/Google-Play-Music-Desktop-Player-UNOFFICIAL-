Emitter.on('theme:updateColor', (event, newColor) => {
  Settings.set('themeColor', newColor);
  Emitter.sendToGooglePlayMusic('theme:updateColor', newColor);
  Emitter.sendToAll('theme:updateColor', newColor);
});

Emitter.on('theme:updateState', (event, state) => {
  Settings.set('theme', state.state);
  Emitter.sendToGooglePlayMusic('theme:updateState', state);
  Emitter.sendToAll('theme:updateState', state);
});
