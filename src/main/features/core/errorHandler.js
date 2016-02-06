process.on('uncaughtException', (error) => {
  Emitter.sendToGooglePlayMusic('error', {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
});
