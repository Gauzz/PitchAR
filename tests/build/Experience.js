var start="<html><head><script src='https://aframe.io/releases/0.8.0/aframe.min.js'></script><script src='https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js'></script></head>"
+"<body style='margin : 0px; overflow: hidden;'>"+
    "<a-scene arjs='sourceType: webcam;debugUIEnabled: false;'>"+"<a-marker-camera preset='hiro'>";
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
  var rx,ry,rz,sx,sy,sz;
  rx=els[i].object3D.rotation.x;
  ry=els[i].object3D.rotation.y;
  rz=els[i].object3D.rotation.z;
  els[i].setAttribute('rotation' , rx+' '+ry+' '+rz);
  sx=els[i].object3D.scale.x;
  sy=els[i].object3D.scale.y;
  sz=els[i].object3D.scale.z;
  els[i].setAttribute('scale' , sx+' '+sy+' '+sz);
 
els[i].flushToDOM(true);
els[i].components.rotation.flushToDOM();
 mid+=els[i].outerHTML;
}
return mid;
}