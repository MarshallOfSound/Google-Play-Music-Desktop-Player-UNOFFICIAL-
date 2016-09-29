import * as React from 'react';

const { PropTypes } = React;

const settingsPanelStyle = {
  padding: 12,
};

export default class SettingsTabWrapper extends React.Component<GPMDP.UI.ContainerProps, {}> {
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
