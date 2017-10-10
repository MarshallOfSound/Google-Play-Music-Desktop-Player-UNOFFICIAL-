import React, { Component, PropTypes } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { green500, green700 } from 'material-ui/styles/colors';

import { requireSettings } from '../generic/SettingsProvider';

class AlarmModal extends Component {
  static propTypes = {
    alarm: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    alarmOption: PropTypes.string,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('alarm:show', this.show);
  }

  componentWillUnmount() {
    Emitter.off('alarm:show', this.show);
  }

  onDateChange = (ev, newDate) => {
    Settings.set('alarm', newDate);
  }

  onOptionChange = (ev, newOption) => {
    Settings.set('alarmOption', newOption);
  }

  cancel = () => {
    Settings.set('alarm', null);
    Settings.set('alarmOption', null);
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
        onTouchTap={this.handleClose}
      />,
    ];
    const timePickerProps = {};
    if (this.props.alarm) {
      timePickerProps.value = new Date(this.props.alarm);
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
          onChange={this.onDateChange}
          {...timePickerProps}
        />
        <RadioButtonGroup defaultSelected={this.props.alarmOption} onChange={this.onOptionChange}>
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

export default requireSettings(AlarmModal, ['alarm', 'alarmOption'], { alarm: null, alarmOption: null });
