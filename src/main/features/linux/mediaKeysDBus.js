import DBus from 'dbus';

try {
  const dbus = new DBus();
  const session = dbus.getBus('session');

  session.getInterface('org.gnome.SettingsDaemon', '/org/gnome/SettingsDaemon/MediaKeys',
  'org.gnome.SettingsDaemon.MediaKeys', (err, iface) => {
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
      iface.GrabMediaPlayerKeys(0, 'org.gnome.SettingsDaemon.MediaKeys'); // eslint-disable-line
    }
  });
} catch (e) {
  // do nothing.
}
