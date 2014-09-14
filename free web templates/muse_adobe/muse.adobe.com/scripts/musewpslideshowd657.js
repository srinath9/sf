/*
 ADOBE CONFIDENTIAL
 ___________________

 Copyright 2012 Adobe Systems Incorporated
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
(function(a,b,c,d,f){c.Plugins.SlideShowCaptions={defaultOptions:{captionClassName:"SSSlideCaption"},initialize:function(b,c){var d=this;a.extend(c,a.extend({},d.defaultOptions,c));b.bind("attach-behavior",function(){d._attachBehavior(b)})},_attachBehavior:function(a){var b=a._findWidgetElements("."+a.options.captionClassName);if(b.length)a._sscpCaptions=b,b.css("display","none"),a.slides.bind("wp-panel-show",function(a,c){b.eq(c.panelIndex).css("display","block")}),a.slides.bind("wp-panel-hide",
function(a,c){b.eq(c.panelIndex).css("display","none")}),a.bind("ready",function(){b.eq(a.slides.activeIndex).css("display","block")})}};c.Plugins.SlideShowLabel={defaultOptions:{labelClassName:"SlideShowLabel"},initialize:function(b,c){var d=this;a.extend(c,a.extend({},d.defaultOptions,c));b.bind("attach-behavior",function(){d._attachBehavior(b)})},_attachBehavior:function(a){var b=this,c=a._findWidgetElements("."+a.options.labelClassName);if(c.length)a._$sslpLabels=c,a.slides.bind("wp-panel-show",
function(){b._updateLabels(a)}),a.bind("ready",function(){b._updateLabels(a)})},_findAllTextNodes:function(a,b){b=b||[];switch(a.nodeType){case 3:b.push(a);break;case 1:if(a.nodeName.toLowerCase()!=="script")for(var c=a.firstChild;c;)this._findAllTextNodes(c,b),c=c.nextSibling}a.nextSibling&&this._findAllTextNodes(a.nextSibling,b);return b},_updateLabels:function(a){var b=this,c=a.slides,d=c.activeIndex+1,f=c.$element.length;a._$sslpLabels.each(function(){for(var a=b._findAllTextNodes(this),c=a.length,
g=0,h=function(a){return++g===1?d:g===2?f:a},p=0;p<c;p++){var n=a[p],s=n.nodeValue,t=s.replace(/\d+/g,h);if(t!==s)n.nodeValue=t}})}};c.Plugins.Lightbox={defaultOptions:{lightboxPartsSelector:".PamphletLightboxPart",closeBtnClassName:"PamphletCloseButton"},initialize:function(b,c){var d=this;a.extend(c,a.extend({},d.defaultOptions,c));b._sslbpAutoPlay=c.autoPlay;c.autoPlay=!1;b.bind("before-transform-markup",function(){d._beforeTransformMarkup(b)});b.bind("attach-behavior",function(){d._attachBehavior(b)})},
_beforeTransformMarkup:function(a){a._sslbpShownInitially=!0;var b=a._findWidgetElements("."+a.options.slideClassName);if(b.filter(":hidden").length==0)a._sslbpSlideOffset=b.offset();else{a._sslbpShownInitially=!1;var d=a._findWidgetElements("."+a.options.viewClassName);a._sslbpSlideOffset={top:c.Utils.getCSSIntValue(d,"top")+c.Utils.getCSSIntValue(b,"top"),left:c.Utils.getCSSIntValue(d,"left")+c.Utils.getCSSIntValue(b,"left")}}},_attachBehavior:function(a){var b=this,d=a.options;a.tabs.$element.bind(d.event,
function(){b._openLightbox(a)});a.slides.bind("wp-panel-before-show",function(){b._openLightbox(a)});if(c.Browser.Features.Touch&&d.elastic==="fullScreen")a.slides.$element.not("a[href]").on("click",function(){b._closeLightbox(a)});a._$sslbpCloseBtn=a._findWidgetElements("."+d.closeBtnClassName).bind("click",function(){b._closeLightbox(a)});b._initializeMarkup(a)},_initializeMarkup:function(b){var d=b.options,f=d.elastic!=="off",i=b._findWidgetElements("."+d.viewClassName),j=b.slides.$element,k=i,
m=b._sslbpSlideOffset,o=j.outerWidth(),q=j.outerHeight(),p=b._findWidgetElements(d.lightboxPartsSelector),k=a(i[0].parentNode).filter("."+d.clipClassName);k.length===0&&(k=i);p.each(function(d,l){var i=a(l);if(i.css("position")!=="fixed"){var j=b._sslbpShownInitially?i.offset():{top:c.Utils.getCSSIntValue(i,"top"),left:c.Utils.getCSSIntValue(i,"left")},k={top:j.top-m.top};if(!f)k.left=j.left-m.left;i.css(k)}}).addClass("popup_element");var n=a('<div id="'+(i.attr("id")||"")+'"></div>').css({left:0,
top:0,width:"auto",height:"auto",padding:0,margin:0,zIndex:"auto"}),s;f&&(s=a("<div/>"),d.elastic==="fullScreen"?s.addClass("fullscreen"):d.elastic==="fullWidth"&&s.addClass("fullwidth"),s.css({paddingLeft:i.css("padding-left"),paddingRight:i.css("padding-right"),paddingTop:i.css("padding-top"),paddingBottom:i.css("padding-bottom"),borderColor:i.css("border-left-color"),borderStyle:i.css("border-left-style"),borderLeftWidth:i.css("border-left-width"),borderRightWidth:i.css("border-right-width"),borderTopWidth:i.css("border-top-width"),
borderBottomWidth:i.css("border-bottom-width")}),s.append(k),s.append(p),n.css({border:"none"}));i.removeAttr("id");var t=a("<div class='overlayWedge'></div>").insertBefore(j[0]);n.append(i.children().not("."+d.slideClassName));i.append(j);n.css({visibility:"hidden"}).appendTo(document.body);var i=n.outerWidth(),v=n.outerHeight();n.detach().css({visibility:""});k.css({position:d.elastic==="fullScreen"?"relative":"absolute",padding:0,left:d.elastic==="fullWidth"?"":0,top:0,borderWidth:0,background:"none"});
d.elastic!=="fullScreen"&&k.css({width:o,height:q});d.transitionStyle==="fading"&&j.css({position:"absolute",left:0,top:0});var w;if(b._fstpPositionSlides||b._csspResizeFullScreenImages)w=function(a,c){b._fstpPositionSlides&&b._fstpPositionSlides(a,c);b._csspResizeFullScreenImages&&b._csspResizeFullScreenImages(b,b.slides.$element,d.heroFitting)};o=-o/2;q=-q/2;k=a("<div class='LightboxContent'></div>").css({position:"absolute"}).append(f?s:k);f||k.append(p);k.museOverlay({autoOpen:!1,offsetLeft:o,
offsetTop:q,overlayExtraWidth:i,overlayExtraHeight:v,$overlaySlice:n,$overlayWedge:t,onClose:function(){b.stop();b.slides.hidePanel(b.slides.activeElement)},$elasticContent:s,resizeSlidesFn:w});if(a.browser.msie&&a.browser.version<9){var y=n[0];c.Utils.needPIE(function(){PIE.detach(y);PIE.attach(y)})}b._$sslbpOverlay=k;b._csspIsImageSlideShow||j.each(function(){c.Utils.detachIframesAndObjectsToPauseMedia(a(this))})},_openLightbox:function(b){var d=b._$sslbpOverlay;d.data("museOverlay").isOpen||(d.museOverlay("open"),
b._sslbpAutoPlay&&b.play());b._csspIsImageSlideShow||c.Utils.attachIframesAndObjectsToResumeMedia(a(b.slides.activeElement))},_closeLightbox:function(b){b._$sslbpOverlay.data("museOverlay").isOpen&&(b._$sslbpOverlay.museOverlay("close"),b._csspIsImageSlideShow||c.Utils.detachIframesAndObjectsToPauseMedia(a(b.slides.activeElement)))}};c.Plugins.ContentSlideShow={defaultOptions:{displayInterval:3E3,transitionDuration:500,transitionStyle:"fading",contentLayout_runtime:"stack",event:"click",deactivationEvent:"none",
hideAllContentsFirst:!1,shuffle:!1,resumeAutoplay:!1,resumeAutoplayInterval:3E3,elastic:"off"},slideShowOverrides:{slideshowClassName:"SlideShowWidget",viewClassName:"SlideShowContentPanel",slideClassName:"SSSlide",slideLinksClassName:"SSSlideLinks",slideLinkClassName:"SSSlideLink",slideLinkActiveClassName:"SSSlideLinkSelected",slideCountClassName:"SSSlideCount",firstBtnClassName:"SSFirstButton",lastBtnClassName:"SSLastButton",prevBtnClassName:"SSPreviousButton",nextBtnClassName:"SSNextButton",playBtnClassName:"SSPlayButton",
stopBtnClassName:"SSStopButton",closeBtnClassName:"SSCloseButton",heroFitting:"fitContentProportionally",thumbFitting:"fillFrameProportionally",lightboxPartsSelector:".SlideShowCaptionPanel, .SSFirstButton, .SSPreviousButton, .SSNextButton, .SSLastButton, .SlideShowLabel, .SSCloseButton",lightboxEnabled_runtime:!1},compositionOverrides:{slideshowClassName:"PamphletWidget",viewClassName:"ContainerGroup",slideClassName:"Container",slideLinkClassName:"Thumb",slideLinkActiveClassName:"PamphletThumbSelected",
prevBtnClassName:"PamphletPrevButton",nextBtnClassName:"PamphletNextButton",closeBtnClassName:"PamphletCloseButton",lightboxPartsSelector:".PamphletLightboxPart"},initialize:function(d,f){var h=this,i=d.$element.hasClass("SlideShowWidget"),j=i?h.slideShowOverrides:h.compositionOverrides;d._csspIsImageSlideShow=i;this._restartTimer=0;a.extend(f,a.extend({},h.defaultOptions,j,f));if(f.hideAllContentsFirst)f.defaultIndex=-1;if(f.lightboxEnabled_runtime)f.contentLayout_runtime="lightbox";if(f.elastic!==
"off")d._csspPositionImage=h._positionImage;i&&(b.Widget.ContentSlideShow.slideImageIncludePlugin.initialize(d,f),c.Plugins.SlideShowLabel.initialize(d,f),c.Plugins.SlideShowCaptions.initialize(d,f));f.transitionStyle=="fading"?b.Widget.ContentSlideShow.fadingTransitionPlugin.initialize(d,f):c.Browser.Features.Touch&&c.Browser.Features.Touch.Start=="touchstart"&&f.enableSwipe===!0?b.Widget.ContentSlideShow.swipeTransitionPlugin.initialize(d,f):b.Widget.ContentSlideShow.filmstripTransitionPlugin.initialize(d,
f);b.Widget.ContentSlideShow.alignPartsToPagePlugin.initialize(d,f);if(f.contentLayout_runtime==="lightbox"){if(f.elastic!=="off")d._csspResizeFullScreenImages=h._resizeFullScreenImages;c.Plugins.Lightbox.initialize(d,f)}f.shuffle===!0&&b.Widget.ContentSlideShow.shufflePlayPlugin.initialize(d,f);d.bind("transform-markup",function(){h._transformMarkup(d)});d.bind("attach-behavior",function(){h._attachBehavior(d)})},_transformMarkup:function(b){var d=b.options,f=b._findWidgetElements("."+d.viewClassName);
if(d.transitionStyle!=="fading"){var i=a('<div class="'+d.clipClassName+'"/>'),j=b._findWidgetElements("."+d.slideClassName),b=j.outerWidth(),j=j.outerHeight();if(d.elastic==="fullScreen")i.addClass("fullscreen");else{var k={position:"relative",width:b+"px",height:j+"px",overflow:"hidden"},m=f.css("position");if(m==="absolute")k.position=m,k.left=f.css("left"),k.top=f.css("top");else if(m==="fixed"){var o=c.Utils.getStyleSheetRuleById(c.Utils.getPageStyleSheet(),f.get(0).id);k.position=m;k.left=c.Utils.getRuleProperty(o,
"left");k.top=c.Utils.getRuleProperty(o,"top");k.bottom=c.Utils.getRuleProperty(o,"bottom");k.right=c.Utils.getRuleProperty(o,"right")}i.css(k)}d.elastic!=="fullScreen"&&f.css({width:b+"px",height:j+"px"});f.css({position:"relative",top:"0",left:"0",margin:"0",overflow:"hidden"}).wrap(i)}else m=f.css("position"),d.elastic!=="fullScreen"&&m!=="fixed"&&f.css({width:"0",height:"0"})},_attachBehavior:function(b){var f=this,h=b.options,i=b.tabs,j=b.slides.$element,k=h.slideLinkActiveClassName,m=h.contentLayout_runtime===
"lightbox";if(h.elastic!=="off"&&(f._resizeFullScreenImages(b,b.slides.$element,h.heroFitting),!m))a(d).on("orientationchange resize",function(){f._resizeFullScreenImages(b,b.slides.$element,h.heroFitting)});if(m)h.hideAllContentsFirst=!0;if(i){var o=i.$element;h.event==="mouseover"&&o.bind("mouseenter",function(){var b=a(this);b.data("enter",!0);i.selectTab(o.index(b))});h.deactivationEvent==="mouseout_trigger"?o.bind("mouseleave",function(){var c=a(this);c.data("enter",!1);b.slides.hidePanel(o.index(c))}):
h.deactivationEvent==="mouseout_both"&&(o.bind("mouseleave",function(){var c=a(this),d=o.index(c),f=j.eq(d);c.data("enter",!1);c.data("setTimeout")||(c.data("setTimeout",!0),setTimeout(function(){!f.data("enter")&&!c.data("enter")&&b.slides.hidePanel(d);c.data("setTimeout",!1)},300))}),j.bind("mouseenter",function(){a(this).data("enter",!0)}),j.bind("mouseleave",function(){var c=a(this),d=j.index(c),f=o.eq(d);c.data("enter",!1);f.data("setTimeout")||(f.data("setTimeout",!0),setTimeout(function(){!c.data("enter")&&
!f.data("enter")&&b.slides.hidePanel(d);f.data("setTimeout",!1)},300))}))}i&&k&&(h.hideAllContentsFirst||i.$element.eq(i.options.defaultIndex).addClass(k),b.slides.bind("wp-panel-show",function(a,b){i.$element.eq(b.panelIndex).addClass(k)}).bind("wp-panel-hide",function(a,b){i.$element.eq(b.panelIndex).removeClass(k)}));f._attachStopOnClickHandler(b,b.$firstBtn);f._attachStopOnClickHandler(b,b.$lastBtn);f._attachStopOnClickHandler(b,b.$previousBtn);f._attachStopOnClickHandler(b,b.$nextBtn);f._attachStopOnClickHandler(b,
b.$playBtn);f._attachStopOnClickHandler(b,b.$stopBtn);f._attachStopOnClickHandler(b,b.$closeBtn);i&&!m&&f._attachStopOnClickHandler(b,i.$element);b._csspIsImageSlideShow||(b.slides.bind("wp-panel-hide",function(b,d){c.Utils.detachIframesAndObjectsToPauseMedia(a(d.panel))}).bind("wp-panel-show",function(b,d){c.Utils.attachIframesAndObjectsToResumeMedia(a(d.panel))}),j.each(function(){(this!=b.slides.activeElement||h.hideAllContentsFirst)&&c.Utils.detachIframesAndObjectsToPauseMedia(a(this))}))},_startRestartTimer:function(a){this._stopRestartTimer();
this._restartTimer=setTimeout(function(){a.play(!0)},a.options.resumeAutoplayInterval+a.options.transitionDuration)},_stopRestartTimer:function(){this._restartTimer&&clearTimeout(this._restartTimer);this._restartTimer=0},_attachStopOnClickHandler:function(a,b){var c=this;b.bind(a.options.event==="click"?"click":"mouseover",function(){a.stop();(a.options.autoPlay||a._sslbpAutoPlay)&&a.options.resumeAutoplay&&0<a.options.resumeAutoplayInterval&&c._startRestartTimer(a)})},_hitTest:function(a,b){b.outerWidth()===
0&&(b=b.children(".popup_anchor").children(".popup_element").eq(0));var c=b.offset(),c={x:c.left,y:c.top,width:b.outerWidth(),height:b.outerHeight()};return a.pageX>=c.x&&a.pageX<=c.x+c.width&&a.pageY>=c.y&&a.pageY<=c.y+c.height},_layoutThumbs:function(b){var d=b.options,f=c.Utils.getStyleValue;b._findWidgetElements("."+d.slideLinksClassName).each(function(){var b=a(this).find("."+d.slideLinkClassName);firstThumb=b[0];tWidth=f(firstThumb,"width");tHeight=f(firstThumb,"height");gapH=f(firstThumb,"margin-right");
gapV=f(firstThumb,"margin-bottom");borderL=f(firstThumb,"border-left-width");borderR=f(firstThumb,"border-right-width");borderT=f(firstThumb,"border-top-width");borderB=f(firstThumb,"border-bottom-width");gWidth=f(this,"width");paddingL=f(this,"padding-left");paddingT=f(this,"padding-top");maxNumThumb=Math.floor((gWidth+gapH)/(tWidth+borderL+borderR+gapH));gStyle=this.runtimeStyle?this.runtimeStyle:this.style;numRow=Math.ceil(b.length/maxNumThumb);firstRowNum=b.length<maxNumThumb?b.length:maxNumThumb;
leftPos=leftMostPos=c.Utils.pixelRound((gWidth-(tWidth+borderL+borderR)*firstRowNum-gapH*(firstRowNum-1))/2)+paddingL;topPos=paddingT;numInRow=1;gStyle.height=(tHeight+borderT+borderB)*numRow+gapV*(numRow-1)+"px";b.each(function(){numInRow>firstRowNum&&(numInRow=1,leftPos=leftMostPos,topPos+=tHeight+borderT+borderB+gapV);numInRow++>1&&(leftPos+=tWidth+borderL+borderR+gapH);var a=this.runtimeStyle?this.runtimeStyle:this.style;a.marginRight="0px";a.marginBottom="0px";a.left=leftPos+"px";a.top=topPos+
"px"})})},_resizeFullScreenImages:function(b,c,d){c.each(function(){a(this).find("img").each(function(){this.complete&&!a(this).hasClass(b.options.imageIncludeClassName)&&b._csspPositionImage(this,d,b.options.elastic)})})},_setupImagePositioning:function(b,c,d,f){var j=this;c.each(function(){a(this).find("img").each(function(){var b=this;b.complete?j._positionImage(b,d,f):a(b).load(function(){j._positionImage(b,d,f)})})})},_positionImage:function(b,l,h,i,j){var k=a(d),m=b.runtimeStyle?b.runtimeStyle:
b.style,o=h==="fullWidth"||h==="fullScreen",q=h==="fullHeight"||h==="fullScreen",p=l=="fitContentProportionally";$img=a(b);o=o?d.innerWidth?d.innerWidth:k.width():p?$img.data("width"):$img.parent().width();k=q?d.innerHeight?d.innerHeight:k.height():p?$img.data("height"):$img.parent().height();i=i!==f?i:c.Utils.getNaturalWidth(b);b=j!==f?j:c.Utils.getNaturalHeight(b);h!=="off"&&(i===0&&(i=$img.data("imageWidth")),b===0&&(b=$img.data("imageHeight")));if(o==i&&k==b)m.marginTop="0px",m.marginLeft="0px";
else{q=i;j=b;if(l=="fillFrameProportionally"){if(h!=="off"||i>o&&b>k)l=i/o,h=b/k,l<h?(j=b/l,q=o):(j=k,q=i/h)}else if(l=="fitContentProportionally"&&(h!=="off"||i>o||b>k))l=i/o,h=b/k,l>h?(j=b/l,q=i/l):(j=b/h,q=i/h);m.width=c.Utils.pixelRound(q)+"px";m.height=c.Utils.pixelRound(j)+"px";m.marginTop=c.Utils.pixelRound((k-j)/2)+"px";m.marginLeft=c.Utils.pixelRound((o-q)/2)+"px"}}};a.extend(b.Widget.ContentSlideShow.slideImageIncludePlugin.defaultOptions,{imageIncludeClassName:"ImageInclude",slideLoadingClassName:"SSSlideLoading"});
b.Widget.ContentSlideShow.prototype.defaultPlugins=[c.Plugins.ContentSlideShow];b.Widget.ContentSlideShow.prototype._getAjaxSrcForImage=function(b){for(var c=a(d).data("ResolutionManager").getDataSrcAttrName(),f=c.length,i,j=0;j<f;j++)if((i=b.data(c[j]))&&i.length)return i;return b.data("src")}})(jQuery,WebPro,Muse,window);
;(function(){if(!("undefined"==typeof Muse||"undefined"==typeof Muse.assets)){var a=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]==b)return c;return-1}(Muse.assets.required,"musewpslideshow.html");if(-1!=a){Muse.assets.required.splice(a,1);for(var a=document.getElementsByTagName("meta"),b=0,c=a.length;b<c;b++){var d=a[b];if("generator"==d.getAttribute("name")){"2014.1.1.276"!=d.getAttribute("content")&&Muse.assets.outOfDate.push("musewpslideshow.html");break}}}}})();
