import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';
import xss from 'xss';

const decoder = new Entities();

const attemptLyricsWikia = (path) =>
  new Promise((resolve, reject) => {
    fetch(`https://lyrics.wikia.com/wiki/${path}`)
      .then((data) => data.text())
      .then((html) => {
        try {
          const lyricsMatch = /('|")lyricbox('|")>(.+<\/script>)?(.+)(<!--)?/g.exec(html);
          if (!lyricsMatch) return reject('Failed to find lyricbox');
          let lyrics = lyricsMatch[4];
          lyrics = lyrics.replace(/<br \/>/gi, '\n');
          lyrics = decoder.decode(lyrics);
          lyrics = xss(lyrics, {
            whiteList: { br: [], i: [], b: [], strong: [], em: [] },
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script'],
          });
          resolve(lyrics);
        } catch (err) {
          reject(err);
        }
      })
      .catch(reject);
  });

export default attemptLyricsWikia;
