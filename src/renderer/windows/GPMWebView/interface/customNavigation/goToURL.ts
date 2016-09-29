Emitter.on('navigate:gotourl', (event, data) => {
  (<any>window).location = data;
});
