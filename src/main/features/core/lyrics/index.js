import _ from 'lodash';

// Lyrics Sources
import attemptLyricsWikia from './source_lyricsWikia';
import attemptMetroLyrics from './source_metroLyrics';

const attemptPromiseSequence = (seq) => {
  return new Promise((resolve, reject) => {
    seq[0].then(resolve).catch(() => {
      if (seq.length <= 1) {
        reject();
      } else {
        attemptPromiseSequence(seq.slice((seq.length - 1) * -1))
          .then(resolve)
          .catch(reject);
      }
    });
  });
};

const bracketedRegex = () => /[\(|\[].+?[\)|\]]/g;

PlaybackAPI.on('change:song', (song) => {
  const promises = [attemptLyricsWikia(`${song.artist}:${song.title}`)];
  let bracketed = song.title.match(bracketedRegex()) || [];

  // DEV: Attempt to find lyrics from wikia
  let title = song.title;
  _.forEachRight(bracketed, (bracket) => {
    title = title.replace(bracket, '').trim();
    promises.push(attemptLyricsWikia(`${song.artist}:${title}`));
  });

  // DEV: Attempt to find lyrics from metro
  const lowerTitle = song.title.toLowerCase().replace(/'/g, '');
  const lowerArtist = song.artist.toLowerCase().replace(/'/g, '');
  const lowerAlbum = song.album.toLowerCase().replace(/'/g, '');
  promises.push(
    attemptMetroLyrics(`${lowerTitle.replace(/ /g, '-')}-lyrics-${lowerArtist.replace(/ /g, '-')}`)
  );

  const dashed = lowerAlbum.match(/- [^-]+/g) || [];
  dashed.push('');

  let album = lowerAlbum;
  _.forEachRight(dashed, (dash) => {
    album = album.replace(dash, '').trim();
    title = lowerTitle;

    bracketed = title.match(bracketedRegex()) || [];
    bracketed.push('');
    _.forEachRight(bracketed, (bracket) => {
      title = title.replace(bracket, '').trim();
      promises.push(
        attemptMetroLyrics(`${title.replace(/ /g, '-')}-lyrics-${album.replace(/ /g, '-')}`)
      );
    });
  });

  attemptPromiseSequence(promises)
    .then((lyrics) => {
      PlaybackAPI._setPlaybackSongLyrics(lyrics);
    })
    .catch(() => {
      Logger.verbose('Lyrics parsing failed');
    });
});
