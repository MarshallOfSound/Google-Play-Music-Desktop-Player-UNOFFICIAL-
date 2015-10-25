var BACK_PRIMARY = '#222326',
    BACK_SECONDARY = '#121314',
    BACK_HIGHLIGHT = '#615F59',
    FORE_PRIMARY = '#FFFFFF',
    FORE_SECONDARY = '#EF6C00';

// Custom
FORE_SECONDARY = '#1ED760';

GLOBAL_STYLES = "<style>";

subColors = function (style) {
    style = style.replace(/\{\{BACK_PRIMARY\}\}/g, BACK_PRIMARY);
    style = style.replace(/\{\{BACK_SECONDARY\}\}/g, BACK_SECONDARY);
    style = style.replace(/\{\{BACK_HIGHLIGHT\}\}/g, BACK_HIGHLIGHT);
    style = style.replace(/\{\{FORE_PRIMARY\}\}/g, FORE_PRIMARY);
    style = style.replace(/\{\{FORE_SECONDARY\}\}/g, FORE_SECONDARY);
    return style;
}

setStyle = function (selector, style) {
    selector = "body.custom " + selector
    selector = selector.replace(/, /g, ", body.custom ");
    string = selector + " {";
    for (var i = 0; i < style.length; i++) {
        string += subColors(style[i]) + " !important;";
    }
    string += "}";
    GLOBAL_STYLES += string;
}

flushStyles = function () {
    document.body.innerHTML += GLOBAL_STYLES + "</style>";
}

if (localStorage.getItem("custom-theme") === null) {
    localStorage.setItem("custom-theme", "false");
}

setInterval(function () {
    var labsCard = document.querySelectorAll('.labs-card.settings-card');
    if (labsCard.length > 0) {
        labsCard = labsCard[0];
        var labsList = labsCard.querySelectorAll('.labs-list')[0],
            exists = labsList.querySelectorAll('.lab-list-item.black');
        if (exists.length === 0) {
            darkOn = localStorage.getItem("custom-theme");
            labsList.innerHTML += '<div class="lab-list-item black"><div class="lab-info"><div class="lab-name">Custom Theme</div><div class="lab-description">Changes the look of Google Play Music to a Custom Theme</div></div><paper-toggle-button onclick="window.turn' + (darkOn === "false" ? "On" : "Off") + 'Custom(this);return false;" checked="' + darkOn + '" title="Custom Theme" aria-label="Custom Theme" role="button" aria-pressed="' + darkOn + '" tabindex="0" touch-action="pan-y"></paper-toggle-button></div>'
        }
    }
}, 10);

