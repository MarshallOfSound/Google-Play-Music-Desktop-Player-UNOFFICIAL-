import _ from 'lodash';
import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';
import xss from 'xss';

const decoder = new Entities();

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

PlaybackAPI.on('change:song', (song) => {
  const promises = [attemptLyricsWikia(`${song.artist}:${song.title}`)];
  const bracketed = song.title.match(/\(.+?\)/g);

  let title = song.title;
  _.forEachRight(bracketed, (bracket) => {
    title = title.replace(bracket, '');
    promises.push(attemptLyricsWikia(`${song.artist}:${title}`));
  });

  attemptPromiseSequence(promises)
    .then((lyrics) => {
      PlaybackAPI._setPlaybackSongLyrics(lyrics);
    })
    .catch(() => {
      Logger.verbose('Lyrics parsing failed');
    });
});
