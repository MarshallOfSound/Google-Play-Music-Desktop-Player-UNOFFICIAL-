import dbus from 'dbus-next';

function registerBindings(desktopEnv, session) {
  const listener = (err, iface) => {
    if (!err) {
      iface.on('MediaPlayerKeyPressed', (n, keyName) => {
        switch (keyName) {
          case 'Next': Emitter.sendToGooglePlayMusic('playback:nextTrack'); return;
          case 'Previous': Emitter.sendToGooglePlayMusic('playback:previousTrack'); return;
          case 'Play': Emitter.sendToGooglePlayMusic('playback:playPause'); return;
          case 'Stop': Emitter.sendToGooglePlayMusic('playback:stop'); return;
          default: return;
        }
      });
      iface.GrabMediaPlayerKeys('GPMDP', 0); // eslint-disable-line
    }
  };

  session.getInterface(`org.${desktopEnv}.SettingsDaemon`, `/org/${desktopEnv}/SettingsDaemon/MediaKeys`, `org.${desktopEnv}.SettingsDaemon.MediaKeys`, listener);
  session.getInterface(`org.${desktopEnv}.SettingsDaemon.MediaKeys`, `/org/${desktopEnv}/SettingsDaemon/MediaKeys`, `org.${desktopEnv}.SettingsDaemon.MediaKeys`, listener);
}

try {
  const session = dbus.sessionBus();
  registerBindings('gnome', session);
  registerBindings('mate', session);
} catch (e) {
  // do nothing.
}
