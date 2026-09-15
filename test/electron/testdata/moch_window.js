import Emitter from 'events';

let idCounter = 0;

export default class MockWindow extends Emitter {
  constructor(...args) {
    super(...args);
    this.open = true;
    this.focused = false;
    this.id = idCounter++;
  }

  focus() {
    this.focused = true;
  }

  close() {
    this.open = false;
  }

  get webContents() {
    return new Emitter();
  }
}
