import DBus from 'dbus';

function registerBindings(desktopEnv, session) {
  session.getInterface('org.' + desktopEnv + '.SettingsDaemon', '/org/' + desktopEnv + '/SettingsDaemon/MediaKeys',
  'org.' + desktopEnv + '.SettingsDaemon.MediaKeys', (err, iface) => {
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
      iface.GrabMediaPlayerKeys(0, 'org.' + desktopEnv + '.SettingsDaemon.MediaKeys'); // eslint-disable-line
    }
  });
}

try {
  const dbus = new DBus();
  const session = dbus.getBus('session');
  
  registerBindings('gnome', session);
  registerBindings('mate', session);
} catch (e) {
  // do nothing.
}
