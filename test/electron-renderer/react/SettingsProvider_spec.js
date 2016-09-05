/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import SettingsProvider from '../../../build/inject/settings/ui/components/SettingsProvider';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<SettingsProvider />', () => {
  let hooks = {};
  let queries = {};
  let unhooks = {};

  beforeEach(() => {
    hooks = {};
    queries = {};
    unhooks = {};
    global.Settings = {
      get: (key, def) => {
        queries[key] = queries[key] || 0;
        queries[key]++;
        return def || key;
      },
    };
    global.Emitter = {
      on: (what, fn) => {
        hooks[what] = hooks[what] || [];
        hooks[what].push(fn);
      },
      off: (what, fn) => {
        unhooks[what] = unhooks[what] || [];
        unhooks[what].push(fn);
      },
    };
  });

  it('should load initial key values', () => {
    mount(<SettingsProvider component={NullComponent} defaults={{}} keys={['foo', 'bar']} />);
    queries.foo.should.be.equal(1);
    queries.bar.should.be.equal(1);
  });

  it('should load initial key values, with defaults if set', () => {
    const component = mount(<SettingsProvider component={NullComponent} defaults={{ bar: 'default_bar' }} keys={['foo', 'bar']} />);
    const props = component.find('NullComponent').props();
    props.foo.should.be.equal('foo');
    props.bar.should.be.equal('default_bar');
  });
});
