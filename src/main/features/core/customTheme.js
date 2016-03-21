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

Emitter.on('theme:updateType', (event, newType) => {
  Settings.set('themeType', newType);
  Emitter.sendToGooglePlayMusic('theme:updateType', newType);
  Emitter.sendToAll('theme:updateType', newType);
});
