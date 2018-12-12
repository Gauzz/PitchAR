let token = ' ';
let k=0;
let perm=0;
function auto() {
  $.ajax({
  method: 'get',
  url: 'https://pitchar.io/api/_token.php',
  data: {
      submit: true,
    },
  success(result){
            console.log(result);   
            console.log("success");
            token=result.project[0].token;
            $('#auth').val(token);
            console.log(token);   
            
    },

});
var sceneEl = document.querySelector('a-scene');
sceneEl.removeAttribute('inspector');
}
auto();
function add(event) {
    obj = document.querySelector('#object');
    obj.object3D.visible = true;
    document.getElementById('but').style.display = 'none';
  }
  function pushImg(e){
    console.log(e.src);
    var node = document.createElement("a-image");
    node.setAttribute('src',e.src);
    node.id= e.id;
    node.object3D.position.set(0,0.5,0);
    node.setAttribute('click-drag','');
    document.getElementById("perswin").appendChild(node);
    $('#assets .close').click();
    $('.modal-backdrop').remove();    
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
    node.width = 100;
    node.height =100;
    node.id= 'img'+perm;
    node.style='margin:4px;';
    node.setAttribute("onclick","pushImg(this);");
    document.getElementById("assetbody").appendChild(node);

  },
  });

 }
let asset = document.getElementById('asset');
asset.addEventListener('click', () =>  {
  if(k==0){
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
            console.log('\n'+asset.Projectimage+'\n');
            var node = document.createElement("img");
            node.src=asset.Projectimage;
            node.width = 100;
            node.height =100;
            node.id= 'img'+i;
            node.style='margin:4px;';
            node.setAttribute("onclick","pushImg(this);");
            if(asset.Assetstype=='image')
            document.getElementById("assetbody").appendChild(node);
            perm=i;  
            
            }
    },

});
k=1;
  }
});

