import _ from 'lodash';

const ACCELERATOR_KEYS = {
  17: 'Ctrl',
};

const MODIFIER_KEYS = {
  16: 'Shift',
  18: 'Alt',
};

const ACTION_KEYS = _.transform(_.range(26), (final, current) => {
  final[current + 65] = String.fromCharCode(current + 65); // eslint-disable-line
}, {
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
});

const initialHotkeys = Settings.get('hotkeys', {});

const writeAccelerator = (input) => {
  if (input.data('a')) {
    const a = input.data('a');
    const m = input.data('m') || [];
    const ac = input.data('ac') || [];
    m.sort();
    ac.sort();

    if (ac.length !== 0) {
      if (m.length !== 0) {
        input.val([a, m.join('+'), ac.join('+')].join('+'));
      } else {
        input.val([a, ac.join('+')].join('+'));
      }
    }
  } else if (input.data('reset')) {
    input.data('reset', false);
    input.data('a', null);
    input.data('m', []);
    input.data('ac', []);
    input.val('Not Set');
  }
};

// DEV: Lets by honest this looks awful, need to clean this up.......
$('#hotkeys input')
.on('keydown', (e) => {
  const input = $(e.currentTarget);
  const m = input.data('m') || [];
  const ac = input.data('ac') || [];

  if (ACCELERATOR_KEYS[e.which]) {
    input.data('a', ACCELERATOR_KEYS[e.which]);
  } else if (MODIFIER_KEYS[e.which] && !_.includes(m, MODIFIER_KEYS[e.which])) {
    input.data('m', m.concat([MODIFIER_KEYS[e.which]]));
  } else if (ACTION_KEYS[e.which] && !_.includes(ac, ACTION_KEYS[e.which])) {
    input.data('ac', ac.concat([ACTION_KEYS[e.which]]));
  }
  writeAccelerator(input);
  e.preventDefault();
  return false;
})
.on('keyup', (e) => {
  const input = $(e.currentTarget);
  const m = input.data('m') || [];
  const ac = input.data('ac') || [];

  if (ACCELERATOR_KEYS[e.which]) {
    input.data('a', null);
  } else if (MODIFIER_KEYS[e.which]) {
    _.remove(m, (val) => val === MODIFIER_KEYS[e.which]);
    input.data('m', m);
  } else if (ACTION_KEYS[e.which]) {
    _.remove(ac, (val) => val === ACTION_KEYS[e.which]);
    input.data('ac', ac);
  } else if (e.which === 27) {
    input.data('reset', true);
  }
  writeAccelerator(input);
  Emitter.fire('hotkey:set', {
    action: input.attr('id'),
    accelerator: (input.val() === 'Not Set' ? null : input.val()),
  });
})
.each((index, el) => {
  const input = $(el);
  input.val(initialHotkeys[input.attr('id')] || 'Not Set');
});
