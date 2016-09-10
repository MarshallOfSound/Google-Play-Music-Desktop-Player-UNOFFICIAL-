/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import HotkeyTab from '../../../../build/renderer/ui/components/settings/tabs/HotkeyTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<HotkeyTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<HotkeyTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
