window.addEventListener('load', () => {
  if (!window.$) return;
  if (!$('#lyrics').length) return;
  let animate = false;
  let animationTimer;
  let noLyricsTimer;
  let jumpDetect;

  // Handle new lyrics strings
  const lyricsHandler = (lyrics) => {
    if (!lyrics) {
      $('#lyrics').html('<h1><span is="translation-key">lyrics-loading-message</span></h1>');
      $('#lyrics p').stop();
      animate = false;
      clearTimeout(noLyricsTimer);
      noLyricsTimer = setTimeout(() => {
        $('#lyrics').html('<h1><span is="translation-key">lyrics-failed-message</span></h1>');
      }, 4000);
    } else {
      clearTimeout(noLyricsTimer);
      const scroll = Settings.get('scrollLyrics', true);
      const lyricsHTML = lyrics.replace(/\n/g, '<br />');
      $('#lyrics').html(`<p ${scroll ? 'data-scroll' : ''}>${lyricsHTML}</p>`);
      animate = true;
    }
  };
  // Handle playing and pausing
  const stateHandler = (isPlaying) => {
    if (!isPlaying) return $('#lyrics p').stop() && setTimeout(() => (animate = true), 10);
  };
  // Handle time progression of a song
  const timeHandler = (timeObj) => {
    $('#lyrics_bar').width(`${(timeObj.total === 0 ? 0 : timeObj.current / timeObj.total) * 100}%`);
    let jumped = false;
    if (timeObj.current < jumpDetect || timeObj.current - jumpDetect > 1000) {
      animate = true;
      jumped = true;
    }
    if (!animate || !timeObj.total || !$('#lyrics p').get(0)) return;
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
  };

  const scrollSettingsHandler = (state) => {
    const lyricsP = $('#lyrics p');
    animate = state;
    if (state) {
      lyricsP.attr('data-scroll', true);
    } else {
      lyricsP.removeAttr('data-scroll');
      clearTimeout(animationTimer);
      lyricsP.stop();
    }
  };

  Emitter.on('PlaybackAPI:change:lyrics', (e, arg) => lyricsHandler(arg));
  Emitter.on('PlaybackAPI:change:state', (e, arg) => stateHandler(arg));
  Emitter.on('PlaybackAPI:change:time', (e, arg) => timeHandler(arg));
  Emitter.on('settings:set:scrollLyrics', (e, arg) => scrollSettingsHandler(arg));

  window.addEventListener('resize', () => { animate = true; });
  $('#lyrics_back').click(() => $('#lyrics_back').removeClass('vis'));
});

Emitter.on('lyrics:show', () => $('#lyrics_back').addClass('vis'));
