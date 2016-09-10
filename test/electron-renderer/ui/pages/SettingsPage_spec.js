/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import SettingsPage from '../../../../build/renderer/ui/pages/SettingsPage';

chai.should();

describe('<SettingsPage />', () => {
  it('should render a WindowContainer root', () => {
    const component = mount(<SettingsPage />);
    component.find('WindowContainer').length.should.be.equal(1);
  });
});
