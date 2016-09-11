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
      typeof Plugin === 'function' &&
      typeof Plugin.prototype.install === 'function' &&
      typeof Plugin.prototype.uninstall === 'function' &&
      typeof Plugin.prototype.activate === 'function'
    ) {
      try {
        this.plugins[pluginPath] = new Plugin(require, Emitter, null, null, {});
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
      this.plugins[pluginPath].uninstall();
      purgeCache(pluginPath);
    }
  }
}
