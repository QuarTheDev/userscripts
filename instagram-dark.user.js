// ==UserScript==
// @name        Instagram Dark Mode
// @description A simple script that toggles a Dark Mode query every time instagram.com is loaded.
// @updateURL   https://raw.githubusercontent.com/QuarTheDev/userscripts/main/instagram-dark.user.js
// @downloadURL https://raw.githubusercontent.com/QuarTheDev/userscripts/main/instagram-dark.user.js
// @version     0.1.2
// @author      QuarTheDev
// @match       *://*.instagram.com/*
// @run-at      document-start
// @icon        https://raw.githubusercontent.com/QuarTheDev/userscripts/main/assets/logos/instagram-dark-512.png
// @license     GPL-3.0
// @namespace   https://quar.pages.dev/
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    var oldUrlSearch = window.location.search;

    if ( ! /\?theme=dark$/.test (oldUrlSearch) ) {
        var newURL = window.location.protocol + "//"
                   + window.location.host
                   + window.location.pathname
                   + oldUrlSearch + "?theme=dark"
                   + window.location.hash
                   ;
        window.location.replace (newURL);
    }
})();