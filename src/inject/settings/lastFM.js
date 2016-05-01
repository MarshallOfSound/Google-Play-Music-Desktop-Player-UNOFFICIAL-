const lastFMButton = $('.lastfm-button');
const status = $('.last-fm-status-text');

const loginText = TranslationProvider.query('lastfm-login-button-text');
const logoutText = TranslationProvider.query('lastfm-logout-button-text');
const authorized = TranslationProvider.query('lastfm-login-authorized');
const notAuthorized = TranslationProvider.query('lastfm-login-not-authorized');
const authorizationInProgress = TranslationProvider.query('lastfm-login-authorizing');

lastFMButton.click(() => {
  if (lastFMButton.data('auth') === true) {
    lastFMButton.text(loginText);
    status.text(notAuthorized);
    Emitter.fire('settings:set', {
      key: 'lastFMKey',
      value: false,
    });
    lastFMButton.data('auth', false);
  } else {
    lastFMButton.attr('disabled', 'disabled');
    lastFMButton.text('...');
    status.text(authorizationInProgress);
    Emitter.fire('lastfm:auth');
  }
});

Emitter.on('lastfm:authcomplete', (event, details) => {
  lastFMButton.removeAttr('disabled');
  if (details.result) {
    lastFMButton.text(logoutText);
    status.text(authorized);
    lastFMButton.data('auth', true);
  } else {
    lastFMButton.text(loginText);
    status.text(notAuthorized);
    lastFMButton.data('auth', false);
  }
});

lastFMButton.data('auth', false);
if (Settings.get('lastFMKey')) {
  lastFMButton.text(logoutText);
  status.text(authorized);
  lastFMButton.data('auth', true);
}
