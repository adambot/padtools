// ==UserScript==
// @name         Puzzle and Dragons Forum fixes
// @namespace    http://puzzleanddragonsforum.com/
// @version      0.3
// @description  Script to make the old guides readable
// @author       adambot
// @match        http://puzzleanddragonsforum.com/*
// @grant        none
// ==/UserScript==



//fix thumbnail links with width= at the end
var thumb = document.getElementsByTagName("img"); //array
console.log(thumb)
var thumbregex = /^(?:.*)(http:\/\/www.puzzledragonx.com\/.*[0-9]+)(?:.*?width=)([0-9]+)(?:.png.*)$/i
var thumbreplace = '$1$2.png" width="$4px" title="$6'
for (var i=0,imax=thumb.length; i<imax; i++) {
    var thumbmatches = thumb[i].outerHTML.match(thumbregex);
    if (thumbmatches) {
        thumb[i].setAttribute("src", thumbmatches[1] + ".png");
        thumb[i].setAttribute("height", thumbmatches[2]);
        thumb[i].setAttribute("width", thumbmatches[2]);
    }
}


//Fix links with width= at the end
var links = document.getElementsByTagName("a"); //array
var linksregex = /^(http:\/\/www.puzzledragonx.com\/.*?)(%20width=)([0-9]+)$/i;
var thumbreplace = "<img src=\"$1.png\" height=\"$2px\" width=\"$2px\">";
for (var i=0,imax=links.length; i<imax; i++) {
    links[i].href = links[i].href.replace(linksregex, "$1");

}


//fix image tags that are being shown as text.  Code Below adopted from AddAvatar by Dhruva Sagar
var fixImg = document.evaluate("//text()[contains(.,'[img=')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var imgRegex = /(\[img=)([0-9]+)(.)([0-9]+)(.)(http.*?)(\[\/img\])/ig;

for(var i=fixImg.snapshotLength - 1; i>=0 ; i--) {
    var imgSnap = fixImg.snapshotItem(i);
    if(imgRegex.test(imgSnap.nodeValue)) {
        var imgSpan = document.createElement("span");
        imgSnap.parentNode.replaceChild(imgSpan, imgSnap);
        var text = imgSnap.nodeValue;
        imgRegex.lastIndex = 0;
        for(var match = null, lastLastIndex = 0; (match = imgRegex.exec(text)); ) {
            imgSpan.appendChild(document.createTextNode(text.substring(lastLastIndex, match.index)));
            var image = document.createElement("img");
            
            if (RegExp.$2 < 20) {
                var height = 20;
            } else {
                var height = RegExp.$2;
            }
            
            if (RegExp.$4 < 20) {
                var width = 20;
            } else {
                var width = RegExp.$4;
            }
            
            image.setAttribute("src", RegExp.$6);
            image.setAttribute("height", height);
            image.setAttribute("width", width);
            imgSpan.appendChild(image);
            lastLastIndex = imgRegex.lastIndex;
        }
        imgSpan.appendChild(document.createTextNode(text.substring(lastLastIndex)));
        imgSpan.normalize();
    }
}