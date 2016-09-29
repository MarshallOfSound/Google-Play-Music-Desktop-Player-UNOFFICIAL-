import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { requireSettings } from '../generic/SettingsProvider';

const { PropTypes } = React;


class AudioDeviceSelector extends React.Component<{
  audiooutput: string
}, {
  deviceList: GPMDP.AudioDevice[]
}> {
  static propTypes = {
    audiooutput: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      deviceList: [],
    };
  }

  componentDidMount() {
    Emitter.on('audiooutput:list', this.updateDeviceList);
    Emitter.on('audiooutput:set', this.requestDeviceList);
    this.requestDeviceList();
  }

  componentWillUnmount() {
    Emitter.off('audiooutput:list', this.updateDeviceList);
    Emitter.off('audiooutput:set', this.requestDeviceList);
  }

  private onChooseDevice = (event: Event, key: string, value: string) => {
    Emitter.fireAtGoogle('audiooutput:set', this.state.deviceList[key].id);
    Emitter.fire('audiooutput:set', value);
  }

  private requestDeviceList = () => {
    Emitter.fireAtGoogle('audiooutput:fetch');
  }

  private updateDeviceList = (event: Event, rawDevices: GPMDP.AudioDevice[]) => {
    const devices: GPMDP.AudioDevice[] = [];
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
          value={this.state.deviceList.length === 0 ? '...' : this.props.audiooutput || this.state.deviceList[0].label}
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

export default requireSettings(AudioDeviceSelector, ['audiooutput'], { audiooutput: '' });
