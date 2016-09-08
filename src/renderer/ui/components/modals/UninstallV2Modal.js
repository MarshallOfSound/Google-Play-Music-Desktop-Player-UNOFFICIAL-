import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

export default class UninstallV2Modal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('uninstall:request', this.show);
  }

  componentWillUnmount() {
    Emitter.off('uninstall:request', this.show);
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
    Emitter.fire('uninstall:confirm');
  }

  show = () => {
    this.setState({
      open: true,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-test-ok')}
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        title={TranslationProvider.query('modal-confirmUninstall-title')}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <div dangerouslySetInnerHTML={{ __html: TranslationProvider.query('modal-confirmUninstall-content') }}></div>
      </Dialog>
    );
  }
}
