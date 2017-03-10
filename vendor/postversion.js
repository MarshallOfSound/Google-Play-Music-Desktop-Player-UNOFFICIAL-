const fs = require('fs');
const path = require('path');

const snapPath = path.resolve(__dirname, '../snapcraft.yaml');
const snap = fs.readFileSync(snapPath, 'utf8');

const packageJSON = require(path.resolve(__dirname, '../package.json'));

fs.writeFileSync(snapPath, snap.replace(/version: '[0-9]+.[0-9]+.[0-9]+'/g, `version: '${packageJSON.version}'`));
