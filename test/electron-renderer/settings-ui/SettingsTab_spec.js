/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import SettingsTab from '../../../build/inject/settings/ui/components/SettingsTab';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<SettingsTab />', () => {
  it('should render as a wrapper with no state', () => {
    const component = mount(<SettingsTab><NullComponent /></SettingsTab>);
    expect(component.state()).to.be.equal(null);
  });

  it('should render the inner child component', () => {
    const component = mount(<SettingsTab><NullComponent /></SettingsTab>);
    component.find(NullComponent).length.should.be.ok;
  });
});
