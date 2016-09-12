import React, { Component } from 'react';

import FileInput from '../FileInput';
import SettingsTabWrapper from './SettingsTabWrapper';
import RaisedButton from 'material-ui/RaisedButton';

export default class StyleTab extends Component {
  render() {
    return (
      <SettingsTabWrapper>
        <FileInput
          label={TranslationProvider.query('settings-options-style-main-app')}
          settingsKey={'mainAppStyleFile'}
          bonusEvents={['FetchMainAppCustomStyles']}
        />
        <FileInput
          label={TranslationProvider.query('settings-options-style-gpm')}
          settingsKey={'gpmStyleFile'}
          bonusEvents={['FetchGPMCustomStyles']}
        />
        <RaisedButton label={TranslationProvider.query('settings-options-style-refresh')} primary style={{ marginTop: 18 }} />
      </SettingsTabWrapper>
    );
  }
}
