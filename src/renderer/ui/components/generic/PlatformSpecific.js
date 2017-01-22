import { Component, PropTypes } from 'react';
import os from 'os';
import semver from 'semver';

export const semverValidator = (props, propName, componentName) => {
  if (props[propName]) {
    return semver.validRange(props[propName]) ? null : new Error(`${propName} in ${componentName} is not a valid semver string`);
  }
  return null;
};

export default class PlatformSpecific extends Component {
  static propTypes = {
    children: PropTypes.object,
    platform: PropTypes.string.isRequired,
    versionRange: semverValidator,
  };

  render() {
    if (process.platform === this.props.platform) {
      if (!this.props.versionRange) return this.props.children;

      if (semver.validRange(this.props.versionRange) && semver.satisfies(os.release(), this.props.versionRange)) {
        return this.props.children;
      }
    }
    return null;
  }
}
