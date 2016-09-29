// This file is quite hacky, silly and overall quite dumb...
// But it needs to be here to handle the upgrade process from the old GPMDP
import { exec } from 'child_process';

if (process.platform === 'win32' && !Settings.get('checkedForOldVersion', false)) {
  exec('wmic product where Vendor="MarshallOfSound" get PackageCache /format:value', (err, out) => {
    Settings.set('checkedForOldVersion', true);
    const MSIPath = out.replace(/(?:\r\n|\r|\n)/g, '').replace('PackageCache=', '');
    if (MSIPath.split('.msi').length > 1) {
      Emitter.once('uninstall:confirm', () => {
        exec(`msiexec /uninstall ${MSIPath}`);
      });
      Emitter.sendToWindowsOfName('main', 'uninstall:request');
    }
  });
}
