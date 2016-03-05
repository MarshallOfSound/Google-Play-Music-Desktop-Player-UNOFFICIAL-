let appdir;

if (process.env.APPDATA) {
  appdir = process.env.APPDATA + '/GPMDP_STORE';
} else {
  switch (process.platform) {
    case 'darwin':
      appdir = process.env.HOME + '/Library/Preferences/GPMDP_STORE';
      break;
    case 'linux':
      appdir = process.env.HOME + '/.GPMDP_STORE';
      break;
    default:
      appdir = '/var/local/GPMDP_STORE';
  }
}

export default appdir;
