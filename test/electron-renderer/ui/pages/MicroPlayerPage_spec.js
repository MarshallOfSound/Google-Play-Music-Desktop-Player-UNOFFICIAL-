/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import MicroPlayerPage from '../../../../build/renderer/ui/pages/MicroPlayerPage';
import mockSettings, { getVars, mockEvent } from '../_mockSettings';

chai.should();

describe('<MicroPlayerPage />', () => {
  let component;
  let fired;

  function track(details) {
    return Object.assign({
      artist: 'alpha',
      album: 'beta',
      title: 'gamma',
      albumArt: 'delta',
    }, details || {});
  }

  beforeEach(() => {
    mockSettings();
    fired = getVars().fired;

    component = mount(<MicroPlayerPage />);
  });

  describe('loading', () => {
    it('should not be loading after receiving the "app:loaded" message.', () => {
      expect(component.state().loading).to.be.true;
      mockEvent('app:loaded');
      expect(component.state().loading).to.be.false;
    });

    it('should emit "micro:ready" event after mounting.', () => {
      expect(fired['micro:ready']).to.have.lengthOf(1);
    });
  });

  describe('controls', () => {
    function find(className) {
      return component.find(`.micro-player .controls .${className}`);
    }

    function verifyDisabled(...classNames) {
      classNames.forEach((name) => {
        const element = find(name);
        expect(element.props().disabled, name).to.be.true;
      });
    }

    function verifyEnabled(...classNames) {
      classNames.forEach((name) => {
        const element = find(name);
        expect(element.props().disabled, name).to.be.falsy;
      });
    }

    it('should initially disable the like/dislike buttons.', () => {
      verifyDisabled('like', 'dislike');
    });

    it('should initially disable the previous/play/next buttons.', () => {
      verifyDisabled('previous', 'play-pause', 'next');
    });

    it('should initially enable the "open main window" button.', () => {
      verifyEnabled('show-main-window');
    });

    it('should enable the like/dislike buttons when there is a track.', () => {
      mockEvent('PlaybackAPI:change:track', track());
      verifyEnabled('like', 'dislike');

      mockEvent('PlaybackAPI:change:track', undefined);
      verifyDisabled('like', 'dislike');
    });

    it('should enable the previous/next buttons when there is a track.', () => {
      mockEvent('PlaybackAPI:change:track', track());
      verifyEnabled('previous', 'next');

      mockEvent('PlaybackAPI:change:track', undefined);
      verifyDisabled('previous', 'next');
    });

    it('should not enable the play button when there is a track but player is stopped.', () => {
      mockEvent('PlaybackAPI:change:track', track());
      verifyDisabled('play-pause');
    });

    it('should enable the play button when there the player is playing.', () => {
      verifyDisabled('play-pause');
      mockEvent('playback:isPlaying');
      verifyEnabled('play-pause');
    });

    it('should enable the play button when there the player is paused.', () => {
      verifyDisabled('play-pause');
      mockEvent('playback:isPaused');
      verifyEnabled('play-pause');
    });

    it('should disable the play button when there the player is stopped.', () => {
      verifyDisabled('play-pause');
      mockEvent('playback:isPaused');
      verifyEnabled('play-pause');
      mockEvent('playback:isStopped');
      verifyDisabled('play-pause');
    });

    it('should be flagged as playing when player is playing.', () => {
      expect(component.state().playing, 'initial').to.be.false;

      mockEvent('playback:isPlaying');
      expect(component.state().playing, 'playing').to.be.true;

      mockEvent('playback:isPaused');
      expect(component.state().playing, 'paused').to.be.false;

      mockEvent('playback:isPlaying');
      expect(component.state().playing, 'playing again').to.be.true;

      mockEvent('playback:isStopped');
      expect(component.state().playing, 'stopped').to.be.false;
    });

    it('should be flagged as stopped when player is stopped.', () => {
      expect(component.state().stopped, 'initial').to.be.true;

      mockEvent('playback:isPlaying');
      expect(component.state().stopped, 'playing').to.be.false;

      mockEvent('playback:isStopped');
      expect(component.state().stopped, 'stopped').to.be.true;

      mockEvent('playback:isPaused');
      expect(component.state().stopped, 'paused').to.be.false;
    });

    it('should be flagged as liked when the rating is liked.', () => {
      expect(component.state().thumbsUp, 'initial').to.be.false;

      mockEvent('PlaybackAPI:change:rating', { liked: true, disliked: false });
      expect(component.state().thumbsUp, 'liked').to.be.true;

      mockEvent('PlaybackAPI:change:rating', { liked: false, disliked: true });
      expect(component.state().thumbsUp, 'disliked').to.be.false;
    });

    it('should be flagged as disliked when the rating is disliked.', () => {
      expect(component.state().thumbsDown, 'initial').to.be.false;

      mockEvent('PlaybackAPI:change:rating', { liked: false, disliked: true });
      expect(component.state().thumbsDown, 'disliked').to.be.true;

      mockEvent('PlaybackAPI:change:rating', { liked: true, disliked: false });
      expect(component.state().thumbsDown, 'liked').to.be.false;
    });

    it('should go to the previous track when the "previous" button is clicked.', () => {
      mockEvent('PlaybackAPI:change:track', track());

      component.find('.controls .previous').simulate('click');
      expect(fired).to.haveOwnProperty('playback:previousTrack');
    });

    it('should toggle playing when the "play" button is clicked.', () => {
      mockEvent('PlaybackAPI:change:track', track());
      mockEvent('playback:isPlaying');

      component.find('.controls .play-pause').simulate('click');
      expect(fired).to.haveOwnProperty('playback:playPause');
    });

    it('should go to the next track when the "next" button is clicked.', () => {
      mockEvent('PlaybackAPI:change:track', track());

      component.find('.controls .next').simulate('click');
      expect(fired).to.haveOwnProperty('playback:nextTrack');
    });

    it('should toggle thumbs up when the like button is clicked.', () => {
      mockEvent('PlaybackAPI:change:track', track());

      component.find('.controls .like').simulate('click');
      expect(fired).to.haveOwnProperty('playback:toggleThumbsUp');
    });

    it('should toggle thumbs down when the dislike button is clicked.', () => {
      mockEvent('PlaybackAPI:change:track', track());

      component.find('.controls .dislike').simulate('click');
      expect(fired).to.haveOwnProperty('playback:toggleThumbsDown');
    });
  });

  describe('track', () => {
    it('should initially not have a track.', () => {
      expect(component.state().hasTrack).to.be.false;
    });

    it('should show the artist and track name in the small view.', () => {
      mockEvent('PlaybackAPI:change:track', track({ artist: 'one', album: 'two', title: 'three' }));
      expect(component.find('.info-group.sm').text()).to.equal('one\u00a0-\u00a0three');
    });

    it('should show the artist, album and track name in the small view.', () => {
      mockEvent('PlaybackAPI:change:track', track({ artist: 'one', album: 'two', title: 'three' }));
      expect(component.find('.info-group.lg .track').text()).to.equal('three');
      expect(component.find('.info-group.lg .artist-album').text()).to.equal('one\u00a0-\u00a0two');
    });

    it('should show the album art when there is a track with album art.', () => {
      mockEvent('PlaybackAPI:change:track', track({ albumArt: 'image' }));
      expect(component.find('.info .album-art img').props().src).to.equal('image');
    });

    it('should show a placeholder for the album art when there is a track without album art.', () => {
      mockEvent('PlaybackAPI:change:track', track({ albumArt: 'image' }));
      expect(component.find('.info .album-art img').props().src).to.equal('image');

      mockEvent('PlaybackAPI:change:track', track({ albumArt: undefined }));
      expect(component.find('.info .album-art img').props().src).to.equal('https://www.samuelattard.com/img/gpm_placeholder.jpg');
    });

    it('should show a placeholder for the album art when there is no track.', () => {
      mockEvent('PlaybackAPI:change:track', track({ albumArt: 'image' }));
      expect(component.find('.info .album-art img').props().src).to.equal('image');

      mockEvent('PlaybackAPI:change:track', undefined);
      expect(component.find('.info .album-art img').props().src).to.equal('https://www.samuelattard.com/img/gpm_placeholder.jpg');
    });
  });

  describe('show main window', () => {
    it('should always enable the "show main window" button.', () => {
      const button = component.find('.show-main-window');
      expect(button.props().disabled, 'initial').to.be.falsy;

      mockEvent('playback:isPlaying');
      expect(button.props().disabled, 'playing').to.be.falsy;

      mockEvent('playback:isStopped');
      expect(button.props().disabled, 'stopped').to.be.falsy;

      mockEvent('PlaybackAPI:change:track', track());
      expect(button.props().disabled, 'track').to.be.falsy;
    });

    it('should emit the "micro:showMainWindow" event when the "show main window" button is clicked.', () => {
      const button = component.find('.show-main-window');
      button.simulate('click');
      expect(fired).to.haveOwnProperty('micro:showMainWindow');
    });
  });

  describe('resize', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    it('should update the album art width when the window is resized.', () => {
      const container = component.find('.album-art');
      expect(container.props().style, 'initial').to.deep.equal({ width: 0 });

      // Verify that the album art element exists, but then
      // replace it so that we can stub the client height.
      expect(component.instance()._albumArtElement).to.exist;
      component.instance()._albumArtElement = { clientHeight: 123 };

      window.dispatchEvent(new Event('resize'));
      expect(container.props().style, 'resized').to.deep.equal({ width: 123 });
    });

    afterEach(() => {
      sandbox.restore();
    });
  });
});
