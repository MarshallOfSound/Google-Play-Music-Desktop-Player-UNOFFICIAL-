// Pre-run
import chai, { expect } from 'chai';

// Actual Test Imports
import WindowManagerClass from '../../build/main/utils/WindowManager';
import MockWindow from './testdata/moch_window';

chai.should();

describe('WindowManager', () => {
  let WindowManager;

  beforeEach(() => {
    WindowManager = new WindowManagerClass();
  });

  it('should add a window a return a Symbol', () => {
    const window = new MockWindow();
    const result = WindowManager.add(window);
    result.should.be.a('symbol');
  });

  it('should return a unique Symbol for each window', () => {
    const window = new MockWindow();
    const result = WindowManager.add(window);
    result.should.be.a('symbol');

    const window2 = new MockWindow();
    const result2 = WindowManager.add(window2);
    result2.should.be.a('symbol');

    result.should.not.be.equal(result2);
  });

  it('should fetch a window from its symbol', () => {
    const window = new MockWindow();
    const result = WindowManager.add(window);
    WindowManager.get(result).should.be.equal(window);
  });

  it('should return null when fetching with an unknown ID', () => {
    expect(WindowManager.get(Symbol())).to.be.equal(null);
  });

  it('should fetch a window from its internal id', () => {
    const window = new MockWindow();
    WindowManager.add(window);
    WindowManager.getByInternalID(window.id).should.be.equal(window);
  });

  it('should fetch a windows from its assigned name', () => {
    const window = new MockWindow();
    WindowManager.add(window, 'MyWindowName');
    WindowManager.getAll('MyWindowName').length.should.be.equal(1);
    WindowManager.getAll('MyWindowName')[0].should.be.equal(window);
  });

  it('should fetch all windows from their assigned names', () => {
    const window = new MockWindow();
    WindowManager.add(window, 'MyWindowName');
    const window2 = new MockWindow();
    WindowManager.add(window2, 'MyWindowName');
    WindowManager.getAll('MyWindowName').length.should.be.equal(2);
    WindowManager.getAll('MyWindowName')[0].should.be.equal(window);
    WindowManager.getAll('MyWindowName')[1].should.be.equal(window2);
  });

  it('should attempt to close a window by its symbol', () => {
    const window = new MockWindow();
    const result = WindowManager.add(window);
    window.open.should.be.equal(true);
    WindowManager.close(result);
    window.open.should.be.equal(false);
  });

  it('should remove reference to the window when it is closed', () => {
    const window = new MockWindow();
    const result = WindowManager.add(window);
    expect(WindowManager.get(result)).to.be.equal(window);
    window.emit('closed');
    expect(WindowManager.get(result)).to.be.equal(null);
  });

  it('should not throw errors when closing a non existent window', () => {
    WindowManager.close(-1);
  });

  it('should return null when fetching non existent windows through any method', () => {
    expect(WindowManager.get(-1)).to.be.equal(null);
    expect(WindowManager.getByInternalID(-1)).to.be.equal(null);
    expect(WindowManager.getAll(-1)).to.be.deep.equal([]);
  });

  it('should return an empty array if it can\'t convert a name to a valid window', () => {
    WindowManager.nameReferences['test.name'] = [-1, -2, -3];
    WindowManager.getAll('test.name').should.be.deep.equal([]);
  });

  it('should return the current WM name when requested', () => {
    if (process.platform === 'linux') return;
    expect(WindowManager.getWindowManagerName()).to.equal(undefined);
  });

  it('should return the current WM GD name when requested', () => {
    if (process.platform === 'linux') return;
    expect(WindowManager.getWindowManagerGDMName()).to.equal(undefined);
  });

  it('should correctly force chain of focus', () => {
    const window = new MockWindow();
    const window2 = new MockWindow();
    const window3 = new MockWindow();

    WindowManager.add(window);
    WindowManager.add(window2);
    WindowManager.add(window3);

    WindowManager.forceFocus(window);
    window.focused.should.be.equal(false);
    window2.emit('focus');
    window.focused.should.be.equal(true);

    window.focused = false;
    window.emit('close');
    window3.emit('focus');
    window.focused.should.be.equal(false);
  });
});
