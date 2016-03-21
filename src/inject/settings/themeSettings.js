const styleSwitch = document.querySelector('#themeStyleSwitch');
const styleSwitchCheckbox = document.querySelector('#themeStyleSwitch input');

$('.color-square').click((e) => {
  const newColor = $(e.currentTarget).css('background-color');
  Emitter.fire('theme:updateColor', newColor);
});

$('#theme-state').change((e) => {
  const state = $(e.currentTarget).is(':checked');
  Emitter.fire('theme:updateState', { state });
  if (state) {
    styleSwitch.style.display = 'block';
  } else {
    styleSwitch.style.display = 'none';
  }
});
$(styleSwitchCheckbox).change((e) => {
  const state = $(e.currentTarget).is(':checked');
  Emitter.fire('theme:updateType', (state ? 'FULL' : 'HIGHLIGHT_ONLY'));
});

if (Settings.get('theme', false)) {
  $('#theme-state').attr('checked', true);
} else {
  $('#theme-state').removeAttr('checked');
  styleSwitch.style.display = 'none';
}
styleSwitchCheckbox.checked = Settings.get('themeType', 'FULL') === 'FULL'; // eslint-disable-line

$('#color_wheel_trigger').click(() => {
  Emitter.fire('window:color_wheel');
});
