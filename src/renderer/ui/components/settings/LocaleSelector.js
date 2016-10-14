import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { requireSettings } from '../generic/SettingsProvider';

import { languageMap } from '../../utils/constants';


class LocaleSelector extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  onChooseLocale = (event, key, value) => {
    Settings.set('locale', value);
  }

  render() {
    let items = fs.readdirSync(path.resolve(__dirname, '..', '..', '..', '..', '_locales'))
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace(/\.json/g, ''))
      .filter((fileName) => !!languageMap[fileName])
      .map((fileName) => (
        <MenuItem key={fileName} value={fileName} primaryText={languageMap[fileName]} />
      ));
    return (
      <div style={{ width: '90%' }}>
        <SelectField
          value={this.props.locale}
          onChange={this.onChooseLocale}
          floatingLabelText={
            `${TranslationProvider.query('settings-option-change-locale')} (${TranslationProvider.query('settings-option-enable-system-borders-details')})`
          }
          maxHeight={200}
          disabled={items.length === 0}
          fullWidth
        >
          {items}
        </SelectField>
      </div>
    );
  }
}

export default requireSettings(LocaleSelector, ['locale'], { locale: remote.app.getLocale() });
