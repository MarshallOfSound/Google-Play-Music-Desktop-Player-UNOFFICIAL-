'use strict';

const fs = require('fs');
const request = require('request');
const path = require('path');

console.log('Uploading ZIP artifact'); // eslint-disable-line

const req = request.post(`http://linux.googleplaymusicdesktopplayer.com/upload/${process.env.TRAVIS_COMMIT}/${process.env.TRAVIS_BUILD_NUMBER}`, (err, resp, body) => {
  if (err) {
    console.log('Upload failed with error!'); // eslint-disable-line
    console.log(err); // eslint-disable-line
  } else {
    console.log('Upload sucessfull');  // eslint-disable-line
    console.log('URL: ' + body);  // eslint-disable-line
  }
});

const form = req.form();
form.append('zip', fs.createReadStream(path.resolve(`${__dirname}/../dist/installers/installers.zip`))); // eslint-disable-line
form.append('key', process.env.LINUX_ARTIFACT_KEY || '');
