import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';
import xss from 'xss';

const decoder = new Entities();

PlaybackAPI.on('change:song', (song) => {
  fetch(`http://lyrics.wikia.com/wiki/${song.artist}:${song.title}`)
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
      PlaybackAPI._setPlaybackSongLyrics(lyrics);
    })
    .catch((e) => {
      Logger.verbose('Lyrics parsing failed', e);
    });
});
