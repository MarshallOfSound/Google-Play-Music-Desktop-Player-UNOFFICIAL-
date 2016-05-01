import './rendererEmitter';
import './generic/translations';
import { remote } from 'electron';

let warnOnce = true;

const waitForBody = setInterval(() => {
  if (document.body) {
    clearInterval(waitForBody);
    document.querySelectorAll('.top-bar')[0].setAttribute('style', '-webkit-app-region: drag');
    setInterval(() => {
      if (document.querySelectorAll('header').length) {
        document.querySelectorAll('header')[0].remove();
      }
      if (document.querySelectorAll('footer').length) {
        document.querySelectorAll('footer')[0].remove();
      }
      if (document.querySelectorAll('.masthead').length) {
        document.querySelectorAll('.masthead')[0].remove();
      }
      if (window.location.href.split('api_key').length === 1 && warnOnce) {
        warnOnce = false;
        alert(TranslationProvider.query('lastfm-login-error'));
        Emitter.fire('lastfm:auth_result', { result: false });
        remote.getCurrentWindow().close();
      }
      if (document.querySelectorAll('.alert-success').length) {
        if (document.querySelectorAll('.alert-success')[0].innerHTML.split('granted permission').length > 1) { // eslint-disable-line
          Emitter.fire('lastfm:auth_result', { result: true });
          remote.getCurrentWindow().close();
        }
      }
    }, 10);
    remote.getCurrentWindow().show();
    const checkForForm = setInterval(() => {
      const submits = document.querySelectorAll('button[type=submit]');
      [].forEach.call(submits, (submit) => {
        if (submit.classList.contains('btn-primary') && submit.name === 'confirm') {
          clearInterval(checkForForm);
          document.querySelector('button[type=submit] + a').addEventListener('click', (e) => {
            e.preventDefault();
            Emitter.fire('lastfm:auth_result', { result: false });
            remote.getCurrentWindow().close();
            return false;
          });
        }
      });
    }, 100);
  }
}, 10);
