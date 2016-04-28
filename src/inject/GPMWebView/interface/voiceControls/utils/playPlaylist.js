import _ from 'lodash';

import waitFor from './waitFor';

export default function (playlistName) {
  return new Promise((resolve, reject) => {
    if (!playlistName) { resolve(); return; }
    const playlistLinks = document.querySelectorAll('#playlists > a');
    let foundLink;

    _.forEach(playlistLinks, (link) => {
      const label = link.querySelector('div').innerText;
      if (label.toLowerCase().trim() === playlistName.toLowerCase()) {
        foundLink = link;
      }
    });

    if (foundLink) {
      foundLink.click();
      waitFor(() => {
        const title = document.querySelector('.playlist-view .material-container-details .info .title'); // eslint-disable-line
        return title && title.innerText.toLowerCase().trim() === playlistName.toLowerCase();
      })
      .then(() => {
        document.querySelector('.playlist-view .material-container-details [data-id=play]').click(); // eslint-disable-line
        resolve('');
      });
    } else {
      reject(`There is no playlist with the name ${playlistName}`);
    }
  });
}
