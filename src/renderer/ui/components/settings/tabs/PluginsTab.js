import React, { Component } from 'react';

import SettingsTabWrapper from './SettingsTabWrapper';
import StringOption from '../StringOption';
import ToggleableOption from '../ToggleableOption';

export default class PluginsTab extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      ready: false,
      i: 0,
    };
  }
  componentDidMount() {
    this.wait = setInterval(() => {
      if (window._controller) {
        clearInterval(this.wait);
        this.setState({
          ready: true,
        });
      }
    }, 20);
    Emitter.on('PluginManager:LoadAndActivate', this._update);
    Emitter.on('PluginManager:Uninstall', this._update);
  }

  componentWillUnmount() {
    clearInterval(this.wait);
    Emitter.off('PluginManager:LoadAndActivate', this._update);
    Emitter.off('PluginManager:Uninstall', this._update);
  }

  _update = () => {
    this.setState({
      i: this.state.i + 1,
    });
  }

  render() {
    if (!this.state.ready) return null;
    return (
      <SettingsTabWrapper>
        {
          Object.keys(window._controller.plugins).map((pluginPath) => {
            const plugin = window._controller.plugins[pluginPath];
            const PluginClass = plugin.constructor;
            return (
              <div key={pluginPath}>
                <h5>{PluginClass.PLUGIN_NAME}</h5>
                {
                  PluginClass.CONFIG.map((configObject) => {
                    const props = {
                      key: configObject.key,
                      label: configObject.name,
                      settingsKey: `${PluginClass.PLUGIN_NAME}_${configObject.key}`,
                    };

                    switch (configObject.type) {
                      case 'text': {
                        return (
                          <StringOption {...props} />
                        );
                      }
                      case 'bool': {
                        return (
                          <ToggleableOption {...props} />
                        );
                      }
                      default: {
                        return null;
                      }
                    }
                  })
                }
              </div>
            );
          })
        }
      </SettingsTabWrapper>
    );
  }
}
