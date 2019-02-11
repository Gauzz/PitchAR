var start="<html><head><script src='https://aframe.io/releases/0.8.0/aframe.min.js'></script><script src='https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js'></script></head>"
+"<body style='margin : 0px; overflow: hidden;'>"+
    "<a-scene arjs='sourceType: webcam;'>"+"<a-marker-camera preset='hiro'>";
var mid=" ";
var end="</a-marker-camera></a-scene></body></html>";

function readFile(){
    showEntities();
    console.log(start+mid+end);
}

function showEntities(){
var sceneEl = document.querySelector('#perswin');    
var els = sceneEl.querySelectorAll('.exp');
for (var i = 0; i < els.length; i++) {
  console.log(els[i]);
  mid+=els[i].outerHTML;
}
}