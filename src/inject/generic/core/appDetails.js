import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

window.addEventListener('load', () => {
  if (window.$ && Settings.get('welcomed') !== remote.app.getVersion() && $('#welcome').length) {
    $('[data-app-changes]').html(fs.readFileSync(path.resolve(`${__dirname}/../../../../MR_CHANGELOG.html`), 'utf8')); // eslint-disable-line

    $('#welcome').openModal({
      dismissible: false,
      complete: () => {
        Emitter.fire('welcomed', remote.app.getVersion());
      },
    });
  }
  if (window.$) {
    const modal = $('#about');
    $('[data-app-version]').text(remote.app.getVersion());
    $('[data-app-name]').text(remote.app.getName());
    $('[data-app-dev-mode]').text(remote.getGlobal('DEV_MODE') ? 'Running in Development Mode' : '');
    Emitter.on('about', () => {
      modal.openModal({
        dismissable: true,
      });
    });
  }
});
