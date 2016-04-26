import _ from 'lodash';
import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';
import xss from 'xss';
import WebSocket from 'ws';

const decoder = new Entities();

const attemptLyricsMusixmatch = (path) => {
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://localhost:5670/');
    ws.on('open', function open() {
      ws.send(`${path}`);
    });
    ws.on('message', function(data, flags) {
      resolve(`${data}`);
      ws.close();
    });
  });
};

const attemptLyricsWikia = (path) => {
  return new Promise((resolve, reject) => {
    fetch(`http://lyrics.wikia.com/wiki/${path}`)
      .then((data) => data.text())
      .then((html) => {
        let lyrics = (/('|")lyricbox('|")>(.+<\/script>)?(.+)<!--/g.exec(html)[4]);
        lyrics = lyrics.replace(/<br \/>/gi, '\n');
        lyrics = decoder.decode(lyrics);
        lyrics = xss(lyrics, {
          whiteList: { br: [], i: [], b: [], strong: [], em: [] },
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script'],
        });
        resolve(lyrics);
      })
      .catch(() => {
        reject();
      });
  });
};

const attemptMetroLyrics = (path) => {
  return new Promise((resolve, reject) => {
    fetch(`http://www.metrolyrics.com/${path}.html`)
      .then((data) => data.text())
      .then((html) => {
        const lyricsChunk = (/('|")lyrics-body('|")>([\s\S]+)('|")lyrics-bottom('|")/gm.exec(html)[3]); // eslint-disable-line
        let lyrics = '';
        const paraRegexp = /<p class=('|")verse('|")>([\s\S]+?)<\/p>/g;
        let paragraph = paraRegexp.exec(lyricsChunk);
        while (paragraph) {
          lyrics += paragraph[3] + '{{PARA}}';
          paragraph = paraRegexp.exec(lyricsChunk);
        }
        lyrics = lyrics.replace(/\r?\n|\r/g, '');
        lyrics = lyrics.replace(/<br ?\/?>/gi, '\n');
        lyrics = lyrics.replace(/\{\{PARA\}\}/gi, '\n\n');
        lyrics = decoder.decode(lyrics);
        lyrics = xss(lyrics, {
          whiteList: { br: [], i: [], b: [], strong: [], em: [] },
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script'],
        });
        resolve(lyrics);
      })
      .catch(() => {
        reject();
      });
  });
};

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

  //DEV: Attempt to find lyrics from musixmatch
  promises.push(
    attemptLyricsMusixmatch(`${song.artist} ${song.title}`)
  );

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
