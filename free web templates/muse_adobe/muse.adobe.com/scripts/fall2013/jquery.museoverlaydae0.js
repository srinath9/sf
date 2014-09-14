/*
 ADOBE CONFIDENTIAL
 ___________________

 Copyright 2011 Adobe Systems Incorporated
 All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and may be covered by U.S. and Foreign Patents,
 patents in process, and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
*/
(function(a){a.fn.museOverlay=function(b){var c=a.extend({autoOpen:!0,offsetLeft:0,offsetTop:0,$overlaySlice:a(),$overlayWedge:a(),duration:300,overlayExtraWidth:0,overlayExtraHeight:0,$fullScreenContent:a()},b);return this.each(function(){var d=a(this).data("museOverlay");if(d&&d[b]!==void 0)return d[b].apply(this,Array.prototype.slice.call(arguments,1));var f=a("<div></div>").appendTo("body").css({position:"absolute",top:0,left:0,zIndex:100001}).hide(),h=a("<div></div>").append(c.$overlaySlice).appendTo(f).css({position:"absolute",
top:0,left:0}),k=a(this).css({position:"absolute",left:0,top:0}).appendTo(f),g=a(window),j,i,m=null,l=c.$fullScreenContent,p=l.length?parseInt(l.css("padding-left"))+parseInt(l.css("padding-right"))+parseInt(l.css("border-left-width"))+parseInt(l.css("border-right-width")):0,q=l.length?parseInt(l.css("padding-top"))+parseInt(l.css("padding-bottom"))+parseInt(l.css("border-top-width"))+parseInt(l.css("border-bottom-width")):0,n={isOpen:!1,open:function(){if(!n.isOpen)j=g.width(),i=g.height(),n.positionContent(j,
i),f.show(),h.bind("click",n.close),h.css({opacity:0}).stop(!0),k.css({opacity:0}).stop(!0),h.bind("click",n.close).animate({opacity:0.99},{queue:!1,duration:c.duration,complete:function(){h.css({opacity:""});k.animate({opacity:1},{queue:!1,duration:c.duration,complete:function(){k.css({opacity:""});n.applyPageDimensions()}})}}),a(document).bind("keydown",n.onKeyDown),n.doLayout(),n.isOpen=!0,g.bind("resize",n.onWindowResize)},close:function(){a(".Container",k).each(function(){Muse.Utils.detachIframesAndObjectsToPauseMedia(a(this))});
h.unbind("click",n.close);g.unbind("resize",n.onWindowResize);a(document).unbind("keydown",n.onKeyDown);if(c.onClose)c.onClose();h.css({opacity:0.99}).stop(!0);k.css({opacity:0.99}).stop(!0);k.animate({opacity:0},{queue:!1,duration:c.duration,complete:function(){h.animate({opacity:0},{queue:!1,duration:c.duration,complete:function(){f.hide();k.css({opacity:""});h.css({opacity:""})}})}});n.isOpen=!1},onKeyDown:function(a){a.keyCode===27&&n.close()},onWindowResize:function(){var a=g.width(),b=g.height();
(j!=a||i!=b)&&m==null&&(m=setTimeout(function(){n.doLayout();j=g.width();i=g.height();n.positionContent(j,i);m=null},10))},doLayout:function(){f.css({width:0,height:0});c.$overlayWedge.css({width:0,height:0});n.applyPageDimensions()},applyPageDimensions:function(){var b=a(document),d=b.width(),b=b.height(),h=document.documentElement||document.body;h.clientWidth!=h.offsetWidth&&(d=h.scrollWidth-1);h.clientHeight!=h.offsetHeight&&(b=h.scrollHeight-1);f.css({width:d,height:b});c.$overlayWedge.css({width:d-
c.overlayExtraWidth,height:b-c.overlayExtraHeight})},positionContent:function(a,b){var d=g.scrollLeft()+Math.max(0,a/2+c.offsetLeft),h=g.scrollTop()+Math.max(0,b/2+c.offsetTop);k.css({top:h,left:d});d=a-p;h=b-q;l.length&&(l.width(d),l.height(h));c.resizeSlidesFn&&c.resizeSlidesFn(d,h)}};k.data("museOverlay",n);c.autoShow&&n.open()})}})(jQuery);
