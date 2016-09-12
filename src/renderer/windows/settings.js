import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SettingsPage from '../ui/pages/SettingsPage';

injectTapEventPlugin();

ReactDOM.render(<SettingsPage />, document.querySelector('#settings-window'));
remote.getCurrentWindow().show();
