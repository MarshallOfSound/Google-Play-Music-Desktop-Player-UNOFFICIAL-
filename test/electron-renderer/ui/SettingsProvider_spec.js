/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import SettingsProvider, { requireSettings } from '../../../build/renderer/ui/components/generic/SettingsProvider';
import mockSettings, { getVars } from './_mockSettings';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<SettingsProvider />', () => {
  let fired;
  let hooks;
  let queries;
  let unhooks;

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;
    hooks = getVars().hooks;
    queries = getVars().queries;
    unhooks = getVars().unhooks;
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

  it('should hook into the settings change events', () => {
    mount(<SettingsProvider component={NullComponent} defaults={{ bar: 'default_bar' }} keys={['foo', 'bar']} />);
    hooks['settings:change:foo'].should.be.ok;
    hooks['settings:change:foo'].length.should.be.equal(1);
    hooks['settings:change:bar'].should.be.ok;
    hooks['settings:change:bar'].length.should.be.equal(1);
  });

  it('should update the props of the component when the settings change', () => {
    const component = mount(<SettingsProvider component={NullComponent} defaults={{ bar: 'default_bar' }} keys={['foo', 'bar']} />);
    hooks['settings:change:foo'].forEach(fn => fn(null, 'new_foo', 'foo'));
    const props = component.find('NullComponent').props();
    props.foo.should.be.equal('new_foo');
  });

  it('should fire settings:set when calling provided setSettings prop', () => {
    const component = mount(<SettingsProvider component={NullComponent} defaults={{ bar: 'default_bar' }} keys={['foo', 'bar']} />);
    const props = component.find('NullComponent').props();
    props.setSetting('foo', 'dummy_value');
    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'foo',
      value: 'dummy_value',
    });
  });

  it('should unhook the settings change events when unmounting', () => {
    const component = mount(<SettingsProvider component={NullComponent} defaults={{ bar: 'default_bar' }} keys={['foo', 'bar']} />);
    unhooks.should.be.deep.equal({});
    component.unmount();
    unhooks['settings:change:foo'].should.be.ok;
    unhooks['settings:change:foo'].length.should.be.equal(1);
    unhooks['settings:change:bar'].should.be.ok;
    unhooks['settings:change:bar'].length.should.be.equal(1);
  });

  it('should pass props through the wrapped component', () => {
    const WrappedNullComponent = requireSettings(NullComponent, ['foo', 'bar'], {});
    const component = mount(<WrappedNullComponent passed={"passed_through"} />);
    const props = component.find('NullComponent').props();
    props.should.have.property('passed');
    props.passed.should.be.ok;
    props.passed.should.be.equal('passed_through');
  });
});
