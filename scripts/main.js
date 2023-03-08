//Package Manager

var version = 7;


 //Compression
 importModule("scripts/modules/compression.js?");
 //release
 importModule("scripts/modules/release.js");
 //galaxy
 importModule("scripts/modules/galaxy.js");




importModule("scripts/modules/notification.js");
importModule("scripts/game.js");
importModule("scripts/modules/debug.js");


function importModule(url) {
    var script = document.createElement("script");
    script.src = url+"?"+version;
    document.head.appendChild(script);
}