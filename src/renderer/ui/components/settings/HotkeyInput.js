import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import { requireSettings } from '../generic/SettingsProvider';
import { ACCELERATOR_KEYS, MODIFIER_KEYS, ACTION_KEYS } from '../../utils/constants';

const styles = {
  inputContainer: {
    width: '50%',
    float: 'left',
    padding: '4px 6px',
  },
};

class HotkeyInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    hotkeyAction: PropTypes.oneOf([
      'playPause',
      'playPause',
      'stop',
      'previousTrack',
      'nextTrack',
      'thumbsUp',
      'thumbsDown',
      'increaseVolume',
      'decreaseVolume',
      'infoTrack',
      'imFeelingLucky',
    ]).isRequired,
    hotkeys: PropTypes.object.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.keys = {
      accelerators: [],
      modifiers: [],
      actions: [],
    };
  }

  updateHotkey = (accelerator) => {
    if (this.props.hotkeys[this.props.hotkeyAction] === accelerator) return;
    Emitter.fire('hotkey:set', {
      action: this.props.hotkeyAction,
      accelerator,
    });
  }

  _handleKeyDown = (event) => {
    const keyCode = event.which;

    if (ACCELERATOR_KEYS[keyCode]) {
      this.keys.accelerators = [ACCELERATOR_KEYS[keyCode]];
    } else if (MODIFIER_KEYS[keyCode] && !_.includes(this.keys.modifiers, MODIFIER_KEYS[keyCode])) {
      this.keys.modifiers.push(MODIFIER_KEYS[keyCode]);
    } else if (ACTION_KEYS[keyCode] && !_.includes(this.keys.actions, ACTION_KEYS[keyCode])) {
      this.keys.actions.push(ACTION_KEYS[keyCode]);
    }
    this._writeAccelerator();
    event.preventDefault();
    return false;
  }

  _handleKeyUp = (event) => {
    const keyCode = event.which;

    if (ACCELERATOR_KEYS[keyCode]) {
      _.remove(this.keys.accelerators, (value) => value === ACCELERATOR_KEYS[keyCode]);
    } else if (MODIFIER_KEYS[keyCode]) {
      _.remove(this.keys.modifiers, (value) => value === MODIFIER_KEYS[keyCode]);
    } else if (ACTION_KEYS[keyCode]) {
      _.remove(this.keys.actions, (value) => value === ACTION_KEYS[keyCode]);
    } else if (keyCode === 27) {
      this._reset();
    }
    this._writeAccelerator();
  }

  _reset = () => {
    this.keys = {
      accelerators: [],
      modifiers: [],
      actions: [],
    };
    this.updateHotkey(null);
  }

  _writeAccelerator = () => {
    if (this.keys.accelerators.length > 0) {
      this.keys.modifiers.sort();
      this.keys.actions.sort();

      if (this.keys.actions.length > 0) {
        const hotkeyArr = [this.keys.accelerators.join('+')];
        if (this.keys.modifiers.length > 0) {
          hotkeyArr.push(this.keys.modifiers.join('+'));
        }
        hotkeyArr.push(this.keys.actions.join('+'));
        this.updateHotkey(hotkeyArr.join('+'));
      }
    }
  }

  render() {
    return (
      <div style={styles.inputContainer}>
        <TextField
          hintText={TranslationProvider.query('settings-option-hotkey-hint')}
          floatingLabelText={this.props.label}
          floatingLabelFixed
          value={this.props.hotkeys[this.props.hotkeyAction] || TranslationProvider.query('settings-option-hotkey-not-set')}
          onKeyDown={this._handleKeyDown}
          onKeyUp={this._handleKeyUp}
          fullWidth
        />
      </div>
    );
  }
}

export default requireSettings(HotkeyInput, ['hotkeys'], { hotkeys: {} });
