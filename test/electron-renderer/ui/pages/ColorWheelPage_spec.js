/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import ColorWheelPage from '../../../../build/renderer/ui/pages/ColorWheelPage';

chai.should();

describe('<ColorWheelPage />', () => {
  it('should render a WindowContainer root', () => {
    const component = mount(<ColorWheelPage />);
    component.find('WindowContainer').length.should.be.equal(1);
  });
});
