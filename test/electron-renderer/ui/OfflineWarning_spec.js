/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import OfflineWarning from '../../../build/renderer/ui/components/generic/OfflineWarning';

chai.should();

describe('<OfflineWarning />', () => {
  it('should render null when online', () => {
    const component = mount(<OfflineWarning navigator={{ onLine: true }} />);
    component.children().length.should.be.equal(0);
  });

  it('should render an offline-warning when offline', () => {
    const component = mount(<OfflineWarning navigator={{ onLine: false }} />);
    component.children().length.should.be.equal(2);
    component.find('.offline-warning').length.should.be.equal(1);
  });

  it('should render null then a warning if the online state changes', () => {
    const fakeNavigator = { onLine: true };
    const component = mount(<OfflineWarning navigator={fakeNavigator} />);
    component.children().length.should.be.equal(0);

    fakeNavigator.onLine = false;
    window.dispatchEvent(new Event('online'));

    component.children().length.should.be.equal(2);
  });

  it('should render a warning then null if the online state changes', () => {
    const fakeNavigator = { onLine: false };
    const component = mount(<OfflineWarning navigator={fakeNavigator} />);
    component.children().length.should.be.equal(2);

    fakeNavigator.onLine = true;
    window.dispatchEvent(new Event('online'));

    component.children().length.should.be.equal(0);
  });

  it('should remove event listeners once unounted', () => {
    const fakeNavigator = { onLine: false };
    const component = mount(<OfflineWarning navigator={fakeNavigator} />);

    component.unmount();

    fakeNavigator.onLine = true;
    window.dispatchEvent(new Event('online'));
  });
});
