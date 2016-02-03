import { ipcRenderer, remote } from 'electron';

class Emitter {
  constructor() {
    let ready = true;
    this.__defineGetter__('ready', () => {
      return ready;
    });
    this.__defineSetter__('ready', (newValue) => {
      ready = newValue;
      if (newValue) {
        this.q.forEach((fn) => {
          fn();
        });
        this.q = [];
      }
    });
    this.q = [];

    ipcRenderer.on('execute', (event, details) => {
      if (details && details.fn) {
        remote.getCurrentWebContents().executeJavaScript(details.fn);
      } else {
        console.warn('Function not passed to the execute event'); // eslint-disable-line
      }
    });

    ipcRenderer.on('passthrough', (event, details) => {
      const view = document.querySelector('webview');
      if (!view) {
        console.warn('Attempting to pass event through to WebView, but no WebView found'); // eslint-disable-line
        console.warn(details); // eslint-disable-line
        return;
      }
      if (details && details.event) {
        if (view.isLoading()) {
          let once = false;
          view.addEventListener('dom-ready', () => {
            if (!once) {
              once = true;
              view.send(details.event, details.details);
            }
          });
        } else {
          view.send(details.event, details.details);
        }
      }
    });
  }

  fire(event, details) {
    if (this.ready) {
      ipcRenderer.send(event, details);
    } else {
      this.q.push(this.fire.bind(this, event, details));
    }
  }

  fireAtAll(event, details) {
    if (this.ready) {
      ipcRenderer.send('passback:all', {
        event,
        details,
      });
    } else {
      this.q.push(this.fireAtAll.bind(this, event, details));
    }
  }

  fireAtMain(event, details) {
    if (this.ready) {
      ipcRenderer.send('passback:main', {
        event,
        details,
      });
    } else {
      this.q.push(this.fireAtMain.bind(this, event, details));
    }
  }

  fireAtGoogle(event, details) {
    if (this.ready) {
      ipcRenderer.send('passback', {
        event,
        details,
      });
    } else {
      this.q.push(this.fireAtGoogle.bind(this, event, details));
    }
  }

  on(event, fn) {
    ipcRenderer.on(event, (internalEvent, internalDetails) => {
      if (this.ready) {
        this._call(fn, internalEvent, internalDetails);
      } else {
        this.q.push(this._call.bind(this, fn, internalEvent, internalDetails));
      }
    });
  }

  _call(fn, internalEvent, internalDetails) {
    fn(internalEvent, internalDetails);
  }
}

global.Emitter = new Emitter();
