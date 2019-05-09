
let k = 0;
var t=0;
let a=0;
let perm = 0;
let ctaid = 0;
var w = 0;
var n=0;
var u = 0;
var cnt = 1;
var uploadbar = document.getElementById('uploadbar');
var imgfil = '';
var filename = '';
var bool = 0;
var object;
var edittype;
var linkid;
function auto() {
	document.getElementById('auth').value = token;
	document.getElementById('auth2').value = token;
	document.getElementById('auth3').value = token;
	document.getElementById('auth4').value = token;
	document.getElementById('auth5').value = token;
	var sceneEl = document.querySelector('a-scene');
	sceneEl.addEventListener('loaded', function () {
		sceneEl.removeAttribute('inspector');
	});

}
auto();

function editAssetId(e) {
	console.log('here');
	document.getElementById('elementid').value = e.dataset.pid;
	edittype = e.dataset.typ;
	console.log(e.dataset.pid);
}

//CTA Functionalities
var cta = document.getElementById('ctabutton');
function chgfore(e) {
	cta.style.color = e.value;
}

function editback() {
	$('#backcolor').toggle();
}

function editcol() {
	$('#butcolor').toggle();
}

$('#backcolor').ColorPicker({
	color: '#4846ae',
	flat: true,
	onChange: function (hsb, hex, rgb) {
		cta.style.backgroundColor = '#' + hex;
		$('#backcol').css('backgroundColor', '#' + hex);
	}
});

$('#butcolor').ColorPicker({
	color: '#ffffff',
	flat: true,
	onChange: function (hsb, hex, rgb) {
		cta.style.color = '#' + hex;
		$('#butcol').css('backgroundColor', '#' + hex);
	}
});

$('#backcolor').hide();
$('#butcolor').hide();

function chgtxt(e) {
	if (e.id == 'buttext') {
		var str = document.getElementById('buticn').value;
		cta.innerText = str + ' ' + e.value;
	} else if (e.id == 'buticn') {
		var str = document.getElementById('buttext').value;
		cta.innerText = e.value + ' ' + str;
	}
	console.log(str + e.value);

	if (e.value == '' || e.value == 'null') {
		var str = document.getElementById('buticn').value;
		cta.innerText = str;
	}
}

function chglnk(e) {
	cta.setAttribute('href', e.value);
}

function chground(e) {
	cta.style.borderTopLeftRadius = e.value + '%';
	cta.style.borderTopRightRadius = e.value + '%';
	cta.style.borderBottomLeftRadius = e.value + '%';
	cta.style.borderBottomRightRadius = e.value + '%';
}

//Text functionalities

function fontchanged(e) {
	var phrasetxt = document.getElementById('phrasetxt');
	phrasetxt.style.fontFamily = e.value;
}

function phrasechanged(e) {
	var phrasetxt = document.getElementsByClassName('phrasetxt');
	if (e.value == '' || e.value == null) {
		phrasetxt[0].innerText = 'TEXT';
		phrasetxt[1].innerText = 'TEXT';
		phrasetxt[2].innerText = 'TEXT';
		phrasetxt[3].innerText = 'TEXT';
		phrasetxt[4].innerText = 'TEXT';
		phrasetxt[5].innerText = 'TEXT';
		phrasetxt[6].innerText = 'TEXT';
	}
	phrasetxt[0].innerText = e.value;
	phrasetxt[1].innerText = e.value;
	phrasetxt[2].innerText = e.value;
	phrasetxt[3].innerText = e.value;
	phrasetxt[4].innerText = e.value;
	phrasetxt[5].innerText = e.value;
	phrasetxt[6].innerText = e.value;
}
var col;
function editphr(e) {
	$('#phrcolor').toggle();
	col = e.style.backgroundColor;
}

$('#phrcolor').ColorPicker({
	color: col,
	flat: true,
	onChange: function (hsb, hex, rgb) {
		var phrasetxt = document.getElementsByClassName('phrasetxt');
		phrasetxt[0].style.color = '#' + hex;
		phrasetxt[1].style.color = '#' + hex;
		phrasetxt[2].style.color = '#' + hex;
		phrasetxt[3].style.color = '#' + hex;
		phrasetxt[4].style.color = '#' + hex;
		phrasetxt[5].style.color = '#' + hex;
		phrasetxt[6].style.color = '#' + hex;

		$('#phrcol').css('backgroundColor', '#' + hex);
	}
});
$('#phrcolor').hide();
var n = 0;
function pushTxt(e) {
	n++;
	var aligntxt = document.getElementById('aligntxt');
	var txt = document.createElement('a-text');
	txt.setAttribute('rotation', { x: 0, y: 0, z: 0 });
	txt.setAttribute('scale', { x: 1, y: 1, z: 1 });
	txt.setAttribute('click-drag', '');
	txt.setAttribute('visible', 'true');
	txt.setAttribute('value', e.innerText);
	txt.setAttribute('align', aligntxt.value);
	if (e.style.fontFamily == 'roboto');
	else {
		txt.setAttribute('font', './css/' + e.style.fontFamily + '.fnt');
		txt.setAttribute('fontImage', './css/' + e.style.fontFamily + '.png');
	}
	txt.setAttribute('color', e.style.color);
	txt.setAttribute('width', '12');
	txt.setAttribute('side', 'double');
	txt.classList.add('exp');
	txt.id = 'txt' + n;
	txt.object3D.position.set(0, 0.6, 0);
	var sc = document.querySelector('a-scene');
	sc.appendChild(txt);
	$('#txt .close').click();
	$('.modal-backdrop').remove();
}

// Video functionalities
function pushVid(e) {
	console.log(e.src);
	if (e.dataset.type == '2D') {
		var node = document.createElement('a-video');
		node.setAttribute('src', e.dataset.source);
		node.id = e.id;
		node.object3D.position.set(0, 0.5, 0);
		node.setAttribute('rotation', { x: 0, y: 0, z: 0 });
		node.setAttribute('scale', { x: 1, y: 1, z: 1 });
		node.setAttribute('visible', 'true');
		node.setAttribute('click-drag', '');
		node.classList.add('exp');
		document.getElementById('perswin').appendChild(node);
	} else if (e.dataset.type == '360') {
		var node = document.createElement('a-videosphere');
		node.setAttribute('visible', 'true');
		node.setAttribute('src', e.dataset.source);
		node.classList.add('exp');
		node.id = e.id;
		document.getElementById('perswin').appendChild(node);
	}
	$('#videos .close').click();
	$('.modal-backdrop').remove();
}

function addbut(e) {
	u++;
	if(u==0){
		t=0;
	}
	else
	{var t=parseInt(document.getElementById('buttext').value.length);}
	//console.log(t);

	




	lnk = document.getElementById("butlink").value;
	console.log(lnk);
	







	var x = cta.cloneNode(true);
	x.style.position = 'fixed';
	x.style.bottom = '100px';
	x.style.marginLeft = 10 + (t*10) + (u * 60) +'px';
	x.style.zIndex = '5';
	x.id = 'cta' + ctaid;
	linkid= x.id;
	x.style.height = 'fit-content';
	x.classList.add('exp2');
	x.setAttribute('data-toggle', 'modal');
	x.setAttribute('data-target', '#ctaModal');
	var d2 = document.getElementById('d2');
	d2.appendChild(x);
	++ctaid;

	$("#" + x.id).click(function (event) {
		event.preventDefault();
		ctaset(this);
	});
}

