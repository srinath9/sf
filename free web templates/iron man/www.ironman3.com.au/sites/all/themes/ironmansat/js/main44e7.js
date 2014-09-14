(function ($) {



if (typeof console == "undefined")
    var console = { log: function() {} };

jQuery.easing.def = "easeInOutQuad";
var scrollAnimDuration = 1500;


var deviceModeDescription = {
	0: 'Undefined device type',
	1: 'Desktop or landscape tablet',
	2: 'Landscape retina tablet',
	3: 'Portrait tablet',
	4: 'Portrait retina tablet',
	5: 'Mobile (portrait and landscape)',
	6: 'Mobile (landscape only)',
	7: 'Mobile (retina landscape)',
	8: 'Mobile (retina portrait)'
};

$(function () {

	$('.btn-login-flyout').click(function() {
		if(checkDeviceMode() <= 4) {
			$('section#flyout article .canScroll').jScrollPane();
		}
	});

	$('.btn-register-flyout').click(function() {
		if(checkDeviceMode() <= 4) {
			$('section#flyout article .canScroll').jScrollPane();
		}
	});
	/* Run this innerWidth code block first */
	var needDeviceCheck = true;

	var deviceMode = 0;
	var isiPad = false;

	var sectionPositions = {};
	var sectionIndex = [];
	//console.log(sectionPositions);
	/*
	1: desktop, landscape tablet
	2: landscape retina tablet
	3: portrait tablet
	4: portrait retina tablet
	5: mobile (portrait and landscape)
	6: mobile (landscape only)
	7: mobile (retina landscape)
	8: mobile (retina portrait)
	*/

	/*

	HTML width / pixel ratio results:

	iPhone 3GS (port) - 320 / 1
	iPhone 3GS (land) - 480 / 1
	iPhone 4S (port) - 320 / 2
	iPhone 4S (land) - 480 / 2
	iPhone 5 (port) - 320 / 2
	iPhone 5 (land) - 568 / 2
	iPad2 (port) - 768 / 1
	iPad2 (land) - 1024 / 1
	iPad 3rd Gen (land) - 1024 / 2
	iPad 3rd Gen (port) - 768 / 2
	Motorola Xoom (land) - 1280 / 1
	Motorola Xoom (port) - 800 / 1
	Samsung Galaxy S2 (port) - 320 / 1.5
	Samsung Galaxy S2 (land) - 533 / 1.5
	Samsung Galaxy Tab 10.1 (land) - 1280 / 1
	Samsung Galaxy Tab 10.1 (port) - 800 / 1

	Desktop Chrome (resized for desktop viewing) - 1407 / 1
	Desktop Chrome (resized for mobile viewing) - 400 / 1



	CSS breakpoints:

	Desktop/landscape tablet (default, no MQ)
	Portrait tablet (max-width 800px)
	Landscape retina tablet (min-width 767, pixel ratio 2)
	Portrait retina tablet (max-width 800, pixel ratio 2)
	Mobile, portrait and landscape (max-width 640px)
	Mobile, landscape only (max-width 640px, orientation: landscape)
	Mobile, retina portrait (max-width 640px, pixel-ratio 2, orientation: portrait)
	Mobile, retina landscape (max-width 640px, pixel-ratio 2, orientation: landscape)

	*/

	var openedLink = $.address.value().substring(1,$.address.value().length);
	if (openedLink != '') {
		if (checkDeviceMode() <= 4) {
			$('html,body').scrollLeft($('#'+openedLink).offset().left - parseInt($('div#wrapper').css('padding-left')));
		} else {
			$('section').hide();
			if (openedLink != 'home') {
				$('#hero-0').hide();
			}
			$('section#'+openedLink).show();
			changeMainNav(openedLink);
		}
	} else {
		window.scrollTo(0, 0);
	}

	$(window).bind("resize", function() {
		needDeviceCheck = true;
		switchVerticalScroll();
	});

	function switchVerticalScroll() {
		if (checkDeviceMode() <= 2) {
			if ($(window).innerHeight() < 642) {
				$('header').css({'position': 'absolute'});
				$('div#wrapper').css({'top': 0, 'margin-top': 0});
				$('#vip-register .form-container, #legal .tab .canScroll').css({'height': 550-(642-$(window).innerHeight())});
				$('#vip-register .form-container, #legal .tab .canScroll').jScrollPane();
			} else {
				$('header').css({'position': 'fixed'});
				$('div#wrapper').css({'top': '50%', 'margin-top': '-321px'});
				$('#vip-register .form-container, #legal .tab .canScroll').css({'padding-bottom': 0});
				$('#vip-register .form-container, #legal .tab .canScroll').jScrollPane();
			}
		} else {
			$('div#wrapper').css({'top':0, 'margin-top': 'inherit'});
		}
	}

	switchVerticalScroll();

	function shiftOrientationLayout(media) {
		console.log('shiftOrientationLayout');
		checkDeviceMode();
		if(media.matches) {
			if ($('#flyout').css('left') == '160px') {
				$('#flyout').css({top:75, left:'50%'});
			} else if ($('#flyout').css('left') == '-135px') {
				$('#flyout').css({top:-222, left:'50%'});
				$('.btn-close-flyout').css({top:310});
			}
		} else {
			// Changed to landscape
			if (parseInt($('#flyout').css('top')) >= 75) {
				console.log('legal panel or register form open?');
				$('#flyout').css({top:'auto', left:160});
			} else if (parseInt($('#flyout').css('top')) <= -222) {
				console.log('login panel open?');
				$('#flyout').css({top:'auto', left:-135});
				$('.btn-close-flyout').css({top:10});
			}
		}
  	}

  	var ie = (function(){
		var undef,
	        v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');

	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	    return v > 4 ? v : undef;
	}());

	if (ie == undefined || ie >= 10) {
		var mql = window.matchMedia("(orientation: portrait)");

       	// Add a media query change listener
    	mql.addListener(function(m) {
            needDeviceCheck = true;
            checkDeviceMode();
            shiftOrientationLayout(m);
        });
	}

	function checkDeviceMode() {
		if (needDeviceCheck == true) {
			resetDeviceMode();
			needDeviceCheck = false;
			recalculateLayout();

			if (typeof ga !== "undefined" && ga != null) {
				ga.log('DEVICE_MODE_CHANGE', deviceModeDescription[deviceMode]);
			}
		}
		return deviceMode;
	}

	resetDeviceMode();

	//Generic analytics event
	$('* [im3_analytics_event]').click(function() {
		if ($(this).attr('im3_analytics_capture')) {
			additional_data = $(this).attr($(this).attr('im3_analytics_capture'));
		} else {
			additional_data = '';
		}
		if (typeof ga !== "undefined" && ga != null) {
			ga.log($(this).attr('im3_analytics_event'), additional_data);
		}
		return true;
	});

	twttr.ready(function (twttr) {
	    twttr.events.bind('click', function(event) {
	    	if (typeof ga !== "undefined" && ga != null) {
			    ga.log('TWEET_CLICK');
			}
		});
	});
	if (checkDeviceMode() <=4) {
		$.ajax({
	    	type: 'GET',
	        url: theme_path+'/img/hero-images/hero-0-anim.jpg',
	        data: {},
	        success: function(response) {
	        	var image = $('<img></img>');
				image.attr('src', theme_path+'/img/hero-images/hero-0-anim.jpg');
	            $('#hero-0').html(image);
	           	$('#hero-0 img').fadeOut(2000).fadeIn(2000, animateHero0);
	        }
	    });

		function animateHero0(){
			$('#hero-0 img').delay(50)
			.animate({opacity:1}, 2000)
			.delay(1200)
			.animate({opacity:0.4}, 2000, animateHero0);
	   	};

	   	$.ajax({
	    	type: 'GET',
	        url: theme_path+'/img/hero-images/hero-1-anim.jpg',
	        data: {},
	        success: function(response) {
	        	var image = $('<img></img>');
				image.attr('src', theme_path+'/img/hero-images/hero-1-anim.jpg');
	            $('#hero-1').html(image);
	           	$('#hero-1 img').fadeOut(2000).fadeIn(2000, animateHero1);
	        }
	    });

		function animateHero1(){
			$('#hero-1 img').delay(50)
			.animate({opacity:1}, 2000)
			.delay(1000)
			.animate({opacity:0}, 2000, animateHero1);
	   	};

	   	$.ajax({
	    	type: 'GET',
	        url: theme_path+'/img/hero-images/hero-2-anim.jpg',
	        data: {},
	        success: function(response) {
	        	var image = $('<img></img>');
				image.attr('src', theme_path+'/img/hero-images/hero-2-anim.jpg');
	            $('#hero-2').html(image);
	           $('#hero-2 img').fadeOut(3000).fadeIn(1000, animateHero2);
	        }
	    });

	    function animateHero2(){
			$('#hero-2 img').delay(50)
			.animate({opacity:1}, 2000)
			.delay(1000)
			.animate({opacity:0}, 2000, animateHero2);
	   	};

		$.ajax({
	    	type: 'GET',
	        url: theme_path+'/img/hero-images/hero-3-anim.jpg',
	        data: {},
	        success: function(response) {
	        	var image = $('<img></img>');
				image.attr({'src':theme_path+'/img/hero-images/hero-3-anim.jpg', 'id':'hero-3-glow'});
	            $('#hero-3').html(image);
	           $('#hero-3 img#hero-3-glow').fadeOut(3000).fadeIn(1000, animateHero3);
	        }
	    });

		function animateHero3(){
			$('#hero-3 img#hero-3-glow').delay(1000)
			.animate({opacity:0.6}, 40)
			.delay(40)
			.animate({opacity:0}, 40)
			.delay(40)
			.animate({opacity:1}, 40)
			.delay(40)
			.animate({opacity:0}, 100)
			.delay(1000)
			.animate({opacity:0.6}, 75)
			.delay(40)
			.animate({opacity:0}, 40)
			.delay(1000)
			.animate({opacity:0.6}, 75)
			.delay(40)
			.animate({opacity:0}, 40, animateHero3);
	   	};
 	}

	function resetDeviceMode() {
		var currentWidth = $(window).width();
		var currentHeight = $(window).height();
		if (currentWidth > 800) {
			//desktop and landscape tablets
			if (window.devicePixelRatio >= 2 && currentWidth == 1024) {
				//retina landscape iPads
				deviceMode = 2;
				isiPad = true;
			} else {
				deviceMode = 1;
				if (currentWidth == 1024 && currentHeight == 672) {
					isiPad = true;
				}
			}
		} else if (currentWidth >= 640) {
			//portrait tablets
			if (window.devicePixelRatio >= 2 && currentWidth == 768) {
				//retina portrait iPads
				deviceMode = 4;
				isiPad = true;
			} else {
				deviceMode = 3;
				if (currentWidth == 768 && currentHeight == 928) {
					isiPad = true;
				}
			}
		} else {
			//mobile phones
			if (currentWidth > currentHeight) {
				//landscape
				if (window.devicePixelRatio >= 2 && currentWidth >= 480 && currentWidth <= 568) {
					//retina landscape inc iPhone 5
					deviceMode = 7;
				} else {
					//other landscape phones
					deviceMode = 6;
				}
			} else {
				//portrait
				if (window.devicePixelRatio >= 2 && currentWidth == 320) {
					//retina portrait iPhones
					deviceMode = 8;
				} else {
					//other portrait phones
					deviceMode = 5;
				}
			}
		}
		return deviceMode;
	}

	function recalculateLayout() {
		switch (deviceMode) {
			case 1:
			case 2:
			case 3:
			case 4:
				$('#tab-cast .mob-carousel-nav ul').css({width: 254, 'margin-left': 0});

				$('section#watch ul li a').each(function() {
					$(this).parent().css({'background-image': 'url('+$(this).attr('data-thumb')+')'});
				});

				$('section#gallery ul li a').each(function() {
					$(this).parent().css({'background-image': 'url('+$(this).attr('data-href')+')'});
				});
				break;
			case 5:
			case 6:
			case 7:
			case 8:
				//Fix the margin and width in the story/cast section
				var mobileCastNavWidth = 0;
				$('#tab-cast .mob-carousel-nav ul li').each(function() {
					mobileCastNavWidth += parseInt($(this).outerWidth()) + parseInt($(this).css('margin-right'));
				});
				//console.log(mobileCastNavWidth);
				$('#tab-cast .mob-carousel-nav ul').css({width: mobileCastNavWidth});

				$('section#watch ul li a').each(function() {
					$(this).parent().css({'background-image': 'url('+$(this).attr('data-thumb-mob')+')'});
				});

				$('section#gallery ul li a').each(function() {
					$(this).parent().css({'background-image': 'url('+$(this).attr('data-href-mob')+')'});
				});
				break;
		}
	}

	checkDeviceMode();

	if (checkDeviceMode() <= 4) {
		//This little snippet will resize the wrapper div to the proper width for all the columns it has
		var totalWidth = 0;
		$('section').each(function() {
			if ($(this).attr('id') != 'flyout') {
				totalWidth += parseInt($(this).outerWidth()) + parseInt($(this).css('margin-right'));
				sectionIndex[sectionIndex.length] = new Object();
				sectionIndex[sectionIndex.length-1] = $(this).attr('id');
				sectionPositions[$(this).attr('id')]  = $(this).offset().left - parseInt($('div#wrapper').css('padding-left'))-50; // the extra 50 offset is to help with the nav highlighting bug
			}
		});

		$('#wrapper').css('width', totalWidth);
	}

	function attachScrollAnalytics() {
		$('.jspDrag').unbind('click');
		//these have to be reattached every time the scrollbar is reinitialised
		$('#tab-ts-and-cs .jspDrag').click(function() {
			if (typeof ga !== "undefined" && ga != null) {
				ga.log('TERMS_SCROLL');
			}
		});
		$('#tab-privacy .jspDrag').click(function() {
			if (typeof ga !== "undefined" && ga != null) {
				ga.log('PRIVACY_SCROLL');
			}
		});
		$('section#downloads .jspDrag').click(function() {
			if (typeof ga !== "undefined" && ga != null) {
				ga.log('DOWNLOADS_SCROLL');
			}
		});
		$('section#story-cast .jspDrag').click(function() {
			if (typeof ga !== "undefined" && ga != null) {
				ga.log('CAST_INFO_SCROLL');
			}
		});
		$('section#find-a-cinema .jspDrag').click(function() {
			if (typeof ga !== "undefined" && ga != null) {
				ga.log('CINEMA_SCROLL');
			}
		});
	}

	var watchCarouselWidth = 0;
	$('#playlist-carousel ul li').each(function() {
		watchCarouselWidth += $(this).outerWidth() + parseInt($(this).css('margin-right'));
	});
	$('#playlist-carousel ul').css('width', watchCarouselWidth);

	var galleryCarouselWidth = 0;
	//Divide these ones by 2 because the list elements are in columns
	$('#gallery-carousel ul li').each(function() {
		galleryCarouselWidth += ($(this).outerWidth() + parseInt($(this).css('margin-right')))/2;
	});
	$('#gallery-carousel ul').css('width', galleryCarouselWidth);

	$('#link-home').click(function () {
		$.address.value('home');  //deep linking
		if (checkDeviceMode() <= 4) {
			$('html,body').animate({
				scrollLeft: 0
			}, scrollAnimDuration).promise().done(function() {
				changeMainNav('home');
			});
		} else {
			$('section').hide();
			$('section#home, #hero-0').show();
			changeMainNav('home');
		}
	});

	$('header nav ul li a').click(function () {
		var leftPos = $('#'+$(this).attr('data-href')).position().left;
		var clickedElement = $(this).attr('data-href');
		if (checkDeviceMode() <= 4) {
			if (clickedElement != 'legal') {
				$.address.value(clickedElement);  //deep linking
				$('html,body').animate({
					scrollLeft: $('#'+clickedElement).offset().left - parseInt($('div#wrapper').css('padding-left'))
				}, scrollAnimDuration).promise().done(function() {
					changeMainNav(clickedElement);
				});
			}
			if (checkDeviceMode() >= 3) {
				$('#mobile-dropdown').trigger('click');
			}
		} else {
			$.address.value(clickedElement);  //deep linking
			$('section').hide();
			$('header nav a#mobile-coin').removeClass('open');
			if (clickedElement != 'home') {
				$('#hero-0').hide();
			} else {
				$('#hero-0').show();
			}
			$('#'+clickedElement).show();
			//show the ad always
			$('section#final').show();
			changeMainNav(clickedElement);
			$('#mobile-dropdown').trigger('click');
		}
	});

	function changeMainNav(whichElement) {
		$('header nav ul li').removeClass('selected');
		$('header nav ul li a[data-href="'+whichElement+'"]').parent().addClass('selected');
	}

	/* vert/horiz mousewheel - for desktops only, not for touch devices */
	if (checkDeviceMode() == 1) {
	   	$("html, body").mousewheel(function(event, delta) {
	   		if ($('#opaque-overlay').css('display') == 'none') {
				this.scrollLeft -= (delta * 30);
				event.preventDefault();
			}
		});
	}

	if (checkDeviceMode() <= 4) {
		$(window).scroll(function(e) {
			var currentSection;
			if ($(this).scrollLeft() > 0) {
				for (o in sectionIndex) {
					if ($(this).scrollLeft() <= sectionPositions[sectionIndex[o]]) {
						$('header nav ul li').removeClass('selected');
						$('header nav ul li a[data-href="'+sectionIndex[o-1]+'"]').parent().addClass('selected');
						if ($('section#'+sectionIndex[o-1]).attr('trigger-nav')) {
							currentSection = $('section#'+sectionIndex[o-1]).attr('trigger-nav');
						} else {
							currentSection = sectionIndex[o-1];
						}
						$.address.value(currentSection);  //deep linking
						changeMainNav(currentSection);
						break;
					}
				}
			}
		});

	 	$('.canScroll').jScrollPane();
	 	attachScrollAnalytics();
		$('.jspContainer').unbind('mousewheel');
	}

	/* click functionality for subnav */
	$('section nav ul li a').click(function () {
		if(($(this).attr('data-href') != 'ts-and-cs') && ($(this).attr('data-href') != 'privacy')){
		$(this).closest('section').find('.tab').hide();
		$(this).closest('nav').find('li a').removeClass('active');
		$('nav li.'+$(this).attr('data-href')+' a').addClass('active');
		$('#tab-'+$(this).attr('data-href')).show();
		}

		if ($('#tab-'+$(this).attr('data-href')).find('.canScroll') && checkDeviceMode() <= 4) {
			$('#tab-'+$(this).attr('data-href')).find('.canScroll').jScrollPane();
			$('.jspContainer').each(function() {
				console.log();
				console.log($(this).attr('data-href'));
				if ($(this).parent().parent().attr('id') != 'tab-privacy' && $(this).parent().parent().attr('id') != 'tab-ts-and-cs') {
					$(this).unbind('mousewheel');
				}
			});
			attachScrollAnalytics();
		}
	});

	$('.reminder .dateInput').datepicker({
		showOn   		: 'button',
		buttonImage  	: theme_path+'/img/icons/calendar.png',
		buttonImageOnly : true,
		dateFormat  	: 'dd/mm/yy',
		setDate   		: new Date(),
		minDate			: '+1d'
    });

	$('#home .set-reminder a').click(function() {
		if (parseFloat($('#home article.double').css('top')) < 0) {
			$('#home article.double').animate({top:0});
			$('#hero-0').animate({top:0});
			$(this).attr('im3_analytics_event', 'SET_REMINDER_OPEN');
			$(this).removeClass('active');
		} else {
			$('#home article.double').animate({top:-171});
			$('#hero-0').animate({top:-171});
			$(this).attr('im3_analytics_event', 'SET_REMINDER_CLOSE');
			$(this).addClass('active');
		}
	});

	$('#home .reminder a.btn-close').click(function() {
		$('#home article.double').animate({top:0});
		$('#hero-0').animate({top:0});
		$('#home .set-reminder a').removeClass('active');
	});

	$('section#story #tab-cast li a').click(function() {
		$(this).parent().parent().find('li').removeClass('active');
		$(this).parent().addClass('active');
		$(this).closest('article').next().next().find('.cast-item').hide();
		$(this).closest('article').next().next().find('#'+$(this).attr('data-href')).show();
		if (checkDeviceMode() <= 4) {
			$('#'+$(this).attr('data-href')+' .canScroll').jScrollPane();
			attachScrollAnalytics();
			$('.jspContainer').unbind('mousewheel');
		}
	});

	$('#mobile-dropdown').click(function() {
		if ($(this).hasClass('open')) {
			$('header nav ul').animate({top:(-400)});
		} else {
			$('header nav ul').animate({top:($('header').outerHeight()-4)});
		}
		$(this).toggleClass('open');
	});

	$('section#gallery ul li a').each(function() {
		$(this).parent().css({'background-image': 'url('+$(this).attr('data-href')+')'});
		if (checkDeviceMode() >= 5) {
			//mobile thumbs
			$(this).parent().css({'background-image': 'url('+$(this).attr('data-href-mob')+')'});
		}
	});

	$('section#gallery ul li a').click(function() {
		if (checkDeviceMode() <= 4) {
			$('#gallery-image-large').css({'background-image': 'url('+$(this).attr('data-target')+')'});
			$('section#gallery ul li').removeClass('selected');
			$(this).parent().addClass('selected');
		} else {
			$('#gallery-image-large').css({'background-image': 'url('+$(this).attr('data-target')+')'});
			$('#gallery-image-large, section#gallery h2#gallery-close').show();
			$('section#gallery ul, section#gallery h2#gallery-heading').hide();
		}
	});

	$('section#gallery h2#gallery-close').click(function() {
		$('#gallery-image-large, section#gallery h2#gallery-close').hide();
		$('section#gallery ul, section#gallery h2#gallery-heading').show();
	});

	$('section#watch ul li a').click(function(evt) {
		if (checkDeviceMode() <= 4) {
			//stop the href from triggering on desktop/tablet. it's only meant to trigger on mobile devices.
			evt.preventDefault();
			$('#watch-video').attr({'src': 'http://www.youtube.com/embed/'+$(this).attr('data-href')+'?wmode=transparent&fs=1&rel=0'});
		}
		$('section#watch ul li').removeClass('selected');
		$(this).parent().addClass('selected');
	});

	$('section#watch ul li a').each(function() {
		$(this).parent().css({'background-image': 'url('+$(this).attr('data-thumb')+')'});
		if (checkDeviceMode() >= 5) {
			$(this).parent().css({'background-image': 'url('+$(this).attr('data-thumb-mob')+')'});
		}
	});

	function isInt(n) {
	   return n % 1 === 0;
	}

	function shiftCarousel(arrow, container, amount, rightLimit) {
		if ($(arrow).hasClass('arrow-left')) {
			$(arrow).parent().find('.arrow-right a').removeClass('disabled');
		} else if ($(arrow).hasClass('arrow-right')) {
			$(arrow).parent().find('.arrow-left a').removeClass('disabled');
		}

		if (amount <= 0 && amount > rightLimit) {
			$(container).animate({'margin-left': amount});
		}
	}

	$('#tab-cast .arrow-left, #tab-cast .arrow-right').click(function() {
		if (checkDeviceMode() >= 5) {
			var animateTo;
			var visibleWidth = $('#tab-cast .mob-carousel-nav ul li').outerWidth()+10;
			if ($(this).hasClass('arrow-right')) {
				animateTo = parseInt($('#tab-cast .mob-carousel-nav ul').css('margin-left')) - $('#tab-cast .mob-carousel-nav ul li').outerWidth() - 10;
				if (animateTo <= 0 - $('#tab-cast .mob-carousel-nav ul').outerWidth() - 10 + ($('#tab-cast .mob-carousel-nav ul li').outerWidth()*2)) {
					$(this).find('a').addClass('disabled');
				}
			} else if ($(this).hasClass('arrow-left')) {
				animateTo = parseInt($('#tab-cast .mob-carousel-nav ul').css('margin-left')) + $('#tab-cast .mob-carousel-nav ul li').outerWidth() + 10;
				if (animateTo >= 0) {
					$(this).find('a').addClass('disabled');
				}
			}
			screenNum = animateTo/visibleWidth;
			if (!isInt(screenNum)) {
				screenNum = Math.round(screenNum);
				animateTo = visibleWidth * screenNum;
			}
			shiftCarousel(this, '#tab-cast .mob-carousel-nav ul', animateTo, 0 - $('#tab-cast .mob-carousel-nav ul').outerWidth() + 10);
		}
	});

	$('#playlist-carousel .arrow-left, #playlist-carousel .arrow-right').click(function() {
		var animateTo;
		var visibleWidth = ($('#playlist-carousel .playlist-carousel-inner ul li').outerWidth()+5)*4;
		if ($(this).hasClass('arrow-right')) {
			animateTo = parseInt($('#playlist-carousel .playlist-carousel-inner ul').css('margin-left')) - visibleWidth;
			if (animateTo <= 0 - $('#playlist-carousel .playlist-carousel-inner ul').outerWidth() + visibleWidth) {
				$(this).find('a').addClass('disabled');
			}
		} else if ($(this).hasClass('arrow-left')) {
			animateTo = parseInt($('#playlist-carousel .playlist-carousel-inner ul').css('margin-left')) + visibleWidth;
			if (animateTo >= 0) {
				$(this).find('a').addClass('disabled');
			}
		}
		screenNum = animateTo/visibleWidth;
		if (!isInt(screenNum)) {
			screenNum = Math.round(screenNum);
			animateTo = visibleWidth * screenNum;
		}
		shiftCarousel(this, '#playlist-carousel .playlist-carousel-inner ul', animateTo, 0 - $('#playlist-carousel .playlist-carousel-inner ul').outerWidth());
	});

	$('#gallery-carousel .arrow-left, #gallery-carousel .arrow-right').click(function() {	console.log('Gallery carousel');
		var animateTo;
		var visibleWidth = ($('#gallery-carousel .gallery-carousel-inner ul li').outerWidth()+4)*6;
		if ($(this).hasClass('arrow-right')) {
			animateTo = parseInt($('#gallery-carousel .gallery-carousel-inner ul').css('margin-left')) - visibleWidth;
			if (animateTo <= 0 - $('#gallery-carousel .gallery-carousel-inner ul').outerWidth() + visibleWidth) {
				$(this).find('a').addClass('disabled');
			}
		} else if ($(this).hasClass('arrow-left')) {
			animateTo = parseInt($('#gallery-carousel .gallery-carousel-inner ul').css('margin-left')) + visibleWidth;
			if (animateTo >= 0) {
				$(this).find('a').addClass('disabled');
			}
		}
		screenNum = animateTo/visibleWidth;
		if (!isInt(screenNum)) {
			screenNum = Math.round(screenNum);
			animateTo = visibleWidth * screenNum;
		}
		shiftCarousel(this, '#gallery-carousel .gallery-carousel-inner ul', animateTo, 0 - $('#gallery-carousel .gallery-carousel-inner ul').outerWidth());
	});

	$('#home .trailer a').click(function() {
		if (checkDeviceMode() <= 4) {
			$('html,body').animate({
				scrollLeft: $('#watch').offset().left - parseInt($('div#wrapper').css('padding-left'))
			}, 1500).promise().done(function() {
				changeMainNav('watch');
			});
		} else {
			$('section, #hero-0').hide();
			$('section#watch').show();
		}
	});

	$('#login-form a.register-today').click(function() {
		if (checkDeviceMode() <= 2) {
			$('#flyout-register').trigger('click');
		} else if (checkDeviceMode() <= 4) {
			$('#flyout').animate({top: 77});
			$('#vip-login').hide();
			$('#vip-register').show();
			$('section#flyout a.btn-close-flyout').css({top: 10});
			$('section#flyout article .canScroll').jScrollPane();
			attachScrollAnalytics();
		} else {
			$('section, section#flyout article').hide();
			$('section#flyout').show();
			$('#vip-register').show();
		}
	});

	$('section#home .reminder form').submit(function(evt) {
		evt.preventDefault();
		$('#home .set-reminder a').attr('im3_analytics_event', 'SET_REMINDER_OPEN');
	});

	$('header nav a.flyout').click(function () {
		$(this).addClass('open');
		$('section#flyout article').hide();
		$('section#flyout article#'+$(this).attr('data-href')).show();
		$('section#flyout article .canScroll').jScrollPane();
		attachScrollAnalytics();

		$('#flyout').show();
		$('section#flyout article .canScroll').jScrollPane();
		var leftPosition = 160-(620-$('section#flyout article#'+$(this).attr('data-href')).outerWidth());
		$('#flyout').animate({left: leftPosition});
		$('#opaque-overlay').show();
	});

	$('#login-form form a.back-to-login').click(function(event) {
		event.preventDefault();
		$('#login-form .login').show();
		$('#login-form .password-recovery').hide();
		return false;
	});

	$('#login-form form a.forgotPass').click(function(event) {
		event.preventDefault();
		$('#login-form .login').hide();
		$('#login-form .password-recovery').show();
		return false;
	});

	$('section#flyout a.btn-close-flyout').click(function () {
		if (checkDeviceMode() <= 2) {
			$('#flyout').animate({left: -772}, {complete: function() { $('#flyout').hide(); }});
		} else {
			$('#flyout').animate({top: -700}); // this can be completely hard coded, no need to worry about heights
			$('header nav a#mobile-coin').removeClass('open');
		}
		$('#opaque-overlay').hide();
	});

	$('header nav a#mobile-coin').click(function () {
		if ($('#flyout').css('top') == 'auto' && checkDeviceMode() > 2) {
			$('#flyout').css({'top': -732, 'left': 0});
		}
		if ($('#mobile-dropdown').hasClass('open')) {
			$('header nav ul').animate({top:(-400)});
			$('#mobile-dropdown').removeClass('open');
		}
		if (checkDeviceMode() <= 4) {
			if ($(this).hasClass('open')) {
				$('#flyout').animate({top: -700}, {complete: function() { $('#flyout').hide(); }});
				$('#opaque-overlay').hide();
			} else {
				$('#opaque-overlay').show();
				$('section#flyout a.btn-close-flyout').css({top: 310});
				$('section#flyout article').hide();
				$('section#flyout article#vip-login').show();
				$('section#flyout article .canScroll').jScrollPane();
				attachScrollAnalytics();

				var topPosition = $('header').css('height');
				$('#flyout').show();
				$('#flyout').animate({top: -222});
			}
			$(this).toggleClass('open');
		} else {
			$(this).addClass('open');
			$('section, #hero-0, section#flyout article').hide();
			$('section#flyout, section#flyout article#vip-login').show();
			changeMainNav('');
		}
	});

	$('section#flyout a.btn-close-flyout').click(function () {
		$('#flyout-login').removeClass('open');
		if (checkDeviceMode() <= 2) {
			$('#flyout').animate({left: -772});
		} else {
			$('#flyout').animate({top: -700}); // this can be completely hard coded, no need to worry about heights
		}
	});

	$('#mobile-fine-print a').click(function() {
		console.log('Fine print');
		if (checkDeviceMode() <= 4) {
			$('section#flyout a.btn-close-flyout').css({top: 10});
			$('section#flyout article').hide();
			$('section#flyout article#legal, section#flyout').show();
			$('section#flyout article .canScroll').jScrollPane();
			attachScrollAnalytics();
			var topPosition = parseInt($('header').css('height'))-5;
			$('#flyout').animate({top: topPosition});
		} else {
			$('section, #hero-0, section#flyout article').hide();
			$('section#flyout, section#flyout article#legal').show();
			window.scroll(0,0);
			changeMainNav('');
		}
	});

	$("#reminder-form").validationEngine('attach', {
		promptPosition			: "topLeft",
		scroll					: false,
		validationEventTrigger  : "submit",
		showOneMessage 			: true
	});

	$('#reminder-form').submit(function(evt) {
		evt.preventDefault();
		var valid = $("#reminder-form").validationEngine('validate');
		if(valid == true) {
			$.ajax({
				type: 'POST',
				url: '/reminder',
				data: {'reminder-date':$("#reminder-date").val(),'reminder-email':$("#reminder-email").val()},
				beforeSend: function(){
							$('#reminder-form').hide();
							$('#reminder-processing').show();
						},
				complete: function(){
							$('#reminder-processing').hide();
							$('#reminder-confirmation').show();
						},
				success: function(response) {
					response = $.parseJSON(response);
					if(response['success']) {
						$(".dateInput").datepicker('setDate', new Date());
						$("#reminder-email").val('');
						setTimeout(function(){
							$('#home article.double').animate({top:0});
							$('#hero-0').animate({top:0});
							$('#home .set-reminder a').attr('im3_analytics_event', 'SET_REMINDER_OPEN');
							$('#reminder-form').show();
							$('#reminder-processing').hide();
							$('#reminder-confirmation').hide();
						}, 1000);
					} else {
						alert(response['error']);
					}
				}
			});
		}
		return false;
	});

	/* $(function() {
		$.ajax({
			type: 'POST',
			url: '/facebookfeeds',
			data: {},
			success: function(response) {
				response = $.parseJSON(response);
				if(response['feeds']){
					$('#facebookfeeds').html(response['feeds']);
					$('div.feed-content').each(function() {
						$(this ).find("a[target ='']").attr('target', '_blank');
						$(this).find("a[href ^='/l.php?']").attr('href', 'http://facebook.com'+$(this).find("a[href ^='/l.php?']").attr('href'));
					});
					if (checkDeviceMode() <= 4) {
						$('#tab-facebook').find('.canScroll').jScrollPane();
						$('#tab-facebook').find('.jspContainer').unbind('mousewheel');
					}
				}
			}
		});
	}); */

	$('#custom-login-form, #custom_forgot_pass').wrapInner('<ul class="formWrapper" />');

	$(".formWrapper div.mandatory").hide();
	$(".formWrapper li div.mandatory").show();
	$("div.container-inline-date first-child").hide();

	$('#edit-field-parent-email-und-0-value').addClass('required').after('<div class="mandatory" style="display: block; ">*</div>');
	$('#edit-field-birthdate-und-0-value-datepicker-popup-0').addClass('required');
	$('#edit-field-birthdate-und-0-value-datepicker-popup-0').after('<div class="mandatory" style="display: block; ">*</div>');

	$('.container-inline-date li').addClass('datepicker-li');
	$('.container-inline-date li:first-child').hide();

	$('.manage-account').click(function() {
		if (checkDeviceMode() <= 2) {
			$('#vip-login').hide();
			$('#manage-account').show();
			$('section#flyout article .canScroll').jScrollPane();
			var leftPosition = 160-(620-$('#manage-account').outerWidth());
			$('#flyout').animate({left: leftPosition});
			$('#opaque-overlay').show();
		} else{
			$('#vip-login').hide();
			$('#manage-account').show();
			var leftPosition = 160-(620-$('#manage-account').outerWidth());
			$('#flyout').animate({left: leftPosition});
			$('#opaque-overlay').show();
		}

		if(checkDeviceMode() == 3 || checkDeviceMode() == 4) {
			$('#flyout').css('top','8%');
			$('#flyout .btn-close-flyout').css('top','10px');
			$('section#flyout article .canScroll').jScrollPane();
		}
	});

	$('#edit-timezone').remove();

	$('#flyout-login').click(function() {
		$('#login-form .login').show();
		$('#login-form .password-recovery').hide();
	});

	$('#edit-field-parent-email li');
	$('#edit-mail').parent('li').after('<li><label for="edit-confirm-mail">Confirm email</label><input type="text" id="edit-confirm-mail" value="" size="60" maxlength="254" class="form-text required email"><div class="mandatory" style="display: block; ">*</div></li>');

	var emailNotification = $('#edit-field-email-notification');
	$('#edit-field-email-notification').remove();
	$('#edit-confirm-mail').parent('li').after(emailNotification);

	$('#edit-field-birthdate-und-0-value-datepicker-popup-0').datepicker({
		showOn			: 'button',
		buttonImage		: theme_path+'/img/icons/calendar-flyout.png',
		buttonImageOnly : true,
		dateFormat		: 'dd/mm/yy',
		maxDate 		: '31/12/2012',
		changeMonth		: true,
		changeYear		: true,
		yearRange		: '1900:2012',
		onSelect		: function() {
							manageGuardianEmail();
						  }
    });

	if(('#edit-field-birthdate-und-0-value-datepicker-popup-0').length){
		$('#edit-field-birthdate-und-0-value-datepicker-popup-0').attr('readonly', true);
		manageGuardianEmail();
	}

	// Show or hide the Parent guardian fielda according to the date selected
	function manageGuardianEmail() {
		$('#edit-field-parent-email').hide('fast');
		$('#edit-field-birthdate-und-0-value-datepicker-popup-0').removeClass('null');
		var birth_date = $('#edit-field-birthdate-und-0-value-datepicker-popup-0').val();
		if(birth_date == '') {
			$('#edit-field-birthdate-und-0-value-datepicker-popup-0').val('DD/MM/YYYY');
			$('#edit-field-birthdate-und-0-value-datepicker-popup-0').addClass('null');
			$('#edit-field-parent-email').hide('fast');
		} else if(birth_date != ''  && getDateDiff(birth_date) >= 13) {
			$('#edit-field-parent-email').hide('fast');
		} else {
			$('#edit-field-parent-email').show('fast');
			if(checkDeviceMode() <= 4) {
				$('section#flyout article .canScroll').jScrollPane();
			}
		}
		if(checkDeviceMode() <= 4) {
			$('section#flyout article .canScroll').jScrollPane();
		}
	}
});


}(jQuery));




