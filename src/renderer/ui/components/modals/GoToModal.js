import { remote } from 'electron';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import request from 'request';

// Initialize the global Logger to forward to the main process.
window.Logger = remote.getGlobal('Logger');

const urlresolve = function urlresolve(url) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      headers: {
        followAllRedirects: true,
      },
    };
    request
      .head(options)
      .on('response', (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page'));
        }
        resolve(response.request.href);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

export default class GoToModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('gotourl', this.show);
  }

  componentWillUnmount() {
    Emitter.off('gotourl', this.show);
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
    findDOMNode(this.refs.input).querySelector('input').focus();
  }

  go = () => {
    if (this.value) {
      this.parseURL(this.value);
    }
  }

  parseURL = (url) => {
    if (url === 'DEV_MODE') {
      const ok = confirm('You have instructed GPMDP to restart in Dev Mode.' + // eslint-disable-line
              'Please be careful and only continue if you know ' +
              'what you are doing or have been told what to do by a project maintainer.');
      if (!ok) return;

      remote.app.relaunch({
        args: remote.process.argv.slice(1).concat(['--dev']),
      });
      remote.app.quit();
    } else if (url === 'DEBUG_INFO') {
      Emitter.fire('generateDebugInfo');
      this.handleClose();
    } else {
      urlresolve(url)
        .then((resolvedUrl) => {
          if (!/https:\/\/play\.google\.com\/music/g.test(resolvedUrl)) return;
          Emitter.fireAtGoogle('navigate:gotourl', resolvedUrl);
          this.handleClose();
        })
        .catch((err) => {
          Logger.error(err.toString());
        });
    }
  }

  _onChange = (event, newValue) => {
    this.value = newValue;
  }

  _onKeyUp = (event) => {
    if (event.which === 13) {
      this.go();
    }
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-lets-go')}
        primary
        keyboardFocused
        onTouchTap={this.go}
      />,
    ];
    return (
      <Dialog
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
        modal={false}
      >
        <TextField
          ref="input"
          hintText={"E.g. https://play.google.com/music/listen"}
          floatingLabelText={TranslationProvider.query('modal-goToURL-title')}
          onKeyUp={this._onKeyUp}
          onChange={this._onChange}
          floatingLabelFixed
          fullWidth
        />
      </Dialog>
    );
  }
}
