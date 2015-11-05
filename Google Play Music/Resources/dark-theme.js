var BACK_PRIMARY = '#222326',
	BACK_SECONDARY = '#121314',
	BACK_HIGHLIGHT = '#615F59',
	FORE_PRIMARY = '#FFFFFF',
	FORE_SECONDARY = '#EF6C00';

// Custom
FORE_SECONDARY = window.CustomColor || '#1ED760';

var GLOBAL_STYLES = "";

var subColors = function (style) {
    style = style.replace(/\{\{BACK_PRIMARY\}\}/g, BACK_PRIMARY);
    style = style.replace(/\{\{BACK_SECONDARY\}\}/g, BACK_SECONDARY);
    style = style.replace(/\{\{BACK_HIGHLIGHT\}\}/g, BACK_HIGHLIGHT);
    style = style.replace(/\{\{FORE_PRIMARY\}\}/g, FORE_PRIMARY);
    style = style.replace(/\{\{FORE_SECONDARY\}\}/g, FORE_SECONDARY);
    return style;
};

var setStyle = function (selector, style, imp) {
    selector = "body.custom " + selector;
    selector = selector.replace(/, /g, ", body.custom ");
    var string = selector + " {";
    for (var i = 0; i < style.length; i++) {
        string += subColors(style[i]) + (imp ? "" : " !important;");
    }
    string += "}";
    GLOBAL_STYLES += string;
};

var flushStyles = function () {
    var s = document.createElement('style');
    s.setAttribute('id', 'custom-theme-style');
    s.innerHTML = GLOBAL_STYLES;
    document.body.appendChild(s);
};

if (localStorage.getItem("custom-theme") === null) {
    localStorage.setItem("custom-theme", "false");
}

window.ReDrawTheme = function () {
    var t = document.getElementById('custom-theme-style');
    if (t) {
        t.remove();
    }
    FORE_SECONDARY = window.CustomColor || '#1ED760';
    BlackTheme();
};

