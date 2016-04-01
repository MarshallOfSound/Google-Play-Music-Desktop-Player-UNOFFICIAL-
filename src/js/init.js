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
          if (asset.name === 'RELEASES') return;
          count += asset.download_count;
        });
      });

      count = Math.round(count / 100) * 100;

      $('[download-counter]').text($('[download-counter]').text() + ', with over ' + count.toLocaleString() + ' downloads, together we can only make it better')
        .after($('<h6><small><i>The download counter used to be a little off here, sorry!</i></small></h6>'));
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
      var platforms = {
          'Win': /x86\.exe$/g,
          'Mac': /\.zip$/g,
          'Deb32': /i386\.deb/g,
          'Deb64': /amd64\.deb/g,
          'Fed32': /i386\.rpm/g,
          'Fed64': /amd64\.rpm/g,
        },
        downloads = {};

      $('#triggerLinux').click(function() {
        $('#downloadModal').closeModal();
        $('#downloadLinuxModal').openModal({
          dismissable: true,
        });
      });

      $('[dl-latest]').each(function(index, item) {
        $(item).text('Download Latest - ' + release.tag_name);
        $(item).click(function(e) {
          e.preventDefault();
          $('#downloadLinuxModal').closeModal();
          $('#downloadModal').openModal({
            dismissable: true,
          });
          return false;
        })
      });

      release.assets.forEach(function(asset) {
        for (var key in platforms) {
          if (platforms.hasOwnProperty(key)) {
            if (platforms[key].test(asset.name)) {
              downloads[key] = asset.browser_download_url;
              return;
            }
          }
        }
      });

      for (var key in downloads) {
        if (downloads.hasOwnProperty(key)) {
          (function(key) {
            $('#download' + key).click(function() {
              window.location = downloads[key];
            });
          })(key);
        }
      }
    }
  });
});
