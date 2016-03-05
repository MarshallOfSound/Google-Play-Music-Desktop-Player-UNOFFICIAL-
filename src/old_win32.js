// This file is quite hacky, silly and overall quite dumb...
// But it needs to be here to handle the upgrade process from the old GPMDP
import { exec } from 'child_process';

if (process.platform === 'win32') {
  exec('wmic product where Vendor="MarshallOfSound" get PackageCache /format:value', (err, out) => {
    const MSIPath = out.replace(/(?:\r\n|\r|\n)/g, '').replace('PackageCache=', '');
    if (MSIPath.split('.msi').length > 1) {
      Emitter.once('uninstall:confirm', () => {
        exec(`msiexec /uninstall ${MSIPath}`);
      });
      Emitter.sendToWindowsOfName('main', 'uninstall:request');
    }
  });
}
