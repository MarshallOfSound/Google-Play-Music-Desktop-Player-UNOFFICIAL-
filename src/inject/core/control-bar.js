import { remote } from 'electron';

const minButton = document.querySelector('#min');
const maxButton = document.querySelector('#max');
const closeButton = document.querySelector('#close');

if (minButton) {
  minButton.addEventListener('click',
            Emitter.fire.bind(Emitter, 'window:minimize', remote.getCurrentWindow().id));
}
if (maxButton) {
  maxButton.addEventListener('click',
            Emitter.fire.bind(Emitter, 'window:maximize', remote.getCurrentWindow().id));
}
if (closeButton) {
  closeButton.addEventListener('click',
            Emitter.fire.bind(Emitter, 'window:close', remote.getCurrentWindow().id));
}
