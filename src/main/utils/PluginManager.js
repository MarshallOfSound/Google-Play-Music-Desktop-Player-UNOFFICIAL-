import { fork } from 'child_process';
import debug from 'debug';
import fetch from 'node-fetch';
import path from 'path';

const d = debug('gpmdp:plugin-manager');

export default class PluginManager {
  static STATUS = {
    OFFLINE: 0,
    LAUNCHING: 1,
    RUNNING: 2,
    SHUTTING_DOWN: 3,
  };

  constructor() {
    this.plugins = this._restorePluginList();
    this.persistPluginList();
    this.plugins.forEach(plugin => this.launchPlugin(plugin));
  }

  _restorePluginList() {
    const plugins = Settings.get('plugins', []).map((plugin) => Object.assign({}, plugin, { state: PluginManager.STATUS.OFFLINE }));
    if (plugins.length === 0) {
      plugins.push({
        name: 'Test Plugin',
        state: PluginManager.STATUS.OFFLINE,
      })
    }
    return plugins;
  }

  _hookEvents(plugin) {
    let aliveTimer;
    // Crash handler
    const crash = (error) => {
      plugin.d('crashed', error);
      plugin.state = PluginManager.STATUS.SHUTTING_DOWN;
      plugin.process.kill();
      this.persistPluginList();
      clearInterval(aliveTimer);
    };

    // Safety wrap process.send
    const originalSend = plugin.process.send.bind(plugin.process);
    plugin.process.send = (...args) => {
      if (plugin.state === PluginManager.STATUS.RUNNING) originalSend(...args);
    };

    // Message Emitter
    plugin.process.on('message', (data) => plugin.process.emit(data.what, ...data.args));

    // Plugin Launched
    plugin.process.on('Host:Ready', () => {
      plugin.d('ready');
      plugin.state = PluginManager.STATUS.RUNNING;
      this.persistPluginList();

      let alive = true;
      aliveTimer = setInterval(() => {
        if (alive) {
          alive = false;
          try {
            plugin.process.send({ what: 'Host:Ping', args: [] });
            plugin.process.once('Host:Pong', () => {
              alive = true;
            });
          } catch (err) {
            // Ignore
          }
        } else {
          crash();
        }
      }, 10000);
    });

    // Plugin Crashed
    plugin.process.on('Host:Crashed', crash);

    // Plugin Exited
    plugin.process.on('exit', () => {
      plugin.d('terminated');
      plugin.state = PluginManager.STATUS.OFFLINE;
      this.persistPluginList();
    });

    // Plugin Gmusic.JS Command
    plugin.process.on('Plugin:GmusicJS:Command', (requestID, namespace, method, args) => {
      const uniqueRequestID = `${plugin.name}--${requestID}`;
      plugin.d('executing gmusic command', uniqueRequestID, namespace, method, args);
      Emitter.sendToGooglePlayMusic('execute:gmusic', {
        namespace,
        method,
        uniqueRequestID,
        args,
      });
      Emitter.once(`execute:gmusic:result_${uniqueRequestID}`, (event, result) => {
        plugin.process.send({ what: `Plugin:GmusicJS:Command:Result_${requestID}`, args: [result] });
      });
    });

    // Settings Proxy
    plugin.process.on('Host:Settings:Get', (requestID, key, defaultValue) => {
      const value = Settings.get(`plugin--${plugin.name}--${key}`, defaultValue);
      plugin.process.send({ what: `Host:Settings:Return_${requestID}`, args: typeof value === 'undefined' ? [] : [value] });
    });
    plugin.process.on('Host:Settings:Set', (requestID, key, value) => {
      Settings.set(`plugin--${plugin.name}-${key}`, value);
      plugin.process.send({ what: `Host:Settings:Return_${requestID}`, args: [] });
    });
  }

  getPluginList() {
    return this.plugins;
  }

  persistPluginList() {
    Settings.set('plugins', this.plugins.map((plugin) => Object.assign({}, plugin, { process: undefined, d: undefined })));
  }

  launchPlugin(plugin) {
    d('launching', plugin);
    const pluginProcess = fork(path.resolve(__dirname, 'PluginHost.js'), [plugin.scriptPath], {
      stdio: 'inherit',
    });
    plugin.process = pluginProcess;
    plugin.state = PluginManager.STATUS.LAUNCHING;
    plugin.d = debug(`gpmdp:plugin-manager:${plugin.name}`);
    this._hookEvents(plugin);
    this.persistPluginList();
  }

  emit(what, ...args) {
    this.plugins.forEach((plugin) => {
      plugin.process.send({ what, args, public: true });
    });
  }
}
