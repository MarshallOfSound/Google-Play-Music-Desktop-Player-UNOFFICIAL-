import React, { Component, PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import SettingsTabWrapper from './SettingsTabWrapper';
import TextListFieldSettings from '../TextListFieldSettings';
import { requireSettings } from '../../generic/SettingsProvider';

class SlackTab extends Component {
  static propTypes = {
    setSetting: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
  };

  render() {
    return (
      <SettingsTabWrapper>
        <h4>
          {TranslationProvider.query('slack-token-label').replace('$1)', '')}
          <a
            href="https://api.slack.com/custom-integrations/legacy-tokens"
            target="_blank"
            style={{ color: this.props.muiTheme.palette.primary1Color }}
          >
            https://api.slack.com/custom-integrations/legacy-tokens
          </a>)
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

const ThemedSlackTab = muiThemeable()(SlackTab);
export default requireSettings(ThemedSlackTab, ['slackToken'], { slackToken: '' });
