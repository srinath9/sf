window.touchCheck = function() {
	return Modernizr.touch;
}
window.mobileCheck = function(){
	return $(window).width()<=mobileThreshold;
}
window.landscapeCheck = function(){
	return (window.orientation === 90 || window.orientation === -90);
}
window.mobileThreshold=700;

$(document).ready(function(){

	var originalWidth=841.89;
	var originalHeight=532.29;
	var exportWidth=1754;
	var exportRatio=exportWidth/originalWidth;

	var skrollrInstance=null;
	var s=1;

	var menuIsOpen=false;
	$(".menu-button").click(function(){
		toggleMenu();
	});
	function toggleMenu(){
		if(menuIsOpen){
			closeMenu();
		}else{
			openMenu();
		}
	}
	function openMenu(){
		menuIsOpen=true;
		var wh=$(window).height();
		$(".menu,.menu-button").addClass("menu-is-open");

		$(".menu").css({
			transform:"translate(0,"+(-wh)+"px)"
		}).transition({y:0,duration:400});
		var links=$(".menu-link:not(.mobile-hide)");
		links.each(function(i){
			$(this).css({
				transform:"translate(0,"+(-wh)+"px)"
			}).transition({y:0,duration:400+(70*(links.length-i))});
		})
	}
	function closeMenu(){
		menuIsOpen=false;
		var wh=$(window).height();
		$(".menu-button").removeClass("menu-is-open");

		$(".menu").transition({y:-wh,duration:250,easing:"easeInQuad"},function(){
			$(".menu").removeClass("menu-is-open");
		});
	}
	$(".menu-link a").click(function(){
		if(mobileCheck()){
			closeMenu();
		}
	})


	//preload imagens
	var imagesLoaded=0;
	var requiredImages=$(".layer").length;
	if(touchCheck()){
		requiredImages-=$(".layer[data-no-touch]").length;
	}else{
		requiredImages-=$(".layer[data-only-touch]").length;
	}
	if(mobileCheck()){
		requiredImages=0;
	}
	var doneLoading=false;
	function imageLoaded(){
		imagesLoaded++;
		if(imagesLoaded>=requiredImages && !doneLoading){
			doneLoading=true;
			loadingFinished();
		}
	}

	function loadingFinished(){
		setTimeout(show,150);
	}

	if(touchCheck()){
		$('video').remove();
	}

	//cria preloader
	(function(){
	  var balls=$(".preloader-ball");
	  var n=balls.length;
	  var d=13;
	  var t=0.45;
	  balls.each(function(i){
	    var cur=$(this);
	    var a=(i/n)*(Math.PI*2);
	    cur.css({
	      left:Math.cos(a)*d,
	      top:Math.sin(a)*d,
	      animation:"ball-anim "+t+"s ease-in "+((t/n)*i)+"s infinite"
	    });
	  });
	  $(".preloader").css({
	  	visibility:"inherit"
	  });
	})();
	function show(){
		$(".preloader-container").transition({scale:0,rotate:15,easing:"easeInQuad",duration:400},function(){
			$(".preloader-container").remove();
			
			$(".cover").css({
				transformOrigin:"0 0"
			})
			$(".cover").transition({y:"100%",skewY:0,duration:600,easing:"easeInQuad"},function(){
				$(".cover").remove();
			})
			$("#home .layer").each(function(){
				var cur=$(this);
				var img=cur.children("canvas");
				var p=cur.attr("data-parallax");
				var zoomOutScale=1+(2.4*p);
				img.css({
					transformOrigin:cur.css('transform-origin'),
					transform:"scale("+zoomOutScale+","+zoomOutScale+") translate("+(30*p)+"px,0)"
				});
				img.transition({scale:1,x:0,duration:1400});
			});
		});
	};

	$(".portfolio-item").each(function(){
		var cur=$(this);
		var svg=cur.find(".inline-svg");
		// console.log(cur.attr('data-url'));
		svg.on("load",function(){
			svg.find("#url").text(cur.attr('data-url'));

			var video=cur.attr('data-video');
		})
	});

	//transforma data-x em data-pos-x, pra ser mais especifico blabla
	$(".layer").each(function(){
		$(this).data("pos-x",$(this).data("x"));
		$(this).data("pos-y",$(this).data("y"));
	})

	//setup dos svgs desenhados
	$(".draw").each(function(){
		var cur=$(this);
		cur.attr("data-"+cur.height()+"-bottom","@data-v:0");
		cur.attr("data-80-center","@data-v:1");
		cur.attr("data-v",0);
	})

	//funcao no resize da janela
	function resize(){
		var ww=$(window).width();
		var wh=$(window).height();
		var wp=ww/wh;

		s=ww/exportWidth;

		var h=originalHeight*exportRatio*s;
		var top=(wh-h)/2;
		var left=0;

		if(top>0){
			top=0;
			s=wh/(originalHeight*exportRatio);
			left=(ww-(originalWidth*exportRatio*s))/2;
		}

		$(".menu").attr("data-0","transform:translate3d(0,0px,0)");
		var menuHeight=$(".menu").height();
		var menuThreshold=wh-menuHeight;
		$(".menu").attr("data-top","transform:translate3d(0,"+(-menuThreshold)+"px,0)");


		$(".parallax").each(function(){
			if($(this).data("height")!=null){
				$(this).css({
					height:$(this).data("height")*exportRatio*s
				})
			}
		})
		$(".parallax .layers").css({
			left:left
		})
		$(".garden .layers").css({
			top:0
		})
		$(".garden").css({
			height:wh
		});


		var scrollTo=0;
		if(skrollrInstance!=null){
			scrollTo=skrollrInstance.getScrollTop();
			skrollrInstance.destroy();
			skrollrInstance=null;
		}
		if(ww<mobileThreshold){
			$(".menu").css({
				lineHeight:wh+"px"
			});
		}else{
			$(".menu").css({
				lineHeight:"70px"
			});
		}
		
		var vh=$(".viewport").height()-wh;
		var keyframes=$(".viewport").data("parallax-keyframes");
		if(keyframes!=null){
			$(".viewport").attr("data-"+keyframes,null);
		}
		$(".viewport").attr("data-"+vh,"transform:translate3d(0,"+(-vh)+"px,0)");
		$(".viewport").data("parallax-keyframes",vh);

		$(".layer").each(function(){
			var cur=$(this);
			var onlyTouch=typeof(cur.attr("data-only-touch"))!="undefined";
			var noTouch=typeof(cur.attr("data-no-touch"))!="undefined";

			if(!mobileCheck() && ((!touchCheck() && !onlyTouch) || (touchCheck() && (!noTouch || onlyTouch))) ){
				var keyframes=cur.data("parallax-keyframes")
				if(keyframes!=null){
					for(var i=0;i<keyframes.length;i++){
						cur.attr("data-"+keyframes[i],null);
					}
					cur.data("parallax-keyframes",null);
				}

				var y=cur.data("pos-y");
				var x=cur.data("pos-x");
				var parallax=cur.data("parallax");
				var scale=cur.data("scale");
				if(x!=null){
					cur.css({
						left:x*exportRatio*s
					})
					// console.log(x*exportRatio*s)
				}else{
					x=0;
				}
				if(y!=null){
					cur.css({
						top:y*exportRatio*s
					})
				}else{
					y=0;
				}
				cur.css({
					transform:"translate3d(0,0,0)"
				});


				if(parallax!=null){
					var start=0;

					start=cur.parent().offset().top;
					var offset=cur.parent().data("parallax-offset");
					if(offset==null){
						offset=0;
					}
					var strength=0.5;
					if(cur.parent().data("parallax-strength")!=null){
						strength=cur.parent().data("parallax-strength");
					}
					var parallaxSize=700;
					var max=(parallaxSize-(parallaxSize*parallax))*strength;
					start+=h*offset;
					keyStart=start-wh;
					keyEnd=start+wh;
					var startScale="";
					var endScale="";
					if(scale==true){
						var scaleDeviation=1*strength;
						startScale=" scale(1,"+(1+scaleDeviation)+")";
						endScale=" scale(1,"+(1-scaleDeviation)+")";
					}
					var endPos=max;
					if(keyEnd>vh){
						var excess=keyEnd-vh;
						excess=excess/parallaxSize;
						endPos=max-(max*excess);
						if(scale){
							endScale=" scale(1,"+(1-(scaleDeviation-(scaleDeviation*excess)))+")";
						}

						keyEnd=vh;
					}
					
					cur.css({
						transformOrigin:((ww/2)-(x*exportRatio*s))+"px "+((wh*0.9)-(y*exportRatio*s))+"px"
					})
					

					cur.attr("data-"+keyStart,"transform:translate3d(0,"+(-max)+"px,0)"+startScale);
					cur.attr("data-"+keyEnd,"transform:translate3d(0,"+endPos+"px,0)"+endScale);

					cur.data("parallax-keyframes",[keyStart,keyEnd]);
				}

			
				drawImage(cur);
			}

		});
		
		$(".garden .layers").css({
			top:top
		})
		$(".layer img").css({
			position:"absolute",
			transform:touchCheck()?"":"translate3d(0,0,0)"
		})
		$(".layer.layer-scale>*").css({
			position:"absolute",
			transformOrigin:"0 0",
			transform:"scale("+s+","+s+")"+(touchCheck()?"":" translate3d(0,0,0)")
		});
		$(".layer-no-scale>*").css({
			position:"absolute",
			transformOrigin:"0 0",
			transform:(touchCheck()?"":" translate3d(0,0,0)")
		});

		if(!touchCheck()){
			skrollrInstance = skrollr.init({
				smoothScrolling: true,
				smoothScrollingDuration: 350,
				mobileDeceleration:0.005
			});
			skrollrInstance.setScrollTop(scrollTo,true);
		}else{
			$(".viewport").css({
				position:"relative"
			})

		}
		
	}

	function drawImage(cur){
		var canvas=$("<canvas/>");
		var img=new Image();
		img.src=cur.attr("data-src");
		var context=canvas.get(0).getContext('2d');
		cur.find("canvas").remove();
		img.onload=function(event){
			cur.find("canvas").remove();
			var dpi=window.devicePixelRatio;
			if(typeof(dpi)=="undefined"){
				dpi=1;
			}

			var w=Math.round(img.width*s*dpi);
			var h=Math.round(img.height*s*dpi);
			// if(typeof(cur.attr("data-only-touch"))!="undefined"){
			// 	alert(s);
			// }

			canvas.attr("width",w);
			canvas.attr("height",h);
			canvas.
				appendTo(cur).
				css({
					position:"absolute",
					top:0,
					left:0,
					transform:"translate3d(0,0,0)"
				})
			;
			canvas.css({
				width:Math.round(w/dpi),
				height:Math.round(h/dpi)
			});
			context.drawImage(img,0,0,w,h);
			// if(touchCheck()){
			// 	var parallaxContainer=cur.parent().parent();
			// 	var containerHeight=parallaxContainer.height();
			// 	if(containerHeight<h && containerHeight<$(window).height()){
			// 		parallaxContainer.height(h);
			// 	}
			// }
			imageLoaded();
		}
	}


	var blocked=false;
	var unblockTimer=null;
	function block(){
		if(!blocked){
			blocked=true;
			$("body").css({
				pointerEvents:"none"
			});
		}else{
			clearTimeout(unblockTimer);
		}
		unblockTimer=setTimeout(unblock,50);
	}
	function unblock(){
		blocked=false;
		$("body").css({
			pointerEvents:"auto"
		});
	}

	if(!touchCheck()){
		$(window).resize(function(){
			resize();
		})
	}else{
		$(window).on("orientationchange",function(event){
			resize();
		})
	}
	resize();

	function updateDrawings(){
		$(".draw").each(function(){
			var cur=$(this);
			var lastV=cur.data("last-v");
			var v=cur.attr("data-v");
			if(lastV!=v){
				if(cur.hasClass("line")){
					cur.css({
						transform:"scale("+v+",1)"
					})
				}
				if(cur.data("loaded")){
					var snap=$(this).data("snap");
					if(snap!=null){
						var path=snap.selectAll("path,line,polyline,polygon,ellipse");
						path.forEach(function(i){
							var l=i.attr("data-length");
							if(l==null){
								l=i.getTotalLength();
								i.attr("data-length",l);
							}
							if(typeof(l)=="undefined"){
								l=1000;
							}
							

							i.attr({strokeDasharray:(v*l)+","+l});
						})
					}
					cur.data("last-v",v);
				}
			}
		});
		requestAnimationFrame(updateDrawings);
	}
	function updateVideos(){
		$(".portfolio-item").each(function(){
			var cur=$(this);
			var videoWasVisible=cur.data("video-visible");
			var v=cur.attr("data-v");
			var videoVisible=false;
			if(v>0.65){
				videoVisible=true;
			}
			if(videoVisible!=videoWasVisible){
				var video=cur.find(".portfolio-item-video");
				video.css({
					display:videoVisible?"block":"none"
				});
				if(videoVisible){
					video.get(0).play();
				}else{
					video.get(0).pause();
				}
			}
			cur.data("video-visible",videoVisible);
		});
		requestAnimationFrame(updateVideos);
	}

	if(!touchCheck()){
		updateDrawings();
		updateVideos();
	}else{

	}

})

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1500);
        return false;
      }
    }
  });
});