import './themeSettings';
import './audioSelection';

document.body.classList.add(process.platform);

$(() => {
  $(document).ready(() => {
    $('ul.tabs').tabs();
    $('.indicator').addClass('theme-back').addClass('orange');
  });
});

const style = $('<style></style>');
$('body').append(style);
const redrawTheme = () => {
  const color = Settings.get('themeColor', 'white');
  const text = `[theme] .theme-text{color:${color} !important;}`;
  const back = `[theme] .theme-back{background:${color} !important;}`;
  const checkbox = `[theme] input[type=checkbox]:checked + label::after{background:${color}` +
                    `!important;border-color:${color} !important;}`;
  style.html(text + back + checkbox);
};

redrawTheme();
Emitter.on('theme:updateColor', redrawTheme);
// var $picker = document.getElementById('colorPicker'),
//   picker = tinycolorpicker($picker);
