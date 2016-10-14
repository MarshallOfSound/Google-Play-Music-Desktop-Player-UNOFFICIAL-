import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ColorWheelPage from '../ui/pages/ColorWheelPage';

injectTapEventPlugin();

ReactDOM.render(<ColorWheelPage />, document.querySelector('#color-wheel-window'));
remote.getCurrentWindow().show();
