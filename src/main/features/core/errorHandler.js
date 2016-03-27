process.on('uncaughtException', (error) => {
  if (Logger) {
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
