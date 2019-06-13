import dbus from 'dbus-next';
import { app } from 'electron';

async function registerBindings(desktopEnv, session) {
  const listener = (n, keyName) => {
    switch (keyName) {
      case 'Next': Emitter.sendToGooglePlayMusic('playback:nextTrack'); return;
      case 'Previous': Emitter.sendToGooglePlayMusic('playback:previousTrack'); return;
      case 'Play': Emitter.sendToGooglePlayMusic('playback:playPause'); return;
      case 'Stop': Emitter.sendToGooglePlayMusic('playback:stop'); return;
      default: return;
    }
  };

  const legacy = await session.getProxyObject(`org.${desktopEnv}.SettingsDaemon`, `/org/${desktopEnv}/SettingsDaemon/MediaKeys`);
  legacy.getInterface(`org.${desktopEnv}.SettingsDaemon.MediaKeys`);
  legacy.on('MediaPlayerKeyPressed', listener);
  app.on('browser-window-focus', () => {
    legacy.GrabMediaPlayerKeys('GPMDP', 0); // eslint-disable-line
  });

  const future = await session.getProxyObject(`org.${desktopEnv}.SettingsDaemon.MediaKeys`, `/org/${desktopEnv}/SettingsDaemon/MediaKeys`);
  future.getInterface(`org.${desktopEnv}.SettingsDaemon.MediaKeys`);
  future.on('MediaPlayerKeyPressed', listener);
  app.on('browser-window-focus', () => {
    future.GrabMediaPlayerKeys('GPMDP', 0); // eslint-disable-line
  });
}

try {
  const session = dbus.sessionBus();
  registerBindings('gnome', session);
  registerBindings('mate', session);
} catch (e) {
  // Do nothing
}