function ctaset(e) {
	document.getElementById('ctaBtnUnpushed').setAttribute('data-idcta', e.id);
}














function linkvisit(){

		//alert(linkid);
		window.open(document.getElementById(linkid).href);
		//console.log(window.open(document.getElementById('cta'+ ctaid ).href););
}















function ctaUnpushed(e) {
	
	//document.getElementById(e.dataset.idaud.slice(0, e.dataset.idaud.length-3)).remove();	
	var play=document.getElementById(e.dataset.idcta);
var q=play.style.marginLeft;
var p=parseInt(q.substring(0,q.indexOf("p")));
var rmvnode=(p-10)/60;

//var l=play.nextSibling.nextSibling.style.marginLeft;
//console.log(q); //margin of removed node
//console.log(l); //margin of next node

console.log(u); //total nodes added
console.log(rmvnode); //position of removed node
for(var i=rmvnode+1; i<=u; i++)
{
	
play=play.nextSibling;
console.log(play);
var l=play.style.marginLeft;
var a=parseInt(play.style.marginLeft.substring(0,play.style.marginLeft.indexOf("p")));
a=a-60;
play.style.marginLeft=a+"px";
}	

document.getElementById(e.dataset.idcta).remove();
u--;
}


function add(event) {
	obj = document.querySelector('#object');
	obj.object3D.visible = true;
	document.getElementById('but').style.display = 'none';
}
var c;

function delimg(e) {
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_delete-assets.php',
		data: { authtoken: token, product_id: e.dataset.pid },
		success(data) {
			console.log(data);
			e.parentNode.parentNode.style.display = 'none';
		}
	});
}

function editimg(e) {
	console.log(e.parentNode.parentNode.childNodes[0].id);

	c = new Croppie(e.parentNode.parentNode.childNodes[0], {
		viewport: { width: 70, height: 70 },
		boundary: { width: 125, height: 125 }
	});
}

function pushImg(e) {
	console.log(e.src);
	var node = document.createElement('a-image');
	node.setAttribute('src', e.src);
	node.id = e.id;
	var img = new Image();
	img.src = e.src;
	node.setAttribute('height', img.height / 500);
	node.setAttribute('width', img.width / 500);
	node.object3D.position.set(0, 0.5, 0);
	node.setAttribute('rotation', { x: 0, y: 0, z: 0 });
	node.setAttribute('scale', { x: 1, y: 1, z: 1 });
	node.setAttribute('visible', 'true');
	node.setAttribute('click-drag', '');
	node.classList.add('exp');
	document.getElementById('perswin').appendChild(node);
	$('#images .close').click();
	$('.modal-backdrop').remove();
}
function pushObj(e) {
	console.log(e.dataset.objfile);
	var node = document.createElement('a-entity');
	node.setAttribute('rotation', { x: 0, y: 0, z: 0 });
	node.setAttribute('visible', 'true');
	node.setAttribute('scale', { x: 1, y: 1, z: 1 });
	if (e.dataset.type == 'obj') {
		node.setAttribute('obj-model', {
			obj: e.dataset.objfile,
			mtl: e.dataset.mtlfile
		});
	} else {
		node.setAttribute('gltf-model', e.dataset.gltffile);
	}
	node.id = e.id + '3d';
	node.object3D.position.set(0, 0.1, 0);
	node.object3D.rotation.set(0, 1.57, 0);
	node.object3D.scale.set(0.7, 0.7, 0.7);
	node.setAttribute('click-drag', '');
	node.classList.add('exp');
	document.getElementById('perswin').appendChild(node);
	$('#assets .close').click();
	$('.modal-backdrop').remove();
	objectloaded(node.id);
}

function updatetype(e) {
	if (e.value == 'gltf') {
		var obj = document.getElementsByClassName('obj');
		obj[0].style.display = 'block';
		obj[1].style.display = 'block';
		obj[0].setAttribute('name', 'gltf');
		obj[1].setAttribute('name', 'gltf');
		var mtl = document.getElementsByClassName('mtl');
		mtl[0].style.display = 'none';
		mtl[1].style.display = 'none';
	} else if (e.value == 'fbx' || e.value == 'zip') {
		var obj = document.getElementsByClassName('obj');
		obj[0].style.display = 'none';
		obj[1].style.display = 'none';
		var mtl = document.getElementsByClassName('mtl');
		mtl[0].style.display = 'none';
		mtl[1].style.display = 'none';
	} else {
		var obj = document.getElementsByClassName('obj');
		obj[0].style.display = 'block';
		obj[1].style.display = 'block';
		obj[0].setAttribute('name', 'gltf');
		obj[1].setAttribute('name', 'obj');
		var mtl = document.getElementsByClassName('mtl');
		mtl[0].style.display = 'block';
		mtl[1].style.display = 'block';
	}
}


function pushAud(e) {
	w++;
	a=(10 + w * 60);
	var d2 = document.getElementById('d2');
	var node = document.createElement('audio');
	var id = e.id + 'aud';
	node.id = id;

	var idAudioLoop = e.id.substr(3);
	var audioValue = document.getElementById('audioLoop' + idAudioLoop).dataset.loop;
	if (audioValue === 'true') {
		node.setAttribute('loop', true);
	}

	var src = document.createElement('source');
	src.src = e.dataset.source;
	node.appendChild(src);
	d2.appendChild(node);
	var play = document.createElement('button');
	play.innerHTML = "<i class='fa fa-file-audio-o' style='color:#4846ae;font-size:28px;'></i>";
	play.setAttribute('data-source', e.dataset.source);
	play.id = id + 'btn';
	play.style.position = 'fixed';
	play.style.bottom = '50px';
	play.style.marginLeft = a + 'px';
	//play.setAttribute('onclick', 'playaud(this)');
	play.setAttribute('onclick', 'audioset(this)');
	play.setAttribute('data-toggle', 'modal');
	play.setAttribute('data-target', '#audioModal');

	play.classList.add('exp2');
	node.classList.add('exp2');
	d2.appendChild(play);
	$('#music .close').click();
	$('.modal-backdrop').remove();
}

function audioset(e) {
	document.getElementById('audBtnUnpushed').setAttribute('data-idaud', e.id);
	document.getElementById('audBtnPlayModal').setAttribute('data-source', e.id.slice(0, e.id.length - 3));
}

