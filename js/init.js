$(function () {
  $('#triggerLinux').click(function() {
    $('#downloadModal').closeModal();
    $('#downloadLinuxModal').openModal({
      dismissable: true,
    });
  });

  $('[dl-latest]').click(function(e) {
    e.preventDefault();
    $('#downloadLinuxModal').closeModal();
    $('#downloadModal').openModal({
      dismissable: true,
    });
    return false;
  })
});

$(function(){
  $('.button-collapse').sideNav();
  $('.parallax').parallax();
  $('.slider').slider({
    full_width: true,
    height: 600
  });
});

$(function() {
  function setDownloadCountText(count) {
    $('[download-counter]').text('100% Open Source, with over ' + (Math.round(count / 100) * 100).toLocaleString() + ' downloads, together we can only make it better');
  }
  setDownloadCountText(window.initialDownloadCount);

  // Fetch download count from github
  $.ajax({
    type: 'get',
    url: 'https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases?per_page=100',
    success: function(releases) {
      var count = 0;

      releases.forEach(function(release) {
        release.assets.forEach(function(asset) {
          if (asset.name === 'RELEASES') return;
          count += asset.download_count;
        });
      });

      setDownloadCountText(count);
    }
  });
  // Fetch issue count from github
  if ($('[issue-count]').length) {
    $.ajax({
      type: 'get',
      url: 'https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues',
      success: function(issues) {
        $('[issue-count]').text(issues.length);
      }
    });
  }
});
