import React, { Component, PropTypes } from 'react';

export default class RatingButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.arrayOf(PropTypes.string).isRequired,
    textClassNames: PropTypes.arrayOf(PropTypes.string),
    separator: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    text: [],
    textClassNames: [],
    separator: '\u00a0-\u00a0',
  };

  render() {
    const spans = [];

    this.props.text.forEach((text, index) => {
      if (index > 0) {
        spans.push(<span className="separator">{this.props.separator}</span>);
      }

      spans.push(<span className={this.props.textClassNames && this.props.textClassNames[index]}>{text}</span>);
    });

    return <div className={this.props.className}>{spans}</div>;
  }
}
