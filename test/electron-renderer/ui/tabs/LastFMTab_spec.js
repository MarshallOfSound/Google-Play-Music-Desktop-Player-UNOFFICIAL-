/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import LastFMTab from '../../../../build/renderer/ui/components/settings/tabs/LastFMTab';
import materialUIContext from '../_materialUIContext';
import mockSettings, { fakeSettings, getVars, mockEvent } from '../_mockSettings';

chai.should();

describe('<LastFMTab />', () => {
  beforeEach(() => {
    mockSettings();
  });

  it('should render a SettingsTabWrapper', () => {
    const component = mount(<LastFMTab />, materialUIContext);
    component.find('SettingsTabWrapper').length.should.be.equal(1);
  });

  it('should initially render a controller button', () => {
    const component = mount(<LastFMTab />, materialUIContext);
    component.find('FlatButton').length.should.be.equal(1);
  });

  describe('when logged in to Last.FM', () => {
    let fired;

    beforeEach(() => {
      fakeSettings('lastFMKey', 'A_FAKE_KEY');
      fired = getVars().fired;
    });

    it('should render a logout button', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').text().should.be.equal('lastfm-logout-button-text');
    });

    it('should reset the lastFMKey setting when the button is clicked', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      fired.should.have.property('settings:set');
      fired['settings:set'][0][0].should.be.deep.equal({
        key: 'lastFMKey',
        value: false,
      });
    });
  });

  describe('when logged out of Last.FM', () => {
    let fired;

    beforeEach(() => {
      fakeSettings('lastFMKey', null);
      fired = getVars().fired;
    });

    it('should render a login button', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').text().should.be.equal('lastfm-login-button-text');
    });

    it('should show three dots when the button is clicked', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      component.find('FlatButton').text().should.be.equal('...');
    });

    it('should attempt to login when the button is clicked', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      fired.should.have.property('lastfm:auth');
    });

    it('should be a noop if clicked multiple times without being authorized', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      component.find('FlatButton').text().should.be.equal('...');
      component.find('FlatButton').props().onTouchTap();
      component.find('FlatButton').text().should.be.equal('...');
    });

    it('should show the logout button when the auth process is successful', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      component.find('FlatButton').text().should.be.equal('...');
      mockEvent('settings:change:lastFMKey', 'FAKE_YET_NON_NULL_KEY', 'lastFMKey');
      component.find('FlatButton').text().should.be.equal('lastfm-logout-button-text');
    });

    it('should keep showing the logout button when the auth process is successfully processed multiple times', () => {
      const component = mount(<LastFMTab />, materialUIContext);
      component.find('FlatButton').props().onTouchTap();
      component.find('FlatButton').text().should.be.equal('...');
      mockEvent('settings:change:lastFMKey', 'FAKE_YET_NON_NULL_KEY', 'lastFMKey');
      component.find('FlatButton').text().should.be.equal('lastfm-logout-button-text');
      mockEvent('settings:change:lastFMKey', 'FAKE_YET_NON_NULL_KEY', 'lastFMKey');
      component.find('FlatButton').text().should.be.equal('lastfm-logout-button-text');
    });
  });
});
