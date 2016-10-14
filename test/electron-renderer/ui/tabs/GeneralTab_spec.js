/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import GeneralTab from '../../../../build/renderer/ui/components/settings/tabs/GeneralTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<GeneralTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<GeneralTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(2); // Theme also renders a SettingsTabWrapper
  });
});
