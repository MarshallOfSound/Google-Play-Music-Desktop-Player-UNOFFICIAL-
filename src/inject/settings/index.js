import './themeSettings';
import './audioSelection';
import './audioEQ';
import './hotkeys';
import './tray';
import './lastFM';
import './mini';

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
  const slider = `[theme] .range-label{background:${color};border:none}
                  [theme] .noUi-horizontal .noUi-handle{background:transparent}`;
  const input = `[theme] .input-field input[type=text]:focus + label {color:${color};}
                  [theme] .input-field input[type=text]:focus {border-bottom-color:${color};
                                                              box-shadow: 0 1px 0 0 ${color};}`;
  const button = `[theme] .btn{background:${color}}`;
  style.html(text + back + checkbox + slider + input + button);
};

redrawTheme();
Emitter.on('theme:updateColor', redrawTheme);
// var $picker = document.getElementById('colorPicker'),
//   picker = tinycolorpicker($picker);
