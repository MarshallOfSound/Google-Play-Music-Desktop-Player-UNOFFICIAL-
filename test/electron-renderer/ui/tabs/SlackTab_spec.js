/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import SlackTab from '../../../../build/renderer/ui/components/settings/tabs/SlackTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<SlackTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<SlackTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
