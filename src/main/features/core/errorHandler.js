process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', error);
  if (global.DEV_MODE) return;
  Emitter.sendToGooglePlayMusic('error', {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
});
