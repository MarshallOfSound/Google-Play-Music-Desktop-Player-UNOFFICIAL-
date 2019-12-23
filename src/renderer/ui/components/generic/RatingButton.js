import React, { Component, PropTypes } from 'react';

export default class RatingButton extends Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    translationKey: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['like', 'dislike']).isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  _getLikeSvg() {
    /* eslint-disable max-len */
    if (this.props.checked) {
      // https://material.io/resources/icons/?icon=thumb_up&style=baseline
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="like-checked">
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      );
    }

    // https://material.io/resources/icons/?icon=thumb_up&style=outline
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className="like-unchecked">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
        <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
      </svg>
    );
    /* eslint-enable max-len */
  }

  _getDislikeSvg() {
    /* eslint-disable max-len */
    if (this.props.checked) {
      // https://material.io/resources/icons/?icon=thumb_down&style=baseline
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="dislike-checked">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
        </svg>
      );
    }

    // https://material.io/resources/icons/?icon=thumb_down&style=outline
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className="dislike-unchecked">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4z" />
      </svg>
    );
    /* eslint-enable max-len */
  }

  render() {
    let icon;

    // "Outline" icons don't exist in the Material Icons font that's
    // used in the other buttons, so we need to use SVGs here.
    if (this.props.type === 'like') {
      icon = this._getLikeSvg();
    } else {
      icon = this._getDislikeSvg();
    }

    return (
      <button
        className={this.props.type}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        title={TranslationProvider.query(this.props.translationKey)}
      >
        {icon}
      </button>
    );
  }
}
