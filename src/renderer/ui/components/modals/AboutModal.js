import { remote } from 'electron';
import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

const appVersion = remote.app.getVersion();
const appName = remote.app.getName();
const appInDevMode = remote.getGlobal('DEV_MODE') ? 'Running in Development Mode' : '';

export default class AboutModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('about', this.show);
  }

  componentWillUnmount() {
    Emitter.off('about', this.show);
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
        label={TranslationProvider.query('button-text-close')}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
        modal={false}
      >
        <h4>
          {TranslationProvider.query('label-about')} {appName}
        </h4>
        <p>
          {TranslationProvider.query('label-version')}: {appVersion}
        </p>
        <p>
          {appInDevMode}
        </p>
      </Dialog>
    );
  }
}
