import './themeSettings';
import './audioSelection';
// import './audioEQ';
import './hotkeys';
import './tray';
import './lastFM';
import './mini';
import './general';

document.body.classList.add(process.platform);

if (window.$) {
  $(() => {
    $(document).ready(() => {
      $('ul.tabs').tabs();
      $('.indicator').addClass('theme-back').addClass('orange');

      const style = $('<style></style>');
      $('body').append(style);
      const redrawTheme = (customColor) => {
        const color = customColor || Settings.get('themeColor');
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
        const switch_ = '.switch label input[type=checkbox]:checked+.lever{background:#aaa}';
        const toggle_ = `.switch label input[type=checkbox]:checked+.lever:after{background:${color}}`; // eslint-disable-line
        style.html(text + back + checkbox + slider + input + button + switch_ + toggle_);
      };

      redrawTheme();
      Emitter.on('theme:updateColor', (event, customColor) => {
        redrawTheme(customColor);
      });
    });
  });
}
