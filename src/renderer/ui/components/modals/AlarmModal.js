import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { green500, green700 } from 'material-ui/styles/colors';

export default class AlarmModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
      alarmTime: Settings.get('alarmTime', null),
      alarmOption: Settings.get('alarmOption', 'normal'),
      alarmDuration: Settings.get('alarmDuration', null),
      alarmDurationSeconds: Settings.get('alarmDurationSeconds', null),
      alarmDurationMinutes: Settings.get('alarmDurationMinutes', null),
      alarmDurationHours: Settings.get('alarmDurationHours', null),
    };
  }

  componentDidMount() {
    Emitter.on('alarm:show', this.show);
  }

  componentWillUnmount() {
    Emitter.off('alarm:show', this.show);
  }

  onTimeChange = (ev, newTime) => {
    this.clearDuration();
    this.setState({
      alarmTime: newTime,
    });
  }

  onOptionChange = (ev, newOption) => {
    this.setState({
      alarmOption: newOption,
    });
  }

  onDurationSecondsChange = (ev, newSecond) => {
    this.clearTime();
    if (newSecond > 60) {
      this.setState({
        alarmDurationSeconds: 60,
      });
    } else {
      this.setState({
        alarmDurationSeconds: newSecond,
      });
    }
  }

  onDurationMinutesChange = (ev, newMinute) => {
    this.clearTime();
    if (newMinute > 60) {
      this.setState({
        alarmDurationMinutes: 60,
      });
    } else {
      this.setState({
        alarmDurationMinutes: newMinute,
      });
    }
  }

  onDurationHoursChange = (ev, newHour) => {
    this.clearTime();
    if (newHour > 60) {
      this.setState({
        alarmDurationHours: 60,
      });
    } else {
      this.setState({
        alarmDurationHours: newHour,
      });
    }
  }

  calculateDuration = () => {
    const seconds = (this.state.alarmDurationSeconds * 1000);
    const minutes = (this.state.alarmDurationMinutes * 60 * 1000);
    const hours = (this.state.alarmDurationHours * 60 * 60 * 1000);
    return seconds + minutes + hours;
  }

  clearTime = () => {
    this.setState({
      alarmTime: '',
    });
  }

  clearDuration = () => {
    this.setState({
      alarmDurationSeconds: '',
      alarmDurationMinutes: '',
      alarmDurationHours: '',
      alarmDuration: null,
    });
  }

  cancel = () => {
    this.clearTime();
    this.clearDuration();
    Settings.set('alarmTime', null);
    Settings.set('alarmOption', null);
    Settings.set('alarmDurationSeconds', null);
    Settings.set('alarmDurationMinutes', null);
    Settings.set('alarmDurationHours', null);
    Settings.set('alarmDuration', null);
    this.handleClose();
  }

  save = () => {
    Settings.set('alarmTime', this.state.alarmTime);
    Settings.set('alarmOption', this.state.alarmOption);
    Settings.set('alarmDurationSeconds', this.state.alarmDurationSeconds);
    Settings.set('alarmDurationMinutes', this.state.alarmDurationMinutes);
    Settings.set('alarmDurationHours', this.state.alarmDurationHours);

    const duration = this.calculateDuration();
    if (duration > 0) {
      Settings.set('alarmDuration', duration);
    } else {
      Settings.set('alarmDuration', null);
    }
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  show = () => {
    this.setState({
      open: true,
    });
  }

  render() {
    const styles = ({
      firstDurationInput: {
        width: 150,
      },
      durationInput: {
        width: 150,
        marginLeft: 10,
      },
    });
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-cancel-alarm')}
        onTouchTap={this.cancel}
      />,
      <FlatButton
        label={TranslationProvider.query('button-text-ok')}
        backgroundColor={green500}
        hoverColor={green700}
        primary
        keyboardFocused
        labelStyle={{ color: 'white' }}
        onTouchTap={this.save}
      />,
    ];
    const timePickerProps = {};
    if (this.state.alarmTime) {
      timePickerProps.value = new Date(this.state.alarmTime);
    }

    return (
      <Dialog
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
        title={TranslationProvider.query('label-alarm')}
      >
        <TimePicker
          hintText={TranslationProvider.query('button-text-click-here-to-set-alarm')}
          fullWidth
          onChange={this.onTimeChange}
          {...timePickerProps}
        />
        <TextField
          hintText={TranslationProvider.query('label-alarm-duration-seconds')}
          type="number"
          min="0"
          max="60"
          value={this.state.alarmDurationSeconds}
          style={styles.firstDurationInput}
          onChange={this.onDurationSecondsChange}
        />
        <TextField
          hintText={TranslationProvider.query('label-alarm-duration-minutes')}
          type="number"
          min="0"
          max="60"
          value={this.state.alarmDurationMinutes}
          style={styles.durationInput}
          onChange={this.onDurationMinutesChange}
        />
        <TextField
          hintText={TranslationProvider.query('label-alarm-duration-hours')}
          type="number"
          min="0"
          max="60"
          value={this.state.alarmDurationHours}
          style={styles.durationInput}
          onChange={this.onDurationHoursChange}
        />
        <RadioButtonGroup defaultSelected={this.state.alarmOption} onChange={this.onOptionChange}>
          <RadioButton
            value="normal"
            label={TranslationProvider.query('label-alarm-option-normal')}
          />
          <RadioButton
            value="fade"
            label={TranslationProvider.query('label-alarm-option-fade')}
          />
        </RadioButtonGroup>
      </Dialog>
    );
  }
}
