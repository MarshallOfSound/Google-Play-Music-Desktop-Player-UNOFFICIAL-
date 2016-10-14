import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';

export default class ThemedDialog extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Dialog
        modal
        {...this.props}
        autoScrollBodyContent
        actionsContainerStyle={{ backgroundColor: this.context.muiTheme.dialog.backgroundColor, borderTop: 0 }}
        bodyStyle={{ backgroundColor: this.context.muiTheme.dialog.backgroundColor }}
        titleStyle={{ backgroundColor: this.context.muiTheme.dialog.backgroundColor }}
      >
        {
          this.props.children
        }
      </Dialog>
    );
  }
}
