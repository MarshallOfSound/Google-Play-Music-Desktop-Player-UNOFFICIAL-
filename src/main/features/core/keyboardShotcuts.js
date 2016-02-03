import { globalShortcut } from 'electron';

globalShortcut.register('MediaPreviousTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:previousTrack');
});

globalShortcut.register('MediaPlayPause', () => {
  Emitter.sendToGooglePlayMusic('playback:playPause');
});

globalShortcut.register('MediaNextTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:nextTrack');
});
