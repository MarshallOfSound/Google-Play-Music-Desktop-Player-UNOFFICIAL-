import React, { Component, PropTypes } from 'react';

const settingsPanelStyle = {
  padding: 12,
};

export default class SettingsTabWrapper extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
  };

  render() {
    return (
      <div style={settingsPanelStyle}>
        {
          this.props.children
        }
      </div>
    );
  }
}
