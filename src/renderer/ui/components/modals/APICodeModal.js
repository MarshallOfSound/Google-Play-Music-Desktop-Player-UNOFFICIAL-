import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

export default class APICodeModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      code: '1234',
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('show:code_controller', this._show);
    Emitter.on('hide:code_controller', this._hide);
  }

  componentWillUnmount() {
    Emitter.off('show:code_controller', this._show);
    Emitter.off('hide:code_controller', this._hide);
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  _hide = () => {
    this.handleClose();
  }

  _show = (event, data) => {
    this.setState({
      code: data.authCode,
      open: true,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-ok')}
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <span id="APICodeContainer">
          {this.state.code}
        </span>
      </Dialog>
    );
  }
}
