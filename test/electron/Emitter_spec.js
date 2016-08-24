/* eslint-disable no-unused-expressions */
// Pre-run
import chai from 'chai';
import { ipcMain } from 'electron';

// Actual Test Imports
import EmitterClass from '../../build/main/utils/Emitter';
import MockIPCWindow from './testdata/moch_ipc_window';

chai.should();

const originalIPCMainOn = ipcMain.on.bind(ipcMain);

describe('Emitter (main)', () => {
  let Emitter;
  let testWindow1;
  let testWindow2;
  let IPCHooks;

  beforeEach(() => {
    // Mock IPC Main
    IPCHooks = {};
    ipcMain.on = (eventName, fn) => {
      IPCHooks[eventName] = IPCHooks[eventName] || [];
      IPCHooks[eventName].push(fn);
      originalIPCMainOn(eventName, fn);
    };
    Emitter = new EmitterClass();
    // Mock WindowManager
    testWindow1 = new MockIPCWindow();
    testWindow2 = new MockIPCWindow();

    global.WindowManager = {
      IDMap: { dummy: 0 },
      get: () => testWindow1,
      getAll: () => [testWindow1, testWindow2],
      getByInternalID: () => testWindow1,
    };
  });

  it('should automatically hook into passback events', () => {
    IPCHooks.passback.should.be.ok;
    IPCHooks.passback.length.should.be.equal(1);
    IPCHooks['passback:main'].should.be.ok;
    IPCHooks['passback:main'].length.should.be.equal(1);
    IPCHooks['passback:all'].should.be.ok;
    IPCHooks['passback:all'].length.should.be.equal(1);
  });

  it('should send an IPC event to a window with a given ID', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.sendToWindow(Symbol(), 'test-event', 'arg1', 'arg2');
    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].should.be.deep.equal({
      event: 'test-event',
      args: ['arg1', 'arg2'],
    });
  });

  it('should send IPC events to all windows with a given name', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.sendToWindowsOfName('dummy-name', 'test-event-2', 'arg1', 'arg2');

    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].should.be.deep.equal({
      event: 'test-event-2',
      args: ['arg1', 'arg2'],
    });

    testWindow2.recieved.length.should.be.equal(1);
    testWindow2.recieved[0].should.be.deep.equal({
      event: 'test-event-2',
      args: ['arg1', 'arg2'],
    });
  });

  it('should default the details of an event to an empty object', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.sendToWindow(Symbol(), 'empty-event');
    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].args.length.should.be.equal(1);
    testWindow1.recieved[0].args[0].should.deep.equal({});
  });

  it('should hook events when requested', () => {
    const fn = () => {};
    Emitter.on('dummy-event', fn);
    IPCHooks['dummy-event'].should.be.ok;
    IPCHooks['dummy-event'].length.should.be.equal(1);
    IPCHooks['dummy-event'][0].should.be.equal(fn);
  });

  describe('when the webcontents is not loaded', () => {
    it('should wait for the webContents to load before sending the event', (done) => {
      testWindow1.mockLoading = true;
      testWindow1.recieved.length.should.be.equal(0);
      Emitter.sendToWindow(Symbol(), 'delayed-event', 'delayed', 'for', 'a', 'bit');
      testWindow1.recieved.length.should.be.equal(0);

      testWindow1.webContents.once('did-stop-loading', () => {
        testWindow1.recieved.length.should.be.equal(1);
        testWindow1.recieved[0].should.be.deep.equal({
          event: 'delayed-event',
          args: ['delayed', 'for', 'a', 'bit'],
        });
        done();
      });

      testWindow1.mockLoading = false;
    });

    it('should only send the event on the first load event, not successive events', (done) => {
      testWindow1.mockLoading = true;
      Emitter.sendToWindow(Symbol(), 'delayed-event', 'delayed', 'for', 'a', 'bit');
      testWindow1.recieved.length.should.be.equal(0);

      testWindow1.webContents.once('did-stop-loading', () => {
        testWindow1.recieved.length.should.be.equal(1);

        testWindow1.webContents.once('did-stop-loading', () => {
          testWindow1.recieved.length.should.be.equal(1);
          done();
        });

        testWindow1.mockLoading = false;
      });

      testWindow1.mockLoading = false;
    });
  });
});
