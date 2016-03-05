$(function(){
  $('.button-collapse').sideNav();
  $('.parallax').parallax();
  $('.slider').slider({
    full_width: true,
    height: 600
  });
});

$(function() {
  // Fetch download count from github
  $.ajax({
    type: 'get',
    url: 'https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases',
    success: function(releases) {
      var count = 0;

      releases.forEach(function(release) {
        release.assets.forEach(function(asset) {
          count += asset.download_count;
        });
      });

      count = Math.round(count / 100) * 100;

      $('[download-counter]').text($('[download-counter]').text() + ', with over ' + count + ' downloads, together we can only make it better')
    }
  });
  // Fetch issue count from github
  $.ajax({
    type: 'get',
    url: 'https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues',
    success: function(issues) {
      $('[issue-count]').text(issues.length);
    }
  });
  // Fetch latest release from github
  $.ajax({
    type: 'get',
    url: 'https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/latest',
    success: function(release) {
      var win,
        osx;

      $('[dl-latest]').each(function(index, item) {
        $(item).text('Download Latest - ' + release.tag_name);
        $(item).click(function(e) {
          e.preventDefault();
          $('#downloadModal').openModal({
            dismissable: true,
          });
          return false;
        })
      });

      release.assets.forEach(function(asset) {
        if (/\.zip$/g.test(asset.name)) {
          osx = asset.browser_download_url;
        } else if (/\.exe$/g.test(asset.name)) {
          win = asset.browser_download_url;
        }
      });

      $('#downloadWin').click(function() {
        if (win) {
          window.location = win;
        } else {
          alert('Something went wrong, please try again in a few minutes');
        }
      });
      $('#downloadMac').click(function() {
        if (osx) {
          window.location = osx;
        } else {
          alert('Something went wrong, please try again in a few minutes');
        }
      });
    }
  });
});
