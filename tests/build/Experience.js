var start1 =
	"<html><head><script src='https://aframe.io/releases/0.9.0/aframe.min.js'></script><script src='https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js'></script>" +
	"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>" +
	"<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script></head>" +
	"<body style='margin : 0px; overflow: hidden;'>" +
	"<a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam;debugUIEnabled: false;'>" +
	"<a-marker-camera preset='hiro'>";
var mid3d = ' ';
var mid2d = '</a-marker-camera></a-scene>';
var end =
	"<div id='ytmodal' class='modal' tabindex='-1' role='dialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' onclick='ytremove(this);' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><br></div><div class='modal-body'><iframe id='ytembed' src='' width='100%' height='60%' frameborder=0px allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen ></iframe></div></div></div></div>" +
	"<script>function ytremove(e){document.getElementById('ytembed').src = '';} function ytset(e){ ytembed= document.getElementById('ytembed'); ytembed.src= 'https://www.youtube.com/embed/'+e.dataset.source; }function playaud(e){var x= document.getElementById(e.dataset.source);x.play();}</script></body></html>";
var file;
function readFile() {
	showEntities();
	console.log(start1 + mid3d + mid2d + end);
	var file = start1 + mid3d + mid2d + end;
	return file;
}

function showEntities() {
	var sceneEl = document.querySelector('#perswin');
	var els = sceneEl.querySelectorAll('.exp');
	var els2 = document.querySelectorAll('.exp2');
	mid3d = '';
	var temp = '';
	for (var i = 0; i < els.length; i++) {
		els[i].flushToDOM(true);
		if (els[i].object3D.visible) mid3d += els[i].outerHTML;
	}
	for (var j = 0; j < els2.length; j++) {
		temp += els2[j].outerHTML;
		console.log(els2[j]);
	}
	mid2d += temp;
	return mid3d + mid2d;
}

function sharelnk(e) {
	console.log('reached share');
	var exptxt = document.getElementById('exptxt');
	exptxt.value = readFile();
	let form = document.querySelector('#form0');
	let formData = new FormData(form);
	$.ajax({
		method: 'POST',
		url: 'https://pitchar.io/pitchar_api/_post_experience.php',
		data: formData,
		processData: false,
		contentType: false,
		xhr: function() {
			var xhr = new window.XMLHttpRequest();

			// Upload progress
			xhr.upload.addEventListener(
				'progress',
				function(evt) {
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
				function(evt) {
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
			document.getElementById('shrlnk').value = data.Data.share_experience;
		}
	});
}
