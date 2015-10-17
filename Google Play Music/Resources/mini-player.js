document.addEventListener("DOMContentLoaded", function(event) {
	GLOBAL_STYLES = "<style>";

	setStyle = function (selector, style, prefix) {
		if (typeof prefix === 'undefined') {
			prefix = true;
		}
		selector = (prefix ? "html.mini " : '') + selector
		selector = selector.replace(/, /g, ", html.mini ");
		string = selector + " {";
		for (var i = 0; i < style.length; i++) {
			string += subColors(style[i]) + " !important;";
		}
		string += "}";
		GLOBAL_STYLES += string;
	}

	setStyle(', body', ['height: 300px', 'width: 300px']);
	setStyle('#player', ['width: 300px', 'min-width: 280px', 'z-index: 9999999', 'height: 65px', 'min-height: 65px']);
	setStyle('#player', ['transition: bottom 0.3s', 'bottom: -100px', 'transition-timing-function: ease-in-out', 'width: 280px', 'left: 10px', 'right: 10px',
						 'border-bottom-left-radius: 8px', 'border-bottom-right-radius: 8px']);
	setStyle('body:hover #player', ['bottom: 10px']);
	setStyle('#material-player-left-wrapper, #material-player-right-wrapper', ['display: none']);
	setStyle('#mini-album', ['position: fixed', 'top: 0', 'left: 0', 'display: block', 'width: 300px', 'height: 300px', 'z-index: 9999998']);
	setStyle('.player-progress-wrapper', ['left: 0']);
	setStyle('.material-player-middle', ['margin: 0px auto']);
	setStyle('::shadow [aria-label="play-circle-fill"], ::shadow [aria-label="pause-circle-fill"]', ['height: 50px', 'width: 50px', 'top: -8px']);
	setStyle('[data-id=play-pause]::shadow paper-ripple.circle', ['height: 50px', 'width: 50px', 'margin-left: 6px', 'margin-top: -2px']);
	setStyle('[data-id=forward], [data-id=rewind], [data-id=repeat], [data-id=shuffle]', ['top: -8px']);
	setStyle('[data-id=shuffle]', ['left: -8px']);
	setStyle('[data-id=repeat]', ['left: 8px']);
	setStyle('[data-id=show-miniplayer-dp]', ['color: #9e9e9e', 'position: absolute', 'top: auto', 'bottom: 0', 'right: 0', 'margin: 0'], false);
	setStyle('#player sj-icon-button[data-id="show-miniplayer-dp"]::shadow core-icon', ['width: 16px', 'height: 16px'], false)
	setStyle('#current-track-prog-mini', ['position: absolute', 'top: 8px', 'left: 6px', 'font-size: 11px', 'display: block']);
	setStyle('#end-track-prog-mini', ['position: absolute', 'top: 8px', 'right: 6px', 'font-size: 11px', 'display: block']);
	setStyle('::shadow #mainContainer', ['overflow: hidden']);

	document.body.innerHTML += GLOBAL_STYLES + "</style>";
	var art = document.createElement('img');
	art.id = "mini-album";
	art.src = "https://www.samuelattard.com/img/gpm_placeholder.jpg";
	art.setAttribute('style', 'display: none');
	document.body.appendChild(art);

	var addTimeSpans = setInterval(function() {
		var player = document.getElementById('player');
		if (document.getElementById('material-player-left-wrapper')) {
			var span = document.createElement('span');
			span.id = "current-track-prog-mini";
			span.setAttribute('style', 'display: none');
			span.innerHTML = "0:00";
			player.appendChild(span);
			var span = document.createElement('span');
			span.id = "end-track-prog-mini";
			span.setAttribute('style', 'display: none');
			span.innerHTML = "0:00";
			player.appendChild(span);

			container = document.createElement('div');
			container.innerHTML = '<sj-icon-button data-id="show-miniplayer-dp" icon="open-in-new" title="Show mini player" aria-label="Show mini player" role="button" tabindex="0" no-focus="" onclick="window.toggleMini()"></sj-icon-button>';
			document.getElementById('player').appendChild(container);
			clearInterval(addTimeSpans);
		}
	}, 10);

	var monitorTime = setInterval(function() {
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
	}, 10);

	window.addEventListener('song-change', function(e) {
		document.getElementById('mini-album').src = e.detail.albumArt.replace('=s90', '=s300');
	});

	window.miniState = false;
	window.toggleMini = function() {
		if (window.miniState) {
			window.goBig();
		} else {
			window.goMini();
		}
		window.miniState = !window.miniState;
	};

	window.goMini = function() {
		csharpinterface.goMini();
	};

	window.goBig = function() {
		csharpinterface.goBig();
	};

	document.addEventListener('mousedown', function(e) { if (window.miniState && e.clientY <= 210) {csharpinterface.dragStart(); e.preventDefault(); return false;}});
});