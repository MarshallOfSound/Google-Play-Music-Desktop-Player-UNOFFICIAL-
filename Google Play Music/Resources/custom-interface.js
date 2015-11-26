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

var currentPlaying = JSON.stringify(null),
    lastScrobble = 0,
    lastScrobbleSong = JSON.stringify(null),
    songStart = 0;
setInterval(function () {
    if (new Date().getTime() - lastScrobble > 10000) {
        if (document.getElementById('sliderBar').value / document.getElementById('sliderBar').max >= 0.5 && currentPlaying !== JSON.stringify(null) && lastScrobbleSong !== currentPlaying) {
            var tmp = window.nowPlaying();
            csharpinterface.songScrobbleRequest(tmp.title, tmp.artist, tmp.album, songStart);
            lastScrobble = new Date().getTime();
            lastScrobbleSong = JSON.stringify(window.nowPlaying());
        }
    }
    if (JSON.stringify(window.nowPlaying()) != currentPlaying) {
        songStart = Math.floor(Date.now() / 1000);
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
        document.querySelectorAll('[href="https://plus.google.com/u/0/dashboard"]')[0].parentNode.setAttribute('data-gpmdp-account-node', 'true');
        var divs = document.querySelectorAll('[data-gpmdp-account-node="true"] > div');
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

        // Desktop Settings Trigger
        var d_settings = document.createElement('a');
        d_settings.setAttribute('data-type', 'desktopsettings');
        d_settings.setAttribute('class', 'nav-item-container tooltip');
        d_settings.setAttribute('href', "");
        d_settings.setAttribute('no-focus', "");
        d_settings.innerHTML = '<iron-icon icon="settings" alt="" class="x-scope iron-icon-0"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope iron-icon"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" class="style-scope iron-icon"></path></g></svg></iron-icon>Desktop Settings';
        d_settings.addEventListener('click', function (e) {
            csharpinterface.showSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        document.querySelectorAll('.nav-section.material')[0].insertBefore(d_settings, document.querySelectorAll('.nav-section.material > a')[2])
    }
}, 10);
