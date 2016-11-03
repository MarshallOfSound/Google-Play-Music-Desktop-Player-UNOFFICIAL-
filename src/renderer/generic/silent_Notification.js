window._Notification = window.Notification;

class SilentNotification {
  constructor(title, options = {}) {
    const opts = options;
    opts.silent = true;

    this._notification = new window._Notification(title, opts);
    this.title = this._notification.title;
    this.dir = this._notification.dir;
    this.lang = this._notification.lang;
    this.body = this._notification.body;
    this.tag = this._notification.tag;
    this.icon = this._notification.icon;
    this.data = this._notification.data;
    this.requireInteraction = false;
    this.silent = true;

    // FIXME: Regression in Electron causes this code to create a hung process
    //        electron/electron#7831
    // Object.defineProperty(this, 'onclick', {
    //   get: () => this._notification.onclick,
    //   set: (fn) => { this._notification.onclick = fn; },
    //   configurable: true,
    //   enumerable: true,
    // });
    //
    // Object.defineProperty(this, 'onerror', {
    //   get: () => this._notification.onerror,
    //   set: (fn) => { this._notification.onerror = fn; },
    //   configurable: true,
    //   enumerable: true,
    // });
  }

  close() {
    this._notification.close();
  }
}

SilentNotification.permission = 'granted';
window.Notification = SilentNotification;
