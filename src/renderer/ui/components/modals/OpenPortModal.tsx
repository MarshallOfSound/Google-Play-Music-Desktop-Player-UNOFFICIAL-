import * as React from 'react';
import Dialog from './ThemedDialog';
import FlatButton from 'material-ui/FlatButton';

export default class OpenPortModal extends React.Component<{}, GPMDP.UI.ModalState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    Emitter.on('openport:request', this.show);
  }

  componentWillUnmount() {
    Emitter.off('openport:request', this.show);
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  show = () => {
    this.setState({
      open: true,
    });
  }

  openNow = () => {
    Emitter.fire('openport:confirm');
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label={TranslationProvider.query('button-text-not-now')}
        labelStyle={{ fontSize: 12 }}
        style={{ height: 26, lineHeight: '26px', opacity: 0.7 }}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={TranslationProvider.query('button-text-lets-do-this')}
        primary
        keyboardFocused
        onTouchTap={this.openNow}
      />,
    ];
    return (
      <Dialog
        title={TranslationProvider.query('modal-confirmTray-title')}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <div dangerouslySetInnerHTML={{ __html: TranslationProvider.query('modal-confirmOpenPort-content') }}></div>
      </Dialog>
    );
  }
}
