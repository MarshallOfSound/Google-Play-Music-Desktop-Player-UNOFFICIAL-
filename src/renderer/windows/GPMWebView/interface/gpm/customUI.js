import { remote } from 'electron';
import _ from 'lodash';

import { style, cssRule } from '../generic/_helpers';

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

/** Removes the referenced <style> tag */
const removeCssRule = (styleTag) => {
  if (styleTag) {
    styleTag.parentElement.removeChild(styleTag);
  }
};


// --- UI modifications ---
function _redirectButton(button, URL, reverseURLChange) {
  if (button) {
    button.addEventListener('click', (e) => {
      remote.shell.openExternal(URL);
      if (reverseURLChange) setTimeout(() => history.back(), 0);
      e.preventDefault();
      return false;
    });
  }
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
  cssRule('#download { display: none !important }');
  cssRule('#manage-downloads { display: none !important }');
  cssRule('.subscription-gifting-card.settings-card {display: none !important}');

  // Hide the upload music button in settings
  cssRule('.music-sources-card.settings-card {display: none !important}');

  hide('.upload-dialog-bg', true);
  hide('.upload-dialog', true);

  cssRule('.song-menu.goog-menu.now-playing-menu > .goog-menuitem:nth-child(3) { display: none !important; }');
}

function installSidebarButton(translationKey, type, icon, index, href, fn) {
  const elem = document.createElement('a');
  elem.setAttribute('data-type', type);
  elem.setAttribute('class', 'nav-item-container tooltip');
  elem.setAttribute('href', href);
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
  installSidebarButton('label-desktop-settings', 'desktopsettings', 'settings', 2, '#', (e) => {
    Emitter.fire('window:settings');
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

/** Create the Quit button in the left sidebar */
function installQuitButton() {
  installSidebarButton('label-quit', 'quit', 'exit-to-app', -1, '#', (e) => {
    remote.app.quit();
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

function installAlarmButton() {
  installSidebarButton('label-alarm', 'alarm', 'alarm', 0, '#', (e) => {
    // Closes the sliding drawer
    document.querySelector('paper-drawer-panel').setAttribute('selected', 'main');
    Emitter.fireAtMain('alarm:show');
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

function installMainMenu() {
  installDesktopSettingsButton();
  installQuitButton();
  installAlarmButton();
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

function showNowPlayingMenu() {
  const lyricsButton = document.querySelector('#\\3Agpmdplyrics');
  const pauseButton = document.querySelector('#\\3Agpmdppause');
  lyricsButton.previousSibling.style.display = 'block';
  lyricsButton.style.display = 'block';
  pauseButton.previousSibling.style.display = 'block';
  pauseButton.style.display = 'block';
}

function hideNowPlayingMenu() {
  const lyricsButton = document.querySelector('#\\3Agpmdplyrics');
  const pauseButton = document.querySelector('#\\3Agpmdppause');
  lyricsButton.previousSibling.style.display = 'none';
  lyricsButton.style.display = 'none';
  pauseButton.previousSibling.style.display = 'none';
  pauseButton.style.display = 'none';
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

  const MenuMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'style' && mutation.target.style.cssText.indexOf('display: none') !== -1) {
        showNowPlayingMenu();
      }
      if (mutation.attributeName !== 'class') return;
      if (!mutation.target.classList.contains('now-playing-menu')) {
        hideNowPlayingMenu();
      }
    });
  });
  MenuMutationObserver.observe(document.querySelector('.goog-menu.song-menu'), {
    attributes: true,
    attributeOldValue: true,
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

let openSidebarStyles;
const setKeepSidebarOpen = (keepSidebarOpen) => {
  const sidebar = document.querySelector('paper-drawer-panel');
  if (keepSidebarOpen) {
    sidebar.removeAttribute('force-narrow');
    sidebar.removeAttribute('narrow');
    openSidebarStyles = cssRule('#material-app-bar .music-logo-link, #quickNavContainer { display: none !important; }');
  } else {
    sidebar.setAttribute('force-narrow', '');
    sidebar.setAttribute('narrow', '');
    removeCssRule(openSidebarStyles);
  }
};

let staticAlbumArtStyle;
const setStaticAlbumArt = (staticAlbumArt) => {
  if (staticAlbumArtStyle) removeCssRule(staticAlbumArtStyle);

  staticAlbumArtStyle = cssRule(staticAlbumArt ? `
  .art-container {
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .art-container img {
    max-width: 100%;
    max-height: 100%;
    width: auto !important;
    height: auto !important;
  }` : '');
};


// Modify the GUI after everything is sufficiently loaded
window.wait(() => {
  Emitter.on('settings:change:keepSidebarOpen', (event, keepSidebarOpen) => {
    setKeepSidebarOpen(keepSidebarOpen);
  });
  Emitter.on('settings:change:staticAlbumArt', (event, staticAlbumArt) => {
    setStaticAlbumArt(staticAlbumArt);
  });

  hideNotWorkingStuff();
  handleSubscribeButton();
  installMainMenu();
  handleZoom();
  installNowPlayingMenu();
  fixChromecastButton();
  setKeepSidebarOpen(Settings.get('keepSidebarOpen'));
  setStaticAlbumArt(Settings.get('staticAlbumArt'));
});
