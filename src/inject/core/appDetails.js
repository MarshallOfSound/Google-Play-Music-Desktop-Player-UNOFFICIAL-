import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

window.addEventListener('load', () => {
  if (window.$ && Settings.get('welcomed') !== remote.app.getVersion()) {
    $('[data-app-changes]').html(fs.readFileSync(path.resolve(`${__dirname}/../../../MR_CHANGELOG.html`), 'utf8')); // eslint-disable-line

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
    Emitter.on('about', () => {
      modal.openModal({
        dismissable: true,
      });
    });
  }
});
