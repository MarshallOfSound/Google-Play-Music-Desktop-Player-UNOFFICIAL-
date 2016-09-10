'use strict';

const fs = require('fs');
const request = require('request');
const path = require('path');

console.log('Uploading ZIP coverage file'); // eslint-disable-line

const req = request.post('https://coverage.gpmdp.xyz/submit', (err) => {
  if (err) {
    console.log('Upload failed with error!'); // eslint-disable-line
    console.log(err); // eslint-disable-line
  } else {
    console.log('Upload sucessfull');  // eslint-disable-line
  }
});

const form = req.form();
form.append('zip', fs.createReadStream(path.resolve(`${__dirname}/../coverage.zip`))); // eslint-disable-line
form.append('key', process.env.COVERAGE_ARTIFACT_KEY || '');

let branch = process.env.TRAVIS_BRANCH;
if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  branch = `PR_${process.env.TRAVIS_PULL_REQUEST}`;
}

form.append('branch', branch);
