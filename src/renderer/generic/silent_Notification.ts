(<any>window)._Notification = (<any>window).Notification;

class SilentNotification implements GPMDP.Notification {
  static permission = 'granted';
  _notification: any;
  requireInteraction: boolean;
  silent: boolean;

  _id: number;
  title: string;
  dir: string;
  lang: string;
  body: string;
  icon: string;
  tag: string;
  data: GPMDP.NotificationOptions;

  onclick: Function;
  onerror: Function;
  onclose: Function;
  onshow: Function;

  constructor(title, options) {
    const opts = options;
    opts.silent = true;

    this._notification = new (<any>window)._Notification(title, opts);
    this.title = this._notification.title;
    this.dir = this._notification.dir;
    this.lang = this._notification.lang;
    this.body = this._notification.body;
    this.tag = this._notification.tag;
    this.icon = this._notification.icon;
    this.data = this._notification.data;
    this.requireInteraction = false;
    this.silent = true;

    Object.defineProperty(this, 'onclick', {
      get: () => this._notification.onclick,
      set: (fn) => { this._notification.onclick = fn; },
      configurable: true,
      enumerable: true,
    });

    Object.defineProperty(this, 'onerror', {
      get: () => this._notification.onerror,
      set: (fn) => { this._notification.onerror = fn; },
      configurable: true,
      enumerable: true,
    });
  }

  close() {
    this._notification.close();
  }
}

SilentNotification.permission = 'granted';
(<any>window).Notification = SilentNotification;
