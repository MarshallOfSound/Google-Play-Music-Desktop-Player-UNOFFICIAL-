/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import PlaybackTab from '../../../../build/renderer/ui/components/settings/tabs/PlaybackTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<PlaybackTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<PlaybackTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