function audBtnUnpushed(e) {
	//document.getElementById(e.dataset.idaud).remove();
	document.getElementById(e.dataset.idaud.slice(0, e.dataset.idaud.length - 3)).remove();
var play=document.getElementById(e.dataset.idaud);
var q=play.style.marginLeft;
var p=parseInt(q.substring(0,q.indexOf("p")));
var rmvnode=(p-10)/60;

//var l=play.nextSibling.nextSibling.style.marginLeft;
//console.log(q); //margin of removed node
//console.log(l); //margin of next node

console.log(w); //total nodes added
console.log(rmvnode); //position of removed node
for(var i=rmvnode+1; i<=w; i++)
{
	
play=play.nextSibling.nextSibling;
console.log(play);
var l=play.style.marginLeft;
var a=parseInt(play.style.marginLeft.substring(0,play.style.marginLeft.indexOf("p")));
a=a-60;
play.style.marginLeft=a+"px";
}	

document.getElementById(e.dataset.idaud).remove();
w--;

}

function previewAudio(e) {
	var node = document.createElement('audio');
	var id = e.id + 'aud';
	node.id = id;
	var src = document.createElement('source');
	src.src = e.dataset.source;
	node.appendChild(src);
	document.body.appendChild(node);
	playAudio(e);
	//node.play();
}

function pauseAudio(e) {
	e.innerHTML = "<i class='fa fa-play'></i>&nbsp;&nbsp;&nbsp;";
	e.removeAttribute('onclick');
	e.setAttribute('onclick', 'playAudio(this);');
	try {
		var player = document.getElementById(e.dataset.source);
		player.pause();
	}
	catch (err) {
		var player2 = document.getElementById(e.id + 'aud');
		player2.pause();
	}
}

function playAudio(e) {
	e.innerHTML = "<i class='fa fa-pause'></i>&nbsp;&nbsp;&nbsp;";
	e.removeAttribute('onclick');
	e.setAttribute('onclick', 'pauseAudio(this);');
	try {
		var player = document.getElementById(e.dataset.source);
		player.play();
	}
	catch (err) {
		var player2 = document.getElementById(e.id + 'aud');
		player2.play();
	}
}

function toogleLoop(e) {
	if (e.value == 'repeat') {
		e.dataset.loop = true;
	} else {
		e.dataset.loop = false;
	}
}
var pos=0;
function pushYT(e) {
	if (cnt<=3){
		//if (pos<=3){

	ytembed = document.getElementById('ytembed');
	ytembed.src = 'https://www.youtube.com/embed/' + e.dataset.source;
	var d2 = document.getElementById('d2');
	var node = document.createElement('img');
	var id = e.id + 'play';
	node.id = id+cnt;
	node.src = e.src;
	node.style.position = 'fixed';
	node.style.top = 50 + (100 * (cnt)) + 'px';
	//pos=cnt;
	//pos= node.style.top;
	//console.log(pos);
	node.style.marginLeft = '10px';
	node.style.width = '80px';
	node.classList.add('exp2');
	node.setAttribute('onclick', 'ytset(this);');
	node.setAttribute('data-source', e.dataset.source);
	node.setAttribute('data-toggle', 'modal');
	node.setAttribute('data-target', '#ytmodal');
	d2.appendChild(node);
	cnt++;	
}
	else{
		alert("Limit Reached");
		}				
	

}

function ytremove(e) {

	document.getElementById('ytembed').src = '';
	
	
}

function ytset(e) {
	ytembed = document.getElementById('ytembed');
	ytembed.src = 'https://www.youtube.com/embed/' + e.dataset.source;
	document.getElementById('ytBtnUnpushed').setAttribute('data-idyt', e.id);
}

function ytUnpushedVideo(e) {
	len= (e.dataset.idyt).length;
	var idd= (e.dataset.idyt).charAt(len-1);
	console.log(idd);
	document.getElementById(e.dataset.idyt).remove();
	document.getElementById('ytembed').src = '';
		cnt--;
		
		if(idd=="1")
		{
			cnt=1;
		}
		else if(idd=="2"){

			cnt=2;
		}
		else if(idd=="3"){

			cnt=3;
		}
		/*cnt =1 if (position of deleted video is 150px)
		else if position of deleted video is 250px c=2 
		else if position of deleted video is 350 px c=3*/
	//alert (cnt);
	/*var node = document.createElement('img');
	node.style.top = 50 + (100 * (cnt)) + 'px';
	pos= node.style.top;
	alert(pos);*/
	/*if(cnt==3){
			pos=
			pushYT();
	*///cnt= (pos-50)/100;
	//alert(cnt);
	
	
	//alert(cnt);

}
//}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$('#my-image').attr('src', e.target.result);
			filename = input.files[0].name;
			var resize = new Croppie($('#my-image')[0], {
				viewport: { width: 100, height: 100 },
				boundary: { width: 300, height: 300 },
				showZoomer: true,
				enableResize: true,
				enableOrientation: true
			});
			$('#use').on('click', function () {
				resize.result('blob').then(function (dataImg) {
					// use ajax to send data to php
					imgfil = dataImg;
					console.log(e);
					console.log(imgfil + ' ' + filename);
					uploadImg();
				});
			});
		};
		reader.readAsDataURL(input.files[0]);
	}
}
$('#image').change(function () {
	readURL(this);
	console.log('changed');
	var index = bool - 1;
	if (bool) {
		$('.cr-boundary').eq(index).css('display', 'none');
		$('.cr-slider-wrap').eq(index).css('display', 'none');
	}
	bool++;
});
function uploadImg(event) {
	let form = document.querySelector('#form');
	let formData = new FormData(form);
	console.log(imgfil + ' ' + filename);
	formData.append('image', imgfil, filename);
	console.log(formData);
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_create-assets.php',
		data: formData,
		processData: false,
		contentType: false,
		xhr: function () {
			var xhr = new window.XMLHttpRequest();

			// Upload progress
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			// Download progress
			xhr.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						// Do something with download progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			return xhr;
		},
		success(data) {
			console.log(data.data.image);
			var div = document.createElement('div');
			div.setAttribute('class', 'hbox');
			var node = document.createElement('img');
			node.src = data.data.image;
			node.width = 125;
			node.height = 125;
			node.id = 'img' + perm;
			node.style = 'margin:4px;';
			node.setAttribute('onclick', 'pushImg(this);');
			div.appendChild(node);
			var overlay = document.createElement('div');
			overlay.setAttribute('class', 'options');
			var del = document.createElement('button');
			del.setAttribute('onclick', 'delimg()');
			del.setAttribute('data-pid', data.data.id);
			overlay.appendChild(del);
			div.appendChild(node);
			if (data.data.image != '') document.getElementById('galleryimgs').appendChild(div);
			else uploadImg(event);
			uploadbar.style.width = 0;
		}
	});
}


