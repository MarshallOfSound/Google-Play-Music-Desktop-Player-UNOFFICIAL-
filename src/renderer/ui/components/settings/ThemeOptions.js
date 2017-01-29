import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import PlatformSpecific from '../generic/PlatformSpecific';
import ToggleableOption from './ToggleableOption';
import SettingsTabWrapper from './tabs/SettingsTabWrapper';
import { requireSettings } from '../generic/SettingsProvider';


import { themeColors } from '../../utils/constants';

class ThemeOptions extends Component {
  static propTypes = {
    themeColor: PropTypes.string.isRequired,
    themeType: PropTypes.string.isRequired,
    themeTypeShouldTrackSystem: PropTypes.bool.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  changeThemeColor = (event) => {
    this.props.setSetting('themeColor', window.getComputedStyle(ReactDOM.findDOMNode(event.target))['background-color']);
  }

  changeThemeType = (event, newValue) => {
    this.props.setSetting('themeType', newValue);
  }

  openColorPicker = () => {
    Emitter.fire('window:color_wheel');
  }

  render() {
    return (
      <SettingsTabWrapper>
        <PlatformSpecific platform="darwin">
          <div style={{ paddingBottom: 16 }}>
            <ToggleableOption
              label={TranslationProvider.query('settings-option-custom-theme-should-track-system')}
              settingsKey={"themeTypeShouldTrackSystem"}
            />
          </div>
        </PlatformSpecific>
        {
          this.props.themeTypeShouldTrackSystem ?
            null :
            <RadioButtonGroup name="shipSpeed" defaultSelected={this.props.themeType} onChange={this.changeThemeType}>
              <RadioButton
                value="HIGHLIGHT_ONLY"
                label={TranslationProvider.query('settings-option-custom-theme-light')}
              />
              <RadioButton
                value="FULL"
                label={TranslationProvider.query('settings-option-custom-theme-dark')}
              />
            </RadioButtonGroup>
        }
        <h5>{TranslationProvider.query('settings-option-custom-theme-choose-color')}</h5>
        <div className="color-square-wrapper">
          {
            themeColors.map((color) => <div key={color} className={`color-square ${color}`} onClick={this.changeThemeColor}></div>)
          }
          <h5>
            <small>
              {TranslationProvider.query('settings-option-custom-theme-choose-custom')}&nbsp;
              <a href="#" onClick={this.openColorPicker}>
                {TranslationProvider.query('settings-option-custom-theme-custom-color')}
              </a>
            </small>
          </h5>
        </div>
      </SettingsTabWrapper>
    );
  }
}

export default requireSettings(ThemeOptions, ['themeColor', 'themeType', 'themeTypeShouldTrackSystem'], {});
