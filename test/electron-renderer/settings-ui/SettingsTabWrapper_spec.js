/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import SettingsTabWrapper from '../../../build/inject/settings/ui/components/tabs/SettingsTabWrapper';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<SettingsTabWrapper />', () => {
  it('should render as a wrapper with no state', () => {
    const component = mount(<SettingsTabWrapper><NullComponent /></SettingsTabWrapper>);
    expect(component.state()).to.be.equal(null);
  });

  it('should render the inner child component', () => {
    const component = mount(<SettingsTabWrapper><NullComponent /></SettingsTabWrapper>);
    component.find(NullComponent).length.should.be.ok;
  });
});
