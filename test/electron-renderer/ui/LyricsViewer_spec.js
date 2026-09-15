/* eslint-disable no-unused-expressions */

import $ from 'jquery';
import React from 'react';
import { findDOMNode } from 'react-dom';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import { shell, remote } from 'electron';
import sinon from 'sinon';
import LyricsViewer from '../../../build/renderer/ui/components/generic/LyricsViewer';
import mockSettings, { fakeSettings, getVars, mockEvent } from './_mockSettings';

chai.should();

describe('<LyricsViewer />', () => {
  let hooks;
  let unhooks;
  let opts;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    mockSettings();
    hooks = getVars().hooks;
    unhooks = getVars().unhooks;
    opts = {
      attachTo: document.createElement('div'),
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render the lyrics container', () => {
    const component = mount(<LyricsViewer />);
    component.children().length.should.be.gt(0);
  });

  it('should hook into the PlaybackAPI events', () => {
    mount(<LyricsViewer />);
    hooks['lyrics:show'].should.be.ok;
    hooks['PlaybackAPI:change:lyrics'].should.be.ok;
    hooks['PlaybackAPI:change:state'].should.be.ok;
    hooks['settings:set:scrollLyrics'].should.be.ok;
  });

  it('should unhook the PlaybackAPI events when unmounting', () => {
    mount(<LyricsViewer />).unmount();
    unhooks['lyrics:show'].should.be.ok;
    unhooks['PlaybackAPI:change:lyrics'].should.be.ok;
    unhooks['PlaybackAPI:change:state'].should.be.ok;
    unhooks['settings:set:scrollLyrics'].should.be.ok;
  });

  it('should hook into the time event when shown', () => {
    mount(<LyricsViewer />);
    mockEvent('lyrics:show');
    hooks['PlaybackAPI:change:time'].should.be.ok;
  });

  it('should show when recieving the show event', () => {
    const component = mount(<LyricsViewer />);
    component.find('#lyrics_back.vis').length.should.be.equal(0);
    mockEvent('lyrics:show');
    component.find('#lyrics_back.vis').length.should.be.equal(1);
  });

  it('should hide when the lyrics are clicked', () => {
    const component = mount(<LyricsViewer />);
    component.find('#lyrics_back.vis').length.should.be.equal(0);
    mockEvent('lyrics:show');
    component.find('#lyrics_back.vis').length.should.be.equal(1);
    component.find('#lyrics_back').simulate('click');
    component.find('#lyrics_back.vis').length.should.be.equal(0);
  });

  it('should say loading lyrics when null lyrics are passed in', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', null);
    const domNode = $(findDOMNode(component.instance()));
    domNode.find('h1').text().should.be.equal('lyrics-loading-message');
  });

  it('should timeout if lyrics aren\'t found in 4 seconds', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', null);
    const domNode = $(findDOMNode(component.instance()));
    clock.tick(4500);
    domNode.find('h1').text().should.be.equal('lyrics-failed-message');
  });

  it('should show "search in Google.com" link if lyrics was not found', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', null);
    component.find('#search-link').length.should.be.equal(0);
    clock.tick(4500);
    component.find('#search-link').length.should.be.equal(1);
  });

  describe('When clicked on "search in Google.com" link', () => {
    it('should open browser, point it to google.com and prefill query field with current song artist and title', () => {
      const remoteStub = sinon.stub(remote, 'getGlobal', () => ({
        currentSong: () => ({ title: 'songTitle', artist: 'artistName' }),
      }));
      const shellStub = sinon.stub(shell, 'openExternal');
      const query = encodeURIComponent('songTitle - artistName lyrics-lyrics');
      const component = mount(<LyricsViewer />, opts);
      mockEvent('PlaybackAPI:change:lyrics', null);
      clock.tick(4500);
      component.find('#search-link').simulate('click');
      remoteStub.restore();

      expect(shellStub.calledOnce).to.equal(true);
      expect(shellStub.getCall(0).args.length).to.equal(1);
      expect(shellStub.getCall(0).args[0]).to.equal(`https://www.google.com/search?q=${query}`);
    });
  });

  it('should update the lyrics when a string of lyrics are passed in', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', null);
    const domNode = $(findDOMNode(component.instance()));
    domNode.find('h1').text().should.be.equal('lyrics-loading-message');
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    domNode.find('p').text().should.be.equal('new lyrics');
  });

  it('should stop scrolling when settings change to false', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('settings:set:scrollLyrics', false);
    const domNode = $(findDOMNode(component.instance()));
    expect(domNode.find('#lyrics p').attr('data-scroll')).to.be.equal(undefined);
  });

  it('should start scrolling when settings change to true', () => {
    const component = mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    mockEvent('settings:set:scrollLyrics', true);
    const domNode = $(findDOMNode(component.instance()));
    expect(domNode.find('#lyrics p').attr('data-scroll')).to.be.equal('true');
  });

  it('should start scrolling when the time changes', () => {
    mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    mockEvent('PlaybackAPI:change:state', true);
    mockEvent('settings:set:scrollLyrics', true);
    mockEvent('PlaybackAPI:change:time', {
      current: 1000,
      total: 2000,
    });
  });

  it('should jump scrolling when the time jumps', () => {
    mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    mockEvent('PlaybackAPI:change:state', true);
    mockEvent('settings:set:scrollLyrics', true);
    mockEvent('PlaybackAPI:change:time', {
      current: 1000,
      total: 20000,
    });
    mockEvent('PlaybackAPI:change:time', {
      current: 18000,
      total: 20000,
    });
  });

  it('should stop animating when the music stops', () => {
    mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    mockEvent('PlaybackAPI:change:state', true);
    mockEvent('settings:set:scrollLyrics', true);
    mockEvent('PlaybackAPI:change:time', {
      current: 1000,
      total: 2000,
    });
    mockEvent('PlaybackAPI:change:state', false);
  });

  it('should not animate when the music isn\'t playing', () => {
    mount(<LyricsViewer />, opts);
    mockEvent('PlaybackAPI:change:lyrics', 'new lyrics');
    mockEvent('PlaybackAPI:change:state', false);
    mockEvent('settings:set:scrollLyrics', true);
    mockEvent('PlaybackAPI:change:time', {
      current: 1000,
      total: 2000,
    });
  });

  it('should animate when the window is resized', () => {
    mount(<LyricsViewer />, opts);
    window.dispatchEvent(new Event('resize'));
  });

  it('should update the styling in dark mode', () => {
    fakeSettings('themeType', 'FULL');
    const component = mount(<LyricsViewer />, opts);
    component.find('#lyrics_bar').props().style.backgroundColor.should.be.equal('themeColor');
  });

  it('should reset styling when the theme is disabled', () => {
    fakeSettings('theme', false);
    const component = mount(<LyricsViewer />, opts);
    component.find('#lyrics_bar').props().style.backgroundColor.should.be.equal('rgb(252, 88, 37)');
  });
});
