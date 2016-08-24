import Emitter from 'events';

let idCounter = 0;

class MockWebContents extends Emitter {
  constructor(...args) {
    super(...args);
    this.recieved = [];
    this.mockLoading = false;
  }

  send(event, ...args) {
    this.recieved.push({
      event,
      args,
    });
  }

  isLoading() {
    return this.mockLoading;
  }
}

export default class MockIPCWindow {
  constructor() {
    this.id = idCounter++;
    this.webContents = new MockWebContents();
  }

  get recieved() {
    return this.webContents.recieved;
  }

  set mockLoading(newValue) {
    this.webContents.mockLoading = newValue;
    if (!newValue) {
      this.webContents.emit('did-stop-loading');
    }
  }
}
