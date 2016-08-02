import _ from 'lodash';
import { BrowserWindow } from 'electron';
import path from 'path';

const NOTIFICATION_DURATION = 3000;

// TODO: Document this, looking at it now even I don't really get it...
class Notification {
  constructor(text, options) {
    this.options = options;
    this.window = new BrowserWindow({
      x: 0,
      y: 0,
      useContentSize: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      resizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      backgroundColor: '#FFF',
      webPreferences: {
        nodeIntegration: true,
        preload: path.resolve('./build/inject/generic/index.js'),
      },
    });

    this.window.loadURL(`file://${path.resolve(`${__dirname}/../../../public_html/notify.html`)}`);

    const windowID = WindowManager.add(this.window, 'notify');
    Emitter.executeOnWindow(windowID, (opts) => {
      window.NOTIFY_DATA = opts; // eslint-disable-line
    }, this.options);

    setTimeout(() => {
      this.close();
    }, NOTIFICATION_DURATION);
  }

  close() {
    if (this.window && this.window.close) {
      try {
        this.window.close();
        this.window = null;
      } catch (e) {
        // Do nothing, this is just to ensure that errors aren't thrown on
        // notification race conditions
      }
    }
  }
}

let currentNotification;
let notifyInProgress = false;
const queue = [];
const handleNotify = (event, notificationConfig) => {
  notifyInProgress = true;
  if (currentNotification) {
    currentNotification.close();
    currentNotification = null;
  }
  currentNotification = new Notification(notificationConfig.title,
                                          notificationConfig);
  if (queue.length === 0) {
    notifyInProgress = false;
  } else {
    queue[0]();
  }
};

Emitter.on('notify', (event, notificationConfig) => {
  if (notifyInProgress) {
    queue.push(handleNotify.bind(this, event, notificationConfig));
  }
  handleNotify(event, notificationConfig);
});

Emitter.on('notify:close', (event, _id) => {
  if (_.get(currentNotification, 'options._id') === _id) {
    currentNotification.close();
    currentNotification = null;
  }
});
