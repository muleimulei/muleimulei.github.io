!function(){
	var wrapper = $('div.site-author.motion-element > div');
	var pic = $('img',wrapper);

	wrapper.hover(function(){
		pic.css({
			"transform": "rotate3d(0,1,0,180deg) scale(.5)"
		});
	},function(){
		pic.css({
			"transform": ""
		});
	})

	// pic.hover(function(){
	// 	$(this).css({
	// 		"transform": "rotate3d(0,1,0,180deg) scale(.5)"
	// 	});
	// 	console.log('hover')
	// },function(){
	// 	$(this).css({
	// 		"transform": ""
	// 	});
	// 	console.log('out')
	// });
}()