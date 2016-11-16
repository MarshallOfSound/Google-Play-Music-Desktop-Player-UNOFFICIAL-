import React, { Component, PropTypes } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import { green500, green700 } from 'material-ui/styles/colors';

import { requireSettings } from '../generic/SettingsProvider';

class SleepModal extends Component {
  static propTypes = {
    sleep: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };

  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('sleep:show', this.show);
  }

  componentWillUnmount() {
    Emitter.off('sleep:show', this.show);
  }

  onChange = (ev, newDate) => {
    Settings.set('sleep', newDate);
  }

  cancel = () => {
    Settings.set('sleep', null);
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
        label={TranslationProvider.query('button-text-cancel-sleeptimer')}
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
    if (this.props.sleep) {
      timePickerProps.value = new Date(this.props.sleep);
    }

    return (
      <Dialog
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
        title={TranslationProvider.query('label-sleeptimer')}
      >
        <TimePicker
          hintText={TranslationProvider.query('button-text-click-here-to-set-sleeptimer')}
          fullWidth
          onChange={this.onChange}
          {...timePickerProps}
        />
      </Dialog>
    );
  }
}

export default requireSettings(SleepModal, ['sleep'], { sleep: null });
