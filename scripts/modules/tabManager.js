

var actualTab = 0;
/*
0 - DM
1 - MP
*/
var tabList = ["dmTab","mpTab"];

function changeTab(t){
    document.getElementById(tabList[actualTab]+"Container").style.display = "none";
    document.getElementById(tabList[actualTab]).classList.remove("tabActive");
    actualTab = t;
    document.getElementById(tabList[actualTab]+"Container").style.display = "block";
    document.getElementById(tabList[actualTab]).classList.add("tabActive");
}

document.getElementById(tabList[0]).onclick = function(){changeTab(0)};
document.getElementById(tabList[1]).onclick = function(){changeTab(1)};