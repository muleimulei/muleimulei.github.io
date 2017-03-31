// console.log($)
(function(){
	var template = `<li data-id="{{id}}" data-img="{{post}}" data-src="{{musicUrl}}">
                <i class="fa fa-music" aria-hidden="true"></i>
                <h5 class='tt'>{{title}}</h5>
                <h5 class="author">{{singer}}</h5>
            	</li>`;
	var open = $("#box .ctrl-box .switch");
	var ul = $('#box .music-list ul');
	var list=[],index=0;//存放音乐，序号
	var width = $('.ctrl-box .bar').width();
	var ulheight = $('.music-list ul').height();
	var canvas = $('#mycanvas');
	var context = canvas.get(0).getContext('2d');
	// var a = $('#box .pic a.fancybox');
	// console.log(a);
	//----------------
	var pic = $('.pic img');
	var title = $('.ctrl-box .title span');
	var author = $('.ctrl-box .title sub');
	var prev = $('.menu .fa-step-backward');
	var play = $('.menu .fa-play');
	var next = $('.menu .fa-step-forward');
	var progress = $('.ctrl-box .bar .played');
	var thumb = $('.ctrl-box .thumb');

	var bar = $('.ctrl-box .bar');
	var audio = new Audio();
	var start = 0;
	var flag = false;


	//--------初始化--------
	$(open).on('click',function(){
		$(ul).slideToggle(function(){
			if(canvas.is(':hidden')){
				canvas.css('display','block')
			}else{
				canvas.css('display','none')
			}
		});

	});
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
	        preList(xmlhttp.response);
	    }
	}

	function preList(l){
		l.forEach(function(item,i){
			var html = template.replace("{{id}}",i).replace("{{post}}",item.picUrl).replace("{{singer}}",item.singer).replace("{{title}}",item.name).replace("{{musicUrl}}",item.src);
			list.push($(html).appendTo(ul));
			if(i==0){
				list[i].addClass('darken');
			}
		});
		$(ul).on('click','li',function(e){

			audio.pause();
			var li = $(this);
			list[index].removeClass('darken');
			list[index].find('i.fa').get(0).className = 'fa fa-music';
			index = li.data('id');

			list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';

			list[index].addClass('darken');
			audio.src = li.data('src');
			pic.attr('src',li.data('img'));
			$('#box .pic a.fancybox').attr('href',li.data('img'));
			title.text(li.find('h5.tt').text());
			author.text('--'+li.find('h5.author').text());
			audio.play();
		});
		initmusic();
	}

	function initmusic(){
		var first = list[index];
		pic.attr('src',first.data('img'));
		$('#box .pic a.fancybox').attr('href',first.data('img'));
		title.text(first.find('h5.tt').text());
		author.text('--'+first.find('h5.author').text());

		play.get(0).className = 'fa fa-spinner fa-spin';
		first.find('i.fa').get(0).className = 'fa fa-cog fa-spin';
		if(audio){
			audio.src = first.data('src');
			audio.play();
		}
		$(audio).on('canplay',function(){
			play.get(0).className = 'fa fa-pause';
		});
		$(audio).on('timeupdate',function(){
			var p = (audio.currentTime/width)*audio.duration;
			progress.width(p);
			thumb.css({
				left: p+'px'
			});
		});
		$(audio).on('ended',function(){
			next.trigger('click');
		});
	}	
	
	play.on('click',function(){
		if(audio){
			if(audio.paused){
				audio.play();
				play.get(0).className = 'fa fa-pause';
				list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
			}else{
				audio.pause();
				play.get(0).className = 'fa fa-play';

				list[index].find('i.fa').get(0).className = 'fa fa-music';
			}
		}
	});
	next.on('click',function(){
		list[index].find('i.fa').get(0).className = 'fa fa-music';
		play.get(0).className = 'fa fa-spinner fa-spin';

		list[index].removeClass('darken');
		index = (index+2 > list.length)? (index+2)%list.length-1: index+1;
		list[index].addClass('darken');
		
		list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
		playmusic(list[index]);
		checkpos();
	});
	prev.on('click',function(){
		list[index].find('i.fa').get(0).className = 'fa fa-music';
		play.get(0).className = 'fa fa-spinner fa-spin';
		list[index].removeClass('darken');
		if(index-1<0){
			index = list.length-1;
		}else{
			index-=1;
		}
		list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
		list[index].addClass('darken');
		
		playmusic(list[index]);
		checkpos();
	});

	// bar.on('mousedown',function(e){
	// 	start = e.offsetX;
	// });
	// bar.on('mousemove',function(){

	// });
	bar.on('mouseup',function(e){
		var d = e.offsetX;
		console.log(d);
		var p = d*audio.duration/width;
		progress.width(d);
		thumb.css({
			left: d+'px'
		});
		audio.currentTime = Math.floor(p);
	});
	//---------初始化结束-----------
	window.audio = audio;

	function playmusic(li){
		list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
		pic.attr('src',li.data('img'));
		$('#box .pic a.fancybox').attr('href',li.data('img'));
		title.text(li.find('h5.tt').text());
		author.text('--'+li.find('h5.author').text());
		audio.pause();
		audio.src = li.data('src');
		audio.play();
	}

	function checkpos(){
		if(list[index].position().top>ulheight){
			ul.scrollTop(list[index].position().top);
		}
	}
//-----------粒子-----------------
var particles = [];

	var canvas = $('#mycanvas');
	var context = canvas.get(0).getContext('2d');
	var line = context.createLinearGradient(0,0,0,canvas.height());
	line.addColorStop(0,'rgb(196, 31, 194)');
	line.addColorStop(.3,'rgb(39, 176, 173)');
	line.addColorStop(.6,'rgb(76, 59, 132)');
	line.addColorStop(.9,'gray');
	
	//粒子类
	function Particle(x,y){
	    this.x = x;
	    this.y = y;
	    this.step = -5;//加入垂直方向的增量,负值就向上运动
	    this.xVel = 0;
	    this.gravity = 0.1;//增加重力影响
	    this.counter = 0;//影响颜色
	/*绘制粒子*/
	    this.render = function(context){
	        //hsl(H,S,L)
	        //H:0-360,S:饱和度0.0%-100.0%，L：亮度0.0%-100.0%
	        context.fillStyle = "hsl("+this.counter+",100%,50%)";

	        context.beginPath();
	        context.arc(this.x,this.y,3,0,2*Math.PI,true);
	        context.fill();
	    };
	/*更新数组中粒子的位置和颜色*/
	    this.update = function(){
	        this.y += this.step;
	        this.step += this.gravity;
	        this.x += this.xVel;
	        this.counter += 2;
	    };
	}
	function loop(x,y){
		context.clearRect(0,0,canvas.width(),canvas.height());
		// context.fillStyle = line;
	    // context.fillRect(0,0,canvas.width(),canvas.height());
	    //随机产生一个粒子
	    var particle = new Particle(x,y);
	    particle.xVel = Math.random()*4-2;//给粒子一个水平位置变化量
	    particles.push(particle);//加入数组中
	    if(particles.length > 4000){
	        particles.shift();
	    }
	    for(var i=0;i<particles.length;i++){
	        var particle = particles[i];
	        //绘制数组中的每一个粒子
	        particle.render(context);
	        //更新数组中的每一个粒子
	        particle.update();
	    }
    }
    setInterval(function(){
    	var x = Math.random()*canvas.width();
	    var y = Math.random()*canvas.height();
        loop(x,y);
    },1000/30);
})();
