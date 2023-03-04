//Package Manager
 //Compression
 importModule("scripts/modules/compression.js");
 //release
 importModule("scripts/modules/release.js");
 //galaxy
 importModule("scripts/modules/galaxy.js");





importModule("scripts/game.js");
importModule("scripts/modules/debug.js");


function importModule(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}