//for edit name
function editNameAsset(e) {
	let formData = new FormData();
	formData.append('update-assets', 'true');
	formData.append('update-media', 'true');
	formData.append('authtoken', token);
	var newName = document.getElementById('newname').value;
	var newTags = document.getElementById('newtags').value;
	var pid = document.getElementById('elementid').value;
	console.log(newName + '   ' + newTags + '  ' + pid);
	formData.append('name', newName);
	formData.append('project_id', pid);
	formData.append('tags', newTags);
	console.log(formData);
	console.log(form);
	if (edittype == 'a') {
		$.ajax({
			method: 'POST',
			url: 'https://pitchar.io/api/_update-assets.php',
			data: formData,
			processData: false,
			contentType: false,
			xhr: function () {
				var xhr = new window.XMLHttpRequest();

				// Upload progress
				xhr.upload.addEventListener(
					'progress',
					function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							//Do something with upload progress
							uploadbar.style.width = percentComplete * 100 + '%';
							if (percentComplete == 1) uploadbar.style.width = 0;
						}
					},
					false
				);

				// Download progress
				xhr.addEventListener(
					'progress',
					function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							// Do something with download progress
							uploadbar.style.width = percentComplete * 100 + '%';
							if (percentComplete == 1) uploadbar.style.width = 0;
						}
					},
					false
				);

				return xhr;
			},
			success(data) {
				alert('Name & tags changed');
			}
		});
	}
	else {
		$.ajax({
			method: 'POST',
			url: 'https://pitchar.io/api/_update_media.php',
			data: formData,
			processData: false,
			contentType: false,
			xhr: function () {
				var xhr = new window.XMLHttpRequest();

				// Upload progress
				xhr.upload.addEventListener(
					'progress',
					function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							//Do something with upload progress
							uploadbar.style.width = percentComplete * 100 + '%';
							if (percentComplete == 1) uploadbar.style.width = 0;
						}
					},
					false
				);

				// Download progress
				xhr.addEventListener(
					'progress',
					function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							// Do something with download progress
							uploadbar.style.width = percentComplete * 100 + '%';
							if (percentComplete == 1) uploadbar.style.width = 0;
						}
					},
					false
				);

				return xhr;
			},
			success(data) {
				alert('Name & tags changed');
			}
		});
	}
}

//for image fetch

let image = document.getElementById('imagebut');
image.addEventListener('click', () => {
	document.getElementById('galleryimgs').innerHTML = '';
	document.getElementById('image').value = '';
	document.getElementById('my-image').src = '#';
	document.getElementsByClassName('searchbar')[0].value = '';
	document.getElementsByClassName('searchbar')[1].value = '';

	document.getElementById('unsplashImgs').innerHTML = '';
	for (var i = 0; i < 10; i++) {
		var node = document.createElement('img');
		node.src = unpic[i].urls.small;
		node.style = 'margin:4px;';
		node.style.width = 125;
		node.style.height = 'auto';
		node.setAttribute('onclick', 'pushImg(this);');
		node.setAttribute('crossorigin', 'anonymous');
		document.getElementById('unsplashImgs').appendChild(node);
	}

	$.ajax({
		method: 'post',
		url: 'https://pitchar.io/api/_fetch-assets.php',
		data: {
			submit: 1,
			authtoken: token
		},
		dataType: 'json',
		success(result) {
			console.log(token);
			console.log(result);
			console.log('success2');
			var assets = result.assets;
			console.log(assets);
			
			for (var i = 0; i < assets.length; i++) {
				asset = assets[i];
				var node = document.createElement('img');
				node.src = asset.Projectimage;
				node.id = 'img' + i;
				node.style = 'margin:4px;width:125px;height:125;';
				node.setAttribute('onclick', 'pushImg(this);');
				node.setAttribute('class', 'image');
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');

				var del = document.createElement('button');
				del.setAttribute('onclick', 'delimg(this)');
				del.setAttribute('data-pid', asset.id);
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', asset.id);
				edit.setAttribute('data-typ', 'a');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				div.appendChild(node);
				div.appendChild(overlay);

				if (asset.Assetstype == 'image' && asset.Projectimage != '')
					document.getElementById('galleryimgs').appendChild(div);
				perm = i;
			}
		}
	});
	k = 1;
});

var l = 15;
var m = 20;
function fetchnew() { }
var searchImg = document.getElementsByClassName('searchbar');
searchImg[0].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		$.ajax({
			method: 'post',
			url: 'https://pitchar.io/api/_search_assets.php',
			data: {
				submit: true,
				authtoken: token,
				tags: document.getElementById('searchasset').value
			},
			success(result) {
				console.log(result);
				document.getElementById('galleryimgs').innerHTML = '';
				var assets = result.assets;
				for (var i = 0; i < assets.length; i++) {
					asset = assets[i];
					var node = document.createElement('img');
					node.src = asset.Projectimage;
					node.width = 125;
					node.height = 125;
					node.id = 'img' + i;
					node.style = 'margin:4px;';
					node.setAttribute('onclick', 'pushImg(this);');
					if (asset.Assetstype == 'image') document.getElementById('galleryimgs').appendChild(node);
					perm = i;
					var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');

				var del = document.createElement('button');
				del.setAttribute('onclick', 'delimg(this)');
				del.setAttribute('data-pid', asset.id);
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', asset.id);
				edit.setAttribute('data-typ', 'a');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('galleryimgs').appendChild(div);

				}
			}
		});
	}
});

var searchYT = document.getElementsByClassName('searchYT');
searchYT[0].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		var q = searchYT[0].value;
		console.log(q);
		var request = gapi.client.youtube.search.list({
			q: q,
			maxResults: 12,
			type: 'video',
			part: 'snippet',
			videoEmbeddable: 'true',
			videoSyndicated: 'true'
		});

		request.execute(function (response) {
			document.getElementById('ytImgs').innerHTML = '';
			var assets = response.result.items;
			console.log(assets);

			for (var i = 0; i < assets.length; i++) {
				asset = assets[i];
				var node = document.createElement('img');

				node.src = asset.snippet.thumbnails.high.url;
				node.width = 125;
				node.id = 'ytimg' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushYT(this);');
				node.setAttribute('data-source', asset.id.videoId);
				document.getElementById('ytImgs').appendChild(node);
				perm = i;
			}
		});
	}
});

$('#ytmodal').on('hidden.bs.modal', function () {
	document.getElementById('ytembed').src = '';
});

//for 3d model fetch

