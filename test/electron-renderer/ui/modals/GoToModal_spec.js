/* eslint-disable no-unused-expressions */
import { remote } from 'electron';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import sinon from 'sinon';
import { given } from 'mocha-testdata';

import GoToModal from '../../../../build/renderer/ui/components/modals/GoToModal';

import createModalTest from './_createModalTest';

chai.use(chaiAsPromised);
chai.should();

createModalTest(GoToModal, ['gotourl'], [], [], () => {}, (_c) => {
  it('updates the current value when it recieves a change event', () => {
    const { component } = _c;
    expect(component.instance().value).to.be.equal(undefined);
    component.instance()._onChange({}, 'foo');
    expect(component.instance().value).to.be.equal('foo');
  });

  it('should not attempt to parse the URL when you hit enter if the value is empty', () => {
    const { component } = _c;
    const instance = component.instance();
    const spy = sinon.spy(instance, 'parseURL');
    instance._onKeyUp({ which: 10 });
    spy.callCount.should.be.equal(0);
    instance._onKeyUp({ which: 13 });
    spy.callCount.should.be.equal(0);
  });

  it('should attempt to parse the URL when you hit enter if the value is not empty', () => {
    const { component } = _c;
    const instance = component.instance();
    instance._onChange({}, 'foo');
    const spy = sinon.spy(instance, 'parseURL');
    instance._onKeyUp({ which: 10 });
    spy.callCount.should.be.equal(0);
    instance._onKeyUp({ which: 13 });
    spy.callCount.should.be.equal(1);
  });

  given(['https://play.google.com/music/listen/now/thing', 'https://play.google.com/music/r/m/Lmfbcdi7lg4inxvv3nydqyzor4y?t=Peaceful_Stroll_'])
  .it('should emit the navigate event if it is a valid GPM URL', (url) => {
    const { component, fired } = _c;
    const instance = component.instance();
    instance._onChange({}, 'https://www.not.google/play/music');
    instance._onKeyUp({ which: 13 });
    fired.should.not.have.property('navigate:gotourl');
    instance._onChange({}, url);
    instance._onKeyUp({ which: 13 });
    fired.should.have.property('navigate:gotourl');
    fired['navigate:gotourl'][0][0].should.be.equal(url);
  });

  given(['https://play.google.com/store/thing', 'https://www.thisdoesnotexist.com'])
  .it('should not emit the navigate event if it is an invalid GPM URL', (url) => {
    const { component, fired } = _c;
    const instance = component.instance();
    instance._onChange({}, 'https://www.not.google/play/music');
    instance._onKeyUp({ which: 13 });
    fired.should.not.have.property('navigate:gotourl');
    instance._onChange({}, url);
    instance._onKeyUp({ which: 13 });
    fired.should.not.have.property('navigate:gotourl');
  });

  it('should emit the generateDebugInfo event if you enter DEBUG_INFO', () => {
    const { component, fired } = _c;
    const instance = component.instance();
    fired.should.not.have.property('generateDebugInfo');
    instance._onChange({}, 'DEBUG_INFO');
    instance._onKeyUp({ which: 13 });
    fired.should.have.property('generateDebugInfo');
    fired.generateDebugInfo.should.be.ok;
  });

  describe('when making stubbed fetch requests', () => {
    beforeEach(() => {
      sinon.stub(window, 'fetch');

      const fakeRedirect = () =>
        Promise.resolve({
          url: 'http://google.com/redirected',
          status: 301,
        });

      const fakeOk = () =>
        Promise.resolve({
          url: 'https://play.google.com/music/listen#/album/Brktxc3e6ajhek4mxpmaa3quksu',
          status: 200,
        });

      // setup mocks for fetch functionality (like redirects)
      window.fetch.onFirstCall().returns(fakeRedirect());
      window.fetch.onSecondCall().returns(fakeRedirect());
      window.fetch.onThirdCall().returns(fakeOk());
    });

    afterEach(() => {
      window.fetch.restore();
    });

    given(['https://goo.gl/UFT1HU', 'https://goo.gl/ySV9WV']).it('should emit the navigate event if it is a valid redirected GPM URL', (url) => { // eslint-disable-line
      const { component, fired } = _c;
      const instance = component.instance();
      const resolveURLSpy = sinon.spy(instance, 'resolveURL');
      const goToURLSpy = sinon.spy(instance, 'goToURL');
      const validURLSpy = sinon.spy(instance, 'validURL');
      instance.attemptToResolveURL(url).then(() => {
        resolveURLSpy.callCount.should.be.equal(1);
        validURLSpy.callCount.should.be.equal(1);
        goToURLSpy.callCount.should.be.equal(1);
        fired.should.have.property('navigate:gotourl');
        fired['navigate:gotourl'][0][0].should.not.be.equal(url);
      });
    });

    it('should not emit the navigate event if it is an invalid redirected GPM URL', () => {
      const fakeInvalidURL = () =>
        Promise.resolve({
          url: 'https://not.a.valid.gpm.url',
          status: 200,
        });

      const { component, fired } = _c;
      const instance = component.instance();

      // setup the stub to trigger on our test payload
      const request = instance.createRequest('https://www.not.google/play/music');
      window.fetch.withArgs(request).returns(fakeInvalidURL());

      const resolveURLSpy = sinon.spy(instance, 'resolveURL');
      const goToURLSpy = sinon.spy(instance, 'goToURL');
      const validURLSpy = sinon.spy(instance, 'validURL');

      return instance.attemptToResolveURL('https://www.not.google/play/music')
        .catch(() => {
          resolveURLSpy.callCount.should.be.equal(1);
          validURLSpy.callCount.should.be.equal(1);
          goToURLSpy.callCount.should.be.equal(0);
          fired.should.not.have.property('navigate:gotourl');
          return Promise.reject('rejected');
        }).should.be.rejected;
    });

    it('should fail if the URL is redirected too many times', () => {
      const fakeRedirect = () =>
        Promise.resolve({
          url: 'http://google.com/redirected',
          status: 301,
        });

      const { component, fired } = _c;
      const instance = component.instance();

      // setup the stub to trigger on our test payload
      const request = instance.createRequest('https://play.google.com/music/redirectforever');
      window.fetch.withArgs(request).returns(fakeRedirect());

      const resolveURLSpy = sinon.spy(instance, 'resolveURL');
      const goToURLSpy = sinon.spy(instance, 'goToURL');
      const validURLSpy = sinon.spy(instance, 'validURL');

      return instance.attemptToResolveURL('https://play.google.com/music/redirectforever')
        .catch((err) => {
          err.should.be.eq(new Error('Too many redirects'));
          resolveURLSpy.callCount.should.be.equal(1);
          validURLSpy.callCount.should.be.equal(1);
          goToURLSpy.callCount.should.be.equal(0);
          fired.should.not.have.property('navigate:gotourl');
          return Promise.reject('rejected');
        }).should.be.rejected;
    });
  });

  describe('when stubbed', () => {
    let confirmStub;
    let relaunchStub;
    let quitStub;

    beforeEach(() => {
      confirmStub = sinon.stub();
      relaunchStub = sinon.stub();
      quitStub = sinon.stub();
      confirmStub.confirm = global.confirm;
      relaunchStub.relaunch = remote.app.relaunch;
      quitStub.quit = remote.app.quit;
      global.confirm = confirmStub;
      remote.app.relaunch = relaunchStub;
      remote.app.quit = quitStub;
    });

    afterEach(() => {
      global.confirm = global.confirm.confim;
      remote.app.relaunch = remote.app.relaunch.relaunch;
      remote.app.quit = remote.app.quit.quit;
    });

    it('should attempt to launch into dev mode when DEV_MODE is submitted and confirmed', () => {
      const { component } = _c;
      const instance = component.instance();
      instance._onChange({}, 'DEV_MODE');
      confirmStub.returns(true);

      instance._onKeyUp({ which: 13 });

      confirmStub.callCount.should.be.equal(1);
      relaunchStub.callCount.should.be.equal(1);
      quitStub.callCount.should.be.equal(1);
    });

    it('should not attempt to launch into dev mode when DEV_MODE is submitted and is not confirmed', () => {
      const { component } = _c;
      const instance = component.instance();
      instance._onChange({}, 'DEV_MODE');
      confirmStub.returns(false);

      instance._onKeyUp({ which: 13 });

      confirmStub.callCount.should.be.equal(1);
      relaunchStub.callCount.should.be.equal(0);
      quitStub.callCount.should.be.equal(0);
    });
  });
});
