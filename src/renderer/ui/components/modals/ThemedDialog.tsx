import * as React from 'react';
import Dialog from 'material-ui/Dialog';

const { PropTypes } = React;

export default class ThemedDialog extends React.Component<GPMDP.UI.ContainerProps, {}> {
  context: GPMDP.UI.ThemeContext;
  
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
