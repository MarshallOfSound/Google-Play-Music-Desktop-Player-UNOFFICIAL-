import { AllHtmlEntities as Entities } from 'html-entities';
import * as fetch from 'node-fetch';

const xss = require('xss');

const decoder = new Entities();

const attemptLyricsWikia = (path) =>
  new Promise<string>((resolve, reject) => {
    fetch(`http://lyrics.wikia.com/wiki/${path}`)
      .then((data) => data.text())
      .then((html) => {
        try {
          let lyrics = (/('|")lyricbox('|")>(.+<\/script>)?(.+)(<!--)?/g.exec(html)[4]);
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
