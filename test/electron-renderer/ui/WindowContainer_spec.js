/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import WindowContainer from '../../../build/renderer/ui/components/generic/WindowContainer';

import mockSettings, { fakeSettings, getVars, mockEvent } from './_mockSettings';

chai.should();

describe('<WindowContainer />', () => {
  let fired;
  let hooks;
  let unhooks;

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;
    hooks = getVars().hooks;
    unhooks = getVars().unhooks;
  });

  it('should not render a title when being the main window', () => {
    fakeSettings('theme', false);
    const component = mount(<WindowContainer isMainWindow title="Test Title" />);
    component.find('.window-title').length.should.be.equal(0);
  });

  it('should render a title when not the main window', () => {
    const component = mount(<WindowContainer title="Test Title" />);
    component.find('.window-title').length.should.be.equal(1);
  });

  it('should hook into theme settings change events on mount', () => {
    mount(<WindowContainer isMainWindow title="Test Title" />);
    hooks['settings:change:theme'].should.be.ok;
    hooks['settings:change:themeColor'].should.be.ok;
    hooks['settings:change:themeType'].should.be.ok;
  });

  it('should unhook from theme settings change events on unmount', () => {
    mount(<WindowContainer isMainWindow title="Test Title" />).unmount();
    unhooks['settings:change:theme'].should.be.ok;
    unhooks['settings:change:themeColor'].should.be.ok;
    unhooks['settings:change:themeType'].should.be.ok;
  });

  it('should update the theme state when theme event is fired', () => {
    const component = mount(<WindowContainer isMainWindow title="Test Title" />);
    component.state().theme.should.be.equal('theme');
    mockEvent('settings:change:theme', true);
    component.state().theme.should.be.equal(true);
  });

  it('should update the themeType state when themeType event is fired', () => {
    const component = mount(<WindowContainer isMainWindow title="Test Title" />);
    component.state().themeType.should.be.equal('FULL');
    mockEvent('settings:change:themeType', 'FULL');
    component.state().themeType.should.be.equal('FULL');
  });

  it('should update the themeColor state when themeColor event is fired', () => {
    const component = mount(<WindowContainer isMainWindow title="Test Title" />);
    component.state().themeColor.should.be.equal('themeColor');
    mockEvent('settings:change:themeColor', 'red');
    component.state().themeColor.should.be.equal('red');
  });

  it('should render the window controls', () => {
    const component = mount(<WindowContainer isMainWindow title="Test Title" />);
    component.find('.control').length.should.be.equal(3);

    fired.should.not.have.property('window:minimize');
    component.find('.control').at(0).props()
      .onClick();
    fired.should.have.property('window:minimize');
  });

  it('should fire the window control events when the controls are used', () => {
    const component = mount(<WindowContainer title="Test Title" />);

    fired.should.not.have.property('window:minimize');
    component.find('.control').at(0).props()
      .onClick();
    fired.should.have.property('window:minimize');

    fired.should.not.have.property('window:maximize');
    component.find('.control').at(1).props()
      .onClick();
    fired.should.have.property('window:maximize');

    fired.should.not.have.property('window:close');
    component.find('.control').at(2).props()
      .onClick();
    fired.should.have.property('window:close');
  });

  it('should confirm close when on the main page and a function is provided', () => {
    const spy = sinon.spy();
    const component = mount(<WindowContainer isMainWindow title="Test Title" confirmClose={spy} />);
    spy.callCount.should.be.equal(0);
    component.find('.control').at(2).props()
      .onClick();
    spy.callCount.should.be.equal(1);
  });
});
