/* eslint-disable no-unused-expressions */

import chai from 'chai';
import EventEmitter from 'events';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MicroPlayerController } from '../../../src/main/features/core/microPlayer/MicroPlayerController';

const expect = chai.use(sinonChai).expect;

describe('MicroPlayerController', () => {
  let sandbox;
  let id;
  let controller;
  let settings;
  let window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    id = Symbol();

    global.Emitter = new EventEmitter();
    global.PlaybackAPI = new EventEmitter();
    global.WindowManager = {
      add: () => id,
      close: sinon.stub(),
    };

    settings = {
      enabled: true,
      position: [0, 0],
      size: [0, 0],
    };

    window = new EventEmitter();
    window.getSize = () => [0, 0];
    window.getPosition = () => [0, 0];
    window.setPosition = () => undefined;
    window.showInactive = () => undefined;
    window.setClosable = sinon.stub();

    // Stub the internal method that creates the window because
    // we don't want a real window to be created for these tests.
    sandbox.stub(MicroPlayerController.prototype, '_createWindow').returns(window);
  });

  afterEach(() => {
    if (controller) {
      controller.dispose();
      controller = undefined;
    }

    sandbox.restore();
  });

  it('should prevent the window from closing.', () => {
    controller = new MicroPlayerController(settings);

    const args = { preventDefault: sinon.stub() };
    window.emit('close', args);

    expect(args.preventDefault).to.have.been.calledOnce;
  });

  it('should allow the window to be closed when the controller is disposed.', () => {
    const args = { preventDefault: sinon.stub() };
    let closedID = undefined;

    WindowManager.close = (windowID) => {
      closedID = windowID;
      window.emit('close', args);
    };

    controller = new MicroPlayerController(settings);

    expect(window.setClosable).to.have.not.been.called;
    expect(closedID).to.be.undefined;

    controller.dispose();

    expect(window.setClosable).to.have.been.calledWith(true);
    expect(closedID).to.equal(id);
    expect(args.preventDefault).to.have.not.been.called;
  });
});
