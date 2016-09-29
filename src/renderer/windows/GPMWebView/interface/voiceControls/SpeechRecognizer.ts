import * as _ from 'lodash';

const COMMAND_CONNECTORS = ['and then', 'and', 'then'];

export default class SpeechRecognizer {
  hotwords: string[];
  prefixes: string[];
  enabled: boolean;
  speech: any;
  _handlers: any;

  constructor(hotwords: string[] = [], prefixes: string[] = []) {
    this.hotwords = hotwords;
    this.prefixes = prefixes;
    this.enabled = false;
    this.speech = new (<any>window).webkitSpeechRecognition(); // eslint-disable-line

    this.speech.onresult = this.onSpeech;

    this.speech.onerror = () => this.speech.stop();
    this.speech.onnomatch = () => this.speech.stop();
    this.speech.onend = () => {
      if (this.enabled) {
        this.speech.start();
      }
    };

    this._handlers = {};
  }

  enable() {
    this.speech.stop();
    this.speech.start();
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.speech.stop();
  }

  private onSpeech = (event) => {
    const results = event.results;
    if (results['0'] && results['0']['0']) {
      const said = results['0']['0'].transcript.trim();
      _.forEach(this.hotwords, (hotword) => {
        if (said.substr(0, hotword.length) === hotword) {
          this.handleCommand(said.substr(hotword.length).trim());
          return false;
        }
      });
    }
    this.speech.stop();
  }

  handleCommand(command) {
    if (!command) return;
    let matchedFn;
    let matchedKey = '';
    let fnArg;

    _.forIn(this._handlers, (fn, key) => {
      if (command.substr(0, key.length).toLowerCase() === key) {
        if (key.length > matchedKey.length) {
          matchedKey = key;
          matchedFn = fn;
          fnArg = command.substr(key.length).trim();
        }
      }
    });

    if (matchedFn) {
      matchedFn(fnArg)
        .catch((error) => {
          Logger.info(error);
        })
        .then((unusedCommand) => {
          if (unusedCommand === undefined) {
            unusedCommand = fnArg; // eslint-disable-line
          }
          let handled = false;
          _.forEach(COMMAND_CONNECTORS, (connector) => {
            if (unusedCommand.substr(0, connector.length) === connector) {
              handled = true;
              this.handleCommand(unusedCommand.substr(connector.length).trim());
              return false;
            }
          });
          if (!handled) {
            this.handleCommand(unusedCommand.trim());
          }
        });
    } else {
      Logger.warn(`Command: "${command}" did not match any registered handlers`);
    }
  }

  registerHandler(action, fn) {
    let actions = action;
    if (!_.isArray(actions)) actions = [action];

    _.forEach(actions, (actionString) => {
      if (this._handlers[actionString.toLowerCase()]) {
        Logger.error(`The action "${action.toLowerCase()}" already has a handler registered`); // eslint-disable-line
      } else {
        _.forEach(this.prefixes.concat(['']), (prefix) => {
          this._handlers[(`${prefix.toLowerCase()} ${actionString.toLowerCase()}`).trim()] = fn;
        });
      }
    });
  }
}
