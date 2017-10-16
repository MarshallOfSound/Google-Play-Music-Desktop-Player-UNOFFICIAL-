import React, { Component, PropTypes } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import TextFieldSettings from '../TextFieldSettings';
import { requireSettings } from '../../generic/SettingsProvider';

class ListenBrainzTab extends Component {
  static propTypes = {
    setSetting: PropTypes.func.isRequired,
  };

  render() {
    return (
      <SettingsTabWrapper>
        <h4>{TranslationProvider.query('listenbrainz-label-user-token')}</h4>
        <TextFieldSettings
          label={TranslationProvider.query('listenbrainz-label-user-token')}
          settingsKey={'listenBrainzUserToken'}
        />
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(ListenBrainzTab, ['listenBrainzUserToken'], { listenBrainzUserToken: '' });
