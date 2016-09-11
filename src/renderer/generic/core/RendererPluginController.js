import { remote } from 'electron';
import { purgeCache } from '../../../_util';


export default class RendererPluginController {
  constructor() {
    this.pluginPaths = Settings.get('plugins', []);
    this.plugins = {};

    this._loadAndActivateAllPlugins();

    Emitter.on('PluginManager:LoadAndActivate', (event, pluginPath) => {
      if (this.load(pluginPath)) {
        this.plugins[pluginPath].activate();
      }
    });
    Emitter.on('PluginManager:Uninstall', (event, pluginPath) => {
      this.uninstall(pluginPath);
    });
  }

  _loadAndActivateAllPlugins() {
    this.pluginPaths.forEach((pluginPath) => {
      if (this.load(pluginPath)) {
        this.plugins[pluginPath].activate();
      }
    });
  }

  load(pluginPath) {
    let Plugin;
    try {
      Plugin = require(pluginPath);
    } catch (err) {
      remote.getGlobal('Logger').error('Error loading plugin in renderer process', err);
      return false;
    }
    if (
      Plugin &&
      Plugin.PLUGIN_NAME &&
      Plugin.CONFIG &&
      typeof Plugin === 'function' &&
      typeof Plugin.prototype.install === 'function' &&
      typeof Plugin.prototype.uninstall === 'function' &&
      typeof Plugin.prototype.activate === 'function'
    ) {
      try {
        const bindings = [];
        const scopedSettings = {
          onChange: (key, fn) => { bindings.push([key, fn]); Emitter.on(`settings:change:${Plugin.PLUGIN_NAME}_${key}`, fn); },
          get: (key, ...args) => Settings.hey(`${Plugin.PLUGIN_NAME}_${key}`, ...args),
          getGlobal: (key, ...args) => Settings.get(key, ...args),
          set: (key, ...args) => Settings.set(`${Plugin.PLUGIN_NAME}_${key}`, ...args),
        };
        this.plugins[pluginPath] = new Plugin(require, Emitter, scopedSettings, null, null, {});
        this.plugins[pluginPath].__BINDINGS__ = bindings;
      } catch (err) {
        remote.getGlobal('Logger').error('Error initializing plugin in renderer process', Plugin.PLUGIN_NAME, err.message);
        return false;
      }
      return true;
    }
    remote.getGlobal('Logger').error('Plugin does not expose all required API methods', pluginPath);
    return false;
  }

  uninstall(pluginPath) {
    if (this.plugins[pluginPath]) {
      try {
        this.plugins[pluginPath].uninstall();
      } catch (err) {
        remote.getGlobal('Logger').error('Error while uninstalling plugin', this.plugins[pluginPath].constructor.PLUGIN_NAME, { message: err.message, stack: err.stack });
      }
      this.plugins[pluginPath].__BINDINGS__.forEach((binding) => {
        Emitter.off(binding[0], binding[1]);
      });
      purgeCache(pluginPath);
    }
  }
}
