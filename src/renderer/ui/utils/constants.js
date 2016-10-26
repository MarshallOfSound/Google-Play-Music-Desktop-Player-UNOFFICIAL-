import _ from 'lodash';

export const themeColors = ['red', 'cyan', 'purple', 'lime', 'indigo', 'pink', 'teal', 'green', 'orange', 'deep-purple'];

export const ACCELERATOR_KEYS = {
  17: 'Ctrl',
};

export const MODIFIER_KEYS = {
  16: 'Shift',
  18: 'Alt',
};

export const ACTION_KEYS = _.transform(_.range(26), (final, current) => { // letters
  final[current + 65] = String.fromCharCode(current + 65); // eslint-disable-line
}, _.transform(_.range(10), (final, current) => { // digits
  final[current + 48] = current.toString(); // eslint-disable-line
}, _.transform(_.range(12), (final, current) => { // f-keys
  final[current + 112] = 'F' + (current + 1).toString(); // eslint-disable-line
}, {
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
  45: 'Insert',
  46: 'Delete',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
})));

export const languageMap = {
  de: 'German',
  'en-US': 'English',
  'nl-NL': 'Dutch',
  'pl-PL': 'Polish',
  'pt-BR': 'Portuguese',
  'fr-FR': 'French',
  ru: 'Russian',
  sk: 'Slovak',
};
