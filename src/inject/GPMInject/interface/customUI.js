import _ from 'lodash';

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

const style = (elementSelector, styleObject) => {
  const nodeList = document.querySelectorAll(elementSelector);
  _.forEach(nodeList, (node) => {
    const element = node;
    _.forIn(styleObject, (value, key) => {
      element.style[key] = value;
    });
  });
};

const cssRule = (styles) => {
  const tag = document.createElement('style');
  tag.type = 'text/css';
  tag.appendChild(document.createTextNode(styles));
  document.head.appendChild(tag);
};

window.wait(() => {
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

  hide('.upload-dialog-bg', true);
  hide('.upload-dialog', true);

  setInterval(() => hide('.goog-menu.now-playing-menu > .goog-menuitem:nth-child(3)'), 500);

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

  // Back button
  const back = document.createElement('paper-icon-button');
  back.addEventListener('click', () => history.back());
  back.setAttribute('icon', 'arrow-back');
  back.setAttribute('id', 'backButton');
  back.setAttribute('class', 'x-scope paper-icon-button-0');
  document.querySelector('#material-one-middle > sj-search-box').insertBefore(back, null);

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

  // Hide icon if search box has query
  cssRule('sj-search-box[has-query] #backButton {opacity: 0 !important}');

  // Ideally we should listen for the URL change
  // 'hashchange' does not seem to work :(
  setInterval(() => {
    const homePage = (location.href.indexOf('https://play.google.com/music/listen#/now') === 0);
    const searching = (document.querySelector('sj-search-box input').value !== '');
    if (homePage || searching) {
      back.style.opacity = 0;
    } else {
      back.style.opacity = 1;
    }
  }, 250);
});
