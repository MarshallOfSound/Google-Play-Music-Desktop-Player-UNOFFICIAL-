import * as React from 'react';

const { PropTypes } = React;

export default class PlatformSpecific extends React.Component<GPMDP.UI.ContainerProps & { platform: string }, {}> {
  static propTypes = {
    children: PropTypes.object,
    platform: PropTypes.string.isRequired,
  };

  render() {
    if (process.platform === this.props.platform) {
      return this.props.children;
    }
    return null;
  }
}
