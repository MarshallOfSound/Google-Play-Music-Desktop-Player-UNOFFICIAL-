import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

export default class UpdateModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('update:available', this.show);
  }

  componentWillUnmount() {
    Emitter.off('update:available', this.show);
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

  updateNow = () => {
    Emitter.fire('update:trigger');
  }

  updateLater = () => {
    Emitter.fire('update:wait');
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-not-now')}
        labelStyle={{ fontSize: 12 }}
        style={{ height: 26, lineHeight: '26px', opacity: 0.7 }}
        onTouchTap={this.updateLater}
      />,
      <FlatButton
        label={TranslationProvider.query('button-text-lets-do-this')}
        primary
        keyboardFocused
        onTouchTap={this.updateNow}
      />,
    ];
    return (
      <Dialog
        title={TranslationProvider.query('modal-confirmUpdate-title')}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <div dangerouslySetInnerHTML={{ __html: TranslationProvider.query('modal-confirmUpdate-content') }}></div>
      </Dialog>
    );
  }
}
