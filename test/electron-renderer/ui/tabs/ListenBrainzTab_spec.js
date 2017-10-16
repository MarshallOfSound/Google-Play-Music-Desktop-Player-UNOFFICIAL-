/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import ListenBrainzTab from '../../../../build/renderer/ui/components/settings/tabs/ListenBrainzTab';
import materialUIContext from '../_materialUIContext';
import mockSettings, { fakeSettings, getVars } from '../_mockSettings';

chai.should();

describe('<ListenBrainzTab />', () => {
  beforeEach(() => {
    mockSettings();
  });

  it('should render a SettingsTabWrapper', () => {
    const component = mount(<ListenBrainzTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });

  it('should initially render a heading text', () => {
    const component = mount(<ListenBrainzTab />, materialUIContext);
    component.find('h4').text().should.be.equal('listenbrainz-label-user-token');
  });

  it('should initially render a TextField', () => {
    const component = mount(<ListenBrainzTab />, materialUIContext);
    component.find('TextField').length.should.be.equal(1);
    component.find('TextField').props().label.should.be.equal('listenbrainz-label-user-token');
  });

  describe('when a user key is not defined', () => {
    let fired;

    beforeEach(() => {
      fakeSettings('listenBrainzUserToken', '');
      fired = getVars().fired;
    });

    it('should set the listenBrainzUserToken setting when TextField\'s value is changed', () => {
      const component = mount(<ListenBrainzTab />, materialUIContext);
      component.find('TextField').props().onChange(null, 'a-b-c-d');
      fired.should.have.property('settings:set');
      fired['settings:set'][0][0].should.be.deep.equal({
        key: 'listenBrainzUserToken',
        value: 'a-b-c-d',
      });
    });
  });

  describe('when a user key is not defined', () => {
    let fired;

    beforeEach(() => {
      fakeSettings('listenBrainzUserToken', 'a-b-c-d');
      fired = getVars().fired;
    });

    it('should set the listenBrainzUserToken setting when TextField\'s value is changed', () => {
      const component = mount(<ListenBrainzTab />, materialUIContext);
      // component.find('TextField').simulate('change', {target: {value: 'My new value'}});
      component.find('TextField').props().onChange(null, '');
      fired.should.have.property('settings:set');
      fired['settings:set'][0][0].should.be.deep.equal({
        key: 'listenBrainzUserToken',
        value: '',
      });
    });
  });
});
