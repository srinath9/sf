$(document).ready(function(){
	$(".inline-svg").each(function(){
		var cur=$(this);
		var w=cur.data("width");
		var h=cur.data("height");
		cur.css({
			display:"inline-block",
			verticalAlign:"middle",
			lineHeight:0
		});
		if(typeof(w)=="undefined"){
			w=cur.width();
		}
		if(typeof(h)=="undefined"){
			h=cur.height();
		}
		cur.css({
			width:w,
			height:h
		});

		var svg=Snap(w,h);

		var setW=w!=0;
		var setH=h!=0;
		Snap.load(cur.data("src"),function(f){
			svg.append(f);
			var container=cur.children("svg");
			var loaded=container.children("svg");
			var originalW=parseFloat(loaded.attr("width"));
			var originalH=parseFloat(loaded.attr("height"));
			var viewBox=loaded[0].getAttribute('viewBox').split(" ");
			if(isNaN(originalW)){
				originalW=parseFloat(viewBox[2]);
			}
			if(isNaN(originalH)){
				originalH=parseFloat(viewBox[3]);
			}
			if(!setW){
				w=originalW;
				container.attr("width",w);
			}else{
				loaded.attr("width",w);
				if(!setH){
					h=originalH*(w/originalW);
					container.attr("height",h);
					setH=true;
				}
			}
			if(!setH){
				h=originalH;
				container.attr("height",h);
			}else{
				loaded.attr("height",h);
				if(!setW){
					w=originalW*(h/originalH);
					container.attr("width",w);
					loaded.attr("width",w);
				}
			}

			cur.css({
				width:w,
				height:h
			})

			cur.data("loaded",true)
			cur.trigger("load");
		})

		svg.appendTo(cur.get(0));
		cur.data("snap",svg);
	})
})