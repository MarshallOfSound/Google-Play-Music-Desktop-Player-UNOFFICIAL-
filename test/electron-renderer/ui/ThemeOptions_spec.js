/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import ThemeOptions from '../../../build/renderer/ui/components/settings/ThemeOptions';
import { themeColors } from '../../../build/renderer/ui/utils/constants';

import mockSettings, { fakeSettings, getVars } from './_mockSettings';
import materialUIContext from './_materialUIContext';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<ThemeOptions />', () => {
  let fired;

  beforeEach(() => {
    mockSettings();
    fakeSettings('themeTypeShouldTrackSystem', false);
    fired = getVars().fired;
  });

  it('should render as a static element with no state', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    expect(component.state()).to.be.equal(null);
  });

  it('should not render inner children', () => {
    const component = mount(<ThemeOptions><NullComponent /></ThemeOptions>, materialUIContext);
    component.find(NullComponent).length.should.be.equal(0);
  });

  it('should render a toggle option for each theme state', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('RadioButton').length.should.be.equal(2);
    component.find('RadioButton').at(0).props().value.should.be.equal('HIGHLIGHT_ONLY');
    component.find('RadioButton').at(1).props().value.should.be.equal('FULL');
  });

  it('should change the themeType setting when a user chooses a toggle option', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('RadioButton').length.should.be.equal(2);
    component.find('RadioButton').at(0).find('input')
      .simulate('change', { target: { checked: true } });

    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'themeType',
      value: 'HIGHLIGHT_ONLY',
    });

    component.find('RadioButton').at(1).find('input')
      .simulate('change', { target: { checked: true } });
    fired['settings:set'].length.should.be.equal(2);
    fired['settings:set'][1][0].should.be.deep.equal({
      key: 'themeType',
      value: 'FULL',
    });
  });

  it('should hide the manual themeType control on darwin when themeTypeShouldTrackSystem is enabled', () => {
    fakeSettings('themeTypeShouldTrackSystem', true);
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('RadioButton').length.should.be.equal(0);
  });

  it('should render a square for every predefined color', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('.color-square').length.should.be.equal(themeColors.length);
    component.find('.color-square').forEach((colorSquare, i) => colorSquare.props().className.split(' ')[1].should.be.equal(themeColors[i]));
  });

  it('should change the themeColor setting when a used clicks a square', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('.color-square').at(0).simulate('click');
    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'themeColor',
      value: '',
    });
  });

  it('should attempt to open the color picker when we click the color picker button', () => {
    const component = mount(<ThemeOptions />, materialUIContext);
    component.find('a').at(0).simulate('click');
    fired['window:color_wheel'].should.be.ok;
    fired['window:color_wheel'].length.should.be.equal(1);
  });
});
