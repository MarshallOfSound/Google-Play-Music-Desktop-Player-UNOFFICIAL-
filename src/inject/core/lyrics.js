import { remote } from 'electron';

window.addEventListener('load', () => {
  if (!window.$) return;
  if (!$('#lyrics').length) return;
  let animate = false;
  let animationTimer;
  let noLyricsTimer;
  let jumpDetect;

  remote.getGlobal('PlaybackAPI').on('change:lyrics', (lyrics) => {
    if (!lyrics) {
      $('#lyrics').html(`<h1>Loading lyrics...</h1>`);
      $('#lyrics p').stop();
      animate = false;
      noLyricsTimer = setTimeout(() => {
        $('#lyrics').html(`<h1>Sorry, we could not find any lyrics for this song</h1>`);
      }, 4000);
    } else {
      clearTimeout(noLyricsTimer);
      const lyricsHTML = lyrics.replace(/\n/g, '<br />');
      $('#lyrics').html(`<p>${lyricsHTML}</p>`);
      animate = true;
    }
  });

  remote.getGlobal('PlaybackAPI').on('change:state', (isPlaying) => {
    if (!isPlaying) return $('#lyrics p').stop() && setTimeout(() => (animate = true), 10);
  });

  remote.getGlobal('PlaybackAPI').on('change:time', (timeObj) => {
    let jumped = false;
    if (timeObj.current < jumpDetect || timeObj.current - jumpDetect > 1000) {
      animate = true;
      jumped = true;
    }
    if (!animate || !timeObj.total) return;
    const lyricsP = $('#lyrics p');
    const maxHeight = parseInt(lyricsP.get(0).scrollHeight, 10);
    const viewPortHeight = parseInt(lyricsP.innerHeight(), 10);
    const waitTime = (viewPortHeight / maxHeight) * timeObj.total * 0.3;
    const actualWaitTime = Math.max(0, waitTime - timeObj.current);
    clearTimeout(animationTimer);
    if (jumped) {
      lyricsP.scrollTop(maxHeight * (Math.max(0, timeObj.current - waitTime) / timeObj.total));
    }
    animationTimer = setTimeout(() => {
      lyricsP.stop().animate({
        scrollTop: maxHeight - viewPortHeight,
      }, timeObj.total - timeObj.current - actualWaitTime - waitTime, 'linear');
    }, actualWaitTime);
    animate = false;
  });

  window.addEventListener('resize', () => animate = true);
  $('#lyrics_back').click(() => $('#lyrics_back').removeClass('vis'));
});

Emitter.on('lyrics:show', () => $('#lyrics_back').addClass('vis'));
