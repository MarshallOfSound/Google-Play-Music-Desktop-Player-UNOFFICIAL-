process.on('uncaughtException', (error) => {
  console.error(error);
  if (global.DEV_MODE) return;
  Emitter.sendToGooglePlayMusic('error', {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
});
