import aframe from 'aframe';
import extras from 'aframe-extras';
import keyboardControls from 'aframe-keyboard-controls';
import clickDragComponent from '../src/index';
require('aframe-look-at-component');
require('aframe');
require('aframe-orbit-controls-component-2');
extras.physics.registerAll(aframe);
aframe.registerComponent('keyboard-controls', keyboardControls);
clickDragComponent(aframe);
    import Unsplash from 'unsplash-js';
    import { toJson } from "unsplash-js";
    // require syntax
    
    const unsplash = new Unsplash({
      applicationId: "fc7e3fa3df7ac20cd539dc3a91b2eef3abb4870d90098d05265410df9b0ec15e",
      secret: "379b72ff6db377d5d32febe5dd0947220c0de657c603309ad5749ab8f0603572",
      callbackUrl: "",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
    unsplash.photos.listPhotos(1, 10, "latest")
    .then(toJson)
    .then(json => {
    unpic = json;
     
});
window.onload = function() {
    var searchImg = document.getElementsByClassName("searchbar");
    searchImg[1].addEventListener("keyup", function(event) {
        event.preventDefault();
        document.getElementById("unsplashImgs").innerHTML = "";
        if (event.keyCode === 13) {
          console.log(String(event.target.value));
          unsplash.search.photos(String(event.target.value), 1)
          .then(toJson).then(json => {
            console.log(json);  
            for(var i=0;i<json.results.length;i++){        
                var node = document.createElement("img");
                node.src=json.results[i].urls.regular;
                node.width = 125;
                node.height =125;
                node.style='margin:4px;';
                node.setAttribute("onclick","pushImg(this);");
                node.setAttribute("crossorigin","anonymous");
                document.getElementById("unsplashImgs").append(node);
                }
        });  
        }
      });
        

};
