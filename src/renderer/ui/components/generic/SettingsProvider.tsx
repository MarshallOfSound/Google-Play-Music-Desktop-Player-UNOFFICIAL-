import * as _ from 'lodash';
import * as React from 'react';

const { PropTypes } = React;

export default class SettingsProvider extends React.Component<{
  component: typeof React.Component,
  componentProps: any,
  defaults: any,
  keys: string[]
}, {}> {
  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object,
    defaults: PropTypes.object.isRequired,
    keys: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const initialState = {};
    props.keys.forEach((settingsKey) => {
      if (typeof props.defaults[settingsKey] !== 'undefined') {
        initialState[settingsKey] = Settings.get(settingsKey, props.defaults[settingsKey]);
      } else {
        initialState[settingsKey] = Settings.get(settingsKey);
      }
    });
    this.state = initialState;
  }

  componentDidMount() {
    this.props.keys.forEach((settingsKey) => {
      Emitter.on(`settings:change:${settingsKey}`, this.handleKeyChange);
    });
  }

  componentWillUnmount() {
    this.props.keys.forEach((settingsKey) => {
      Emitter.off(`settings:change:${settingsKey}`, this.handleKeyChange);
    });
  }

  setSetting(key, value) {
    Settings.set(key, value);
  }

  handleKeyChange = (event, keyValue, keyName) => {
    this.setState({
      [keyName]: keyValue,
    });
  }

  render() {
    const componentProps = this.props.componentProps || {};
    return React.createElement(this.props.component, _.assign(
      {},
      componentProps,
      this.state,
      { setSetting: this.setSetting }
    ));
  }
}

interface IWrappedComponent extends Function {
  displayName?: string;
}

export const requireSettings = (component: any, settingsArray: string[], settingsDefaults: any = {}) => {
  const WrappedComponent: IWrappedComponent = (props) => (
    <SettingsProvider component={component} componentProps={props} keys={settingsArray} defaults={settingsDefaults} />
  );
  WrappedComponent.displayName = `Wrapped${component.name ? component.name : 'Component'}`;
  return WrappedComponent as (props: any) => React.Component<any, any>;
};
