// console.log($)
(function(){
	var template = `<li data-img="{{post}}" data-src="{{musicUrl}}">
                <i class="fa fa-music" aria-hidden="true"></i>
                <!-- <i class="fa fa-spinner "></i> -->
                <h5>{{title}}</h5>
                <h5 class="author">{{singer}}</h5>
            	</li>`;
	var open = document.querySelector("#box .ctrl-box .switch");
	var ul = document.querySelector('#box .music-list ul');
	var list,index;//存放音乐，序号

	open.addEventListener('click',function(){
		if(ul.style.height=='0px'){
			ul.style.height='180px';
		}else{
			ul.style.height='0px';
		}
	},false);

	/*基础请求*/
	var xmlhttp = null;
	var url = '/music/music.json';
	if(window.XMLHttpRequest){  
	    var xmlhttp = new XMLHttpRequest();  
	}else{  
	    var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');  
	}  
	xmlhttp.responseType = 'json';
	xmlhttp.open('GET',url,true);//仅仅写出 GET 下的基础请求，POST 需要进行伪装；  

	xmlhttp.send(null);
	xmlhttp.onreadystatechange = function(){  
	    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){  
	        list = xmlhttp.response;
	        preList(list);
	    }
	}

	function preList(list){
		list.forEach(function(item){
			var html = template.replace("{{post}}",item.picUrl).replace("{{singer}}",item.singer).replace("{{title}}",item.name).replace("{{musicUrl}}",item.src);
			var li = document.createElement('li');
			li.innerHTML = html;
			ul.appendChild(li);
		});
		ul.addEventListener('click',function(e){
			console.log('%o',e.target);
		},false);

	}



})();

var s = `
            <li>
                <i class="fa fa-music" aria-hidden="true"></i>
                <!-- <i class="fa fa-spinner "></i> -->
                <h5>你好，世界</h5>
                <h5 class="author">凌俊杰</h5>
            </li>
            <li>
                <i class="fa fa-music" aria-hidden="true"></i>
                <!-- <i class="fa fa-spinner "></i> -->
                <h5>你好，世界</h5>
                <h5 class="author">凌俊杰</h5>
            </li>

            <li class="active">
                <i class="fa fa-spinner"></i>
                <h5>你好，世界</h5>
                <h5 class="author">凌俊杰</h5>
            </li>
            <li>
                <i class="fa fa-music" aria-hidden="true"></i>
                <!-- <i class="fa fa-spinner "></i> -->
                <h5>你好，世界</h5>
                <h5 class="author">凌俊杰</h5>
            </li>
            <li>
                <i class="fa fa-music" aria-hidden="true"></i>
                <!-- <i class="fa fa-spinner "></i> -->
                <h5>你好，世界</h5>
                <h5 class="author">凌俊杰</h5>
            </li>`;