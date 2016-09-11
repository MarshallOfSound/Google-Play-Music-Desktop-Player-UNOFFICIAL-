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
        this.plugins[pluginPath].activate();
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
      typeof Plugin === 'function' &&
      typeof Plugin.prototype.install === 'function' &&
      typeof Plugin.prototype.uninstall === 'function' &&
      typeof Plugin.prototype.activate === 'function'
    ) {
      try {
        this.plugins[pluginPath] = new Plugin(require, Emitter, PlaybackAPI, WindowManager, {});
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
    } else {
      Logger.info('Installing plugin, saving path', pluginPath);
      Settings.set('plugins', this.pluginPaths.concat([pluginPath]));
    }
    if (this.load(pluginPath)) {
      this.plugins[pluginPath].install();
      this.plugins[pluginPath].activate();
      Emitter.sendToAll('PluginManager:LoadAndActivate', pluginPath);
      Emitter.sendToGooglePlayMusic('PluginManager:LoadAndActivate', pluginPath);
    }
  }

  uninstall(pluginPath) {
    if (this.plugins[pluginPath]) {
      this.plugins[pluginPath].uninstall();
      Emitter.sendToAll('PluginManager:Uninstall', pluginPath);
      Emitter.sendToGooglePlayMusic('PluginManager:Uninstall', pluginPath);
    }
    Settings.set('plugins', this.pluginPaths.filter((_path) => _path !== pluginPath));
  }
}
