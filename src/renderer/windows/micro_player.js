import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MicroPlayerPage from '../ui/pages/MicroPlayerPage';

injectTapEventPlugin();

ReactDOM.render(<MicroPlayerPage />, document.querySelector('#micro-player'));
remote.getCurrentWindow().show();
