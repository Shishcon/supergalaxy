//Package Manager

var version = 14;


 //Compression
 importModule("scripts/modules/compression.js?");
 //release
 importModule("scripts/modules/release.js");
 //heaven (infinity)
 importModule("scripts/modules/heaven.js");
 //heavenUpgrades
 importModule("scripts/modules/heavenUpgrades.js");
 //automator
 importModule("scripts/modules/automator.js");



importModule("scripts/modules/notification.js");
importModule("scripts/game.js");
importModule("scripts/modules/debug.js");
importModule("scripts/modules/tabManager.js");


async function importModule(url) {
    var script = document.createElement("script");
    script.src = url+"?"+version;
    document.head.appendChild(script);
}