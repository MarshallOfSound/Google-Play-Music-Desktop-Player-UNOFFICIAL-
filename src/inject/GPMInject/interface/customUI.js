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

  // Temp Fix: Hiding the entire account details bubble
  hide('[aria-label="Account Information"]');
  hide('[class="gb_ab"]');
  hide('[class="gb_bb"]');

  // Hide Upload Dialog
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
});
