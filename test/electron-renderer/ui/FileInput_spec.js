/* eslint-disable no-unused-expressions */
import { remote } from 'electron';
import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';


import FileInput from '../../../build/renderer/ui/components/settings/FileInput';
import mockSettings, { fakeSettings, getVars } from './_mockSettings';
import materialUIContext from './_materialUIContext';

chai.should();

describe('<FileInput />', () => {
  let callCount;
  let component;
  let dummyFileList = ['/path/to/file'];
  let fired;

  beforeEach(() => {
    mockSettings();
    fakeSettings('foo', true);
    fired = getVars().fired;
  });

  beforeEach(() => {
    component = mount(
      <FileInput
        label={TranslationProvider.query('settings-options-style-main-app')}
        settingsKey={'fakeSettingKey'}
        bonusEvents={['BonusEvent1']}
      />,
      materialUIContext
    );
    callCount = 0;
    remote.dialog.showOpenDialog = (bw, opts, cb) => { cb(dummyFileList); callCount++; };
  });

  it('should render buttons to select a file and clear', () => {
    component.find('RaisedButton').length.should.be.equal(2);
  });

  it('should render a text input field', () => {
    component.find('TextField').length.should.be.equal(1);
  });

  it('should open a file dialog when the button is clicked', () => {
    callCount.should.be.equal(0);
    const button = component.find('RaisedButton').at(0);
    button.props().onTouchTap();
    callCount.should.be.equal(1);
  });

  it('should open a file dialog when the text input is clicked', () => {
    callCount.should.be.equal(0);
    component.find('TextField').props().onClick();
    callCount.should.be.equal(1);
  });

  it('should be a noop when the user does not select any files', () => {
    dummyFileList = undefined;
    component.find('TextField').props().onClick();
    fired.should.be.deep.equal({});
  });

  it('should update the correct setting when the file exists', () => {
    dummyFileList = [__filename];
    component.find('TextField').props().onClick();
    fired.should.have.property('settings:set');
    fired['settings:set'].should.deep.equal([[{ key: 'fakeSettingKey', value: __filename }]]);
  });

  it('should fire the bonus events when the file exists', () => {
    dummyFileList = [__filename];
    component.find('TextField').props().onClick();
    fired.should.have.property('BonusEvent1');
  });

  it('should update the correct setting when cleared', () => {
    const button = component.find('RaisedButton').at(1);
    button.props().onTouchTap();
    fired.should.have.property('settings:set');
    fired['settings:set'].should.deep.equal([[{ key: 'fakeSettingKey', value: null }]]);
  });

  afterEach(() => {
    component.unmount();
  });
});