let asset = document.getElementById('asset');
asset.addEventListener('click', () => {
	document.getElementById('galleryobjs').innerHTML = '';
	document.getElementsByClassName('searchbar')[2].value = '';
	document.getElementsByClassName('searchbar')[3].value = '';

	var scene = new THREE.Scene();
var container = new THREE.Group();
scene.add(container);

const API_KEY = 'AIzaSyANZMpdihFsQgcJkFIEjasfiLgX6Nyb8SE';
//var searchGooglePoly = document.getElementsByClassName('searchGooglePoly');
//searchGooglePoly[0].addEventListener('keyup', function (event) {
	//event.preventDefault();
	//if (event.keyCode === 13) {
		//alert("searchGooglePoly");

		var settings = {
			async: true,
			crossDomain: true,
			url: `https://poly.googleapis.com/v1/assets?keywords=${searchGooglePoly[0]
				.value}&format=OBJ&key=${API_KEY}`,
			method: 'GET'
		};

		$.ajax(settings).done(function (response) {
			//console.log(response);
			document.getElementById('googlePolyImgs').innerHTML = '';

			var modResults = response.assets;
			//console.log(modResults);
			for (var i = 0; i < modResults.length; i++) {
				var node = document.createElement('img');
				node.src = modResults[i].thumbnail.url;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';

				var format = modResults[i].formats.find((format) => {
					return format.formatType === 'OBJ';
				});
				var obj = format.root;
				var mtl = format.resources.find((resource) => {
					return resource.url.endsWith('mtl');
				});
				var path = obj.url.slice(0, obj.url.indexOf(obj.relativePath));

				node.setAttribute('data-obj', obj.url);
				node.setAttribute('data-mtl', mtl.url);

				//node.setAttribute("onclick","pushAud(this);");
				if (format !== undefined) {
					node.setAttribute('onclick', 'pushPolyModel(this);');
				}

				node.setAttribute('class', 'image');
				node.setAttribute('data-source', modResults[i].name);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('googlePolyImgs').appendChild(div);

				div.appendChild(node);
				div.appendChild(overlay);
			}
		});
	//}
//});


	$.ajax({
		method: 'post',
		url: 'https://pitchar.io/api/_fetch-assets.php',
		data: {
			submit: 1,
			authtoken: token
		},
		dataType: 'json',
		success(result) {
			console.log(token);
			console.log(result);
			console.log('success2');
			var assets = result.assets;
			for (var i = 0; i < assets.length; i++) {
				asset = assets[i];
				if (
					asset.Assetstype == 'zip' ||
					asset.Assetstype == 'fbx' ||
					asset.Assetstype == 'gltf' ||
					asset.Assetstype == 'obj'
				) {
					var node = document.createElement('img');
					var div = document.createElement('div');
					node.src = asset.objthumbnail;
					node.width = 125;
					node.id = 'img' + i;
					node.setAttribute('data-type', asset.Assetstype);
					node.setAttribute('data-objfile', asset.obj);
					node.setAttribute('data-gltffile', asset.gltf);
					if (asset.Assetstype == 'obj') node.setAttribute('data-mtlfile', asset.mtl);
					node.style = 'margin:4px;';
					node.setAttribute('onclick', 'pushObj(this);');
					div.setAttribute('class', 'hbox');
					div.appendChild(node);
					var overlay = document.createElement('div');
					overlay.setAttribute('class', 'options');
					var del = document.createElement('button');
					del.setAttribute('onclick', 'delobj(this)');
					del.setAttribute('data-pid', asset.id);
					del.innerHTML = "<i class='fa fa-trash'></i>";
					overlay.appendChild(del);
					var edit = document.createElement('button');
					edit.setAttribute('onclick', 'editAssetId(this)');
					edit.setAttribute('data-toggle', "modal");
					edit.setAttribute('data-target', "#editmodal");
					edit.setAttribute('data-pid', asset.id);
					edit.setAttribute('data-typ', 'a');
					edit.innerHTML = "<i class='fa fa-edit'></i>";
					overlay.appendChild(edit);
					div.appendChild(node);
					div.appendChild(overlay);

					if ((asset.Assetstype == 'gltf' && asset.gltf != '') || (asset.Assetstype == 'fbx' && asset.fbx != '') || (asset.Assetstype == 'obj' && asset.obj != '' ))
					{
					document.getElementById('galleryobjs').appendChild(div);
					}
				}
				perm = i;
			}
		}
	});
});

var l = 15;
var m = 20;
function fetchnew() { }
var searchObj = document.getElementsByClassName('searchbar');
searchObj[2].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		$.ajax({
			method: 'post',
			url: 'https://pitchar.io/api/_search_assets.php',
			data: {
				submit: true,
				authtoken: token,
				tags: searchObj[2].value
			},
			success(result) {
				console.log(result);
				document.getElementById('galleryobjs').innerHTML = '';
				var assets = result.assets;
				for (var i = 0; i < assets.length; i++) {
					asset = assets[i];
					var node = document.createElement('img');
					node.src = asset.objthumbnail;
					node.width = 125;
					node.height = 125;
					node.id = 'img' + i;
					node.style = 'margin:4px;';
					node.setAttribute('onclick', 'pushObj(this);');
					if (asset.Assetstype == 'zip' ||
					asset.Assetstype == 'fbx' ||
					asset.Assetstype == 'gltf' ||
					asset.Assetstype == 'obj') document.getElementById('galleryobjs').appendChild(node);
					perm = i;
					var div = document.createElement('div');
					div.setAttribute('class', 'hbox');
					div.appendChild(node);
					var overlay = document.createElement('div');
					overlay.setAttribute('class', 'options');
					var del = document.createElement('button');
					del.setAttribute('onclick', 'delobj(this)');
					del.setAttribute('data-pid', asset.id);
					del.innerHTML = "<i class='fa fa-trash'></i>";
					overlay.appendChild(del);
					var edit = document.createElement('button');
					edit.setAttribute('onclick', 'editAssetId(this)');
					edit.setAttribute('data-toggle', "modal");
					edit.setAttribute('data-target', "#editmodal");
					edit.setAttribute('data-pid', asset.id);
					edit.setAttribute('data-typ', 'a');
					edit.innerHTML = "<i class='fa fa-edit'></i>";
					overlay.appendChild(edit);
					div.appendChild(node);
					div.appendChild(overlay);
					document.getElementById('galleryobjs').appendChild(div);
				}
			}
		});
	}
});

