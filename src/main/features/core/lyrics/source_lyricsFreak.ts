import * as request from 'request';

const xss = require('xss');

const fetchLyricsPage = (title, artist) =>
  new Promise<string>((resolve, reject) => {
    const search = `http://www.lyricsfreak.com/search.php?a=search&type=song&q=${title.replace(/ /g, '+')}`;
    request(search, (err, resp) => {
      try {
        if (err) return reject(err);
        const HTML = JSON.stringify((<any>resp).body);
        let lyricsTable = HTML.split('tbody')[1];
        lyricsTable = lyricsTable.replace(/\\r/g, '');
        const trackRegEx = /<tr>[\s\S]+?><a[\s\S]+?&middot;[&nbsp;]+(.+?)<[\s\S]+?<a href=\\"(.+?)\\"[\s\S]+?>(.+?) lyrics<\/a>[\s\S]+?<\/tr>/g;
        let match = trackRegEx.exec(lyricsTable);
        const tracks = [];
        while (match !== null) {
          const track = {
            artist: match[1].trim(),
            url: `http://www.lyricsfreak.com${match[2].trim()}`,
            track: match[3].trim(),
          };
          tracks.push(track);
          match = trackRegEx.exec(lyricsTable);
        }
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          if (track.artist.toLowerCase() === artist.toLowerCase()) {
            return resolve(track.url);
          }
        }
      } catch (e) {
        // Who cares
      }
      return reject('Could not find track');
    });
  });

const fetchLyrics = (track, artist) =>
  fetchLyricsPage(track, artist)
    .then((url) =>
      new Promise((resolve, reject) => {
        request(url, (err, resp) => {
          if (err) return reject(err);
          try {
            let lyrics = /<div id='content[\s\S]+?>([\s\S]+?)<\/div>/g.exec(resp.body)[1];
            lyrics = lyrics.replace(/<br>/gi, '\n');
            resolve(xss(lyrics, {
              whiteList: { br: [], i: [], b: [], strong: [], em: [] },
              stripIgnoreTag: true,
              stripIgnoreTagBody: ['script'],
            }));
          } catch (e) {
            reject(e);
          }
        });
      })
    );

export default fetchLyrics;
