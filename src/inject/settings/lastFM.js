const lastFMButton = $('.lastfm-button');
const status = $('.last-fm-status-text');

lastFMButton.click(() => {
  if (lastFMButton.data('auth') === true) {
    lastFMButton.text('Log in to Last.FM');
    status.text('Not Authorized');
    Emitter.fire('settings:set', {
      key: 'lastFMKey',
      value: false,
    });
    lastFMButton.data('auth', false);
  } else {
    lastFMButton.attr('disabled', 'disabled');
    lastFMButton.text('...');
    status.text('Authorization In Progress');
    Emitter.fire('lastfm:auth');
  }
});

Emitter.on('lastfm:authcomplete', (event, details) => {
  lastFMButton.removeAttr('disabled');
  if (details.result) {
    lastFMButton.text('Log out of Last.FM');
    status.text('Authorized');
    lastFMButton.data('auth', true);
  } else {
    lastFMButton.text('Log in to Last.FM');
    status.text('Not Authorized');
    lastFMButton.data('auth', false);
  }
});

lastFMButton.data('auth', false);
if (Settings.get('lastFMKey')) {
  lastFMButton.text('Log out of Last.FM');
  status.text('Authorized');
  lastFMButton.data('auth', true);
}
