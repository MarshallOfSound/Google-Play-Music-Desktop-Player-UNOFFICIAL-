import React, { Component, PropTypes } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import TextListFieldSettings from '../TextListFieldSettings';
import { requireSettings } from '../../generic/SettingsProvider';

class SlackTab extends Component {
  static propTypes = {
    setSetting: PropTypes.func.isRequired,
  };

  render() {
    return (
      <SettingsTabWrapper>
        <h4>
          {TranslationProvider.query('slack-token-label').replace('$1)', '')}
          <a href="https://api.slack.com/custom-integrations/legacy-tokens" target="_blank" style={{ color: 'white' }}>https://api.slack.com/custom-integrations/legacy-tokens</a>)
        </h4>
        <TextListFieldSettings
          label={TranslationProvider.query('slack-token-label')}
          settingsKey={'slackToken'}
          placeholder={TranslationProvider.query('slack-token-placeholder')}
        />

      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(SlackTab, ['slackToken'], { slackToken: '' });
