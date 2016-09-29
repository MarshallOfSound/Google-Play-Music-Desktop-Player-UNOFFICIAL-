import { remote } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';

import SettingsPage from '../ui/pages/SettingsPage';

require('react-tap-event-plugin')();

render(<SettingsPage />, document.querySelector('#settings-window'));
remote.getCurrentWindow().show();
