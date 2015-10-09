window.nowPlaying = function() {
    var container = document.getElementsByClassName('now-playing-info-content'),
        info = {},
        element;
    
    if (container.length > 0) {
        container = container[0];
        element = container.getElementsByClassName('player-album');
        if (element.length > 0) {
            element = element[0];
            info.album = element.innerText || element.textContent;
            element = document.getElementById('player-song-title');
            info.title = element.innerText || element.textContent;
            element = document.getElementById('player-artist');
            info.artist = element.innerText || element.textContent;
			info.albumArt = document.getElementById('playingAlbumArt').src;
        }
    }
    if (!info.title) {
        return null;
    } else {
        return info;
    }
}

var currentPlaying = JSON.stringify(null);
setInterval(function() {
    if (JSON.stringify(window.nowPlaying()) != currentPlaying) {
        currentPlaying = JSON.stringify(window.nowPlaying());
		tmp = window.nowPlaying();
		csharpinterface.songChangeEvent(tmp.title, tmp.album, tmp.artist, tmp.albumArt);
    }
}, 20);