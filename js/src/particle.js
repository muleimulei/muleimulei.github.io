!function() {
    var balls = [];
    var time = 0;
    function n(n, e, t) {
        return n.getAttribute(e) || t
    }
    function e(n) {
        return document.getElementsByTagName(n)
    }
    function t() {
        var t = e("script")
          , o = t.length
          , i = t[o - 1];
        return {
            l: o,
            z: n(i, "zIndex", -1),
            o: n(i, "opacity", .5),
            c: n(i, "color", "0,0,0"),
            n: n(i, "count", 99)
        }
    }
    function o() {
        c = u.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        a = u.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    function i() {
        l.clearRect(0, 0, c, a);
        if(document.body.clientWidth<400&&balls.length>15){
            balls.splice(Math.floor(Math.random()*balls.length),5);
        }else if(balls.length>30){
            balls.splice(Math.floor(Math.random()*balls.length),10);
        }
        for(var t = 0;t<balls.length;t++){
            if(!balls[t].link&&Math.random()<.7){
                balls[t].link = Math.floor(balls.length*Math.random());
            }
        	l.beginPath();
        	l.fillStyle = balls[t].color,
        	l.arc(balls[t].x,balls[t].y,balls[t].radius,0,Math.PI*2);
        	l.fill();


            l.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${Math.random()+.001})`;
            l.lineWidth = '7px';
            l.strokeStyle = "rgba(0,0,0,0.5)"
            if(balls[t].link&&balls[balls[t].link]&&balls[balls[t].link]){
                l.moveTo(balls[t].x,balls[t].y);
                l.lineTo(balls[balls[t].link].x,balls[balls[t].link].y);
            }
            l.stroke();
            l.fill();
        	l.closePath();
        	if(balls[t].x+balls[t].dx-balls[t].radius<0||balls[t].x+balls[t].dx+balls[t].radius>document.body.clientWidth){
        		balls[t].dx *= -1;
        	}
        	if(balls[t].y+balls[t].dy+balls[t].radius>document.body.clientHeight||balls[t].y-balls[t].radius<0){
        		balls[t].dy *= -1;
        	}
        	balls[t].x +=balls[t].dx;
        	balls[t].y +=balls[t].dy;
            if(Math.random()<.5&&time++>40){
                time=0;
                balls[t].color=`rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.random()})`;
            }        
            
            balls[t].radius += (Math.random()<.5?.01:.02);
            if(balls[t].radius>45){
                var xx = balls[t].x;
                var yy = balls[t].y;
                var radius = balls[t].radius;
                balls.splice(t,1);
                for(var f = 0;f<5;f++){
                    var n = 360*Math.random();
                    balls.push({
                        x: Math.cos(2*Math.PI/360*n)*radius+xx,
                        y: Math.sin(2*Math.PI/360*n)*radius+yy,
                        radius: Math.random()*2+3,
                        dx: Math.random()<.5? Math.random()*1.5:(-1.5)*Math.random(),
                        dy: Math.random()<.5? Math.random()*1.5:(-1.5)*Math.random(),
                        link: balls.length===0|| Math.random()<.5? false : Math.floor(balls.length*Math.random()),
                        color:`rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.random()})`,
                    });
                }
            }
        }

        var n, e, t, o, u, d, x = [w].concat(y);
        y.forEach(function(i) {
            for (i.x += i.xa,
            i.y += i.ya,
            i.xa *= i.x > c || i.x < 0 ? -1 : 1,
            i.ya *= i.y > a || i.y < 0 ? -1 : 1,
            l.fillRect(i.x - .5, i.y - .5, 1, 1),
            e = 0; e < x.length; e++)
                n = x[e],
                i !== n && null !== n.x && null !== n.y && (o = i.x - n.x,
                u = i.y - n.y,
                d = o * o + u * u,
                d < n.max && (n === w && d >= n.max / 2 && (i.x -= .03 * o,
                i.y -= .03 * u),
                t = (n.max - d) / n.max,
                l.beginPath(),
                l.lineWidth = t / 2,
                l.strokeStyle = "rgba(" + m.c + "," + (t + .2) + ")",
                l.moveTo(i.x, i.y),
                l.lineTo(n.x, n.y),
                l.stroke()));
            x.splice(x.indexOf(i), 1)
        }),
        r(i)
    }
    var c, a, u = document.createElement("canvas"), m = t(), d = "c_n" + m.l, l = u.getContext("2d"), r = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(n) {
        window.setTimeout(n, 1e3 / 45)
    }
    , x = Math.random, w = {
        x: null,
        y: null,
        max: 2e4
    };
    u.id = d,
    u.style.cssText = "position:fixed;top:0;left:0;z-index:" + m.z + ";opacity:" + m.o,
    e("body")[0].appendChild(u),
    o(),
    window.onresize = o,
    window.onmousemove = function(n) {
        n = n || window.event,
        w.x = n.clientX,
        w.y = n.clientY
    }
    ,
    window.onmouseout = function() {
        w.x = null,
        w.y = null
    }
    ;
    for (var y = [], s = 0; m.n > s; s++) {
        var f = x() * c
          , h = x() * a
          , g = 2 * x() - 1
          , p = 2 * x() - 1;
        y.push({
            x: f,
            y: h,
            xa: g,
            ya: p,
            max: 6e3
        })
    }
    setTimeout(function() {
        i();
    }, 100);
    document.body.addEventListener('click',function(e){
        if(document.body.clientWidth<400&&balls.length>5) return;
        if(balls.length>40) return;
    	balls.push({
            x: e.clientX,
            y: e.clientY,
            radius: Math.random()*10+20,
            dx: Math.random()<.5? 1.5:-1.5,
            dy: Math.random()<.5? 1.5:-1.5,
            link: balls.length===0|| Math.random()<.5? false : Math.floor(balls.length*Math.random()),
            color:`rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.random()})`,
        });
    },false);
}();
