/* eslint-disable no-unused-expressions */

import chai from 'chai';
import EventEmitter from 'events';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MicroPlayerEventAdapter } from '../../../src/main/features/core/microPlayer/MicroPlayerEventAdapter';
import { setAppLoaded } from '../../../src/main/features/core/microPlayer/_applicationState';

const expect = chai.use(sinonChai).expect;

describe('MicroPlayerEventAdapter', () => {
  let playback;
  let events;
  let windowID;
  let adapter;

  function getEvent(name) {
    return events.filter((x) => x.event === name)[0];
  }

  beforeEach(() => {
    windowID = Symbol();
    events = [];

    global.Emitter = new EventEmitter();
    global.Emitter.sendToWindow = (window, event, data) => {
      events.push({ window, event, data });
    };

    playback = new EventEmitter();
    playback.isPlaying = () => false;
    playback.isPaused = () => false;
    playback.getRating = () => ({ liked: false, disliked: false });
    playback.currentSong = () => null;
    global.PlaybackAPI = playback;

    setAppLoaded(true);
  });

  it('should send "app:loaded" message when app is already loaded when once micro player is ready.', () => {
    setAppLoaded(true);
    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');

    // The app:loaded event should always be the first event.
    expect(events[0]).to.deep.equal({ window: windowID, event: 'app:loaded', data: undefined });
  });

  it('should not send "app:loaded" message when app is not already loaded.', () => {
    setAppLoaded(false);
    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(events.map((x) => x.event)).to.not.contain('app:loaded');
  });

  it('should not forward "app:loaded" message.', () => {
    setAppLoaded(false);
    adapter = new MicroPlayerEventAdapter(windowID);
    Emitter.emit('micro:ready');
    expect(events.map((x) => x.event)).to.not.contain('app:loaded');

    // Fire the "app:loaded" event after the micro player is ready.
    // The adapter should not forward this event to the micro player.
    Emitter.emit('app:loaded');
    expect(events.map((x) => x.event)).to.not.contain('app:loaded');
  });

  it('should send "playback:isPlaying" when micro player is ready and app is playing.', () => {
    playback.isPlaying = () => true;
    playback.isPaused = () => false;

    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(getEvent('playback:isPlaying')).to.exist;
    expect(getEvent('playback:isPaused')).to.not.exist;
    expect(getEvent('playback:isStopped')).to.not.exist;
  });

  it('should send "playback:isPaused" when micro player is ready and app is paused.', () => {
    playback.isPlaying = () => false;
    playback.isPaused = () => true;

    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(getEvent('playback:isPlaying')).to.not.exist;
    expect(getEvent('playback:isPaused')).to.exist;
    expect(getEvent('playback:isStopped')).to.not.exist;
  });

  it('should send "playback:isStopped" when micro player is ready and app is stopped.', () => {
    playback.isPlaying = () => false;
    playback.isPaused = () => false;

    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(getEvent('playback:isPlaying')).to.not.exist;
    expect(getEvent('playback:isPaused')).to.not.exist;
    expect(getEvent('playback:isStopped')).to.exist;
  });

  it('should send the current rating when micro player is ready.', () => {
    playback.getRating = () => ({ liked: true, disliked: false });

    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(getEvent('PlaybackAPI:change:rating')).to.deep.equal({
      event: 'PlaybackAPI:change:rating',
      window: windowID,
      data: { liked: true, disliked: false },
    });
  });

  it('should send the current track when micro player is ready.', () => {
    playback.currentSong = () => ({ artist: 'foo', album: 'bar' });

    adapter = new MicroPlayerEventAdapter(windowID);
    expect(events).to.be.empty;
    Emitter.emit('micro:ready');
    expect(getEvent('PlaybackAPI:change:track')).to.deep.equal({
      event: 'PlaybackAPI:change:track',
      window: windowID,
      data: { artist: 'foo', album: 'bar' },
    });
  });

  [
    'playback:isPlaying',
    'playback:isPaused',
    'playback:isStopped',
  ].forEach((event) => {
    it(`should forward the "${event}" event to the micro player.`, () => {
      adapter = new MicroPlayerEventAdapter(windowID);
      Emitter.emit('micro:ready');

      // Reset the captured events so that we ignore
      // any of the initial events that were emitted.
      events = [];

      expect(getEvent(event)).to.not.exist;
      Emitter.emit(event);
      expect(getEvent(event)).to.exist;
    });
  });

  [
    { event: 'change:rating', data: { liked: false, disliked: true } },
    { event: 'change:track', data: { artist: 'foo' } },
  ].forEach(({ event, data }) => {
    it(`should forward the "${event}" event from the PlaybackAPI to the micro player.`, () => {
      adapter = new MicroPlayerEventAdapter(windowID);
      Emitter.emit('micro:ready');

      // Reset the captured events so that we ignore
      // any of the initial events that were emitted.
      events = [];

      expect(getEvent(`PlaybackAPI:${event}`)).to.not.exist;
      playback.emit(event, data);
      expect(getEvent(`PlaybackAPI:${event}`)).to.deep.equal({
        event: `PlaybackAPI:${event}`,
        window: windowID,
        data,
      });
    });
  });

  it('should remove event listeners when disposed.', () => {
    adapter = new MicroPlayerEventAdapter(windowID);
    Emitter.emit('micro:ready');

    // Confirm that an event is forwarded before being disposed.
    events = [];
    Emitter.emit('playback:isPlaying');
    expect(events).to.not.be.empty;

    // Dispose the adapter and reset the captured events list.
    events = [];
    adapter.dispose();

    // Confirm that the event is not forwarded after being disposed.
    Emitter.emit('playback:isPlaying');
    expect(events).to.be.empty;
  });

  describe('micro:showMainWindow', () => {
    let window;

    beforeEach(() => {
      window = {
        isMinimized: () => true,
        setSkipTaskbar: sinon.spy(),
        restore: sinon.spy(),
        show: sinon.spy(),
        focus: sinon.spy(),
      };

      global.WindowManager = {
        getAll: (name) => { // eslint-disable-line arrow-body-style
          return name === 'main' ? [window] : [];
        },
      };

      adapter = new MicroPlayerEventAdapter(windowID);
      Emitter.emit('micro:ready');
    });

    it('should show the main window when requested by the micro player.', () => {
      Emitter.emit('micro:showMainWindow');

      expect(window.setSkipTaskbar).to.have.been.calledWithExactly(false);
      expect(window.show).to.have.been.called;
      expect(window.focus).to.have.been.called;
    });

    it('should not restore the main window if it is not minimized.', () => {
      window.isMinimized = () => false;
      Emitter.emit('micro:showMainWindow');
      expect(window.restore).to.have.not.been.called;
      expect(window.show).to.have.been.called;
    });

    it('should restore the main window if it is minimized.', () => {
      window.isMinimized = () => true;
      Emitter.emit('micro:showMainWindow');
      expect(window.restore).to.have.been.called;
      expect(window.show).to.have.been.called;
    });
  });

  afterEach(() => {
    if (adapter) {
      adapter.dispose();
      adapter = undefined;
    }
  });
});
