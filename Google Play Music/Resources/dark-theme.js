setStyle = function(selector, style) {
	selector = "body.black " + selector
	selector = selector.replace(/, /g, ", body.black ");
    string = selector + " {";
    for (var i = 0; i < style.length; i++) {
        string += style[i] + " !important;";
    }
    string += "}";
    document.body.innerHTML += "<style data-black='true'>" + string + "</style>";
}

var toBeDeleted = [],
    currentTheme = "false";
DeleteElement = function(selector) {
    toBeDeleted.push(selector)
}
if (localStorage.getItem("dark-theme") === null) {
    localStorage.setItem("dark-theme", "false");
}

setInterval(function() {
    // Delete stuff
    for (var s = 0; s < toBeDeleted.length; s++) {
        var tmp = document.querySelectorAll(toBeDeleted[s]);
        for (var i = 0; i < tmp.length; i++) {
            tmp[i].parentNode.removeChild(tmp[i]);
        }
        if (toBeDeleted[s] === '') {
            toBeDeleted[s] = "asiofhdsoifhodsighodsihgoifdhogidfoi";
        }
    }
    var labsCard = document.querySelectorAll('.labs-card.settings-card');
    if (labsCard.length > 0) {
        labsCard = labsCard[0];
        var labsList = labsCard.querySelectorAll('.labs-list')[0],
            exists = labsList.querySelectorAll('.lab-list-item.black');
        if (exists.length === 0) {
            darkOn = localStorage.getItem("dark-theme");
            labsList.innerHTML += '<div class="lab-list-item black"><div class="lab-info"><div class="lab-name">Dark Theme</div><div class="lab-description">Changes the look of Google Play Music to a Dark Theme</div></div><paper-toggle-button onclick="turn' + (darkOn === "false" ? "On" : "Off") + 'Black(this);return false;" checked="' + darkOn + '" title="Dark Theme" aria-label="Dark Theme" role="button" aria-pressed="' + darkOn + '" tabindex="0" touch-action="pan-y"></paper-toggle-button></div>'
        }
    }
}, 10);

DeleteElement('[data-action="help-and-feedback"]');
DeleteElement('[data-action="upload-music"]');
DeleteElement('.gb_rb.gb_Ta.gb_r');
DeleteElement('.gb_ga.gb_Ta.gb_r.gb_ma');

