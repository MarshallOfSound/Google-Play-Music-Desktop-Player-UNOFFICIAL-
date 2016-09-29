import { app } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const raven = require('raven');

if (!global.DEV_MODE && process.env.GPMDP_SENTRY_DSN) {
  const client = new raven.Client(process.env.GPMDP_SENTRY_DSN, {
    release: app.getVersion(),
    environment: fs.existsSync(path.resolve(__dirname, '../../../..', 'circle.yml')) ? 'development' : 'production',
    platform: os.platform(),
    platform_version: os.release(),
    arch: os.arch(),
    system_memoty: os.totalmem(),
    extra: {
      settings: (<any>Settings).data,
    },
  });
  if (global.Logger) Logger.info('Starting Sentry');
  client.patchGlobal();
} else {
  process.on('uncaughtException', (error) => {
    if (global.Logger) {
      Logger.error('Uncaught Exception.', error);
    } else {
      // In case an exception was thrown before the logger was initialized.
      console.log('Uncaught Exception: %j', error); // eslint-disable-line
    }
    if (global.DEV_MODE) return;
    Emitter.sendToGooglePlayMusic('error', {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  });
}
