import React, { Component, PropTypes } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import TextFieldSettings from '../TextFieldSettings';
import { requireSettings } from '../../generic/SettingsProvider';

class SlackTab extends Component {
  static propTypes = {
    setSetting: PropTypes.func.isRequired,
  };

  render() {
    return (
      <SettingsTabWrapper>
        <h4>{TranslationProvider.query('slack-token-label')}</h4>
        <TextFieldSettings
          label={TranslationProvider.query('slack-token-label')}
          settingsKey={'slackToken'}
          placeholder={TranslationProvider.query('slack-token-placeholder')}
        />
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(SlackTab, ['slackToken'], { slackToken: '' });
