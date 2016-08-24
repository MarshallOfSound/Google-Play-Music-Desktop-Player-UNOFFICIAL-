import Emitter from 'events';

let idCounter = 0;

export default class MockWindow extends Emitter {
  constructor(...args) {
    super(...args);
    this.open = true;
    this.focused = false;
    this.id = idCounter++;
  }

  close() {
    this.open = false;
  }
}