BlackTheme = function() {
    setStyle('#material-app-bar', ['background-color: #121314']);
    setStyle('', ['background-color: #121314']);
    setStyle('#nav-container, #loading-overlay, #loading-progress, #loading-progress-bar', ['background: #222326']);
    setStyle('#loading-progress-bar', ['border: none']);
    setStyle('.nav-toolbar, .material-card .details, .material-card .image-wrapper', ['background: #222326']);
    setStyle('#nav', ['background: #222326', 'color: white']);
    setStyle('#player, .player-rating-container, #player.material .now-playing-actions sj-icon-button', ['color: white', 'background-color: #222326']);
    setStyle('#player.material:hover #material-player-progress::shadow #sliderContainer:not(.disabled) #sliderBar::shadow #progressContainer, .playlist-view .editable:hover', ['background: #615F59']);
    setStyle('.cluster-text-protection::before, .cluster-text-protection', ['background: transparent']);
    setStyle('.title, .recommended-header', ['color: white']);
    setStyle('.nav-item-container', ['color: white']);
    setStyle('#nav_collections .nav-item-container:focus, .nav-item-container:focus, .nav-item-container:hover, .nav-item-container.selected', ['background-color: #615F59']);
    setStyle('.nav-item-container:not(:focus):hover core-icon', ['color: #EF6C00']);
    setStyle('#nav_collections .nav-item-container:focus core-icon, .nav-item-container:focus core-icon', ['color: #EF6C00']);
    setStyle('.fade-out:after', ['display: none']);
    setStyle('.column.col-0 .material-card:first-child .image-wrapper', ['padding-top: 0']);
    setStyle('.material-detail-view .has-hero-image, .song-row td, .song-row td > *, .upload-progress-row td, .song-row.selected-song-row td', ['background: #222326', 'color: white']);
    setStyle('.song-row.selected-song-row .song-indicator, .song-row.selected-song-row .title-right-items, .song-row.selected-song-row .content, .song-row.selected-song-row .song-indicator[data-playback-status="paused"], .song-row.selected-song-row .song-indicator[data-playback-status="loading"], .song-row.selected-song-row [data-col="index"] .hover-button[data-id="play"], .song-row.selected-song-row [data-col="track"] .hover-button[data-id="play"], .song-row.selected-song-row td, .song-row.selected-song-row td > *', ['background-color: #615F59']);
    setStyle('.song-row.hover .song-indicator, .song-row.hover .title-right-items, .song-row.hover .content, .song-row.hover .song-indicator[data-playback-status="paused"], .song-row.hover .song-indicator[data-playback-status="loading"], .song-row.hover [data-col="index"] .hover-button[data-id="play"], .song-row.hover [data-col="track"] .hover-button[data-id="play"], .song-row.hover td, .song-row.hover td > *', ['background-color: #615F59']);
    setStyle(', .material-detail-view .material-container-details .info .description, .song-table th', ['color: #efefef']);
    setStyle('.song-row.hover [data-col="track"] .hover-button[data-id="play"]', ['background-color: #615F59']);
    setStyle('.song-row [data-col="index"] .song-indicator', ['background-color: #222326']);
    setStyle('.song-row.hover [data-col="index"] .song-indicator, .song-row.selected-song-row [data-col="index"] .song-indicator', ['background-color: #615F59']);
    setStyle('.song-row.selected-song-row.hover [data-col="index"] .hover-button[data-id="play"]', ['background-color: #615F59']);
    setStyle('.songlist-container', ['background-color: #222326']);
    setStyle('.nav-section-divider', ['border-bottom: 1px solid #615F59']);
    setStyle('.goog-menu, .now-playing-menu .goog-menuitem, .now-playing-menu .goog-submenu, .now-playing-menu .goog-submenu .goog-submenu-arrow, .goog-menuitem', ['background-color: #222326']);
    setStyle('.goog-menu .goog-menuitem .goog-menuitem-content, .goog-menuitem-highlight .goog-menuitem-content .goog-submenu-arrow, .goog-menuitem-highlight .goog-menuitem-content', ['color: white']);
    setStyle('.goog-menu .goog-menuitem.selected .goog-menuitem-content', ['color: #ef6c00']);
    setStyle('.goog-menu .goog-menuitem:hover, .goog-menu .goog-menuseparator', ['background-color: #615F59']);
    setStyle('.song-row td a', ['color: #777']);
    setStyle('.song-row.hover td a, .song-row.selected-song-row td a', ['color: #ccc']);
    setStyle('paper-action-dialog', ['background: #222326', 'color: white']);
    setStyle('.settings-card', ['background-color: #222326', 'color: white']);
    setStyle('#queue-overlay', ['background-color: #222326']);
    setStyle('#queue-overlay::after', ['border-color: transparent transparent #222326 #222326']);
    setStyle('.song-table [data-col="title"], .song-table.mini [data-col="song-details"] .song-title', ['color: white']);
}

window['turnOnBlack'] = function(self) {
    var old = document.body.className;
    if (old.split('black').length === 1) {
        document.body.className = document.body.className + ' black';
    }
    localStorage.setItem("dark-theme", "true");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOffBlack()');
    }
}

window['turnOffBlack'] = function(self) {
    document.body.className = document.body.className.toString().replace(/ ?black/g, '');
    localStorage.setItem("dark-theme", "false");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOnBlack()');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
	BlackTheme();
    if (localStorage.getItem("dark-theme") === "true") {
        window.turnOnBlack(null);
    }
});
