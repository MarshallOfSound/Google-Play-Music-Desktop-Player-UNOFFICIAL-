import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import PlayerPage from '../ui/pages/PlayerPage';

injectTapEventPlugin();

ReactDOM.render(<PlayerPage />, document.querySelector('#main-window'));
remote.getCurrentWindow().show();
