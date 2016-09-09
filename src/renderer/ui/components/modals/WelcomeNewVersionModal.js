import { remote } from 'electron';
import React, { Component } from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';
import fs from 'fs';
import path from 'path';

const appVersion = remote.app.getVersion();
const changeLog = fs.readFileSync(path.resolve(`${__dirname}/../../../../../MR_CHANGELOG.html`), 'utf8');

export default class WelcomeNewVersionModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: Settings.get('welcomed') !== appVersion,
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
    Settings.set('welcomed', appVersion);
  }

  show = () => {
    this.setState({
      open: true,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-lets-go')}
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        title={`${TranslationProvider.query('modal-welcome-title')} ${appVersion}`}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <div dangerouslySetInnerHTML={{ __html: changeLog }}></div>
      </Dialog>
    );
  }
}
