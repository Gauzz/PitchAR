let token = 'jzXPgvSfhYMx7I3';
let k=0;
let perm=0;

function auto() {
/*  $.ajax({
  method: 'post',
  url: 'https://pitchar.io/api/_token.php',
  data: {
      submit: true,
    },
  success(result){
            console.log(result);   
            console.log("success");
            token=result.project[0].token;
            console.log(token);   
            
    },

});
*/
var sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('loaded', function () { 
  sceneEl.removeAttribute('inspector');
});


}
auto();
function add(event) {
    obj = document.querySelector('#object');
    obj.object3D.visible = true;
    document.getElementById('but').style.display = 'none';
  }
var c;
  function editimg(e){
    console.log(e.parentNode.parentNode.childNodes[0].id);
    
      c = new Croppie(e.parentNode.parentNode.childNodes[0],{
      viewport: { width: 70, height: 70 },
      boundary: { width: 125, height: 125 },});
      
  }


  function pushImg(e){
    console.log(e.src);
    var node = document.createElement("a-image");
    node.setAttribute('src',e.src);
    node.id= e.id;
    node.object3D.position.set(0,0.5,0);
    node.setAttribute('click-drag','');
    document.getElementById("perswin").appendChild(node);
    $('#images .close').click();
    $('.modal-backdrop').remove();    
   }  
   function pushObj(e){
    console.log(e.dataset.objfile);
    var node = document.createElement("a-entity");
    if(e.dataset.type == 'obj'){
       node.setAttribute('obj-model', {
       obj: e.dataset.objfile,
       mtl: e.dataset.mtlfile,
      });
    }
    else{
      node.setAttribute('gltf-model',e.dataset.objfile);
    }
    node.id= e.id;
    node.object3D.position.set(0,0.1,0);
    node.object3D.rotation.set(0,1.57,0);
    node.object3D.scale.set(0.7,0.7,0.7);
    node.setAttribute('click-drag','');
    document.getElementById("perswin").appendChild(node);
    $('#assets .close').click();
    $('.modal-backdrop').remove();    
   }  

function updatetype(e){
  if(e.value=='gltf'){
   var obj=document.getElementsByClassName('obj');
   obj[0].style.display = 'block';
   obj[1].style.display = 'block';  
   var mtl=document.getElementsByClassName('mtl');
   mtl[0].style.display = 'none';
   mtl[1].style.display = 'none';
  }
  else if(e.value=='fbx' || e.value=='zip'){
    var obj=document.getElementsByClassName('obj');
    obj[0].style.display = 'none';
    obj[1].style.display = 'none';   
    var mtl=document.getElementsByClassName('mtl');
    mtl[0].style.display = 'none';
    mtl[1].style.display = 'none';
   }
   else{
    var obj=document.getElementsByClassName('obj');
    obj[0].style.display = 'block';
    obj[1].style.display = 'block';  
    var mtl=document.getElementsByClassName('mtl');
    mtl[0].style.display = 'block';
    mtl[1].style.display = 'block';
     
   }

}

function uploadImg(event) {
   let form = document.querySelector('#form');
   let formData = new FormData(form);
   console.log(formData);
   console.log(form);
   $.ajax({
    method: 'POST',
    url: 'https://pitchar.io/api/_create-assets.php',
    data: formData,
    processData: false,
    contentType: false,
    success(data){
    console.log(data.data.image);
    var node = document.createElement("img");
    node.src=data.data.image;
    node.width = 125;
    node.height =125;
    node.id= 'img'+perm;
    node.style='margin:4px;';
    node.setAttribute("onclick","pushImg(this);");
    document.getElementById("galleryimgs").appendChild(node);

  },
  });

 }


 function uploadObj(event) {
  let form = document.querySelector('#form');
  let formData = new FormData(form);
  console.log(formData);
  console.log(form);
  $.ajax({
   method: 'POST',
   url: 'https://pitchar.io/api/_create-assets.php',
   data: formData,
   processData: false,
   contentType: false,
   success(data){
   console.log(data.data.image);
   var div= document.createElement("div");
   div.setAttribute("class","hbox");
   var node = document.createElement("img");
   node.src=data.data.image;
   node.width = 125;
   node.height =125;
   node.id= 'img'+perm;
   node.style='margin:4px;';
   node.setAttribute("onclick","pushImg(this);");
   div.appendChild(node);
   var overlay=document.createElement("div");
   overlay.setAttribute("class","options")
   var edit=document.createElement('button');
   edit.setAttribute("onclick","editimg()");
   var del=document.createElement('button');
   del.setAttribute("onclick","delimg()");
   overlay.appendChild(edit);
   overlay.appendChild(del);
   div.appendChild(node);
   document.getElementById("galleryimgs").appendChild(div);

 },
 });

}

//for image fetch