function registerUser() {

(function ($) {

	var formId = 'user-register-form';
	isError = false;
	$('#'+formId).find('.required').each(function(){
		if($('.error-symbol-'+$(this).attr('id')).length) {
			$('.error-symbol-'+$(this).attr('id')).remove();
			$('.error-'+$(this).attr('id')).remove();
		}
		error_msg = '';
		var internalError = false;
		name = $(this).attr('name');
		if($(this).val() == "" || $(this).val() == "_none" || $(this).val() == "DD/MM/YYYY"){
			internalError = true;
			error_msg = $(this).prev('label').text()+' is mandatory';
			if($(this).attr('id') == 'input-guardian') {
				var birth_date = $('#edit-field-birthdate-und-0-value-datepicker-popup-0').val();
				if(birth_date == '' || birth_date == 'DD/MM/YYYY') {
					internalError = false;
					isError = true;
				} else if(birth_date != ''  && getDateDiff(birth_date) >= 13) {
					internalError = false;
				} else {
					isError = true;
				}
			} else {
				isError = true;
			}
			if($(this).parent().get(0).tagName.toLowerCase() != 'li'){
				error_msg = $(this).parentsUntil('li').parent().find('label').text()+' is mandatory';
			}
		}
		if($(this).attr('type') == 'checkbox' && !$(this).is(':checked')) {
			isError = internalError = true;
			error_msg = $(this).prev('label').text()+' is mandatory';
			if($(this).parent().get(0).tagName.toLowerCase() != 'li'){
				error_msg = $(this).parentsUntil('li').parent().find('label').text()+' is mandatory';
			}
		}
		if(($(this).attr('id') =='input-guardian') && ($(this).val() != '') && ($(this).val().toLowerCase() == $('#'+formId+' #input-email').val().toLowerCase())) {
			isError = internalError = true;
			if(error_msg == '')
				error_msg = 'Guardian email can not be same as user email';
			else
				error_msg += '<br/> Guardian email can not be same as user email';
		}
		if(($(this).hasClass('email')) && error_msg == '' && $(this).attr('type') == 'text') {
			var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!email_regex.test($(this).val())) {
				isError = internalError = true;
				if(error_msg == '')
					error_msg = 'Invalid Email address';
				else
					error_msg += '<br/> Invalid Email address';
			}
		}
		if($(this).attr('id') =='input-confirm-email' && ($(this).val() != $('#'+formId+' #input-email').val())) {
			isError = internalError = true;
			if(error_msg == '')
				error_msg = 'Emails must match';
			else
				error_msg += '<br/> Emails must match';
		}
		if(internalError) {
			if(!$('.error-symbol-'+$(this).attr('id')).length) {
				$(this).parent().append('<div class="error-symbol error-symbol-'+$(this).attr('id')+'">!</div><div class="error error-'+$(this).attr('id')+'">'+error_msg+'</div>');
			}
		}
	});
	if(isError){
		return false;
	}

	var form_data = $('#'+formId).serialize();
	$.ajax({
		type: 'POST',
		data: form_data,
		url:'/register_user',
		success: function(response) {
			if(response == 'success') {
				window.location.href = 'index.html';
			} else {
				$('#'+formId).find('.message_error').html(response);
			}
		}
	});

}(jQuery));

}

