let fired = {};
let hooks = {};
let queries = {};
let unhooks = {};
let _values = {};

export const getVars = () =>
  ({
    fired,
    hooks,
    queries,
    unhooks,
  });

export const fakeSettings = (key, value) => {
  _values[key] = value;
};

export default () => {
  fired = {};
  hooks = {};
  queries = {};
  unhooks = {};
  _values = {};
  global.Settings = {
    get: (key, def) => {
      queries[key] = queries[key] || 0;
      queries[key]++;
      return typeof _values[key] === 'undefined' ? def || key : _values[key];
    },
  };
  global.Emitter = {
    fire: (what, ...args) => {
      fired[what] = fired[what] || [];
      fired[what].push(args);
    },
    on: (what, fn) => {
      hooks[what] = hooks[what] || [];
      hooks[what].push(fn);
    },
    off: (what, fn) => {
      unhooks[what] = unhooks[what] || [];
      unhooks[what].push(fn);
    },
  };
  global.TranslationProvider = {
    query: str => str,
  };
};
