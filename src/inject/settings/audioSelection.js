import _ from 'lodash';

let devices;

Emitter.on('audiooutput:list', (event, d) => {
  devices = d;
  $('#audioOutputSelect option').remove();
  devices.forEach((device) => {
    if (device.kind === 'audiooutput') {
      const opt = $('<option></option>');
      opt.attr('value', device.deviceId);
      opt.text(device.label === '' ? 'Default Device' : device.label);
      if (device.label === Settings.get('audiooutput')) {
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
  const label = _.find(devices, (device) => {
    return device.deviceId === $(e.currentTarget).val();
  }).label;
  Emitter.fire('audiooutput:set', label);
});
