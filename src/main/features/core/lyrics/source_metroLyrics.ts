import { AllHtmlEntities as Entities } from 'html-entities';
import * as fetch from 'node-fetch';

const xss = require('xss');

const decoder = new Entities();

const attemptMetroLyrics = (path) =>
  new Promise((resolve, reject) => {
    fetch(`http://www.metrolyrics.com/${path}.html`)
      .then((data) => data.text())
      .then((html) => {
        const lyricsChunk = (/('|")lyrics-body('|")>([\s\S]+)('|")lyrics-bottom('|")/gm.exec(html)[3]); // eslint-disable-line
        let lyrics = '';
        const paraRegexp = /<p class=('|")verse('|")>([\s\S]+?)<\/p>/g;
        let paragraph = paraRegexp.exec(lyricsChunk);
        while (paragraph) {
          lyrics += `${paragraph[3]}{{PARA}}`;
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
      .catch(reject);
  });

export default attemptMetroLyrics;
