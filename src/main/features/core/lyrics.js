import { AllHtmlEntities as Entities } from 'html-entities';
import fetch from 'node-fetch';

const decoder = new Entities();

PlaybackAPI.on('change:song', (song) => {
  fetch(`http://lyrics.wikia.com/wiki/${song.artist}:${song.title}`)
    .then((data) => data.text())
    .then((html) => {
      let lyrics = (/('|")lyricbox('|")>.+<\/script>(.+)<!--/g.exec(html)[3]);
      lyrics = lyrics.replace(/<br \/>/gi, '\n');
      lyrics = decoder.decode(lyrics);
      PlaybackAPI.setPlaybackSongLyrics(lyrics);
    })
    .catch(() => {
      console.log('Lyrics parsing failed'); // eslint-disable-line
    });
});