function delobj(e) {
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_delete-assets.php',
		data: { authtoken: token, product_id: e.dataset.pid },
		success(data) {
			console.log(data);
			e.parentNode.parentNode.style.display = 'none';
		}
	});
}

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
		xhr: function () {
			var xhr = new window.XMLHttpRequest();

			// Upload progress
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			// Download progress
			xhr.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						// Do something with download progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			return xhr;
		},
		success(data) {
			console.log(data);
			var node = document.createElement('img');
			node.src = data.data.objthumbnail;
			node.width = 125;
			node.setAttribute('data-type', asset.type);
			node.setAttribute('data-objfile', asset.obj);
			node.setAttribute('data-gltffile', asset.gltf);
			if (asset.Assetstype == 'obj') node.setAttribute('data-mtlfile', asset.mtl);
			node.style = 'margin:4px;';
			node.setAttribute('onclick', 'pushObj(this);');
			var div = document.createElement('div');
			div.setAttribute('class', 'hbox');
			div.appendChild(node);
			var overlay = document.createElement('div');
			overlay.setAttribute('class', 'options');
			var del = document.createElement('button');
			del.setAttribute('onclick', 'delimg(this)');
			del.setAttribute('data-pid', asset.id);
			del.innerHTML = "<i class='fa fa-trash'></i>";
			overlay.appendChild(del);
			div.appendChild(node);
			div.appendChild(overlay);
			document.getElementById('galleryobjs').appendChild(div);
			uploadbar.style.width = 0;
		}
	});
}
// fetch audio files
k = 0;
let music = document.getElementById('musicbut');
music.addEventListener('click', () => {
	document.getElementById('galleryauds').innerHTML = '';
	document.getElementsByClassName("searchbar")[5].value="";
	document.getElementsByClassName("searchbar")[6].value="";
	console.log('reached audio');
	var searchFS = document.getElementsByClassName('searchFS');
//searchFS[0].addEventListener('keyup', function (event) {
//	event.preventDefault();
//	if (event.keyCode === 13) {
		//alert("searchFS");

		var settings = {
			async: true,
			crossDomain: true,
			url:
				'https://freesound.org/apiv2/search/text/?query=' +
				searchFS[0].value +
				'&fields=name,previews&token=EGxQRoYUVQsqYXQ5gbbk9oSp5zU9MICs4KEa9404',
			method: 'GET'
		};

		$.ajax(settings).done(function (response) {
			//console.log(response);
			document.getElementById('fsImgs').innerHTML = '';

			var audResults = response.results;
			//console.log(audResults);
			for (var i = 0; i < audResults.length; i++) {
				var node = document.createElement('img');
				//node.src=media.thumbnail;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushAud(this);');
				node.setAttribute('class', 'image');
				node.setAttribute('data-source', audResults[i].previews['preview-lq-mp3']);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('fsImgs').appendChild(div);
				//if(media.type=='audio')
				//document.getElementById("galleryauds").appendChild(div);
				//perm=i;

				var audioPrev = document.createElement('button');
				audioPrev.setAttribute('data-source', audResults[i].previews['preview-lq-mp3']);
				audioPrev.id = audResults[i].name;
				audioPrev.setAttribute('onclick', 'previewAudio(this);');
				audioPrev.innerHTML = "<i class='fa fa-play'></i>";
				overlay.appendChild(audioPrev);
				div.appendChild(node);
				div.appendChild(overlay);

				var audioLoop = document.createElement('select');
				audioLoop.id = 'audioLoop' + i;
				var opt1 = document.createElement('option');
				opt1.value = 'play once';
				opt1.innerHTML = 'play once';
				audioLoop.appendChild(opt1);
				var opt2 = document.createElement('option');
				opt2.value = 'repeat';
				opt2.innerHTML = 'repeat';
				audioLoop.appendChild(opt2);
				audioLoop.setAttribute('data-loop', false);
				audioLoop.setAttribute('onclick', 'toogleLoop(this)');
				overlay.appendChild(audioLoop);

				div.appendChild(node);
				div.appendChild(overlay);
			}
		});
	//}
//});
	$.ajax({
		method: 'post',
		url: 'https://pitchar.io/api/_fetch-media.php',
		data: {
			submit: 1,
			authtoken: token
		},
		dataType: 'json',
		success(result) {
			console.log(token);
			console.log(result);
			var medias = result.media;
			for (var i = 0; i < medias.length; i++) {
				media = medias[i];
				console.log(media.audio);
				var node = document.createElement('img');
				node.src = media.thumbnail;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushAud(this);');
				node.setAttribute('class', 'image');
				node.setAttribute('data-source', media.audio);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				del.setAttribute('data-pid', media.id);
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', media.id);
				edit.setAttribute('data-typ', 'm');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				if (media.type == 'audio' && media.audio != '') document.getElementById('galleryauds').appendChild(div);
				perm = i;

				var audioPrev = document.createElement('button');
				audioPrev.setAttribute('data-source', media.audio);
				audioPrev.setAttribute('onclick', 'previewAudio(this);');
				audioPrev.innerHTML = "<i class='fa fa-play'></i>";
				overlay.appendChild(audioPrev);
				div.appendChild(node);
				div.appendChild(overlay);

				var audioLoop = document.createElement('select');
				audioLoop.id = 'audioLoop' + i;
				var opt1 = document.createElement('option');
				opt1.value = 'play once';
				opt1.innerHTML = 'play once';
				audioLoop.appendChild(opt1);
				var opt2 = document.createElement('option');
				opt2.value = 'repeat';
				opt2.innerHTML = 'repeat';
				audioLoop.appendChild(opt2);
				audioLoop.setAttribute('data-loop', false);
				audioLoop.setAttribute('onclick', 'toogleLoop(this)');
				overlay.appendChild(audioLoop);
				div.appendChild(node);
				div.appendChild(overlay);
			}
		}
	});
});





var l = 15;
var m = 20;
function fetchnew() { }
var searchAud = document.getElementsByClassName('searchbar');
searchAud[4].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		$.ajax({
			method: 'post',
			url: 'https://pitchar.io/api/_search_media.php',
			data: {
				submit: true,
				authtoken: token,
				tags: searchAud[4].value
			},
			success(result) {
				console.log(result);
				document.getElementById('galleryauds').innerHTML = '';
				var medias = result.media;
				for (var i = 0; i < medias.length; i++) {
					media = medias[i];
					var node = document.createElement('img');
					node.src = media.thumbnail;
					node.width = 125;
					node.height = 125;
					node.id = 'img' + i;
					node.style = 'margin:4px;';
					node.setAttribute('onclick', 'previewAudio(this);');
					if (media.type == 'audio') document.getElementById('galleryauds').appendChild(node);
					perm = i;
					var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				del.setAttribute('data-pid',media.id);
				console.log(media.id);
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('galleryauds').appendChild(div);
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', media.id);
				edit.setAttribute('data-typ', 'm');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				if (media.type == 'audio') document.getElementById('galleryauds').appendChild(div);
				perm = i;

				var audioPrev = document.createElement('button');
				audioPrev.setAttribute('data-source', media.audio);
				audioPrev.setAttribute('onclick', 'previewAudio(this);');
				audioPrev.innerHTML = "<i class='fa fa-play'></i>";
				overlay.appendChild(audioPrev);
				div.appendChild(node);
				div.appendChild(overlay);

				var audioLoop = document.createElement('select');
				audioLoop.id = 'audioLoop' + i;
				var opt1 = document.createElement('option');
				opt1.value = 'play once';
				opt1.innerHTML = 'play once';
				audioLoop.appendChild(opt1);
				var opt2 = document.createElement('option');
				opt2.value = 'repeat';
				opt2.innerHTML = 'repeat';
				audioLoop.appendChild(opt2);
				audioLoop.setAttribute('data-loop', false);
				audioLoop.setAttribute('onclick', 'toogleLoop(this)');
				overlay.appendChild(audioLoop);
				div.appendChild(node);
				div.appendChild(overlay);
				}
			}
		});
	}
});





