import React, { Component, PropTypes } from 'react';

export default class LoadingSpinner extends Component {
  static propTypes = {
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 2,
  };

  render() {
    return (
      <svg className="circular" viewBox="25 25 50 50">
        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth={this.props.size} strokeMiterlimit="10" />
      </svg>
    );
  }
}
