import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { requireSettings } from '../generic/SettingsProvider';


class AudioDeviceSelector extends Component {
  static propTypes = {
    audiooutput: PropTypes.string.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      deviceList: [],
    };
  }

  componentDidMount() {
    Emitter.on('audiooutput:list', this._updateDeviceList);
    Emitter.on('audiooutput:set', this._requestDeviceList);
    this._requestDeviceList();
  }

  componentWillUnmount() {
    Emitter.off('audiooutput:list', this._updateDeviceList);
    Emitter.off('audiooutput:set', this._requestDeviceList);
  }

  onChooseDevice = (event, key, value) => {
    Emitter.fireAtGoogle('audiooutput:set', this.state.deviceList[key].id);
    Emitter.fire('audiooutput:set', value);
  }

  _requestDeviceList = () => {
    Emitter.fireAtGoogle('audiooutput:fetch');
  }

  _updateDeviceList = (event, rawDevices) => {
    const devices = [];
    rawDevices.forEach((device) => {
      if (device.kind === 'audiooutput') {
        let label = device.label;
        if (!label) {
          switch (device.deviceId) {
            case 'default':
              label = TranslationProvider.query('audio-device-default');
              break;
            case 'communications':
              label = TranslationProvider.query('audio-device-communications');
              break;
            default:
              label = TranslationProvider.query('audio-device-unknown');
              break;
          }
        }
        devices.push({
          label,
          id: device.deviceId,
        });
      }
    });
    this.setState({
      deviceList: devices,
    });
  }

  render() {
    let items = this.state.deviceList.map((device, index) => (
      <MenuItem key={index} value={device.label} primaryText={device.label} />
    ));
    if (items.length === 0) {
      items = [<MenuItem key={-1} value="..." primaryText="..." />];
    }
    return (
      <div style={{ width: '90%' }}>
        <SelectField
          value={this.state.deviceList.length === 0 ? '...' : this.props.audiooutput}
          onChange={this.onChooseDevice}
          floatingLabelText={TranslationProvider.query('tray-label-audio-device')}
          maxHeight={200}
          disabled={this.state.deviceList.length === 0}
          fullWidth
        >
          {items}
        </SelectField>
      </div>
    );
  }
}

export default requireSettings(AudioDeviceSelector, ['audiooutput']);
