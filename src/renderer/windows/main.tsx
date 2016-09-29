import { remote } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';

import PlayerPage from '../ui/pages/PlayerPage';

require('react-tap-event-plugin')();

render(<PlayerPage />, document.querySelector('#main-window'));
remote.getCurrentWindow().show();