let image = document.getElementById('imagebut');
image.addEventListener('click', () =>  {
  document.getElementById("galleryimgs").innerHTML = "";
  document.getElementsByClassName("searchbar")[0].value="";
  document.getElementsByClassName("searchbar")[1].value="";
  $.ajax({
  method: 'post',
  url: 'https://pitchar.io/api/_fetch-assets.php',
  data: {
      submit: 1,
      authtoken: token,
    },
  dataType: 'json',
  success(result){
            console.log(token); 
            console.log(result);   
            console.log("success2");
            var assets = result.assets;
            for(var i=0;i<assets.length;i++){
            asset = assets[i];
            var node = document.createElement("img");
            node.src=asset.Projectimage;
            node.width = 125;
            node.height =125;
            node.id= 'img'+i;
            node.style='margin:4px;';
            node.setAttribute("onclick","pushImg(this);");
            node.setAttribute("class","image");
            var div= document.createElement("div");
            div.setAttribute("class","hbox");
            div.appendChild(node);
            var overlay=document.createElement("div");
            overlay.setAttribute("class","options")
            var edit=document.createElement('button');
            edit.setAttribute("onclick","editimg(this)");
            edit.innerHTML="<i class='fa fa-edit'></i>";
            var del=document.createElement('button');
            del.setAttribute("onclick","delimg(this)");
            del.innerHTML="<i class='fa fa-trash'></i>";
            overlay.appendChild(edit);
            overlay.appendChild(del);
            div.appendChild(node);
            div.appendChild(overlay);
            if(asset.Assetstype=='image')
            document.getElementById("galleryimgs").appendChild(div);
            perm=i;  
            }
            document.getElementById("unsplashImgs").innerHTML = "";
            for(var i=0;i<10;i++){        
              var node = document.createElement("img");
              node.src=unpic[i].urls.small;
              node.width = 125;
              node.height =125;
              node.style='margin:4px;';
              node.setAttribute("onclick","pushImg(this);");
              node.setAttribute("crossorigin","anonymous");
              document.getElementById("unsplashImgs").appendChild(node);
              }
            },
        });
        k=1;
      
    });

var l=15;
var m=20;
function fetchnew(){
  
  
}
var searchImg = document.getElementsByClassName("searchbar");
searchImg[0].addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    $.ajax({
      method: 'post',
      url: 'https://pitchar.io/api/_search_assets.php',
      data: {
          submit: true,
          authtoken: 'jzXPgvSfhYMx7I3',
          tags: document.getElementById("searchasset").value,
        },
      success(result){
                console.log(result);   
                document.getElementById("galleryimgs").innerHTML = "";
                var assets = result.assets;
                for(var i=0;i<assets.length;i++){
                asset = assets[i];
                var node = document.createElement("img");
                node.src=asset.Projectimage;
                node.width = 125;
                node.height =125;
                node.id= 'img'+i;
                node.style='margin:4px;';
                node.setAttribute("onclick","pushImg(this);");
                if(asset.Assetstype=='image')
                document.getElementById("galleryimgs").appendChild(node);
                perm=i;  
                }
               
        },
    
    });
  }
});

//for 3d model fetch

let asset = document.getElementById('asset');
asset.addEventListener('click', () =>  {
  document.getElementById("galleryobjs").innerHTML = "";
  document.getElementsByClassName("searchbar")[2].value="";
  document.getElementsByClassName("searchbar")[3].value="";
  $.ajax({
  method: 'post',
  url: 'https://pitchar.io/api/_fetch-assets.php',
  data: {
      submit: 1,
      authtoken: token,
    },
  dataType: 'json',
  success(result){
            console.log(token); 
            console.log(result);   
            console.log("success2");
            var assets = result.assets;
            for(var i=0;i<assets.length;i++){
            asset = assets[i];
            if(asset.Assetstype=='zip' || asset.Assetstype=='fbx' ||asset.Assetstype=='gltf' || asset.Assetstype=='obj')
           {
            var node = document.createElement("img");
            node.src=asset.objthumbnail;
            node.width = 125;
            node.height =125;
            node.id= 'img'+i;
            node.setAttribute("data-type",asset.Assetstype);
            node.setAttribute("data-objfile",asset.obj);
            if(asset.Assetstype=='obj')
            node.setAttribute("data-mtlfile",asset.mtl);
            node.style='margin:4px;';
            node.setAttribute("onclick","pushObj(this);");
            document.getElementById("galleryobjs").appendChild(node);
           }
            perm=i;  
            }
          }
    });
   });

   function uploadObj(event) {
    let form = document.querySelector('#form2');
    let formData = new FormData(form);
    console.log(formData);
    console.log(form);
    $.ajax({
     method: 'POST',
     url: 'https://pitchar.io/api/_create-assets.php',
     data: formData,
     processData: false,
     contentType: false,
     success(data){
     console.log(data);
     var node = document.createElement("img");
     node.src=data.data.objthumbnail;
     node.width = 125;
     node.height =125;
     node.setAttribute("data-type",asset.type);
     node.setAttribute("data-objfile",asset.obj);
     if(asset.Assetstype=='obj')
     node.setAttribute("data-mtlfile",asset.mtl);
     node.style='margin:4px;';
     node.setAttribute("onclick","pushObj(this);");
    document.getElementById("galleryobjs").appendChild(node);
 
   },
   });
 
  }
 
  