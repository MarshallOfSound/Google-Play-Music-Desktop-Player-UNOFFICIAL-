/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import AudioTab from '../../../../build/renderer/ui/components/settings/tabs/AudioTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<AudioTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<AudioTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