var BlackTheme = function () {
    setStyle('#material-app-bar', ['background-color: {{BACK_SECONDARY}}']);
    setStyle('', ['background-color: {{BACK_SECONDARY}}']);
    setStyle('#nav-container, #loading-overlay, #loading-progress, #loading-progress-bar', ['background: {{BACK_PRIMARY}}']);
    setStyle('#loading-progress-bar', ['border: none']);
    setStyle('.nav-toolbar, .material-card .details, .material-card .image-wrapper', ['background: {{BACK_PRIMARY}}']);
    setStyle('#nav', ['background: {{BACK_PRIMARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('#player, .player-rating-container, #player.material .now-playing-actions paper-icon-button', ['color: {{FORE_PRIMARY}}', 'background-color: {{BACK_PRIMARY}}']);
    setStyle('#player.material:hover #material-player-progress #sliderContainer:not(.disabled) #sliderBar #progressContainer, .playlist-view .editable:hover', ['background: {{BACK_HIGHLIGHT}}']);
    setStyle('.cluster-text-protection::before, .cluster-text-protection', ['background: transparent']);
    setStyle('.title, .recommended-header', ['color: {{FORE_PRIMARY}}']);
    setStyle('.nav-item-container', ['color: {{FORE_PRIMARY}}']);
    setStyle('#nav_collections .nav-item-container:focus, .nav-item-container:focus, .nav-item-container:hover, .nav-item-container.selected', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.nav-item-container:not(:focus):hover iron-icon', ['color: {{FORE_SECONDARY}}']);
    setStyle('#nav_collections .nav-item-container:focus iron-icon, .nav-item-container:focus iron-icon', ['color: {{FORE_SECONDARY}}']);
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
    setStyle('.material .song-row:hover [data-col="index"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.goog-menuheader', ['color: {{FORE_PRIMARY}}']);
    setStyle('.paper-progress-1 #primaryProgress.paper-progress', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.album-view .material-container-details .info .title .explicit', ['background-color: {{FORE_SECONDARY}}']);
    // Accents
    setStyle('.paper-input-container-0 .input-content.label-is-highlighted.paper-input-container label, .paper-input-container-0 .input-content.label-is-highlighted.paper-input-container .paper-input-label', ['color: {{FORE_SECONDARY}}']);
    setStyle('.paper-input-container-0 .input-content.paper-input-container input, .paper-input-container-0 .input-content.paper-input-container textarea, .paper-input-container-0 .input-content.paper-input-container iron-autogrow-textarea, .paper-input-container-0 .input-content.paper-input-container .paper-input-input, .material-share-options #sharing-option-label', ['color: {{FORE_PRIMARY}}']);
    setStyle('.paper-input-container-0 .add-on-content.is-highlighted.paper-input-container *', ['color: {{FORE_SECONDARY}}']);
    setStyle('.material-container-details paper-fab, #current-loading-progress', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('#player.material .material-player-middle paper-icon-button[data-id="play-pause"]:not([disabled])', ['color: {{FORE_SECONDARY}}']);
    setStyle('#loading-overlay.material paper-spinner .circle', ['border-color: {{FORE_SECONDARY}}'], true);
    setStyle('a.primary', ['color: {{FORE_SECONDARY}}']);
    setStyle('paper-button.material-primary', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-checkbox #checkbox.checked', ['border-color: {{FORE_SECONDARY}}', 'background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-checkbox #ink', ['color: {{FORE_SECONDARY}}']);
    setStyle('paper-checkbox #checkboxLabel', ['color: {{FORE_PRIMARY}}']);
    setStyle('paper-toggle-button[checked] .toggle-button', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-toggle-button[checked] .toggle-bar', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-toggle-button[checked] .toggle-ink', ['color: {{FORE_SECONDARY}}']);
    setStyle('.paper-slider-0 #sliderKnobInner.paper-slider, .paper-progress-0 #primaryProgress.paper-progress', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.nav-item-container.selected iron-icon', ['color: {{FORE_SECONDARY}}']);
    setStyle('.upload-dialog-title', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.material a, .material .simple-dialog a', ['color: {{FORE_PRIMARY}}']);
    setStyle('.material .song-table [data-col="title"], .material .song-table.mini [data-col="song-details"] .song-title', ['color: {{FORE_PRIMARY}}']);
    setStyle('.subcategories-list, .material-detail-view .station-container-content-wrapper .material-container-details', ['background-color: {{BACK_PRIMARY}}']);
    setStyle('.material-list li a:hover, .material-list li a:focus', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.paper-input-container-0 .focused-line.paper-input-container', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('paper-action-dialog paper-button, paper-dialog .buttons paper-button, .share-buttons .share-button .button-label', ['color: {{FORE_PRIMARY}}']);
    setStyle('.song-row:hover td, .song-row:hover td > *', ['background: {{BACK_HIGHLIGHT}}']);
    setStyle('.material .song-row:hover [data-col="track"] .hover-button[data-id="play"]', ['background-color: {{BACK_HIGHLIGHT}}']);
    setStyle('.rating-container li', ['-webkit-filter: invert(1)']);
    setStyle('#player.material .material-player-middle paper-icon-button[data-id="repeat"][value="LIST_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="repeat"][value="SINGLE_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="shuffle"][value="ALL_SHUFFLE"], #player.material .material-player-middle paper-icon-button[data-id="repeat"][value="LIST_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="repeat"][value="SINGLE_REPEAT"], #player.material .material-player-middle paper-icon-button[data-id="shuffle"][value="ALL_SHUFFLE"]', ['color: {{FORE_SECONDARY}}']);
    setStyle('.cluster .lane-button core-icon, .cluster .lane-button iron-icon, #player.material #material-player-right-wrapper paper-icon-button[data-id="queue"].opened', ['color: {{FORE_SECONDARY}}']);
    setStyle('.song-row .explicit, .material-card .explicit', ['background-color: {{FORE_SECONDARY}}']);
    setStyle('.material-detail-view .material-container-details .read-more-button', ['color: {{FORE_SECONDARY}}']);
    setStyle('paper-dialog', ['background: {{BACK_SECONDARY}}', 'color: {{FORE_PRIMARY}}']);
    setStyle('.nav-toolbar .menu-logo', ['-webkit-filter: hue-rotate(90deg)']);

    flushStyles();
};

window.turnOnCustom = function (self) {
    csharpinterface.darkTheme();
    var old = document.body.className;
    if (old.split('custom').length === 1) {
        document.body.className = document.body.className + ' custom';
    }
    localStorage.setItem("custom-theme", "true");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOffCustom()');
    }
};

window.turnOffCustom = function (self) {
    csharpinterface.lightTheme();
    document.body.className = document.body.className.toString().replace(/ ?custom/g, '');
    localStorage.setItem("custom-theme", "false");
    if (self !== null) {
        self.setAttribute('onclick', 'window.turnOnCustom()');
    }
};

document.addEventListener("DOMContentLoaded", function () {
    BlackTheme();
    if (localStorage.getItem("custom-theme") === "true") {
        window.turnOnCustom(null);
    } else {
        window.turnOffCustom(null);
    }
});