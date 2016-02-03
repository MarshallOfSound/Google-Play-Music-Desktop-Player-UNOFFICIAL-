Emitter.on('audiooutput:list', (event, devices) => {
  $('#audioOutputSelect option').remove();
  devices.forEach((device) => {
    if (device.kind === 'audiooutput') {
      const opt = $('<option></option>');
      opt.attr('value', device.deviceId);
      opt.text(device.label === '' ? 'Default Device' : device.label);
      $('#audioOutputSelect').append(opt);
    }
  });
  $('select').material_select();
  $('.dropdown-content li>a, .dropdown-content li>span').addClass('theme-text');
});

Emitter.fireAtGoogle('audiooutput:fetch');

$('#audioOutputSelect').on('change', (e) => {
  Emitter.fireAtGoogle('audiooutput:set', $(e.currentTarget).val());
});
