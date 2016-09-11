/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import AudioDeviceSelector from '../../../build/renderer/ui/components/settings/AudioDeviceSelector';
import materialUIContext from './_materialUIContext';
import mockSettings, { getVars, mockEvent } from './_mockSettings';

chai.should();

describe('<OfflineWarning />', () => {
  let hooks;
  let unhooks;
  let fired;

  beforeEach(() => {
    mockSettings();
    hooks = getVars().hooks;
    unhooks = getVars().unhooks;
    fired = getVars().fired;
  });

  it('should render a selection menu', () => {
    const component = mount(<AudioDeviceSelector />, materialUIContext);
    component.find('SelectField').length.should.be.equal(1);
  });

  it('should initialy render a disabled dropdown menu', () => {
    const component = mount(<AudioDeviceSelector />, materialUIContext);
    component.find('SelectField').props().disabled.should.be.equal(true);
  });

  it('should hook into audiooutput events when mounting', () => {
    mount(<AudioDeviceSelector />, materialUIContext);
    hooks.should.have.property('settings:change:audiooutput');
    hooks.should.have.property('audiooutput:list');
    hooks.should.have.property('audiooutput:set');
  });

  it('should unhook from audiooutput events when unmounting', () => {
    mount(<AudioDeviceSelector />, materialUIContext).unmount();
    unhooks.should.have.property('settings:change:audiooutput');
    unhooks.should.have.property('audiooutput:list');
    unhooks.should.have.property('audiooutput:set');
  });

  it('should enable the dropdown when a device list is recieved', () => {
    const component = mount(<AudioDeviceSelector />, materialUIContext);
    mockEvent('audiooutput:list', [{ deviceId: 'id', label: 'label', kind: 'audiooutput' }], 'audiooutput:list');
    component.find('SelectField').props().disabled.should.be.equal(false);
  });

  it('should render the dropdown with correct default labels', () => {
    const component = mount(<AudioDeviceSelector />, materialUIContext);
    mockEvent('audiooutput:list', [
      { deviceId: 'id', label: 'label', kind: 'audiooutput' },
      { deviceId: 'default', label: '', kind: 'audiooutput' },
      { deviceId: 'communications', label: '', kind: 'audiooutput' },
      { deviceId: 'a_mic_id', label: 'Microphone', kind: 'audioinput' },
      { deviceId: 'unknown_thing', label: '', kind: 'audiooutput' },
    ], 'audiooutput:list');
    component.find('SelectField').props().disabled.should.be.equal(false);
    component.find('SelectField').props().children[0].props.primaryText.should.be.equal('label');
    component.find('SelectField').props().children[1].props.primaryText.should.be.equal('audio-device-default');
    component.find('SelectField').props().children[2].props.primaryText.should.be.equal('audio-device-communications');
    component.find('SelectField').props().children[3].props.primaryText.should.be.equal('audio-device-unknown');
  });

  it('should update the audiooutput device when a new option is chosen', () => {
    const component = mount(<AudioDeviceSelector />, materialUIContext);
    mockEvent('audiooutput:list', [{ deviceId: 'id', label: 'label', kind: 'audiooutput' }], 'audiooutput:list');
    component.find('SelectField').props().disabled.should.be.equal(false);
    component.find('SelectField').props().onChange({}, 0, 'label');
    fired.should.have.property('audiooutput:set');
    fired['audiooutput:set'][0][0].should.have.be.equal('id');
    fired['audiooutput:set'][1][0].should.have.be.equal('label');
  });
});
