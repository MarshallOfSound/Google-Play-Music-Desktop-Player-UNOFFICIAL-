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
  const interfaceLegacy = legacy.getInterface(`org.${desktopEnv}.SettingsDaemon.MediaKeys`);
  interfaceLegacy.on('MediaPlayerKeyPressed', listener);
  app.on('browser-window-focus', () => {
    interfaceLegacy.GrabMediaPlayerKeys('GPMDP', 0); // eslint-disable-line
  });

  const future = await session.getProxyObject(`org.${desktopEnv}.SettingsDaemon.MediaKeys`, `/org/${desktopEnv}/SettingsDaemon/MediaKeys`);
  const interfaceFuture = future.getInterface(`org.${desktopEnv}.SettingsDaemon.MediaKeys`);
  interfaceFuture.on('MediaPlayerKeyPressed', listener);
  app.on('browser-window-focus', () => {
    interfaceFuture.GrabMediaPlayerKeys('GPMDP', 0); // eslint-disable-line
  });
}

try {
  const session = dbus.sessionBus();
  registerBindings('gnome', session);
  registerBindings('mate', session);
} catch (e) {
  // Do nothing
}
