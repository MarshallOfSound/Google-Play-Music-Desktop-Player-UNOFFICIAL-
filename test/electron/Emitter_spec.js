/* eslint-disable no-unused-expressions */
// Pre-run
import chai from 'chai';
import { ipcMain } from 'electron';

// Actual Test Imports
import EmitterClass from '../../build/main/utils/Emitter';
import MockIPCWindow from './testdata/moch_ipc_window';

chai.should();

const originalIPCMainOn = ipcMain.on.bind(ipcMain);
const originalIPCMainOnce = ipcMain.once.bind(ipcMain);
const originalIPCMainRemoveListener = ipcMain.removeListener.bind(ipcMain);

describe('Emitter (main)', () => {
  let Emitter;
  let testWindow1;
  let testWindow2;
  let IPCHooks;
  let IPCHooksOnce;

  beforeEach(() => {
    // Mock IPC Main
    IPCHooks = {};
    IPCHooksOnce = {};
    ipcMain.on = (eventName, fn) => {
      IPCHooks[eventName] = IPCHooks[eventName] || [];
      IPCHooks[eventName].push(fn);
      originalIPCMainOn(eventName, fn);
    };
    const removeListener = (collection, eventName, fn) => {
      if (collection[eventName]) {
        const index = collection[eventName].indexOf(fn);
        if (index >= 0) {
          collection[eventName].splice(index, 1);
        }
      }
    };
    ipcMain.once = (eventName, fn) => {
      IPCHooksOnce[eventName] = IPCHooksOnce[eventName] || [];
      IPCHooksOnce[eventName].push(fn);
      originalIPCMainOnce(eventName, fn);
    };
    ipcMain.removeListener = (eventName, fn) => {
      removeListener(IPCHooksOnce, eventName, fn);
      removeListener(IPCHooks, eventName, fn);
      originalIPCMainRemoveListener(eventName, fn);
    };
    Emitter = new EmitterClass();
    // Mock WindowManager
    testWindow1 = new MockIPCWindow();
    testWindow2 = new MockIPCWindow();

    global.WindowManager = {
      IDMap: { dummy: 0, goodie: 1 },
      get: () => testWindow1,
      getAll: (name) => { if (name === 'main') { return [testWindow1]; } return [testWindow1, testWindow2, null]; },
      getByInternalID: (id) => { if (id === 'goodie') { return null; } return testWindow1; },
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
    // Should not throw error
    Emitter.sendToWindow('goodie', 'test-event', 'arg1', 'arg2');
  });

  it('should send an IPC event to all windows', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.sendToAll('test-event', 'arg1', 'arg2');
    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].should.be.deep.equal({
      event: 'test-event',
      args: ['arg1', 'arg2'],
    });
  });

  it('should pass a method to be executed on a window', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.executeOnWindow(Symbol(), function () { doFoo(); }, 'bar', 'arg2'); // eslint-disable-line
    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].should.be.deep.equal({
      event: 'execute',
      args: [{
        fn: '(function () {\n      doFoo();\n    }).apply(window, ["bar","arg2"])',
      }],
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

  it('should send passthrough IPC events to GPM when using sendToGooglePlayMusic', () => {
    testWindow1.recieved.length.should.be.equal(0);
    Emitter.sendToGooglePlayMusic('gpm-event', 'bar1', 'bar2');

    testWindow1.recieved.length.should.be.equal(1);
    testWindow1.recieved[0].should.be.deep.equal({
      event: 'passthrough',
      args: [{
        event: 'gpm-event',
        details: ['bar1', 'bar2'],
      }],
    });

    testWindow2.recieved.length.should.be.equal(0);
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

  it('should hook events (once) when requested', () => {
    const fn = () => {};
    Emitter.once('dummy-event', fn);
    IPCHooksOnce['dummy-event'].should.be.ok;
    IPCHooksOnce['dummy-event'].length.should.be.equal(1);
    IPCHooksOnce['dummy-event'][0].should.be.equal(fn);
  });

  it('should unhook events when requested', () => {
    const fn = () => {};
    Emitter.on('dummy-event', fn);
    IPCHooks['dummy-event'].should.be.ok;
    IPCHooks['dummy-event'].length.should.be.equal(1);
    IPCHooks['dummy-event'][0].should.be.equal(fn);

    Emitter.removeListener('dummy-event', fn);
    IPCHooks['dummy-event'].should.be.ok;
    IPCHooks['dummy-event'].length.should.be.equal(0);
  });

  it('should unhook events (once) when requested', () => {
    const fn = () => {};
    Emitter.once('dummy-event', fn);
    IPCHooksOnce['dummy-event'].should.be.ok;
    IPCHooksOnce['dummy-event'].length.should.be.equal(1);
    IPCHooksOnce['dummy-event'][0].should.be.equal(fn);

    Emitter.removeListener('dummy-event', fn);
    IPCHooksOnce['dummy-event'].should.be.ok;
    IPCHooksOnce['dummy-event'].length.should.be.equal(0);
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

  afterEach(() => {
    Object.keys(IPCHooks).forEach((eventName) => ipcMain.removeAllListeners(eventName));
    Object.keys(IPCHooksOnce).forEach((eventName) => ipcMain.removeAllListeners(eventName));
  });
});
