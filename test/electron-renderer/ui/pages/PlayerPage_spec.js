/* eslint-disable no-unused-expressions */
import { remote } from 'electron';
import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import PlayerPage from '../../../../build/renderer/ui/pages/PlayerPage';
import mockSettings, { getVars } from '../_mockSettings';

chai.should();

describe('<PlayerPage />', () => {
  let fired;

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;
  });

  it('should render a WindowContainer root', () => {
    const component = mount(<PlayerPage />);
    component.find('WindowContainer').length.should.be.equal(1);
  });

  it('should initialy be in a non-ready state', () => {
    const component = mount(<PlayerPage />);
    component.instance().ready.should.be.equal(false);
  });

  it('should show the tray modal when closing the window', () => {
    const component = mount(<PlayerPage />);
    component.find('WindowContainer').props().confirmClose();
    // TODO: Test this somehow
  });

  it('shouldbe marked as ready when the DOM is ready inside the webview', (done) => {
    const component = mount(<PlayerPage />);
    const stub = sinon.stub(window, 'addEventListener');
    const _on = remote.getCurrentWindow().on;
    const windowSpy = remote.getCurrentWindow().on = sinon.spy();
    component.instance()._domReady();
    component.instance().refs.view = {
      focus: sinon.spy(),
    };
    setTimeout(() => {
      component.instance().ready.should.be.equal(true);
      component.instance().refs.view.focus.callCount.should.be.equal(1);
      stub.callCount.should.be.eq(19);
      stub.getCall(18).args[1]({});
      windowSpy.firstCall.args[0].should.be.equal('focus');
      const queryStub = sinon.stub(document, 'querySelector');
      const focusObj = {
        focus: sinon.spy(),
      };
      queryStub.returns(focusObj);
      windowSpy.firstCall.args[1]();
      queryStub.callCount.should.be.equal(1);
      focusObj.focus.callCount.should.be.equal(1);
      queryStub.restore();
      stub.restore();
      remote.getCurrentWindow().on = _on;
      done();
    }, 800);
  });

  it('should immediately navigate to the target page once when the webview stops loading', (done) => {
    const component = mount(<PlayerPage />);
    component.instance().once.should.be.equal(true);
    document.body.setAttribute('loading', 'loading');
    component.instance()._didStopLoading();
    component.instance().once.should.be.equal(false);
    setTimeout(() => {
      expect(document.body.getAttribute('loading')).to.be.equal(null);
      component.instance()._didStopLoading();
      component.instance().once.should.be.equal(false);
      done();
    }, 400);
  });

  it('should persist GPM URLS on navigate events', () => {
    const component = mount(<PlayerPage />);
    component.instance().ready = true;
    component.instance()._didNavigate('https://play.google.com/music/now');
    fired['settings:set'].should.be.ok;
  });

  it('should persist GPM URLS on navigate in pageevents', () => {
    const component = mount(<PlayerPage />);
    component.instance().ready = true;
    component.instance()._didNavigateInPage('https://play.google.com/music/now');
    fired['settings:set'].should.be.ok;
  });

  it('should not persist GPM URLS on navigate events when not ready', () => {
    const component = mount(<PlayerPage />);
    component.instance()._didNavigate('https://play.google.com/music/now');
    expect(fired['settings:set']).to.not.be.ok;
  });

  it('should not persist GPM URLS on navigate in page events when not ready', () => {
    const component = mount(<PlayerPage />);
    component.instance()._didNavigateInPage('https://play.google.com/music/now');
    expect(fired['settings:set']).to.not.be.ok;
  });

  it('should not persist non-GPM URLS on navigate events', () => {
    const component = mount(<PlayerPage />);
    component.instance().ready = true;
    component.instance()._didNavigate('https://www.google.com');
    expect(fired['settings:set']).to.not.be.ok;
  });

  it('should not persist non-GPM URLS on navigate in page events', () => {
    const component = mount(<PlayerPage />);
    component.instance().ready = true;
    component.instance()._didNavigateInPage('https://www.google.com');
    expect(fired['settings:set']).to.not.be.ok;
  });
});