var searchFS = document.getElementsByClassName('searchFS');
searchFS[0].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		//alert("searchFS");

		var settings = {
			async: true,
			crossDomain: true,
			url:
				'https://freesound.org/apiv2/search/text/?query=' +
				searchFS[0].value +
				'&fields=name,previews&token=EGxQRoYUVQsqYXQ5gbbk9oSp5zU9MICs4KEa9404',
			method: 'GET'
		};

		$.ajax(settings).done(function (response) {
			//console.log(response);
			document.getElementById('fsImgs').innerHTML = '';

			var audResults = response.results;
			//console.log(audResults);
			for (var i = 0; i < audResults.length; i++) {
				var node = document.createElement('img');
				//node.src=media.thumbnail;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushAud(this);');
				node.setAttribute('class', 'image');
				node.setAttribute('data-source', audResults[i].previews['preview-lq-mp3']);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('fsImgs').appendChild(div);
				//if(media.type=='audio')
				//document.getElementById("galleryauds").appendChild(div);
				//perm=i;

				var audioPrev = document.createElement('button');
				audioPrev.setAttribute('data-source', audResults[i].previews['preview-lq-mp3']);
				audioPrev.id = audResults[i].name;
				audioPrev.setAttribute('onclick', 'previewAudio(this);');
				audioPrev.innerHTML = "<i class='fa fa-play'></i>";
				overlay.appendChild(audioPrev);
				div.appendChild(node);
				div.appendChild(overlay);

				var audioLoop = document.createElement('select');
				audioLoop.id = 'audioLoop' + i;
				var opt1 = document.createElement('option');
				opt1.value = 'play once';
				opt1.innerHTML = 'play once';
				audioLoop.appendChild(opt1);
				var opt2 = document.createElement('option');
				opt2.value = 'repeat';
				opt2.innerHTML = 'repeat';
				audioLoop.appendChild(opt2);
				audioLoop.setAttribute('data-loop', false);
				audioLoop.setAttribute('onclick', 'toogleLoop(this)');
				overlay.appendChild(audioLoop);

				div.appendChild(node);
				div.appendChild(overlay);
			}
		});
	}
});


function delaud(e) {
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_delete-media.php',
		data: { authtoken: token, product_id: e.dataset.pid },
		success(data) {
			console.log(data);
			

			e.parentNode.parentNode.style.display= 'none';
		}
	});
}

// to upload audio files
function uploadAud(event) {
	let form = document.querySelector('#form4');
	let formData = new FormData(form);
	console.log(formData);
	console.log(form);
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_create-media.php',
		data: formData,
		processData: false,
		contentType: false,
		xhr: function () {
			var xhr = new window.XMLHttpRequest();

			// Upload progress
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			// Download progress
			xhr.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						// Do something with download progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			return xhr;
		},
		success(data) {
			console.log(data);
			uploadbar.style.width = 0;
			var node = document.createElement('img');
			node.src = data.data.thumbnail;
			node.width = 125;
			node.height = 125;
			node.id = 'img' + perm;
			node.style = 'margin:4px;';
			node.setAttribute('onclick', 'pushAud(this);');
			document.getElementById('galleryauds').appendChild(node);
		}
	});
}
//change video type
function chgcheck(e) {
	if (e.checked) {
		var typ = document.getElementById('check360');
		typ.value = '360';
	}
}

// upload video
function uploadVid(event) {
	let form = document.querySelector('#form6');
	let formData = new FormData(form);
	console.log(formData);
	console.log(form);
	var div = document.createElement('div');
	div.id = 'upbar';
	event.closest('.modal-body').append(div);
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_create-media.php',
		data: formData,
		processData: false,
		contentType: false,
		xhr: function () {
			var xhr = new window.XMLHttpRequest();

			// Upload progress
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			// Download progress
			xhr.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						// Do something with download progress
						uploadbar.style.width = percentComplete * 100 + '%';
						if (percentComplete == 1) uploadbar.style.width = 0;
					}
				},
				false
			);

			return xhr;
		},
		success(data) {
			uploadbar.style.width = 0;
			console.log(data.data.thumbnail);
			var node = document.createElement('img');
			node.src = data.data.thumbnail;
			node.width = 125;
			node.height = 125;
			node.id = 'img' + perm;
			node.style = 'margin:4px;';
			node.setAttribute('onclick', 'pushVid(this);');
			node.setAttribute('data-source', data.data.video);
			node.setAttribute('data-type', data.data.type);
			var div = document.createElement('div');
			div.setAttribute('class', 'hbox');
			div.appendChild(node);
			var overlay = document.createElement('div');
			overlay.setAttribute('class', 'options');
			var del = document.createElement('button');
			del.innerHTML = "<i class='fa fa-trash'></i>";
			overlay.appendChild(del);
			div.appendChild(node);
			div.appendChild(overlay);

			document.getElementById('galleryvids').appendChild(div);
		}
	});
}

function delvid(e) {
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/api/_delete-media.php',
		data: { authtoken: token, product_id: e.dataset.pid },
		success(data) {
			console.log(data);
			e.parentNode.parentNode.style.display = 'none';
		}
	});
}

// to fetch videos
let video = document.getElementById('videobut');
video.addEventListener('click', () => {
	console.log('reached video');
	document.getElementById('galleryvids').innerHTML = '';
	document.getElementsByClassName("searchbar")[7].value="";
	//document.getElementsByClassName("searchbar")[8].value="";
	var searchYT = document.getElementsByClassName('searchYT');
//searchYT[0].addEventListener('keyup', function (event) {
	//event.preventDefault();
	//if (event.keyCode === 13) {
		var q = searchYT[0].value;
		console.log(q);
		var request = gapi.client.youtube.search.list({
			q: q,
			maxResults: 12,
			type: 'video',
			part: 'snippet',
			videoEmbeddable: 'true',
			videoSyndicated: 'true'
		});

		request.execute(function (response) {
			document.getElementById('ytImgs').innerHTML = '';
			var assets = response.result.items;
			console.log(assets);

			for (var i = 0; i < assets.length; i++) {
				asset = assets[i];
				var node = document.createElement('img');

				node.src = asset.snippet.thumbnails.high.url;
				node.width = 125;
				node.id = 'ytimg' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushYT(this);');
				node.setAttribute('data-source', asset.id.videoId);
				document.getElementById('ytImgs').appendChild(node);
				perm = i;
			}
		});
	//}
//});

	$.ajax({
		method: 'post',
		url: 'https://pitchar.io/api/_fetch-media.php',
		data: {
			submit: 1,
			authtoken: token
		},
		dataType: 'json',
		success(result) {
			console.log(token);
			console.log(result);
			console.log('success2');
			var medias = result.media;
			for (var i = 0; i < medias.length; i++) {
				media = medias[i];
				var node = document.createElement('img');
				node.src = media.thumbnail;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';
				node.setAttribute('onclick', 'pushVid(this);');
				node.setAttribute('class', 'image');
				node.setAttribute('data-source', media.video);
				node.setAttribute('data-type', media.type);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				del.setAttribute('data-pid', media.id);
				overlay.appendChild(del);
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', media.id);
				edit.setAttribute('data-typ', 'm');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				var videotype = document.createElement('button');
				videotype.innerHTML = "<b style='position:absolute;left:2px;top:2px;'>" + media.type + "</b>";
				overlay.appendChild(videotype);
				div.appendChild(overlay);
				if (media.type == '2D' || media.type == '360' && media.video != '')
					document.getElementById('galleryvids').appendChild(div);
				perm = i;
			}
		}
	});
});


