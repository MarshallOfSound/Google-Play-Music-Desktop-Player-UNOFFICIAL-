/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import MicroTab from '../../../../build/renderer/ui/components/settings/tabs/MicroTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<MicroTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<MicroTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
