import * as React from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import AudioDeviceSelector from '../AudioDeviceSelector';

export default class AudioTab extends React.Component<{}, {}> {
  render() {
    return (
      <SettingsTabWrapper>
        <AudioDeviceSelector />
      </SettingsTabWrapper>
    );
  }
}
