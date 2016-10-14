/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import ColorPicker from '../../../build/renderer/ui/components/settings/ColorPicker';

import mockSettings, { getVars } from './_mockSettings';
import materialUIContext from './_materialUIContext';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<ColorPicker />', () => {
  let fired;

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;
  });

  it('should render as a static element with no state', () => {
    const component = mount(<ColorPicker />, materialUIContext);
    expect(component.state()).to.be.equal(null);
  });

  it('should not render inner children', () => {
    const component = mount(<ColorPicker><NullComponent /></ColorPicker>, materialUIContext);
    component.find(NullComponent).length.should.be.equal(0);
  });

  it('should render an inner chrome style color picker', () => {
    const component = mount(<ColorPicker />, materialUIContext);
    component.find('Chrome').length.should.be.equal(1);
  });

  it('should update the themeColor setting when the color picker changes', () => {
    const component = mount(<ColorPicker />, materialUIContext);
    component.find('Chrome').props().onChangeComplete({ hex: 'fancy_red' });
    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'themeColor',
      value: 'fancy_red',
    });
  });
});
