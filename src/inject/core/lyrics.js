import { remote } from 'electron';

window.addEventListener('load', () => {
  if (!window.$) return;
  if (!$('#lyrics').length) return;
  let noLyricsTimer;

  remote.getGlobal('PlaybackAPI').on('change:lyrics', (lyrics) => {
    if (!lyrics) {
      $('#lyrics').html(`<h1>Loading lyrics...</h1>`);
      $('#lyrics p').stop();
      noLyricsTimer = setTimeout(() => {
        $('#lyrics').html(`<h1>Sorry, we could not find any lyrics for this song</h1>`);
      }, 4000);
    } else {
      clearTimeout(noLyricsTimer);
      const lyricsHTML = lyrics.replace(/\n/g, '<br />');
      $('#lyrics').html(`<p>${lyricsHTML}</p>`);
    }
  });

  $('#lyrics_back').click(() => $('#lyrics_back').removeClass('vis'));
});

Emitter.on('lyrics:show', () => $('#lyrics_back').addClass('vis'));
