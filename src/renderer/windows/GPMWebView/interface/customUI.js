import { remote } from 'electron';
import _ from 'lodash';


// --- Helpers ---

/** Hide elements by a selector */
const hide = (elementSelector, kill = false) => {
  const nodeList = document.querySelectorAll(elementSelector);
  _.forEach(nodeList, (node) => {
    const element = node;
    element.style.display = 'none';
    if (kill) {
      element.remove();
    }
  });
};

/** Set CSS style by a selector */
export const style = (elementSelector, styleObject) => {
  const nodeList = document.querySelectorAll(elementSelector);
  _.forEach(nodeList, (node) => {
    const element = node;
    _.forIn(styleObject, (value, key) => {
      element.style[key] = value;
    });
  });
};

/** Inject a CSS rule to the page (in a <style> tag) */
export const cssRule = (styles) => {
  const tag = document.createElement('style');
  tag.type = 'text/css';
  tag.appendChild(document.createTextNode(styles));
  document.head.appendChild(tag);
};


// --- UI modifications ---
function _redirectButton(button, URL, reverseURLChange) {
  if (button) {
    button.addEventListener('click', (e) => {
      remote.shell.openExternal(URL);
      if (reverseURLChange) setImmediate(history.back);
      e.preventDefault();
      return false;
    });
  }
}

/** Change the Shop button to open Shop in external browser */
function fixShopButton() {
  _redirectButton(document.querySelector('[data-type="shop"]'), 'https://play.google.com/store/music?feature=music_general');
}

function handleSubscribeButton() {
  _redirectButton(document.querySelector('[data-type="sub"]'), 'https://play.google.com/music/listen#/sulp', true);
}

/** Hide buttons & elements that don't work */
function hideNotWorkingStuff() {
  // Top right account control buttons
  hide('#material-one-right #gb > div > div > div:not(:last-child)');
  style('#material-one-right #gb > div > div > div:last-child',
          { display: 'block', float: 'right' });
  style('#material-one-right #gb > div > div', { display: 'block', float: 'right' });
  cssRule('#material-one-right #gb {min-width: 40px !important}');

  // Built in mini player buttons
  hide('.player-top-right-items > paper-icon-button');

  // Settings options that won't work
  hide('[data-action="upload-music"]');
  hide('[data-action="help-and-feedback"]');
  hide('[data-action="send-gift"]');

  // Hide the upload music button in settings
  cssRule('.music-sources-card.settings-card {display: none !important}');

  hide('.upload-dialog-bg', true);
  hide('.upload-dialog', true);

  setInterval(() => hide('.song-menu.goog-menu.now-playing-menu > .goog-menuitem:nth-child(3)'), 500);
}

function installSidebarButton(translationKey, type, icon, index, fn) {
  const elem = document.createElement('a');
  elem.setAttribute('data-type', type);
  elem.setAttribute('class', 'nav-item-container tooltip');
  elem.setAttribute('href', '');
  elem.setAttribute('no-focus', '');
  elem.innerHTML = `<iron-icon icon="${icon}" alt="" class="x-scope iron-icon-1"></iron-icon><span is="translation-key">${translationKey}</span>`; // eslint-disable-line
  elem.addEventListener('click', fn);
  if (index === -1) {
    document.querySelectorAll('.nav-section.material')[0].appendChild(elem);
  } else {
    document.querySelectorAll('.nav-section.material')[0].insertBefore(elem, document.querySelectorAll('.nav-section.material > a')[index]); // eslint-disable-line
  }
}

/** Create the Desktop Settings button in the left sidebar */
function installDesktopSettingsButton() {
  installSidebarButton('label-desktop-settings', 'desktopsettings', 'settings', 2, (e) => {
    Emitter.fire('window:settings');
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

/** Create the Quit button in the left sidebar */
function installQuitButton() {
  installSidebarButton('label-quit', 'quit', 'exit-to-app', -1, (e) => {
    remote.app.quit();
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

/* eslint-disable max-len, no-multi-str */
function installNowPlayingButton(textKey, id, callback) {
  const ripple = `<paper-ripple style="-webkit-user-select: none;">
                  <div id="background" class="style-scope paper-ripple" style="-webkit-user-select: none;"></div>
                  <div id="waves" class="style-scope paper-ripple" style="-webkit-user-select: none;"></div>
                  </paper-ripple>`;
  const content = document.createElement('div');
  content.setAttribute('class', 'goog-menuitem-content');
  content.innerHTML = `${ripple} <span is="translation-key">${textKey}</span>`;

  const button = document.createElement('div');
  button.setAttribute('class', 'goog-menuitem');
  button.setAttribute('role', 'menuitem');
  button.setAttribute('id', id);
  button.appendChild(content);

  const nowPlayingMenu = document.querySelector('.goog-menu.song-menu');
  nowPlayingMenu.appendChild(button);

  button.addEventListener('click', (e) => {
    // DEV: Hacky but smooth way to close menu when clicked.
    setTimeout(() => {
      document.querySelector('.goog-menu.song-menu').style.display = 'none';
    }, 150);
    callback(e);
  });
}
/* eslint-enable max-len */

function installNowPlayingSeperator() {
  const seperator = document.createElement('div');
  seperator.setAttribute('role', 'menuitem');
  seperator.setAttribute('class', 'goog-menuseparator');

  const nowPlayingMenu = document.querySelector('.goog-menu.song-menu');
  nowPlayingMenu.appendChild(seperator);
}

function installNowPlayingMenu() {
  installNowPlayingSeperator();
  installNowPlayingButton('label-pause-after-song', ':gpmdppause', () => {
    Emitter.fireAtGoogle('pauseAfter:show');
  });
  installNowPlayingSeperator();
  installNowPlayingButton('label-show-lyrics', ':gpmdplyrics', () => {
    Emitter.fireAtMain('lyrics:show');
  });
}

function handleZoom() {
  let zoom = Settings.get('zoom', 1);
  remote.getCurrentWebContents().setZoomFactor(zoom);
  window.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.repeat) return;
    const webContents = remote.getCurrentWebContents();
    if (e.which === 189) {
      // Zoom out
      zoom -= 0.1;
    } else if (e.which === 187) {
      // Zoom in
      zoom += 0.1;
    } else if (e.which === 48) {
      zoom = 1;
    } else {
      return;
    }
    webContents.setZoomFactor(zoom);
    Emitter.fire('settings:set', {
      key: 'zoom',
      value: zoom,
    });
  });
}

const fixChromecastButton = () => {
  cssRule('#player paper-icon-button[data-id="cast"] { display: inline-block; }');
};


// Modify the GUI after everything is sufficiently loaded
window.wait(() => {
  hideNotWorkingStuff();
  fixShopButton();
  handleSubscribeButton();
  installDesktopSettingsButton();
  installQuitButton();
  handleZoom();
  installNowPlayingMenu();
  fixChromecastButton();
});
