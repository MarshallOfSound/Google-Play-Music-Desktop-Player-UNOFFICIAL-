import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const context = {
  context: { muiTheme: getMuiTheme(darkBaseTheme) },
  childContextTypes: { muiTheme: React.PropTypes.object.isRequired },
};

export default context;
