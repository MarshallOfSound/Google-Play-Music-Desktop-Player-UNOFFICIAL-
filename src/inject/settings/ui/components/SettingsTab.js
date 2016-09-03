import React, { Component, PropTypes } from 'react';

const settingsPanelStyle = {
  padding: 12,
};

export default class SettingsTab extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
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
