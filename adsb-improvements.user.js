// ==UserScript==
// @name         ADS-B Improvements
// @description  A modification for adsbexchange.com that makes the UI slightly more modern and easier to look at.
// @updateURL    https://raw.githubusercontent.com/QuarTheDev/userscripts/main/adsb-improvements.user.js
// @downloadURL  https://raw.githubusercontent.com/QuarTheDev/userscripts/main/adsb-improvements.user.js
// @version      0.3.2
// @author       QuarTheDev
// @match        *://*.adsbexchange.com/*
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/logos/adsb-improvements-512.png
// @license      GPL-3.0
// @namespace    https://quar.pages.dev/
// @grant        GM_addStyle
// ==/UserScript==

// NOTES
// Google Icons data:
// Fill: 1
// Weight: 500
// Grade: 200
// Optical Size: 48

(function() {
    'use strict';

    // Auto-Redirect adsbexchange.com to globe.adsbexchange.com
    if (location.hostname === 'adsbexchange.com') {
        var newURL = location.href.replace('adsbexchange.com', 'globe.adsbexchange.com');
        location.replace(newURL);
    }

    // FlightAware Redirect
    // Special thanks to @pony-pasture-aviation for the concept
    let callsignElement = document.getElementById('selected_callsign');

    callsignElement.addEventListener('DOMSubtreeModified', function() {
        if (callsignElement.textContent !== "no callsign") {
            callsignElement.style.cursor = 'pointer';
            callsignElement.innerHTML = `<a href="https://flightaware.com/live/flight/${callsignElement.textContent}" target="_blank" style="text-decoration: none; color: inherit;">${callsignElement.textContent}</a>`;
        } else {
            callsignElement.style.cursor = 'default';
            callsignElement.innerHTML = callsignElement.textContent;
        }
    });

    callsignElement.style.cursor = (callsignElement.textContent !== "no callsign") ? 'pointer' : 'default';
    callsignElement.innerHTML = (callsignElement.textContent !== "no callsign") ? `<a href="https://flightaware.com/live/flight/${callsignElement.textContent}" target="_blank" style="text-decoration: none; color: inherit;">${callsignElement.textContent}</a>` : callsignElement.textContent;

    // Branding removal
    const elementTitle = document.getElementById('dump1090_version');
    if (elementTitle) {
        elementTitle.textContent = 'ADS-B Exchange';
        elementTitle.removeAttribute('href');
    }

    // Mature sidebar names
    const sidebar_titles = document.getElementsByClassName('section-title-content');
    sidebar_titles[7].textContent = 'Miscellaneous';

    // Temporary: Snap Sliders
    var sliderSelector = ".ui-slider-handle";
    var snapIncrement = 5;

    var sliders = document.querySelectorAll(sliderSelector);
    sliders.forEach(function(slider) {
        slider.addEventListener("mouseup", function() {
            var position = parseInt(slider.style.left, 10);
            var snappedPosition = Math.round(position / snapIncrement) * snapIncrement;
            slider.style.left = snappedPosition + "%";
        });
    });

    // Dynamic background (temporary solution, will fix soon)
    const radioColors = {
        0: '#aad3df',   // OpenStreetMap ADSBx
        1: '#aad3df',   // OpenStreetMap
        2: '#d5e8eb',   // CARTO.com English
        // 3
        // 4
        5: '#262626',   // CARTO.com dark_all
        6: '#262626',   // CARTO.com dark_nolabels
        7: '#d4dadc',   // CARTO.com light_all
        8: '#d4dadc',   // CARTO.com light_nolabels
        9: '#fefefe',
        10: '#fefefe',
        11: '#fefefe',
        12: '#fefefe',
        13: '#fefefe',
        14: '#fefefe',
        15: '#fefefe',
        16: '#fefefe'
    };

    function setBackgroundColor(color) {
        const mapCanvas = document.getElementById('map_canvas');
        if (mapCanvas) {
            mapCanvas.style.backgroundColor = color;
        }
    }

    function checkRadioButtons() {
        const layerRadios = document.querySelectorAll('li.layer input[type="radio"]');
        layerRadios.forEach((radio, index) => {
            if (radio.checked && radioColors.hasOwnProperty(index)) {
                setBackgroundColor(radioColors[index]);
            }
        });
    }

    const observerCallback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
                checkRadioButtons();
                break;
            }
        }
    };

    function startMutationObserver() {
        const observer = new MutationObserver(observerCallback);
        const layerRadios = document.querySelectorAll('li.layer input[type="radio"]');
        layerRadios.forEach((radio) => {
            observer.observe(radio, { attributes: true });
        });
    }

    function initialize() {
        checkRadioButtons();
        startMutationObserver();
    }

    initialize();

    // Main CSS modifications
    GM_addStyle(`

        *:not(body):not(#layout_container):not(#map_container):not(#map_canvas):not(.ol-viewport):not(.ol-unselectable.ol-layers):not(.ol-layer):not(canvas):not(img):not(.layer-switcher .group button) {
            border-radius: 8px !important;
        }

        div.ol-attribution.ol-unselectable.ol-control.ol-uncollapsible {
            display: none !important;
        }

        div#credits {
            display: none !important;
        }

        td#adsbexchange_header.infoblock_row.hidden {
            display: none !important;
        }

        .ol-scale-line-inner {
            border: none !important;
        }

        div#splitter {
            display: none !important;
        }

        div#creditsSelected {
            display: none !important
        }

        tr#adsbexchange_header.infoblock_row.hidden {
            display: none !important;
        }

        .adsbx-selected-bg::before {
            background-image: none !important;
        }

        div#settingsCog {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/settings.png?v=1') !important;
        }

       .settingsCog {
            filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.3)) !important;
        }

        .button {
            box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.3) !important;
        }

        .highlightedTitle {
            border-bottom: calc(1px * var(--SCALE)) solid var(--BGCOLOR2) !important;
        }

        .ol-zoom {
            left: calc(100% - calc(35px * var(--SCALE))) !important;
            top: calc(100% - calc(65px * var(--SCALE))) !important;
        }

        .sidebar_button {
            background-color: var(--ACCENT) !important;
        }

        .ol-unselectable.ol-control.layer-switcher.layer-switcher-group-select-style-none.layer-switcher-activation-mode-click.activationModeClick {
            box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.3) !important;
        }

        button#toggle_sidebar_button.sidebar_button.show_sidebar {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/hide_sidebar.png?v=1') !important;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3) !important;
        }

        button#expand_sidebar_button.sidebar_button {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/hide_sidebar.png?v=1') !important;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3) !important;
        }

        button#toggle_sidebar_button.sidebar_button.hide_sidebar {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/hide_sidebar.png?v=1') !important;
            transform: scaleX(1);
            box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.3) !important;
        }

        button#shrink_sidebar_button.shrink_sidebar.hidden.sidebar_button {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/hide_sidebar.png?v=1') !important;
            transform: scaleX(1) !important;
        }

        .ol-unselectable.ol-control.layer-switcher.layer-switcher-group-select-style-none.layer-switcher-activation-mode-click.activationModeClick {
            background-color: var(--ACCENT) !important;
        }

        .layer-switcher button {
            background-color: var(--ACCENT) !important;
            color: #fff !important;
            cursor: pointer !important;
        }

        .layer-switcher button:focus,
        .layer-switcher button:hover {
            background-color: var(--ACCENT) !important;
        }

        .layer-switcher.shown.layer-switcher-activation-mode-click > button {
            background-color: var(--ACCENT) !important;
        }

        .activeButton {
            color: #fff !important;
        }

        .inActiveButton {
            color: #888 !important;
        }

        #dump1090_version {
            font-size: large !important;
            font-weight: bold !important;
            text-decoration: none !important;
        }

        td.link {
            text-align: center !important;
            text-decoration: none !important;
        }

        .identSmall {
            font-weight: 400 !important;
        }

        .identLarge {
            font-weight: 700 !important;
        }

        button.ol-zoom-in {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/zoom-in.png?v=1') !important;
        }

        button.ol-zoom-out {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/zoom-out.png?v=1') !important;
        }

        .ol-scale-line {
            background: rgba(0,89,107,.5) !important;
        }

        .error_box {
            bottom: calc( 35px * var(--SCALE)) !important;
            left: calc( 10px * var(--SCALE)) !important;
            border: none !important;
            background-color: rgba(0,89,107,.75) !important;
            color: #FFF !important;
        }

        .layer-switcher .group button {
            background-image: url('https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/collapse.png?v=1') !important;
            background-position: none !important;
            background-size: 14px !important;
        }

        button#show_trace.greyButton {
            padding: calc( 3px * var(--SCALE)) calc( 20px * var(--SCALE)) !important;
            text-transform: uppercase !important;
            text-align: center !important;
            color: #e8e8e8 !important;
            font-family: helvetica neue,Helvetica,Verdana,sans-serif !important;
            font-size: var(--FS2) !important;
            background-color: #003f4b !important;
            font-weight: 400 !important;
            margin-bottom: calc( 7px * var(--SCALE)) !important;
        }

        .greyButton::after {
            display: none !important;
        }

        .infoblockCloseBox {
            filter: none !important;
            right: calc( 8px * var(--SCALE)) !important;
            top: calc( 8px * var(--SCALE)) !important;
            background-image: url(https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/close-settings.png?v=1) !important;
        }

        #toggle_sidebar_control {
            margin-bottom: calc( 6px * var(--SCALE)) !important;
        }

        #highlighted_infoblock {
            box-shadow: none !important;
        }

        .ui-slider-handle {
            background-color: var(--TXTCOLOR2) !important;
        }
    `);
})();