function updateProfile() {

(function ($) {

	var formId = 'user-profile-form';
	isError = false;

	$('#'+formId).find('.required').each(function(){
		if($('.error-symbol-'+$(this).attr('id')).length) {
			$('.error-symbol-'+$(this).attr('id')).remove();
			$('.error-'+$(this).attr('id')).remove();
		}
		error_msg = '';
		var internalError = false;
		name = $(this).attr('name');
		if(($(this).val() == "" || $(this).val() == "_none" || $(this).val() == "DD/MM/YYYY") && ($(this).attr('id') !='input-current-password')){
			internalError = true;
			error_msg = $(this).prev('label').text()+' is mandatory';
			if($(this).attr('id') == 'input-guardian') {
				var birth_date = $('#edit-field-birthdate-und-0-value-datepicker-popup-0').val();
				if(birth_date == '' || birth_date == 'DD/MM/YYYY') {
					internalError = false;
					isError = true;
				} else if(birth_date != ''  && getDateDiff(birth_date) >= 13) {
					internalError = false;
				} else {
					isError = true;
				}
			} else {
				isError = true;
			}
			if($(this).parent().get(0).tagName.toLowerCase() != 'li'){
				error_msg = $(this).parentsUntil('li').parent().find('label').text()+' is mandatory';
			}
		}
		if($(this).attr('type') == 'checkbox' && !$(this).is(':checked')) {
			isError = internalError = true;
			error_msg = $(this).prev('label').text()+' is mandatory';
			if($(this).parent().get(0).tagName.toLowerCase() != 'li'){
				error_msg = $(this).parentsUntil('li').parent().find('label').text()+' is mandatory';
			}
		}
		if($(this).attr('id') =='input-password') {
			if($(this).val() == '') {
				internalError = false;
			}
		}
		if($(this).attr('id') =='input-current-password') {
			if($(this).val() == '' && $('#'+formId+' #input-password').val() == '') {
				internalError = false;
			} else if(($(this).val() == '') && ($('#'+formId+' #input-password').val() != '')) {
				error_msg = $(this).prev('label').text()+' is mandatory';
				isError = internalError = true;
			}
		}
		if(($(this).attr('id') =='input-guardian') && ($(this).val() != '') && ($(this).val().toLowerCase() == $('#'+formId+' #input-email').val().toLowerCase())) {
			isError = internalError = true;
			if(error_msg == '')
				error_msg = 'Guardian email can not be same as user email';
			else
				error_msg += '<br/> Guardian email can not be same as user email';
		}
		if(($(this).hasClass('email')) && error_msg == '' && $(this).attr('type') == 'text') {
			var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!email_regex.test($(this).val())) {
				isError = internalError = true;
				if(error_msg == '')
					error_msg = 'Invalid email address';
				else
					error_msg += '<br/> Invalid email address';
			}
		}
		if($(this).attr('id') =='input-confirm-email' && ($(this).val() != $('#'+formId+' #input-email').val())) {
			isError = internalError = true;
			if(error_msg == '')
				error_msg = 'Emails must match';
			else
				error_msg += '<br/> Emails must match';
		}
		if(internalError) {
			if(!$('.error-symbol-'+$(this).attr('id')).length) {
				$(this).parent().append('<div class="error-symbol error-symbol-'+$(this).attr('id')+'">!</div><div class="error error-'+$(this).attr('id')+'">'+error_msg+'</div>');
			}
		}
	});
	if(isError){
		return false;
	}

	var form_data = $('#'+formId).serialize();
	$.ajax({
		type: 'POST',
		data: form_data,
		url:'/update_profile',
		success: function(response) {
			if(response == 'success') {
				window.location.href = 'index.html';
			} else {
				$('#'+formId).find('.message_error').html(response);
			}
		}
	});

}(jQuery));

}

// Get the datedifference between selected date and current date
function getDateDiff(d1)
{
	var one_day=1000*60*60*24;
	var now = new Date();
	dt_date = now.getDate();
	dt_mth = parseInt(now.getMonth()+1);
	dt_year = now.getFullYear();
	d2 = dt_date+'/'+dt_mth+'/'+dt_year;
	var x = d1.split("index.html");
	var y = d2.split("index.html");
	var date1=new Date(x[2],(x[1]-1),x[0]);
	var date2=new Date(y[2],(y[1]-1),y[0])
	var dDays = (date2.getTime()-date1.getTime())/one_day;
	var dMonths = Math.ceil(dDays / 30);
	var dYears = Math.floor(dMonths /12) + "." + dMonths % 12;
	return dYears;
}



