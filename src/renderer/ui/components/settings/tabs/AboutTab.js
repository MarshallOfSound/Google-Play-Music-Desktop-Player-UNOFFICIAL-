import { remote } from 'electron';
import React, { Component } from 'react';
import SettingsTabWrapper from './SettingsTabWrapper';

const appVersion = remote.app.getVersion();
const appName = remote.app.getName();
const appInDevMode = remote.getGlobal('DEV_MODE') ? 'Running in Development Mode' : '';

export default class AboutTab extends Component {
  render() {
    return (
      <SettingsTabWrapper>
        <h4>
          {TranslationProvider.query('label-about')} {appName}
        </h4>
        <p>
          {TranslationProvider.query('label-version')}: {appVersion}
        </p>
        <p>
          {appInDevMode}
        </p>
      </SettingsTabWrapper>
    );
  }
}
