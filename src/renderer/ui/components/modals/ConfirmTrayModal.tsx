import { remote } from 'electron';
import * as React from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

export default class ConfirmTrayModal extends React.Component<{}, GPMDP.UI.ModalState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
    Emitter.fire('window:close', remote.getCurrentWindow().id);
  }

  handleCloseAndNeverAgain = () => {
    Settings.set('warnMinToTray', false);
    this.handleClose();
  }

  show = () => {
    this.setState({
      open: true,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-ok')}
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={TranslationProvider.query('button-text-dont-tell-me-again')}
        primary
        keyboardFocused
        onTouchTap={this.handleCloseAndNeverAgain}
      />,
    ];
    return (
      <Dialog
        title={TranslationProvider.query('modal-confirmTray-title')}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        {TranslationProvider.query('modal-confirmTray-content')}
      </Dialog>
    );
  }
}
