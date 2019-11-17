/* eslint-disable no-unused-expressions */

import { screen } from 'electron';
import chai from 'chai';
import EventEmitter from 'events';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MicroPlayerBoundsManager } from '../../../src/main/features/core/microPlayer/MicroPlayerBoundsManager';

const expect = chai.use(sinonChai).expect;

describe('MicroPlayerBoundsManager', () => {
  let window;
  let sandbox;
  let clock;
  let manager;
  let settings;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();

    window = new EventEmitter();
    window.setPosition = sinon.stub();
    window.getPosition = sinon.stub().returns([0, 0]);
    window.getSize = sinon.stub().returns([100, 100]);
    window.getBounds = () => ({
      x: window.getPosition()[0],
      y: window.getPosition()[1],
      width: window.getSize()[0],
      height: window.getSize()[1],
    });

    settings = {
      size: [0, 0],
      position: [0, 0],
    };
  });

  describe('ensure on screen', () => {
    function verifyAdjustment(originalPosition, size, screenBounds, adjustedPosition) {
      settings.position = originalPosition;
      window.getSize.returns(size);

      const getDisplayMatching = sandbox.stub(screen, 'getDisplayMatching').returns({
        bounds: screenBounds,
      });

      manager = new MicroPlayerBoundsManager(window, settings);

      expect(getDisplayMatching).to.have.been.calledWith({
        x: originalPosition[0],
        y: originalPosition[1],
        width: size[0],
        height: size[1],
      });

      expect(window.setPosition).to.have.been.calledWith(...adjustedPosition);
    }

    it('should position the window at the top of the screen with the main window when no position has been saved.', () => {
      settings.position = undefined;
      window.getSize.returns([100, 200]);

      const getDisplayMatching = sandbox.stub(screen, 'getDisplayMatching').returns({
        bounds: { x: 400, y: 600, width: 1000, height: 2000 },
      });

      global.WindowManager = {
        getAll: sinon.stub().returns([{
          getBounds: () => ({ x: 1, y: 2, width: 3, height: 4 }),
        }]),
      };

      manager = new MicroPlayerBoundsManager(window, settings);

      expect(global.WindowManager.getAll).to.have.been.calledWith('main');
      expect(getDisplayMatching).to.have.been.calledWith({ x: 1, y: 2, width: 3, height: 4 });
      expect(window.setPosition).to.have.been.calledWith(850, 600);
    });

    it('should move the window down when it is above the top of the screen.', () => {
      verifyAdjustment(
        [800, 280],
        [100, 200],
        { x: 400, y: 300, width: 1000, height: 2000 },
        [800, 300]
      );
    });

    it('should move the window up when it is below the bottom of the screen.', () => {
      verifyAdjustment(
        [800, 2150],
        [100, 200],
        { x: 400, y: 300, width: 1000, height: 2000 },
        [800, 2100]
      );
    });

    it('should move the window to the right when the left edge is off screen.', () => {
      verifyAdjustment(
        [390, 800],
        [100, 200],
        { x: 400, y: 300, width: 1000, height: 2000 },
        [400, 800]
      );
    });

    it('should move the window to the left when the right edge is off screen.', () => {
      verifyAdjustment(
        [1310, 800],
        [100, 200],
        { x: 400, y: 300, width: 1000, height: 2000 },
        [1300, 800]
      );
    });
  });

  describe('saving', () => {
    function verifySettings(position, size) {
      expect({ position: settings.position, size: settings.size }).to.deep.equal({
        position,
        size,
      });
    }

    beforeEach(() => {
      sandbox.stub(screen, 'getDisplayMatching').returns({
        bounds: { x: 0, y: 0, width: 1000, height: 1000 },
      });

      settings.position = [0, 0];
      settings.size = [100, 100];
      window.getSize.returns([100, 100]);

      manager = new MicroPlayerBoundsManager(window, settings);
    });

    it('should save the size and position one second after the window is moved.', () => {
      window.getPosition.returns([20, 30]);
      window.emit('move');

      clock.tick(999);
      verifySettings([0, 0], [100, 100]);

      clock.tick(1);
      verifySettings([20, 30], [100, 100]);
    });

    it('should save the size and position one second after the window is resized.', () => {
      window.getSize.returns([80, 120]);
      window.emit('resize');

      clock.tick(999);
      verifySettings([0, 0], [100, 100]);

      clock.tick(1);
      verifySettings([0, 0], [80, 120]);
    });

    it('should debounce window moving and resizing.', () => {
      window.getSize.returns([50, 70]);
      window.emit('resize');

      clock.tick(800);

      window.getPosition.returns([25, 60]);
      window.emit('move');

      clock.tick(200);
      verifySettings([0, 0], [100, 100]);

      clock.tick(800);
      verifySettings([25, 60], [50, 70]);
    });

    it('should cancel saving when the window is closed.', () => {
      window.getSize.returns([50, 70]);
      window.emit('resize');

      clock.tick(500);
      window.emit('closed');

      clock.tick(1000);
      verifySettings([0, 0], [100, 100]);
    });
  });

  describe('snapping', () => {
    function verifySnap(expectedPosition) {
      clock.tick(249);
      expect(window.setPosition).to.have.not.been.called;

      clock.tick(1);
      expect(window.setPosition).to.have.been.calledWith(...expectedPosition);
    }

    beforeEach(() => {
      sandbox.stub(screen, 'getDisplayMatching').returns({
        bounds: { x: 200, y: 400, width: 600, height: 800 },
      });

      settings.position = [300, 500];
      settings.size = [100, 100];
      window.getSize.returns([100, 100]);

      manager = new MicroPlayerBoundsManager(window, settings);

      window.setPosition.reset();
    });

    it('should not snap to the top of the screen after the window is moved but is not near the top of the screen.', () => {
      window.getPosition.returns([300, 410]);
      window.emit('move');
      clock.tick(10000);
      expect(window.setPosition).to.have.not.been.called;
    });

    it('should snap to the top of the screen after the window is moved close to the top of the screen.', () => {
      window.getPosition.returns([300, 405]);
      window.emit('move');
      verifySnap([300, 400]);
    });

    it('should snap to the top of the screen after the window is moved above the top of the screen.', () => {
      window.getPosition.returns([300, 390]);
      window.emit('move');
      verifySnap([300, 400]);
    });

    it('should not snap to the bottom of the screen after the window is moved but is not near the bottom of the screen.', () => {
      window.getPosition.returns([300, 1090]);
      window.emit('move');
      clock.tick(10000);
      expect(window.setPosition).to.have.not.been.called;
    });

    it('should snap to the bottom of the screen after the window is moved close to the bottom of the screen.', () => {
      window.getPosition.returns([300, 1095]);
      window.emit('move');
      verifySnap([300, 1100]);
    });

    it('should snap to the bottom of the screen after the window is moved beloe the bottom of the screen.', () => {
      window.getPosition.returns([300, 1110]);
      window.emit('move');
      verifySnap([300, 1100]);
    });
  });

  it('should remove window listeners when disposed.', () => {
    settings.position = [0, 0];
    window.getSize.returns([100, 100]);

    manager = new MicroPlayerBoundsManager(window, settings);

    window.getSize.returns([50, 70]);
    window.emit('resize');
    clock.tick(1000);

    expect(settings.size).to.deep.equal([50, 70]);

    manager.dispose();

    window.getSize.returns([20, 40]);
    window.emit('resize');
    clock.tick(1000);

    expect(settings.size).to.deep.equal([50, 70]);
  });

  afterEach(() => {
    if (manager) {
      manager.dispose();
      manager = undefined;
    }

    sandbox.restore();
  });
});