var l = 15;
var m = 20;
function fetchnew() { }
var searchVid = document.getElementsByClassName('searchbar');
searchVid[6].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		$.ajax({
			method: 'post',
			url: 'https://pitchar.io/api/_search_media.php',
			data: {
				submit: true,
				authtoken: token,
				tags: searchVid[6].value
			},
			success(result) {
				console.log(result);
				document.getElementById('galleryvids').innerHTML = '';
				var medias = result.media;
				for (var i = 0; i < medias.length; i++) {
					media = medias[i];
					var node = document.createElement('img');
					node.src = media.thumbnail;
					node.width = 125;
					node.height = 125;
					node.id = 'img' + i;
					node.style = 'margin:4px;';
					node.setAttribute('onclick', 'pushVid(this);');
					if (media.type == '2D' || media.type == '360') document.getElementById('galleryvids').appendChild(node);
					perm = i;


			var div = document.createElement('div');

				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				del.setAttribute('data-pid', media.id);
				overlay.appendChild(del);
				var edit = document.createElement('button');
				edit.setAttribute('onclick', 'editAssetId(this)');
				edit.setAttribute('data-toggle', "modal");
				edit.setAttribute('data-target', "#editmodal");
				edit.setAttribute('data-pid', media.id);
				edit.setAttribute('data-typ', 'm');
				edit.innerHTML = "<i class='fa fa-edit'></i>";
				overlay.appendChild(edit);
				var videotype = document.createElement('button');
				videotype.innerHTML = "<b style='position:absolute;left:2px;top:2px;'>" + media.type + "</b>";
				overlay.appendChild(videotype);
				document.getElementById('galleryvids').appendChild(div);
					console.log(media.id);

				div.appendChild(overlay);
				if (media.type == '2D' || media.type == '360')
					document.getElementById('galleryvids').appendChild(div);
				

				}
			}
		});
	}
});


//video functionalities
function chgvidtype(e) {
	if (e.checked) {
		document.getElementById('vidtype').value = '360';
	} else {
		document.getElementById('vidtype').value = '2D';
	}
}

// googlePoly Integration
var scene = new THREE.Scene();
var container = new THREE.Group();
scene.add(container);

const API_KEY = 'AIzaSyANZMpdihFsQgcJkFIEjasfiLgX6Nyb8SE';
var searchGooglePoly = document.getElementsByClassName('searchGooglePoly');
searchGooglePoly[0].addEventListener('keyup', function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		//alert("searchGooglePoly");

		var settings = {
			async: true,
			crossDomain: true,
			url: `https://poly.googleapis.com/v1/assets?keywords=${searchGooglePoly[0]
				.value}&format=OBJ&key=${API_KEY}`,
			method: 'GET'
		};

		$.ajax(settings).done(function (response) {
			//console.log(response);
			document.getElementById('googlePolyImgs').innerHTML = '';

			var modResults = response.assets;
			//console.log(modResults);
			for (var i = 0; i < modResults.length; i++) {
				var node = document.createElement('img');
				node.src = modResults[i].thumbnail.url;
				node.width = 125;
				node.height = 125;
				node.id = 'img' + i;
				node.style = 'margin:4px;';

				var format = modResults[i].formats.find((format) => {
					return format.formatType === 'OBJ';
				});
				var obj = format.root;
				var mtl = format.resources.find((resource) => {
					return resource.url.endsWith('mtl');
				});
				var path = obj.url.slice(0, obj.url.indexOf(obj.relativePath));

				node.setAttribute('data-obj', obj.url);
				node.setAttribute('data-mtl', mtl.url);

				//node.setAttribute("onclick","pushAud(this);");
				if (format !== undefined) {
					node.setAttribute('onclick', 'pushPolyModel(this);');
				}

				node.setAttribute('class', 'image');
				node.setAttribute('data-source', modResults[i].name);
				var div = document.createElement('div');
				div.setAttribute('class', 'hbox');
				div.appendChild(node);
				var overlay = document.createElement('div');
				overlay.setAttribute('class', 'options');
				var del = document.createElement('button');
				del.setAttribute('onclick', 'delaud(this)');
				del.innerHTML = "<i class='fa fa-trash'></i>";
				overlay.appendChild(del);
				div.appendChild(node);
				div.appendChild(overlay);
				document.getElementById('googlePolyImgs').appendChild(div);

				div.appendChild(node);
				div.appendChild(overlay);
			}
		});
	}
});

function pushPolyModel(e) {
	// var loader = new THREE.MTLLoader();
	// loader.setCrossOrigin( true );
	// loader.setMaterialOptions( { ignoreZeroRGBs: true } );
	// loader.setTexturePath( path );
	// loader.load( mtl.url, function ( materials ) {

	//   var loader = new THREE.OBJLoader();
	//   loader.setMaterials( materials );
	//   loader.load( obj.url, function ( object ) {

	var node = document.createElement('a-entity');
	node.setAttribute('rotation', { x: 0, y: 0, z: 0 });
	node.setAttribute('visible', 'true');
	node.setAttribute('scale', { x: 1, y: 1, z: 1 });

	node.setAttribute('obj-model', {
		obj: e.dataset.obj,
		mtl: e.dataset.mtl
	});

	node.id = e.id + '3d';
	node.object3D.position.set(0, 0.1, 0);
	node.object3D.rotation.set(0, 1.57, 0);
	node.object3D.scale.set(0.7, 0.7, 0.7);
	node.setAttribute('click-drag', '');
	node.classList.add('exp');
	node.setAttribute('loaded', 'objectloaded()');
	document.getElementById('perswin').appendChild(node);
	$('#assets .close').click();
	$('.modal-backdrop').remove();
	objectloaded(node.id);

	// // re-center
	// var center = box.getCenter();
	// center.y = box.min.y;
	// object.position.sub( center );

	// // scale
	// var scaler = new THREE.Group();
	// scaler.add( object );
	// scaler.scale.setScalar( 6 / box.getSize().length() );
	// container.add( scaler );
	// } );

	// } );
}

async function objectloaded(id) {
	object = document.getElementById(id);
	try {
		var objectd = object.getObject3D('mesh');
		var sphere = new THREE.Sphere();
		var bbox = new THREE.Box3().setFromObject(objectd);
		bbox.getBoundingSphere(sphere);
		var dia = sphere.radius;
		var pow = Math.pow(dia, -1);
		console.log(pow);
		object.object3D.scale.x = pow;
		object.object3D.scale.y = pow;
		object.object3D.scale.z = pow;
	} catch (err) {
		setTimeout(function () {
			objectloaded(id);
		}, 3000);
	}
}
document.getElementById('choosemarkerbut').addEventListener('click', function (e) {
	document.getElementById('gallerymarkers').innerHTML = "<img src='marker/hiro.png' width='150px' style='padding:5px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' onclick='resetMarker(this);'>";
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/pitchar_api/_fetch_markers.php',
		data: { authtoken: token, submit: 1 },
		success(data) {
			console.log(data);
			var markers = data.Data;
			for (var i = 0; i < markers.length; i++) {
				marker = markers[i];
				var node = document.createElement('img');
				node.src = marker.linkmarker;
				node.id = 'markerimg' + i;
				node.style = 'padding:5px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:150px;';
				node.setAttribute('onclick', 'selectMarker(this);');
				node.setAttribute('data-markerid', marker.id);
				document.getElementById('gallerymarkers').appendChild(node);
			}
		}
	});

	
});