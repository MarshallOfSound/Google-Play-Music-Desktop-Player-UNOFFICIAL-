/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { MicroPlayerSettings } from '../../../src/main/features/core/microPlayer/MicroPlayerSettings';

describe('MicroPlayerSettings', () => {
  /** @type {MicroPlayerSettings} */
  let settings;
  let store;

  function testProperty(setter, getter, key, values) {
    for (const value of values) {
      setter((value));
      expect(store[key]).to.equal(value);
      expect(getter((value))).to.equal(value);
    }
  }

  before(() => {
    global.Settings = {
      get: (key, defaultValue) => store[key] || defaultValue,
      set: (key, value) => (store[key] = value),
    };
  });

  beforeEach(() => {
    settings = new MicroPlayerSettings();
    store = {};
  });

  describe('enabled', () => {
    it('should be false by default.', () => {
      expect(settings.enabled).to.be.false;
    });

    it('should get and set the value.', () => {
      testProperty(
        (value) => (settings.enabled = value),
        () => settings.enabled,
        'microplayer-enabled',
        [true, false]
      );
    });
  });

  describe('size', () => {
    it('should be 400x40 by default.', () => {
      expect(settings.size).to.deep.equal([400, 40]);
    });

    it('should get and set the value.', () => {
      testProperty(
        (value) => (settings.size = value),
        () => settings.size,
        'microplayer-size',
        [[100, 10], [200, 50]]
      );
    });
  });

  describe('position', () => {
    it('should be undefined by default.', () => {
      expect(settings.position).to.be.undefined;
    });

    it('should get and set the value.', () => {
      testProperty(
        (value) => (settings.position = value),
        () => settings.position,
        'microplayer-position',
        [[10, 20], [300, 100]]
      );
    });
  });
});
