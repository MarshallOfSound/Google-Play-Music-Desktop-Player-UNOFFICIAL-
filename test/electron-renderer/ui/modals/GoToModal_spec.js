/* eslint-disable no-unused-expressions */
import { remote } from 'electron';
import chai, { expect } from 'chai';
import sinon from 'sinon';

import GoToModal from '../../../../build/renderer/ui/components/modals/GoToModal';

import createModalTest from './_createModalTest';

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

  it('should emit the navigate event if it is a valid GPM URL', () => {
    const { component, fired } = _c;
    const instance = component.instance();
    instance._onChange({}, 'https://www.not.google/play/music');
    instance._onKeyUp({ which: 13 });
    fired.should.not.have.property('navigate:gotourl');
    instance._onChange({}, 'https://play.google.com/music/listen/now/thing');
    instance._onKeyUp({ which: 13 });
    fired.should.have.property('navigate:gotourl');
    fired['navigate:gotourl'][0][0].should.be.equal('https://play.google.com/music/listen/now/thing');
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
