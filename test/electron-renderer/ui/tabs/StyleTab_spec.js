/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import StyleTab from '../../../../build/renderer/ui/components/settings/tabs/StyleTab';
import materialUIContext from '../_materialUIContext';

chai.should();

describe('<StyleTab />', () => {
  it('should render a SettingsTabWrapper', () => {
    const component = mount(<StyleTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });
});
