(function(){
	var xhr;
	if (window.XMLHttpRequest) {
	//现代主流浏览器
		xhr = new XMLHttpRequest();
	} else {
	// 针对浏览器，比如IE5或IE6
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open('GET','/picture/pictures.json');
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// console.log(xhr.response);
			handlePicture(JSON.parse(xhr.response));
		}
	}
	var wrapper = document.querySelector('.wrapper');
	var index = 0;
	var linenum = 6;
	function handlePicture(arr){
		addPictures(arr);
	}
	function addPictures(arr){
		for(var i = 0;i<arr.length;i++){
			var div = document.createElement('div');
			wrapper.appendChild(div);
			var img = document.createElement('img');
			img.setAttribute('src',arr[i]);
			var a = document.createElement('a');
			a.className = 'fancybox fancybox.image';
			a.setAttribute('href',arr[i]);
			a.style = 'border:none';
			div.appendChild(a);
			a.appendChild(img);
		}
	}
})();
