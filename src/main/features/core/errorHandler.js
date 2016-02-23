process.on('uncaughtException', (error) => {
  console.error(error);
  Emitter.sendToGooglePlayMusic('error', {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
});
