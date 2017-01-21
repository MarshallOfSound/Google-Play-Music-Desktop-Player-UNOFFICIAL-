import { Component, PropTypes } from 'react';
import os from 'os';

export default class PlatformSpecific extends Component {
  static propTypes = {
    children: PropTypes.object,
    platform: PropTypes.string.isRequired,
    version: PropTypes.string,
  };

  render() {
    if (process.platform === this.props.platform) {
      if (!this.props.version) return this.props.children;

      if (os.release().startsWith(this.props.version)) {
        return this.props.children;
      }
    }
    return null;
  }
}
