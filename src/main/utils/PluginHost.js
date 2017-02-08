import fs from 'fs';
import Emitter from 'events';
import path from 'path';

Error.prototype.toJSON = function () {
  return {
    message: this.message,
    stack: this.stack,
  };
};

const pluginSandboxRunner = (messenger, Settings, PlaybackAPI) => {
  const pluginContent = fs.readFileSync(path.resolve(__dirname, 'plugin.js'), 'utf8');
  eval(`((global, process) => { ${pluginContent} })({}, {})`);
};

// Keep alive timer
let i = 1;
setInterval(() => {
  i = (i + 1) % 2;
}, 5000);

const hostSandboxRunner = () => {
  const send = process.send.bind(process);
  const transmit = (what, ...args) => {
    send({
      what,
      args
    });
  };

  transmit('Host:Ready');

  const messenger = new Emitter();
  const sandboxedMessenger = new Emitter();

  process.on('message', (data) => {
    messenger.emit(data.what, ...data.args);
    if (data.public) sandboxedMessenger.emit(data.what, ...data.args);
  });

  messenger.on('Host:Ping', () => {
    transmit('Host:Pong');
  });

  process.on('uncaughtException', (error) => {
    transmit('Host:Crashed', error);
  });

  delete process.send;

  let settingsRequestIndex = 1;
  const proxiedSettings = {
    get(key, defaultValue, cb = () => {}) {
      const requestID = settingsRequestIndex++;
      let args = [requestID, key];
      if (typeof defaultValue === 'undefined') args.push(defaultValue)
      transmit('Host:Settings:Get', ...args);
      messenger.once(`Host:Settings:Return_${requestID}`, (args) => cb(...args));
    },
    set(key, value, cb = () => {}) {
      const requestID = settingsRequestIndex++;
      let args = [requestID, key];
      if (typeof value === 'undefined') args.push(value)
      transmit('Host:Settings:Set', ...args);
      messenger.once(`Host:Settings:Return_${requestID}`, (args) => cb(...args));
    }
  }

  let gmusicRequestIndex = 1;
  const gmusicController = new (class GmusicController extends Emitter {
    constructor() {
      super();
      messenger.on('Plugin:Gmusic:Event', (...args) => this.emit(...args));
    }

    callGMusicJS(namespace, method, args = [], cb = () => {}) {
      const requestID = settingsRequestIndex++;
      transmit('Plugin:GmusicJS:Command', requestID, namespace, method, args);
      messenger.once(`Plugin:GmusicJS:Command:Result_${requestID}`, (...args) => cb(...args));
    }
  })();

  setTimeout(() => {
    pluginSandboxRunner(sandboxedMessenger, proxiedSettings, gmusicController);
  }, 500);
};

hostSandboxRunner();
