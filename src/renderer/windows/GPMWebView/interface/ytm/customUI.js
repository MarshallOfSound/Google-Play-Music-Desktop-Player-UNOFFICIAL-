import { remote } from 'electron';

function installGPMButton() {
  const elem = document.createElement('paper-button');
  elem.setAttribute('id', 'gpm-button');
  elem.setAttribute('class', 'yt-button-renderer');
  elem.setAttribute('style', 'background: #212121; color: orange; font-weight: bold;');
  elem.innerHTML = '<span is="translation-key">button-text-gpm-switch</span>';
  elem.addEventListener('click', () => {
    const mainWindow = remote.getCurrentWindow();
    Settings.set('service', 'google-play-music');
    mainWindow.hide();
    mainWindow.reload();
  });
  document.querySelector('#right-content').prepend(elem);
}


// Modify the GUI after everything is sufficiently loaded
window.wait(() => {
  installGPMButton();
});
