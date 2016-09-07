/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import TextField from 'material-ui/TextField';

import HotkeyInput from '../../../build/inject/settings/ui/components/HotkeyInput';
import mockSettings, { fakeSettings, getVars } from './_mockSettings';
import materialUIContext from './_materialUIContext';

chai.should();

describe('<HotkeyInput />', () => {
  let fired;

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;
  });

  const simulateKeyDown = (input, which) => {
    input.simulate('keyDown', {
      which,
    });
  };

  const simulateKeyUp = (input, which) => {
    input.simulate('keyUp', {
      which,
    });
  };

  it('should render a text field', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    component.find(TextField).length.should.be.equal(1);
  });

  it('should render a text field with the correct default value', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    component.find(TextField).props().value.should.be.equal('Not Set');

    fakeSettings('hotkeys', {
      playPause: 'Ctrl+Shift+P',
    });
    const component2 = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    component2.find(TextField).props().value.should.be.equal('Ctrl+Shift+P');
  });

  it('should update the value when a new hotkey is entered', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    const input = component.find(TextField).find('input');
    simulateKeyDown(input, 17);
    simulateKeyDown(input, 38);
    fired['hotkey:set'].should.be.ok;
    const hotkeyArg = fired['hotkey:set'][0][0];
    hotkeyArg.should.be.deep.equal({
      action: 'playPause',
      accelerator: 'Ctrl+Up',
    });
  });

  it('should not update the value when a new hotkey is entered if the accelerator does not change', () => {
    fakeSettings('hotkeys', {
      playPause: 'Ctrl+Up',
    });
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    const input = component.find(TextField).find('input');
    simulateKeyDown(input, 17);
    simulateKeyDown(input, 38);
    simulateKeyDown(input, 38);
    simulateKeyDown(input, 38);
    simulateKeyDown(input, 38);
    expect(fired['hotkey:set']).to.not.be.ok;
  });

  it('should update the value and sort it when a new multi-component hotkey is entered', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    const input = component.find(TextField).find('input');
    simulateKeyDown(input, 17);
    simulateKeyDown(input, 16);
    simulateKeyDown(input, 38);
    simulateKeyDown(input, 39);
    simulateKeyDown(input, 40);
    simulateKeyDown(input, 41);
    fired['hotkey:set'].should.be.ok;
    const hotkeyArg = fired['hotkey:set'][3][0];
    hotkeyArg.should.be.deep.equal({
      action: 'playPause',
      accelerator: 'Ctrl+Shift+Down+Right+Up',
    });
  });

  it('should reset the accelerator when the escape key is released', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    const input = component.find(TextField).find('input');
    simulateKeyUp(input, 27);
    fired['hotkey:set'].should.be.ok;
    const hotkeyArg = fired['hotkey:set'][0][0];
    hotkeyArg.should.be.deep.equal({
      action: 'playPause',
      accelerator: null,
    });
  });

  it('should naturally reset the keys object when all depressed keys are released', () => {
    const component = mount(<HotkeyInput label="Test Label" hotkeyAction="playPause" />, materialUIContext);
    const input = component.find(TextField).find('input');
    simulateKeyDown(input, 17);
    simulateKeyDown(input, 16);
    simulateKeyDown(input, 38);
    simulateKeyUp(input, 17);
    simulateKeyUp(input, 16);
    simulateKeyDown(input, 999);
    simulateKeyUp(input, 38);
    simulateKeyUp(input, 999);
  });
});
