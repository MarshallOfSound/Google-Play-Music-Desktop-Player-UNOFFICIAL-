import { remote } from 'electron';
import { style, cssRule } from '../_helpers';

window.wait(() => {
  const service = Settings.get('service');
  const listenNowURLTest = service === 'google-play-music'
    ? () => /$https:\/\/play\.google\.com\/music\/listen#\/now/
    : () => /$https:\/\/music\.youtube\.com\/^/;

  const backBtn = document.createElement('paper-icon-button');
  backBtn.setAttribute('icon', 'arrow-back');
  backBtn.setAttribute('id', 'backButton');
  backBtn.setAttribute('class', 'x-scope paper-icon-button-0');

  let searchInput;

  if (service === 'google-play-music') {
    const searchBox = (document.querySelector('#material-one-middle > sj-search-box')
      || document.querySelector('#material-one-middle'));
    searchInput = (document.querySelector('sj-search-box input')
      || document.querySelector('#material-one-middle > input'));
    searchBox.insertBefore(backBtn, null);
    style('#backButton', {
      position: 'absolute',
      right: '3px',
      top: '1px',
      width: '46px',
      height: '46px',
      opacity: '0',
      transition: 'opacity 0.2s ease-in-out',
    });
  } else if (service === 'youtube-music') {
    const pivotBar = document.querySelector('ytmusic-pivot-bar-renderer');
    pivotBar.insertBefore(backBtn, pivotBar.firstChild);
    style('#backButton', {
      position: 'relative',
      right: '-8px',
      top: '0px',
      width: '48px',
      height: '48px',
      opacity: '0',
      transition: 'opacity 0.2s ease-in-out',
    });
  }

  const canBack = () => !listenNowURLTest().test(location.href);

  const attemptBack = () => {
    const testJs = 'document.querySelector("webview").canGoBack()';
    remote.getCurrentWindow().webContents.executeJavaScript(testJs, false, (canGoBack) => {
      if (!canBack()) return null;
      if (canGoBack) return history.back();
      location.href = service === 'google-play-music'
      ? 'https://play.google.com/music/listen#/now'
      : 'https://music.youtube.com/';
    });
  };
  const attemptForward = () => {
    const testJs = 'document.querySelector("webview").canGoForward()';
    remote.getCurrentWindow().webContents.executeJavaScript(testJs, false, (canGoForward) => {
      if (canGoForward) return history.forward();
    });
  };
  Emitter.on('GPMNav:Forward', attemptForward);
  Emitter.on('GPMNav:Back', attemptBack);

  backBtn.addEventListener('click', attemptBack);

  /*
   OSX has a standard of cmd+left and cmd+right for browser navigation.
   However cmd does not show up as a modifier key, but rather as a
   separate keypress, which also eats the keyup event of the key it
   is modifying.
   */
  const holdingKeyMap = {};

  window.addEventListener('keydown', (e) => {
    holdingKeyMap[e.which] = true;

    if ((holdingKeyMap[91] || holdingKeyMap[93])
       && document.activeElement.value === undefined) {
      if (e.which === 37) {
        attemptBack();
      } else if (e.which === 39) {
        attemptForward();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if ((e.which === 8 && document.activeElement.value === undefined)
      || (e.which === 37 && e.altKey && document.activeElement.value === undefined)) {
      attemptBack();
    } else if (e.which === 39 && e.altKey && document.activeElement.value === undefined) {
      attemptForward();
    }
    holdingKeyMap[e.which] = false;
  });

  // Make sure the clearSearch button is above the arrow
  style('sj-search-box #clearButton', { 'z-index': 10 });

  // Hide Back button if search box has query
  cssRule('.gmusic-theme[data-theme-type=FULL] sj-search-box #backButton { color: #fff !important }');
  cssRule('sj-search-box[has-query] #backButton {opacity: 0 !important}');

  const correctButtonVis = () => { backBtn.style.opacity = (!canBack()) ? 0 : 1; };
  window.addEventListener('popstate', correctButtonVis);
  if (searchInput) searchInput.addEventListener('input', correctButtonVis);
  const oPushState = history.pushState.bind(history);
  history.pushState = (...args) => {
    setTimeout(correctButtonVis, 50);
    return oPushState(...args);
  };
  correctButtonVis();
});
