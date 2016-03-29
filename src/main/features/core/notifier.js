import { app } from 'electron';
import path from 'path';
// import _ from 'underscore';

function notifyService() {
  var count = 1;
  var process = require('process'); 
  const notifier = require('node-notifier');
  // const mainWindow = WindowManager.getAll('main')[0];
  // let _songInfo = {};
  // notifier.on('click', function (notifierObject, options) {
  //   mainWindow.show();
  // });

  PlaybackAPI.on('change:song', (newSong) => {
    var http = require('https');
    var fs = require('fs');

    var filename = path.resolve(app.getPath('temp'), process.pid + "_" + count + '_GPMDP_CurrAlbumArt.jpg');
    count += 1;
    var file = fs.createWriteStream(filename);
    var request = http.get(newSong.albumArt, function(response) {
      response.pipe(file);
      notifier.notify({
        title: newSong.title,
        urgency: "low",
        message: newSong.artist + " - " + newSong.album,
        icon: filename,
        sound: false,
        wait: false
      }, function (err, response) {
        fs.unlink(filename);
      });
    });
  });

  // PlaybackAPI.on('change:time', (time) => {
  // });

  // PlaybackAPI.on('change:state', (playbackState) => {
  //   //notify on pause?
  // });
}

notifyService();