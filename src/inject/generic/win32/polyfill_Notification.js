import os from 'os';

const osVersion = os.release().split('.');

if (osVersion[0] && (parseInt(osVersion[0], 10) > 6 || parseInt(osVersion[0], 10) === 6 && parseInt(osVersion[1], 10) > 1)) {
  // If we are above windows 7 we can use the system notifications but with
  // the silent flag forced on
  require('../silent_Notification');
} else {
  const NOTIFICATIONS = [];

  /**
   * This class is designed to mock the HTML5 Notification API on windows
   * because the native implementation has annoyed notifcation noises that
   * can't be turned off.
   *
   * This class is intended to follow the API spec here
   * -- https://developer.mozilla.org/en/docs/Web/API/notification
   *
   * This is so it could be used anywhere the actual API is used
   */
  class FakeNotification {
    constructor(text, options) {
      /** Instance Properties **/
      this.title = text;
      this.dir = options.dir || null;
      this.lang = options.lang || null;
      this.body = options.body || '';
      this.tag = options.tag || null;
      this.icon = options.icon || null;

      this.data = options;

      NOTIFICATIONS.push(this);
      this._id = NOTIFICATIONS.length;

      Emitter.fire('notify', {
        _id: this._id,
        title: this.title,
        icon: this.icon,
        body: this.body,
      });

      /** Instance Event Handlers**/
      this.onclick = null;
      this.onerror = null;
      this.onclose = null;
      this.onshow = null;
    }

    /** Instance Methods **/
    close() {
      Emitter.fire('notify:close', this._id);
    }
  }

  /** Static Properties **/
  FakeNotification.permission = 'granted';

  /** Static Methods **/
  FakeNotification.requestPermission = (callback) => {
    callback('granted');
  };

  /** Event Handlers -- Cross Thread **/
  // TODO: Implement this event in the notificationPolyfill
  Emitter.on('notification:clicked', (event, id) => {
    if (NOTIFICATIONS[id] && NOTIFICATIONS[id].onclick) {
      NOTIFICATIONS[id].onclick();
    }
  });

  // TODO: Implement this event in the notificationPolyfill
  Emitter.on('notification:error', (event, details) => {
    const id = details.id;
    if (NOTIFICATIONS[id] && NOTIFICATIONS[id].onerror) {
      NOTIFICATIONS[id].onerror(details.error);
    }
  });

  // TODO: Implement this event in the notificationPolyfill
  Emitter.on('notification:closed', (event, id) => {
    if (NOTIFICATIONS[id] && NOTIFICATIONS[id].onclose) {
      NOTIFICATIONS[id].onclose();
    }
  });

  // TODO: Implement this event in the notificationPolyfill
  Emitter.on('notification:showed', (event, id) => {
    if (NOTIFICATIONS[id] && NOTIFICATIONS[id].onshow) {
      NOTIFICATIONS[id].onshow();
    }
  });

  window._Notification = window.Notification;
  window.Notification = FakeNotification;
}
