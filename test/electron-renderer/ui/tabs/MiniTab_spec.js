/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import MiniTab from '../../../../build/renderer/ui/components/settings/tabs/MiniTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<MiniTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<MiniTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
