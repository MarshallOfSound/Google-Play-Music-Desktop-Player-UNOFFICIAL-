const spawn = require('child_process').spawn;

console.log('Rebuilding native modules for electron'); // eslint-disable-line

const build = spawn((process.platform === 'win32' ? 'rebuild.bat' : './rebuild.sh'), {
  cwd: __dirname,
});

build.stdout.on('data', (data) => {
  console.log(data.toString()); // eslint-disable-line
});

build.stderr.on('data', (data) => {
  console.error(data.toString()); // eslint-disable-line
});

build.on('exit', () => {
  console.log('Rebuild complete');  // eslint-disable-line
  // Who cares
});

build.on('error', (err) => {
  console.error(err.toString()); // eslint-disable-line
});
