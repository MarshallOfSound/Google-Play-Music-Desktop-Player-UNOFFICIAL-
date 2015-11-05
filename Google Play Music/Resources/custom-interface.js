window.nowPlaying = function () {
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
};

var currentPlaying = JSON.stringify(null);
setInterval(function () {
    if (JSON.stringify(window.nowPlaying()) != currentPlaying) {
        currentPlaying = JSON.stringify(window.nowPlaying());
        var tmp = window.nowPlaying(),
			event = new CustomEvent('song-change', {
			    'detail': window.nowPlaying()
			});
        window.dispatchEvent(event);
        csharpinterface.songChangeEvent(tmp.title, tmp.album, tmp.artist, tmp.albumArt);
    }
}, 20);

var check = setInterval(function () {
    if (document.querySelectorAll('.nav-item-container[data-action=upload-music]').length !== 0) {
        clearInterval(check);
        var hideDiv = function (div) {
            div.style.display = "none";
        };

        hideDiv(document.querySelectorAll('.nav-item-container[data-action=upload-music]')[0]);
        hideDiv(document.querySelectorAll('.nav-item-container[data-action=help-and-feedback]')[0]);
        var divs = document.querySelectorAll('[aria-label="Account Information"] > div');
        hideDiv(divs[0]);
        hideDiv(divs[1]);
        hideDiv(divs[2].querySelectorAll('div')[0]);
        divs[2].querySelectorAll('div')[1].querySelectorAll('a')[0].setAttribute('style', 'color: black !important');
        hideDiv(document.querySelectorAll('#gbwa')[0]);
        hideDiv(document.querySelectorAll('#gbwa + div')[0]);
        hideDiv(document.querySelectorAll('#gbwa + div')[0]);
        document.querySelectorAll('#gbwa + div + div')[0].setAttribute('style', 'margin-left: auto !important');

        var e = document.getElementById('material-one-right');
        e.innerHTML = '' +
			'<style>[data-id=prev-history][disabled], [data-id=next-history][disabled] { opacity: 0.3; }</style>' +
			'<paper-icon-button data-id="prev-history" icon="arrow-back" role="button" tabindex="0" title="Navigate Back" aria-label="Navigate Back" style="color: white" onclick="window.history.back()"></paper-icon-button>' +
			'<paper-icon-button data-id="next-history" icon="arrow-forward" role="button" tabindex="0" title="Navigate Forward" aria-label="Navigate Forward" style="color: white" onclick="window.history.forward()"></paper-icon-button>' +
			e.innerHTML;
    }
}, 10);