/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import Checkbox from 'material-ui/Checkbox';

import ToggleableOption from '../../../build/inject/settings/ui/components/ToggleableOption';
import mockSettings, { fakeSettings, getVars } from './_mockSettings';
import materialUIContext from './_materialUIContext';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

chai.should();

describe('<ToggleableOption />', () => {
  let fired;

  beforeEach(() => {
    mockSettings();
    fakeSettings('foo', true);
    fired = getVars().fired;
  });

  it('should render a checkbox', () => {
    const component = mount(<ToggleableOption label="Test Label" settingsKey="foo" />, materialUIContext);
    component.find(Checkbox).length.should.be.equal(1);
  });

  it('should render a checkbox with the correct default value', () => {
    const component = mount(<ToggleableOption label="Test Label" settingsKey="foo" />, materialUIContext);
    component.find(Checkbox).props().checked.should.be.ok;

    fakeSettings('foo', false);
    const component2 = mount(<ToggleableOption label="Test Label" settingsKey="foo" />, materialUIContext);
    component2.find(Checkbox).props().checked.should.not.be.ok;
  });

  it('should call setSetting when the checkbox is toggled', () => {
    const component = mount(<ToggleableOption label="Test Label" settingsKey="foo" />, materialUIContext);
    expect(fired['settings:set']).to.not.be.ok;
    component.find('input').simulate('change', { target: { checked: true } });
    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'foo',
      value: true,
    });
  });
});
