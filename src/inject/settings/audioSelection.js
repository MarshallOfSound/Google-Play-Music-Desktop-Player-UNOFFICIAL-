import _ from 'lodash';

let devices;

Emitter.on('audiooutput:list', (event, d) => {
  devices = d;
  $('#audioOutputSelect option').remove();
  devices.forEach((device) => {
    if (device.kind === 'audiooutput') {
      let label = device.label;
      if (!label) {
        switch (device.deviceId) {
          case 'default':
            label = TranslationProvider.query('audio-device-default');
            break;
          case 'communications':
            label = TranslationProvider.query('audio-device-communications');
            break;
          default:
            label = TranslationProvider.query('audio-device-unknown');
            break;
        }
      }
      const opt = $('<option></option>');
      opt.attr('value', device.deviceId);
      opt.text(label);
      if (label === Settings.get('audiooutput')) {
        opt.attr('selected', true);
      }
      $('#audioOutputSelect').append(opt);
    }
  });
  $('select').material_select();
  $('.dropdown-content li>a, .dropdown-content li>span').addClass('theme-text');
});

Emitter.fireAtGoogle('audiooutput:fetch');

$('#audioOutputSelect').on('change', (e) => {
  Emitter.fireAtGoogle('audiooutput:set', $(e.currentTarget).val());
  const label = _.find(devices, (device) => device.deviceId === $(e.currentTarget).val()).label;
  Emitter.fire('audiooutput:set', label);
});

let currentSelected = Settings.get('audiooutput');
setInterval(() => {
  if (currentSelected !== Settings.get('audiooutput')) {
    currentSelected = Settings.get('audiooutput');
    $('#audioOutputSelect option').each((index, opt) => {
      if ($(opt).text() === currentSelected) {
        $('#audioOutputSelect').val($(opt).attr('value'));
        $('#audioOutputSelect').material_select();
      }
    });
  }
}, 500);
