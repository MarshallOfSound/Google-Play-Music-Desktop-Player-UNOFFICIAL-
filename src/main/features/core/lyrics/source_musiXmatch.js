import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';
import xss from 'xss';
import JSON from 'JSON';

const decoder = new Entities();

const attemptMusiXmatch = (path) => {
  return new Promise((resolve, reject) => {
    fetch(`https://www.musixmatch.com/search/${path}`) // the lyrics urls aren't always very straightforward...
      .then((data) => data.text())
      .then((searchHtml) => {
        const searchReturn = JSON.parse(/__mxmProps = ({.+})<\/script>/.exec(searchHtml)[1]);
        fetch(searchReturn.allResults.bestMatch.shareURI)
          .then((data) => data.text())
          .then((lyricsHtml) => {
            const lyricsReturn = JSON.parse(/__mxmState = ({.+});<\/script>/.exec(lyricsHtml)[1]);
            let lyrics;
            if (lyricsReturn.page.lyrics.lyrics.instrumental) {
              lyrics = 'INSTRUMENTAL';
            } else {
              lyrics = lyricsReturn.page.lyrics.lyrics.body;
            }
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
      })
      .catch(() => {
        reject();
      });
  });
};

export default attemptMusiXmatch;