BlackTheme = function () {
    setStyle('#material-app-bar', ['background-color: {{BACK_SECONDARY}}']);
    setStyle('', ['background-color: {{BACK_SECONDARY}}']);
    setStyle('#nav-container, #loading-overlay, #loading-progress, #loading-progress-bar', ['background: {{BACK_PRIMARY}}']);
    setStyle('#loading-progress-bar', ['border: none']);
    setStyle('.nav-toolbar, .material-card .details, .material-card .image-wrapper', ['background: {{BACK_PRIMARY}}']);
    setStyle('#nav', ['background: {{BACK_PRIMARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('#player, .player-rating-container, #player.material .now-playing-actions sj-icon-button', ['color: {{FORE_PRIMARY}}', 'background-color: {{BACK_PRIMARY}}']);
    setStyle('#player.material:hover #material-player-progress::shadow #sliderContainer:not(.disabled) #sliderBar::shadow #progressContainer, .playlist-view .editable:hover', ['background: {{BACK_HIGHLIGHT}}']);
    setStyle('.cluster-text-protection::before, .cluster-text-protection', ['background: transparent']);
    setStyle('.title, .recommended-header', ['color: {{FORE_PRIMARY}}']);
    setStyle('.nav-item-container', ['color: {{FORE_PRIMARY}}']);
    setStyle('#nav_collections .nav-item-container:focus, .nav-item-container:focus, .nav-item-container:hover, .nav-item-container.selected', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.nav-item-container:not(:focus):hover core-icon', ['color: {{FORE_SECONDARY}}']);
    setStyle('#nav_collections .nav-item-container:focus core-icon, .nav-item-container:focus core-icon', ['color: {{FORE_SECONDARY}}']);
    setStyle('.fade-out:after', ['display: none']);
    setStyle('.column.col-0 .material-card:first-child .image-wrapper', ['padding-top: 0']);
    setStyle('.material .song-row .song-indicator', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.material .song-row:hover .song-indicator', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.material-detail-view .has-hero-image, .song-row td, .song-row td > *, .upload-progress-row td, .song-row.selected-song-row td', ['background: {{BACK_PRIMARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('.song-row.selected-song-row .song-indicator, .song-row.selected-song-row .title-right-items, .song-row.selected-song-row .content, .song-row.selected-song-row .song-indicator[data-playback-status="paused"], .song-row.selected-song-row .song-indicator[data-playback-status="loading"], .song-row.selected-song-row [data-col="index"] .hover-button[data-id="play"], .song-row.selected-song-row [data-col="track"] .hover-button[data-id="play"], .song-row.selected-song-row td, .song-row.selected-song-row td > *', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.song-row.hover .song-indicator, .song-row.hover .title-right-items, .song-row.hover .content, .song-row.hover .song-indicator[data-playback-status="paused"], .song-row.hover .song-indicator[data-playback-status="loading"], .song-row.hover [data-col="index"] .hover-button[data-id="play"], .song-row.hover [data-col="track"] .hover-button[data-id="play"], .song-row.hover td, .song-row.hover td > *', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('body.material, .material-detail-view .material-container-details .info .description, .song-table th', ['color: #efefef']);
    setStyle('.song-row.hover [data-col="track"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.song-row [data-col="index"] .song-indicator', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.song-row.hover [data-col="index"] .song-indicator, .song-row.selected-song-row [data-col="index"] .song-indicator', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.song-row.selected-song-row.hover [data-col="index"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.songlist-container', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.nav-section-divider', ['border-bottom: 1px solid {{BACK_HIGHLIGHT}}']);
    setStyle('.goog-menu, .now-playing-menu .goog-menuitem, .now-playing-menu .goog-submenu, .now-playing-menu .goog-submenu .goog-submenu-arrow, .goog-menuitem', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.goog-menu .goog-menuitem .goog-menuitem-content, .goog-menuitem-highlight .goog-menuitem-content .goog-submenu-arrow, .goog-menuitem-highlight .goog-menuitem-content', ['color: {{FORE_PRIMARY}}']);
    setStyle('.goog-menu .goog-menuitem.selected .goog-menuitem-content', ['color: {{FORE_SECONDARY}}']);
    setStyle('.goog-menu .goog-menuitem:hover, .goog-menu .goog-menuseparator', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.material-detail-view .artist-details .bio-wrapper .bio', ['color: {{FORE_PRIMARY}}']);
    setStyle('.song-row.hover td a, .song-row.selected-song-row td a', ['color: {{FORE_PRIMARY}}']);
    setStyle('paper-action-dialog', ['background: {{BACK_PRIMARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('.settings-card', ['background-color: {{BACK_PRIMARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('#queue-overlay', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('#queue-overlay::after', ['border-color: transparent transparent {{BACK_PRIMARY}} {{BACK_PRIMARY}}']);
    setStyle('.upload-dialog-content', ['background-color: {{BACK_SECONDARY}}']);
    setStyle('.upload-dialog-description', ['color: {{FORE_PRIMARY}}']);
    setStyle('.material .song-row:hover [data-col="index"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}'])
    setStyle('.goog-menuheader', ['color: {{FORE_PRIMARY}}']);
    // Accents
    setStyle('.material-container-details sj-fab, #current-loading-progress', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('#player.material .material-player-middle sj-icon-button[data-id="play-pause"]:not([disabled])', ['color: {{FORE_SECONDARY}}']);
    setStyle('#loading-overlay.material paper-spinner::shadow .circle', ['border-color: {{FORE_SECONDARY}}']);
    setStyle('a.primary', ['color: {{FORE_SECONDARY}}']);
    setStyle('sj-paper-button.material-primary', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-checkbox::shadow #checkbox.checked', ['border-color: {{FORE_SECONDARY}}', 'background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-toggle-button::shadow [checked] .toggle', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-toggle-button::shadow [checked] .toggle-ink', ['color: {{FORE_SECONDARY}}']);
    setStyle('paper-slider::shadow #sliderKnobInner, paper-slider::shadow #sliderBar::shadow #activeProgress', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.nav-item-container.selected core-icon', ['color: {{FORE_SECONDARY}}']);
    setStyle('.upload-dialog-title', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.material a, .material .simple-dialog a', ['color: {{FORE_PRIMARY}}']);
    setStyle('.material .song-table [data-col="title"], .material .song-table.mini [data-col="song-details"] .song-title', ['color: {{FORE_PRIMARY}}']);
    setStyle('.subcategories-list, .material-detail-view .station-container-content-wrapper .material-container-details', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.material-list li a:hover, .material-list li a:focus', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('paper-input-decorator::shadow #underline .focused-underline', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-action-dialog sj-paper-button, paper-dialog .buttons paper-button, .share-buttons .share-button .button-label', ['color: {{FORE_PRIMARY}}']);
    setStyle('.song-row:hover td, .song-row:hover td > *', ['background: {{BACK_HIGHLIGHT}}']);
    setStyle('.material .song-row:hover [data-col="track"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}']);
	setStyle('.rating-container li', ['-webkit-filter: invert(1)']);
	setStyle('#player.material .material-player-middle sj-icon-button[data-id="repeat"][value="LIST_REPEAT"], #player.material .material-player-middle sj-icon-button[data-id="repeat"][value="SINGLE_REPEAT"], #player.material .material-player-middle sj-icon-button[data-id="shuffle"][value="ALL_SHUFFLE"], #player.material .material-player-middle paper-icon-button[data-id="repeat"][value="LIST_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="repeat"][value="SINGLE_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="shuffle"][value="ALL_SHUFFLE"]', ['color: {{FORE_SECONDARY}}']);
	setStyle('.cluster .lane-button core-icon, .cluster .lane-button iron-icon, #player.material #material-player-right-wrapper sj-icon-button[data-id="queue"].opened', ['color: {{FORE_SECONDARY}}']);
	setStyle('.song-row .explicit, .material-card .explicit', ['background-color: {{FORE_SECONDARY}}']);
	setStyle('.material-detail-view .material-container-details .read-more-button', ['color: {{FORE_SECONDARY}}']);
	setStyle('paper-dialog', ['background: {{BACK_SECONDARY}}', 'color: {{FORE_PRIMARY}}']);
	setStyle('.nav-toolbar .menu-logo', ['-webkit-filter: hue-rotate(90deg)']);

    flushStyles();
}

window['turnOnCustom'] = function (self) {
    csharpinterface.darkTheme();
    var old = document.body.className;
    if (old.split('custom').length === 1) {
        document.body.className = document.body.className + ' custom';
    }
    localStorage.setItem("custom-theme", "true");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOffCustom()');
    }
}

window['turnOffCustom'] = function (self) {
    csharpinterface.lightTheme();
    document.body.className = document.body.className.toString().replace(/ ?custom/g, '');
    localStorage.setItem("custom-theme", "false");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOnCustom()');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    BlackTheme();
    if (localStorage.getItem("custom-theme") === "true") {
        window.turnOnCustom(null);
    } else {
        window.turnOffCustom(null);
    }
});