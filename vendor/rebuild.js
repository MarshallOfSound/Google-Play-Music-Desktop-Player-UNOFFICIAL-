const spawn = require('child_process').spawn;

console.log('Rebuilding native modules for electron'); // eslint-disable-line

const build = spawn((process.platform === 'win32' ? 'rebuild.bat' : 'rebuild.sh'), {
  cwd: __dirname,
});

build.stdout.on('data', (data) => {
  console.log(data); // eslint-disable-line
});

build.stderr.on('data', (data) => {
  console.error(data); // eslint-disable-line
});

build.on('exit', () => {
  console.log('Rebuild complete');  // eslint-disable-line
  // Who cares
});
