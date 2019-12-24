import { remote } from 'electron';

function addButton(id, click) {
  const elem = document.createElement('paper-button');
  elem.setAttribute('id', id);
  elem.setAttribute('class', 'yt-button-renderer');
  elem.setAttribute('style', 'background: #212121; color: orange; font-weight: bold;');
  elem.addEventListener('click', click);

  document.querySelector('#right-content').prepend(elem);

  return elem;
}

function installGPMButton() {
  const elem = addButton('gpm-button', () => {
    const mainWindow = remote.getCurrentWindow();
    Settings.set('service', 'google-play-music');
    mainWindow.hide();
    mainWindow.reload();
  });

  elem.innerHTML = '<span is="translation-key">button-text-gpm-switch</span>';
}

function installMicroPlayerButton() {
  const elem = addButton('micro-player-button', () => {
    Emitter.fire('window:microplayer');
  });

  const setter = (checked) => {
    elem.innerHTML = `<span is="translation-key">label-micro-player-${checked ? 'on' : 'off'}</span>`;
  };

  setter(Settings.get('microplayer-enabled'));
  Emitter.on('settings:change:microplayer-enabled', (event, visible) => setter(visible));
}


// Modify the GUI after everything is sufficiently loaded
window.wait(() => {
  installGPMButton();
  installMicroPlayerButton();
});
