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
const style = (elementSelector, styleObject) => {
  const nodeList = document.querySelectorAll(elementSelector);
  _.forEach(nodeList, (node) => {
    const element = node;
    _.forIn(styleObject, (value, key) => {
      element.style[key] = value;
    });
  });
};

/** Inject a CSS rule to the page (in a <style> tag) */
const cssRule = (styles) => {
  const tag = document.createElement('style');
  tag.type = 'text/css';
  tag.appendChild(document.createTextNode(styles));
  document.head.appendChild(tag);
};


// --- UI modifications ---

/** Change the Shop button to open Shop in external browser */
function fixShopButton() {
  const shopButton = document.querySelector('[data-type="shop"]');
  if (shopButton) {
    shopButton.addEventListener('click', (e) => {
      remote.shell.openExternal('https://play.google.com/store/music?feature=music_general');
      e.preventDefault();
      return false;
    });
  }
}

/** Hide buttons & elements that don't work */
function hideNotWorkingStuff() {
  // Top left account control buttons
  hide('#material-one-right #gb > div > div > div:not(:last-child)');
  style('#material-one-right #gb > div > div > div:last-child',
          { display: 'block', float: 'right' });
  style('#material-one-right #gb > div > div', { display: 'block', float: 'right' });

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

  setInterval(() => hide('.goog-menu.now-playing-menu > .goog-menuitem:nth-child(3)'), 500);
}

/** Create the Desktop Settings button in the left sidebar */
function installDesktopSettingsButton() {
  const dSettings = document.createElement('a');
  dSettings.setAttribute('data-type', 'desktopsettings');
  dSettings.setAttribute('class', 'nav-item-container tooltip');
  dSettings.setAttribute('href', '');
  dSettings.setAttribute('no-focus', '');
  dSettings.innerHTML = '<iron-icon icon="settings" alt="" class="x-scope iron-icon-1"></iron-icon>Desktop settings'; // eslint-disable-line
  dSettings.addEventListener('click', (e) => {
    Emitter.fire('window:settings');
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  document.querySelectorAll('.nav-section.material')[0].insertBefore(dSettings, document.querySelectorAll('.nav-section.material > a')[2]); // eslint-disable-line
}

/** Create the back button. */
function installBackButton() {
  const listenNowURL = 'https://play.google.com/music/listen#/now';

  const backBtn = document.createElement('paper-icon-button');
  backBtn.setAttribute('icon', 'arrow-back');
  backBtn.setAttribute('id', 'backButton');
  backBtn.setAttribute('class', 'x-scope paper-icon-button-0');
  document.querySelector('#material-one-middle > sj-search-box').insertBefore(backBtn, null);

  const canBack = () => {
    const isHomePage = (location.href.indexOf(listenNowURL) === 0);
    const searching = (document.querySelector('sj-search-box input').value !== '');

    return !(isHomePage || searching);
  };

  backBtn.addEventListener('click', () => {
    const testJs = 'document.querySelector("webview").canGoBack()';
    remote.getCurrentWindow().webContents.executeJavaScript(testJs, false, (canGoBack) => {
      if (!canBack()) return null;
      if (canGoBack) return history.back();
      location.href = listenNowURL;
    });
  });

  style('#backButton', {
    position: 'absolute',
    right: '3px',
    top: '1px',
    width: '46px',
    height: '46px',
    opacity: '0',
    transition: 'opacity 0.2s ease-in-out',
  });

  // Make sure the clearSearch button is above the arrow
  style('sj-search-box #clearButton', { 'z-index': 10 });

  // Hide Back button if search box has query
  cssRule('sj-search-box[has-query] #backButton {opacity: 0 !important}');

  const correctButtonVis = () => backBtn.style.opacity = (!canBack()) ? 0 : 1;
  window.addEventListener('popstate', correctButtonVis);
  document.querySelector('sj-search-box input').addEventListener('input', correctButtonVis);
  correctButtonVis();
}


// Modify the GUI after everything is sufficiently loaded
window.wait(() => {
  hideNotWorkingStuff();
  fixShopButton();
  installDesktopSettingsButton();
  installBackButton();
});
