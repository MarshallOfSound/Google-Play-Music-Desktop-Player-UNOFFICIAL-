import { remote } from 'electron';

Emitter.on('pauseAfter:show', () => {
  const toast = document.createElement('paper-toast');
  toast.setAttribute('text', `Pausing after this song.`);
  toast.duration = 0;
  toast.noCancelOnOutsideClick = true;
  const disableButton = document.createElement('a');
  disableButton.innerHTML = 'Don\'t pause after this song';
  disableButton.style.color = '#E53935';
  disableButton.style.margin = '0';
  disableButton.style.marginBottom = '102px';
  disableButton.style.padding = '0';
  disableButton.style.marginLeft = '10px';
  disableButton.style.cursor = 'pointer';
  disableButton.addEventListener('click', (e) => {
    remote.getGlobal('PlaybackAPI')._setPauseAfter(false);
    e.preventDefault();
    return false;
  });
  toast.appendChild(disableButton);
  document.body.appendChild(toast);
  toast.show();
  Emitter.on('pauseAfter:hide', () => {
    toast.hide();
  });
});
