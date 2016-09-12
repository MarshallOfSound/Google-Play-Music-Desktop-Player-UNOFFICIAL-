import { app } from 'electron';
import os from 'os';
import raven from 'raven';

if (process.env.GPMDP_SENTRY_DSN) {
  const client = new raven.Client(process.env.GPMDP_SENTRY_DSN, {
    release: app.getVersion(),
    environment: global.DEV_MODE ? 'development' : 'production',
    platform: os.platform(),
    platform_version: os.release(),
    arch: os.arch(),
    system_memoty: os.totalmem(),
    extra: {
      settings: Settings.data,
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
