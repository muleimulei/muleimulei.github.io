// console.log($)
(function() {
    var template = `<li data-id="{{id}}" data-img="{{post}}" data-src="{{musicUrl}}">
                <i class="fa fa-music" aria-hidden="true"></i>
                <h5 class='tt'>{{title}}</h5>
                <h5 class="author">{{singer}}</h5>
                </li>`;
    var open = $("#box .ctrl-box .switch");
    var ul = $('#box .music-list ul');
    var list = [],
        index = 0; //存放音乐，序号
    var width = $('.ctrl-box .bar').width();
    var ulheight = $('.music-list ul').height();
    var canvas = $('#mycanvas');
    var context = canvas.get(0).getContext('2d');
    var bw = document.body.clientWidth;
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
    var box1 = $('#box');
    var box2 = $('#box2');
    //--------初始化--------
    $(open).on('click', function() {
        $(ul).slideToggle(function() {
            if (canvas.is(':hidden')) {
                canvas.css('display', 'block')
            } else {
                canvas.css('display', 'none')
            }
        });
    });
    /*基础请求*/
    var xmlhttp = null;
    var url = '/music/music.json';
    if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();
    } else {
        var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlhttp.responseType = 'json';
    xmlhttp.open('GET', url, true); //仅仅写出 GET 下的基础请求，POST 需要进行伪装；  
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            preList(xmlhttp.response);
        }
    }

    function preList(l) {
        l.forEach(function(item, i) {
            var html = template.replace("{{id}}", i).replace("{{post}}", item.picUrl).replace("{{singer}}", item.singer).replace("{{title}}", item.name).replace("{{musicUrl}}", item.src);
            list.push($(html).appendTo(ul));
            if (i == 0) {
                list[i].addClass('darken');
            }
        });
        $(ul).on('click', 'li', function(e) {
            audio.pause();
            play.get(0).className = 'fa fa-spinner fa-spin';
            var li = $(this);
            list[index].removeClass('darken');
            list[index].find('i.fa').get(0).className = 'fa fa-music';
            index = li.data('id');
            list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
            list[index].addClass('darken');
            audio.src = li.data('src');
            pic.attr('src', li.data('img'));
            $('#box .pic a.fancybox').attr('href', li.data('img'));
            title.text(li.find('h5.tt').text());
            author.text('--' + li.find('h5.author').text());
            audio.play();
        });
        initmusic();
    }

    function initmusic() {
        var first = list[index];
        pic.attr('src', first.data('img'));
        $('#box .pic a.fancybox').attr('href', first.data('img'));
        title.text(first.find('h5.tt').text());
        author.text('--' + first.find('h5.author').text());
        play.get(0).className = 'fa fa-spinner fa-spin';
        first.find('i.fa').get(0).className = 'fa fa-cog fa-spin';
        if (audio) {
            audio.src = first.data('src');
        }
        // audio.play();
        $(audio).on('canplaythrough', function() {
            play.get(0).className = 'fa fa-pause';
        });
        $(audio).on('timeupdate', function() {
            var p = (audio.currentTime * width) / audio.duration;
            progress.width(p);
            thumb.get(0).style.left = p + 'px';
        });
        $(audio).on('ended', function() {
            next.trigger('click');
        });
        // $(audio).on('waiting', function() {
        //     play.get(0).className = 'fa fa-spin';
        // });
        // $(audio).on('suspend', function() {
        //     play.get(0).className = 'fa fa-spin';
        // });
        // $(audio).on('stalled', function() {
        //     play.get(0).className = 'fa fa-spin';
        // });
    }
    play.on('click', function() {
        if (audio) {
            if (audio.paused) {
                audio.play();
                play.get(0).className = 'fa fa-pause';
                list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
            } else {
                audio.pause();
                play.get(0).className = 'fa fa-play';
                list[index].find('i.fa').get(0).className = 'fa fa-music';
            }
        }
    });
    next.on('click', function() {
        list[index].find('i.fa').get(0).className = 'fa fa-music';
        play.get(0).className = 'fa fa-spinner fa-spin';
        list[index].removeClass('darken');
        index = (index + 2 > list.length) ? (index + 2) % list.length - 1 : index + 1;
        list[index].addClass('darken');
        list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
        playmusic(list[index]);
        checkpos();
    });
    prev.on('click', function() {
        list[index].find('i.fa').get(0).className = 'fa fa-music';
        play.get(0).className = 'fa fa-spinner fa-spin';
        list[index].removeClass('darken');
        if (index - 1 < 0) {
            index = list.length - 1;
        } else {
            index -= 1;
        }
        list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
        list[index].addClass('darken');
        playmusic(list[index]);
        checkpos();
    });
    bar.on('click', function(e) {
        var d = e.offsetX;
        var p = d * audio.duration / width;
        audio.currentTime = Math.floor(p);
    });
    //---------初始化结束-----------
    // window.audio = audio;
    function playmusic(li) {
        list[index].find('i.fa').get(0).className = 'fa fa-cog fa-spin';
        pic.attr('src', li.data('img'));
        $('#box .pic a.fancybox').attr('href', li.data('img'));
        title.text(li.find('h5.tt').text());
        author.text('--' + li.find('h5.author').text());
        audio.pause();
        audio.src = li.data('src');
        audio.play();
    }

    function checkpos() {
        var l = list[index].position().top;
        if (l > ulheight || l < 0) {
            ul.scrollTop(l);
        }
    }
    //-----------粒子-----------------
    var particles = [];
    var canvas = $('#mycanvas');
    var context = canvas.get(0).getContext('2d');
    //粒子类
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.step = -2; //加入垂直方向的增量,负值就向上运动
        this.xVel = 0;
        this.gravity = 0.1; //增加重力影响
        this.counter = 0; //影响颜色
        /*绘制粒子*/
        this.render = function(context) {
            //hsl(H,S,L)
            //H:0-360,S:饱和度0.0%-100.0%，L：亮度0.0%-100.0%
            context.fillStyle = "hsl(" + this.counter + ",100%,50%)";
            context.beginPath();
            context.arc(this.x, this.y, 10, 0, 2 * Math.PI, true);
            context.fill();
        };
        /*更新数组中粒子的位置和颜色*/
        this.update = function() {
            this.y += this.step;
            this.step += this.gravity;
            this.x += this.xVel;
            this.counter += 2;
        };
    }

    function loop(x, y) {
        context.clearRect(0, 0, canvas.width() + 200, canvas.height());
        // context.fillStyle = line;
        // context.fillRect(0,0,canvas.width(),canvas.height());
        //随机产生一个粒子
        var particle = new Particle(x, y);
        particle.xVel = Math.random() * 4 - 2; //给粒子一个水平位置变化量
        particles.push(particle); //加入数组中
        if (bw < 400) {
            if (particles.length > 20) {
                particles.shift();
            }
        } else {
            if (particles.length > 100) {
                particles.shift();
            }
        }
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            //绘制数组中的每一个粒子
            particle.render(context);
            //更新数组中的每一个粒子
            particle.update();
        }
    }
    setInterval(function() {
        var x = Math.random() * canvas.width();
        var y = Math.random() * canvas.height();
        loop(x, y);
    }, 1000 / 30);
    //添加另一页面,可视化音乐
    var c = document.querySelector('#box2>canvas');
    var cc = c.getContext('2d');
    var line = cc.createLinearGradient(0, 0, 0, c.height);
    line.addColorStop(0, 'blue');
    line.addColorStop(.5, 'yellow');
    line.addColorStop(1, 'green');
    var toggle = document.querySelector('.toggle');
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    var gainNode = audioCtx[audioCtx.createGain ? 'createGain' : 'createGainNode']();
    var bufferSource = audioCtx.createBufferSource();
    const SIZE = 256;
    analyser.fftSize = SIZE;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var requestAnimateF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    var f = 'column';
    var btns = $('.control > div > button');
    var dots = [];

    function checkFile(file) {
        if (!/\/mp3$|\/ogg$|\/wav$|\/mpeg/.test(file.type)) {
            alert('请选择音频文件播放');
            return false;
        }
        return true;
    }
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    toggle.addEventListener('click', function() {
        if (box1.is(':hidden')) {
            box2.slideToggle(function() {
                box1.slideToggle(function() {
                    audio.play();
                });
            })
        } else {
            audio.pause();
            box1.slideToggle(function() {
                box2.slideToggle(function() {});
            })
        }
    });
    var input = document.querySelector('#box2 .drop>input');
    input.addEventListener('change', function(e) {
        var file = this.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!checkFile(file)) {
            return;
        }
        if (window.FileReader) {
            var fr = new FileReader();
            fr.onloadend = function(e) {
                canvasDraw(fr.result);
            };
            fr.readAsArrayBuffer(file);
        }
    }
    $('.drop')[0].addEventListener('drop', function(e) {
        $(this).css({
            'borderColor': '#0e0e0e',
            'backgroundColor': '#e6d3d3;'
        });
        try {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
            return false;
        } catch (e) {
            console.log(e);
        }
    });
    $('.drop').on('dragover', function(e) {
        e.preventDefault();
        $(this).css({
            'borderColor': 'blueviolet',
            'backgroundColor': 'bisque'
        });
    });
    $('.drop').on('dragleave', function(e) {
        e.preventDefault();
        $(this).css({
            'borderColor': 'black',
            'backgroundColor': 'white'
        });
    });
    $('.control > div').delegate('button', 'click', function(e) {
        if (!bufferSource.buffer) return;
        btns.css({
            'backgroundColor': '#3a7ebb'
        });
        $(e.target).css({
            'backgroundColor': '#0a2d4c'
        });
        switch (e.target.getAttribute('data-type')) {
            case 'column':
                f = 'column';
                break;
            case 'wave':
                f = 'wave';
                break;
            case 'circle':
                f = 'circle';
                getDots();
                break;
        }
    });

    function getDots() {
        dots = [];
        for (let i = 0; i < bufferLength; i++) {
            let x = Math.random() * c.width;
            let y = Math.random() * c.height;
            let color = `rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.random()})`;
            dots.push({
                x: x,
                y: y,
                color: color
            });
        }
    }

    function canvasDraw(audioData) {
        audioCtx.decodeAudioData(audioData, function(buffer) {
            bufferSource.buffer = buffer;
        }, function(e) {
            "Error with decoding audio data" + e.err
        });
        bufferSource.connect(analyser);
        bufferSource.start();

        function v() {
            if (f) {
                analyser.getByteFrequencyData(dataArray);
            } else {
                analyser.getByteTimeDomainData(dataArray);
            }
            draw(dataArray);
            requestAnimateF(v);
        }
        requestAnimateF(v);
    }

    function draw(arr) {
        var ch = c.height;
        var cw = c.width;
        // console.log(ch,cw);
        cc.clearRect(0, 0, cw, ch);
        cc.beginPath();
        cc.globalAlpha = 0.3;
        cc.fillStyle = line;
        cc.fillRect(0, 0, cw, ch);
        cc.closePath();
        cc.globalAlpha = 1.0;
        // cc.scale(2,2);
        switch (f) {
            case 'wave':
                {
                    cc.lineWidth = 2;
                    cc.strokeStyle = 'rgb(255, 0, 0)';
                    cc.beginPath();
                    let sliceWidth = cw * 1.0 / bufferLength;
                    let x = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        if (i == 0) {
                            y = ch / 2;
                        } else {
                            if (arr[i] < bufferLength) {
                                y = ch / 2 - arr[i] / 2;
                                y = ch / 2 - (ch / 2 - y) * 3;
                            } else if (arr[i] >= bufferLength) {
                                y = ch / 2 + arr[i] / 4;
                                y = 3 * (y - ch / 2) + ch / 2;
                            } else {
                                y = ch / 2;
                            }
                        }
                        cc.lineTo(x, y);
                        x += sliceWidth;
                    }
                    cc.stroke();
                    break;
                }
            case 'column':
                {
                    cc.fillStyle = 'red';
                    var w = cw * 1.0 / bufferLength;
                    for (var i = 0; i < arr.length; i++) {
                        var h = arr[i] / 256 * ch;
                        cc.fillRect(w * i, ch - h, w * 0.6, ch);
                    }
                    break;
                }
            case 'circle':
                {
                    cc.clearRect(0, 0, cw, ch);
                    cc.beginPath();
                    cc.fillStyle = 'rgba(114, 77, 150, 0.24)';
                    cc.fillRect(0, 0, cw, ch);
                    cc.closePath();
                    cc.lineWidth = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        let o = dots[i];
                        let r = arr[i] / 256 * 50;
                        cc.strokeStyle = 'white';
                        var g = cc.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
                        g.addColorStop(0, '#fff');
                        g.addColorStop(1, o.color);
                        cc.beginPath();
                        cc.fillStyle = g;
                        cc.arc(o.x, o.y, r, 0, Math.PI * 2, true);
                        cc.stroke();
                        cc.fill();
                        cc.closePath();
                        // o.color = `rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.random()})`;
                    }
                    break;
                }
        }
    }
    //tools
    function changeVolume(percent) {
        gainNode.gain.value = percent * percent;
    }
    var voice = document.querySelector('#box2 input[type=range]');
    changeVolume(voice.value / voice.max);
    voice.addEventListener('change', function() {
        changeVolume(this.value / this.max);
    });
})();