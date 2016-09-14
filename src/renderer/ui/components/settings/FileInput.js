import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import SettingsProvider from '../generic/SettingsProvider';

class FileInput extends Component {
  static propTypes = {
    bonusEvents: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
    settingsKey: PropTypes.string.isRequired,
  };

  _triggerFile = () => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      title: 'Choose a CSS file',
      buttonLabel: 'Load CSS',
      properties: ['openFile'],
      filters: [
        { name: 'CSS Files', extensions: ['css'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    }, (filenames) => {
      if (!filenames) return;
      const filePath = filenames[0];
      if (fs.existsSync(filePath)) {
        this.props.setSetting(this.props.settingsKey, filePath);
        this.props.bonusEvents.forEach((eventName) => Emitter.fire(eventName));
      }
    });
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <RaisedButton
          label={this.props.label}
          onTouchTap={this._triggerFile}
          style={{ backgroundColor: 'transparent', marginRight: 14, marginTop: 4, maxHeight: 0 }}
          primary
        />
        <TextField
          id={`${this.props.label.replace(/ /g, '-')}_value`}
          value={this.props[this.props.settingsKey] ? path.basename(this.props[this.props.settingsKey]) : ''}
          style={{ flex: 1 }}
          onClick={this._triggerFile}
        />
      </div>
    );
  }
}

export default class WrappedFileInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    bonusEvents: PropTypes.array,
  };

  render() {
    const { bonusEvents, label, settingsKey } = this.props;
    return (
      <SettingsProvider component={FileInput} componentProps={{ bonusEvents: bonusEvents || [], label, settingsKey }} keys={[settingsKey]} defaults={{}} />
    );
  }
}
