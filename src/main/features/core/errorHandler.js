import { app, crashReporter } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import raven from 'raven';

if (!global.DEV_MODE && process.env.GPMDP_SENTRY_DSN !== 'undefined') {
  const client = new raven.Client(process.env.GPMDP_SENTRY_DSN, {
    release: app.getVersion(),
    environment: fs.existsSync(path.resolve(__dirname, '../../../..', 'circle.yml')) ? 'development' : 'production',
    platform: os.platform(),
    platform_version: os.release(),
    arch: os.arch(),
    system_memoty: os.totalmem(),
    extra: {
      settings: Settings.data,
    },
  });
  console.info('Starting Sentry'); // eslint-disable-line
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

crashReporter.start({
  productName: 'GPMDP',
  companyName: 'gpmdp',
  submitURL: 'https://gpmdp.sp.backtrace.io:6098/post?format=minidump&token=029c3dfba8cc89d09a7a8a5dd42d32eb27371fefe80525edcc8ff0efebff40cd',
  uploadToServer: true,
});
