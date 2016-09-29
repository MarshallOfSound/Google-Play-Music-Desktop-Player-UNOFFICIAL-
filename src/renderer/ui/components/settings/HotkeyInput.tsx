import * as _ from 'lodash';
import * as React from 'react';
import TextField from 'material-ui/TextField';

import { requireSettings } from '../generic/SettingsProvider';
import { ACCELERATOR_KEYS, MODIFIER_KEYS, ACTION_KEYS } from '../../utils/constants';

const { PropTypes } = React;

const styles = {
  inputContainer: {
    width: '50%',
    float: 'left',
    padding: '4px 6px',
  },
};

class HotkeyInput extends React.Component<{
  label: string
  hotkeyAction: 'playPause' | 'stop' | 'previousTrack' | 'nextTrack' | 'thumbsUp' | 'thumbsDown' | 'increaseVolume' | 'decreaseVolume'
  hotkeys: any
  setSettings: Function
}, {}> {
  keys: GPMDP.KeyStore

  static propTypes = {
    label: PropTypes.string.isRequired,
    hotkeyAction: PropTypes.oneOf([
      'playPause',
      'stop',
      'previousTrack',
      'nextTrack',
      'thumbsUp',
      'thumbsDown',
      'increaseVolume',
      'decreaseVolume',
    ]).isRequired,
    hotkeys: PropTypes.object.isRequired,
    setSetting: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.keys = {
      accelerators: [],
      modifiers: [],
      actions: [],
    };
  }

  private updateHotkey = (accelerator: string) => {
    if (this.props.hotkeys[this.props.hotkeyAction] === accelerator) return;
    Emitter.fire('hotkey:set', {
      action: this.props.hotkeyAction,
      accelerator,
    });
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const keyCode = event.which;

    if (ACCELERATOR_KEYS[keyCode]) {
      this.keys.accelerators = [ACCELERATOR_KEYS[keyCode]];
    } else if (MODIFIER_KEYS[keyCode] && !_.includes(this.keys.modifiers, MODIFIER_KEYS[keyCode])) {
      this.keys.modifiers.push(MODIFIER_KEYS[keyCode]);
    } else if (ACTION_KEYS[keyCode] && !_.includes(this.keys.actions, ACTION_KEYS[keyCode])) {
      this.keys.actions.push(ACTION_KEYS[keyCode]);
    }
    this.writeAccelerator();
    event.preventDefault();
    return false;
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    const keyCode = event.which;

    if (ACCELERATOR_KEYS[keyCode]) {
      _.remove(this.keys.accelerators, (value) => value === ACCELERATOR_KEYS[keyCode]);
    } else if (MODIFIER_KEYS[keyCode]) {
      _.remove(this.keys.modifiers, (value) => value === MODIFIER_KEYS[keyCode]);
    } else if (ACTION_KEYS[keyCode]) {
      _.remove(this.keys.actions, (value) => value === ACTION_KEYS[keyCode]);
    } else if (keyCode === 27) {
      this.reset();
    }
    this.writeAccelerator();
  }

  private reset = () => {
    this.keys = {
      accelerators: [],
      modifiers: [],
      actions: [],
    };
    this.updateHotkey(null);
  }

  private writeAccelerator = () => {
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
          value={this.props.hotkeys[this.props.hotkeyAction] || 'Not Set'}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          fullWidth
        />
      </div>
    );
  }
}

export default requireSettings(HotkeyInput, ['hotkeys'], { hotkeys: {} });
