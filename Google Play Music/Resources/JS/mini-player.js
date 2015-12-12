document.addEventListener("DOMContentLoaded", function () {
    var GLOBAL_STYLES = "";

    var setStyle = function (selector, style, prefix) {
        if (typeof prefix === 'undefined') {
            prefix = true;
        }
        selector = (prefix ? "html.mini " : '') + selector;
        selector = selector.replace(/, /g, ", html.mini ");
        var string = selector + " {";
        for (var i = 0; i < style.length; i++) {
            string += subColors(style[i]) + " !important;";
        }
        string += "}";
        GLOBAL_STYLES += string;
    };

    setStyle(', body', ['height: 300px', 'width: 300px']);
    setStyle('#player', ['width: 300px', 'min-width: 280px', 'z-index: 9999999', 'height: 65px', 'min-height: 65px']);
    setStyle('#player', ['transition: bottom 0.3s', 'bottom: -100px', 'transition-timing-function: ease-in-out', 'width: 280px', 'left: 10px', 'right: 10px',
		'border-bottom-left-radius: 8px', 'border-bottom-right-radius: 8px'
    ]);
    setStyle('body[ready]:hover #player, body[controls] #player', ['bottom: 10px']);
    setStyle('body[ready]:hover #mini-info, body[controls] #mini-info', ['opacity: 1']);
    setStyle('#material-player-right-wrapper, #material-player-left-wrapper .player-left .image-wrapper, #material-player-left-wrapper .now-playing-info-content, #material-player-left-wrapper [data-id="now-playing-menu"]', ['display: none']);
    setStyle('#material-player-left-wrapper', ['flex: none', 'width: 0'])
    setStyle('#material-player-left-wrapper .now-playing-actions ', ['opacity: 1']);
    setStyle('#player #material-player-left-wrapper .rating-container paper-icon-button', ['background: transparent', 'position: absolute', 'top: 8px']);
    setStyle('#player #material-player-left-wrapper .rating-container paper-icon-button:nth-child(1)', ['left: 20px', 'display: none']);
    setStyle('#player #material-player-left-wrapper .rating-container paper-icon-button:nth-child(2)', ['left: 210px', 'display: none']);
    setStyle('#player[radio] #material-player-left-wrapper .rating-container paper-icon-button:nth-child(1)', ['display: block']);
    setStyle('#player[radio] #material-player-left-wrapper .rating-container paper-icon-button:nth-child(2)', ['display: block']);
    setStyle('#material-player-left-wrapper .rating-container', ['width: 0'])
    setStyle('#mini-album', ['position: fixed', 'top: 0', 'left: 0', 'display: block', 'width: 100%', 'height: 100%', 'z-index: 9999998']);
    setStyle('.player-progress-wrapper', ['left: 0']);
    setStyle('.material-player-middle', ['margin: 0px auto']);
    setStyle('#player.material .material-player-middle sj-icon-button[data-id="play-pause"] core-icon, #player.material .material-player-middle paper-icon-button[data-id="play-pause"] iron-icon', ['height: 50px', 'width: 50px', 'top: -2px']);
    setStyle('paper-icon-button[data-id="play-pause"]', ['text-align: center']);
    setStyle('[data-id=play-pause]::shadow paper-ripple.circle', ['height: 50px', 'width: 50px', 'margin-left: 6px', 'margin-top: -2px']);
    setStyle('[data-id=forward], [data-id=rewind], [data-id=repeat], [data-id=shuffle]', ['top: -8px']);
    setStyle('[data-id=repeat]', ['left: 28px']);
    setStyle('[data-id=rewind]', ['left: 16px']);
    setStyle('[data-id=forward]', ['left: -16px']);
    setStyle('[data-id=shuffle]', ['left: -28px']);
    setStyle('[data-id=show-miniplayer-dp]', ['color: #9e9e9e', 'position: absolute', 'top: auto', 'bottom: -4px', 'right: -4px', 'margin: 0'], false);
    setStyle('#player paper-icon-button[data-id="show-miniplayer-dp"] iron-icon', ['width: 16px', 'height: 16px'], false);
    setStyle('#current-track-prog-mini', ['position: absolute', 'top: 8px', 'left: 6px', 'font-size: 11px', 'display: block']);
    setStyle('#end-track-prog-mini', ['position: absolute', 'top: 8px', 'right: 6px', 'font-size: 11px', 'display: block']);
    setStyle('::shadow #mainContainer', ['overflow: hidden']);
    setStyle('#embed-container', ['width: 0', 'overflow: hidden'], false);
    setStyle('#mini-info', ['position: fixed', 'top: 0px', 'left: 0', 'width: 100%', 'height: 90px', 'overflow: hidden',
		'background: -webkit-linear-gradient(top, rgba(45,45,45,0.85) 0%,rgba(9,9,9,0.41) 79%,rgba(0,0,0,0) 100%)', 'display: block',
		'z-index: 9999999', 'transition: opacity 0.3s', 'transition-timing-function: ease-in-out', 'opacity: 0'
    ]);
    setStyle('#mini-info span', ['color: #EEE', 'display: block', 'font-size: 20px', 'padding: 4px 12px', 'cursor: default']);
    setStyle('#mini-info span:last-child', ['font-size: 16px', 'height: 18px', 'overflow: hidden']);

    var newStyle = document.createElement("style");
    newStyle.innerHTML = GLOBAL_STYLES;
    document.body.appendChild(newStyle);
    var info = document.createElement('div');
    info.id = "mini-info";
    info.setAttribute('style', 'display: none');
    info.innerHTML = '<span></span><span></span>';
    document.body.appendChild(info);

    var art = document.createElement('img');
    art.id = "mini-album";
    art.src = "https://www.samuelattard.com/img/gpm_placeholder.jpg";
    art.setAttribute('style', 'display: none');
    // If the album art load ever fails, use the placeholder
    art.addEventListener('error', function (e) {
        e.target.src = "https://www.samuelattard.com/img/gpm_placeholder.jpg";
    });
    art.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });
    document.body.appendChild(art);

    var addTimeSpans = setInterval(function () {
        var player = document.getElementById('player');
        if (document.getElementById('material-player-left-wrapper')) {
            span = document.createElement('span');
            span.id = "current-track-prog-mini";
            span.setAttribute('style', 'display: none');
            span.innerHTML = "0:00";
            player.appendChild(span);
            var span = document.createElement('span');
            span.id = "end-track-prog-mini";
            span.setAttribute('style', 'display: none');
            span.innerHTML = "0:00";
            player.appendChild(span);

            var container = document.createElement('div');
            container.innerHTML = '<paper-icon-button data-id="show-miniplayer-dp" icon="open-in-new" title="Show mini player" aria-label="Show mini player" role="button" tabindex="0" no-focus="" onclick="window.toggleMini(); this.blur(); return false;"></paper-icon-button>';
            document.getElementById('player').appendChild(container);
            clearInterval(addTimeSpans);
        }
    }, 10);

    var monitorTime = setInterval(function () {
        var currentTime = document.getElementById('time_container_current');
        var targetSpan = document.getElementById('current-track-prog-mini');
        if (currentTime && targetSpan) {
            if (targetSpan.innerHTML != currentTime.innerHTML) {
                targetSpan.innerHTML = currentTime.innerHTML;
            }
        }
        targetSpan = document.getElementById('end-track-prog-mini');
        var maxTime = document.getElementById('time_container_duration');
        if (targetSpan && maxTime) {
            if (targetSpan.innerHTML != maxTime.innerHTML) {
                targetSpan.innerHTML = maxTime.innerHTML;
            }
        }
        // Also check the controls setting
        if (window.hoverControls && document.body.getAttribute('controls') != null) {
            document.body.removeAttribute('controls');
        }
        if (!window.hoverControls && document.body.getAttribute('controls') == null) {
            document.body.setAttribute('controls', 'controls');
        }
        // Also check if it is radio or not
        var repeat = document.querySelectorAll('paper-icon-button[data-id="repeat"]'),
            player = document.querySelector('#player');
        if (repeat && repeat[0] && player) {
            if (repeat[0].style.display === 'none') {
                if (player.getAttribute('radio') === null) {
                    player.setAttribute('radio', 'on');
                }
            } else {
                if (player.getAttribute('radio') !== null) {
                    player.removeAttribute('radio');
                }
            }
        }
    }, 10);

    window.addEventListener('song-change', function (e) {
        document.getElementById('mini-album').src = e.detail.albumArt.replace('=s90', '=s300');
        var infoSpans = document.getElementById('mini-info').getElementsByTagName('span');
        infoSpans[0].innerHTML = e.detail.title;
        infoSpans[1].innerHTML = e.detail.artist + " - " + e.detail.album;
    });

    window.miniState = false;
    window.miniButton = true;
    window.toggleMini = function () {
        if (window.miniButton) {
            if (window.miniState) {
                window.goBig();
            } else {
                window.goMini();
            }
            window.miniState = !window.miniState;
            window.miniButton = false;
        }
    };

    // Scroll to change volume when in mini state
    window.addEventListener('mousewheel', function (e) {
        if (window.miniState) {
            var slider = document.getElementById('material-vslider');
            if (e.wheelDelta < 0) {
                slider.decrement();
            } else {
                slider.increment();
            }
        }
    });

    // Rely on the ready attribute because when the window is resized CEF does not check the hover state
    document.body.addEventListener('mouseover', function () {
        if (window.miniButton) {
            document.body.setAttribute('ready', 'ready');
        }
    });
    window.goMini = function () {
        document.body.removeAttribute('ready');
        csharpinterface.goMini();
    };

    window.goBig = function () {
        csharpinterface.goBig();
    };

    document.addEventListener('mousedown', function (e) {
        if (window.miniState && e.clientY <= 210) {
            csharpinterface.dragStart();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
});