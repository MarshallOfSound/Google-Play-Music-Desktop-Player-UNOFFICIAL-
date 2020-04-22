/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import StyleTab from '../../../../build/renderer/ui/components/settings/tabs/StyleTab';
import materialUIContext from '../_materialUIContext';
import mockSettings, { getVars } from '../_mockSettings';

chai.should();

describe('<StyleTab />', () => {
  beforeEach(() => {
    mockSettings();
  });

  it('should render a SettingsTabWrapper', () => {
    const component = mount(<StyleTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });

  it('should refresh the styles when the refresh button is clicked', () => {
    const component = mount(<StyleTab />, materialUIContext);
    const buttons = component.find('RaisedButton');
    buttons.last().props().onClick();

    const fired = getVars().fired;
    fired.should.haveOwnProperty('FetchGPMCustomStyles');
    fired.should.haveOwnProperty('FetchMainAppCustomStyles');
  });
});
