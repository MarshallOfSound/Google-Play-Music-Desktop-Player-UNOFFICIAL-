import { purgeCache } from '../../_util';

export default class PluginManager {
  constructor() {
    this.pluginPaths = Settings.get('plugins', []);
    this.plugins = {};

    this._loadAndActivateAllPlugins();
  }

  _loadAndActivateAllPlugins() {
    this.pluginPaths.forEach((pluginPath) => {
      if (this.load(pluginPath)) {
        try {
          this.plugins[pluginPath].activate();
        } catch (err) {
          Logger.error('Error activating plugin:', this.plugins[pluginPath].constructor.PLUGIN_NAME, err);
        }
      }
    });
  }

  load(pluginPath) {
    let Plugin;
    try {
      Plugin = require(pluginPath);
    } catch (err) {
      Logger.error('Error loading plugin', err);
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
          onChange: (key, fn) => { bindings.push([key, fn]); Settings.onChange(`${Plugin.PLUGIN_NAME}_${key}`, fn); },
          get: (key, ...args) => Settings.get(`${Plugin.PLUGIN_NAME}_${key}`, ...args),
          getGlobal: (key, ...args) => Settings.get(key, ...args),
          set: (key, ...args) => Settings.set(`${Plugin.PLUGIN_NAME}_${key}`, ...args),
        };
        this.plugins[pluginPath] = new Plugin(require, Emitter, scopedSettings, PlaybackAPI, WindowManager, {});
        this.plugins[pluginPath].__BINDINGS__ = bindings;
        this.plugins[pluginPath].__SCOPED_SETTINGS__ = scopedSettings;
      } catch (err) {
        Logger.error('Error initializing plugin', Plugin.PLUGIN_NAME, err);
        return false;
      }
      Logger.info('Successfully loaded plugin:', Plugin.PLUGIN_NAME);
      return true;
    }
    Logger.error('Plugin does not expose all required API methods', pluginPath);
    return false;
  }

  install(pluginPath) {
    if (this.plugins[pluginPath]) {
      Logger.info('Plugin already installed, uninstalling', pluginPath);
      this.uninstall(pluginPath);
      purgeCache(pluginPath);
    }
    Logger.info('Installing plugin, saving path', pluginPath);
    Settings.set('plugins', this.pluginPaths.concat([pluginPath]));

    if (this.load(pluginPath)) {
      this.plugins[pluginPath].constructor.CONFIG.forEach((configItem) => {
        this.plugins[pluginPath].__SCOPED_SETTINGS__.set(configItem.key, configItem.default);
      });
      try {
        this.plugins[pluginPath].install();
      } catch (err) {
        Logger.error('Error installing plugin:', this.plugins[pluginPath].constructor.PLUGIN_NAME, err);
      }
      try {
        this.plugins[pluginPath].activate();
      } catch (err) {
        Logger.error('Error activating plugin:', this.plugins[pluginPath].constructor.PLUGIN_NAME, err);
      }
      Emitter.sendToAll('PluginManager:LoadAndActivate', pluginPath);
      Emitter.sendToGooglePlayMusic('PluginManager:LoadAndActivate', pluginPath);
    }
  }

  uninstall(pluginPath) {
    if (this.plugins[pluginPath]) {
      try {
        this.plugins[pluginPath].uninstall();
      } catch (err) {
        Logger.error('Error uninstalling plugin:', this.plugins[pluginPath].constructor.PLUGIN_NAME, err);
      }
      this.plugins[pluginPath].__BINDINGS__.forEach((binding) => {
        Settings.offChange(binding[0], binding[1]);
      });
      delete this.plugins[pluginPath];
      Emitter.sendToAll('PluginManager:Uninstall', pluginPath);
      Emitter.sendToGooglePlayMusic('PluginManager:Uninstall', pluginPath);
    }
    Settings.set('plugins', this.pluginPaths.filter((_path) => _path !== pluginPath));
  }
}
