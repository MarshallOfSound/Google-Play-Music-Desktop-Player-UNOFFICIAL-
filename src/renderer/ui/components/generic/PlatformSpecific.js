import { Component, PropTypes } from 'react';

export default class PlatformSpecific extends Component {
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
