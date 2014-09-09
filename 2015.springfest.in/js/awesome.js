                                var plates;
var buts;
window.onload = init;
function init(){
       $('.nav_buttons').css({'opacity':'1'});
					$('#menu').css('visibility','visible');
					$('#menu-container').css('bottom','0px');
					$('#menu-show').css({'opacity':'0','z-index':'-999'});
					lift_navs();

	var current=0;

	var socs = $('#top_right>ul>li');	
	var lag_socs = 300;
	for(var i=0;i<socs.length;i++){
		var mag_socs = i;
		$(socs[i]).animate({'margin-top':'42px'},70*mag_socs+lag_socs);
	}

	plates = $(".plate");
	
	var boxshadows = ["#FF0000","#FFA000","#74AF28","#3BA686","#5F6F8C","#979382"];

	$('.nav_buttons').click(function(e){
		$('.nav_buttons').css('box-shadow','');
		$(this).css('box-shadow','inset 0px 5px '+boxshadows[$(this).attr('brdy')]);
		var next = $(this).attr('sfx');
              if(next==4){
                  var win = window.open('http://springfest.in/sponsors/', '_blank');
                  if(win){win.focus();}
                  else{alert('Please allow popups for this site');}
                  return;
              }
		if(next==undefined)return;
		current = awesome(current,next);
	});
	////////////////
	var processing=0;

	$(document).mouseup(function(e){
		$('#testimonials').css({'z-index':'-99999','opacity':'0'});

		var sub_div = $("#subscribe-link,#subscribe-link *");
		var sub_input = $('#subscribe-input');
		
		if(processing)return;

		for(var i=0;i<sub_div.length;i++){
			if(e.target.id === $(sub_div[i]).attr('id')){
				$('#side_con').css('left','-220px');
				$("#subscribe-input").css('left','150px');
				$("#subscribe-txt").focus();
				return;
			}
		}

		$("#subscribe-input").css('left','-300px');
		$("#subscribe-txt").blur();
		$("#subscribe-txt").val('');
		$("#subscribe-button").html('Submit');
	
		if(e.target.id==="recent_rib"){
			$('#side_con').css('left',0);
			return;
		}

		var rchpn = $("#rc_hpn,#rc_hpn *");

		for(var i=0;i<rchpn.length;i++){
			if(e.target.id === $(rchpn[i]).attr('id')||($(e.target).attr('class') === $(rchpn[i]).attr('class')&&$(e.target).attr('class')!=undefined)){
				$('#side_con').css('left',0);
				return;
			}
		}

		$('#side_con').css('left','-220px');

	});

	$("#subscribe-button").click(function(e){
		
		if(document.querySelector('#subscribe-txt').validity.valid){
			
			var img = "<img id='load-svg' src='img/loading-bubbles.svg' height='38px'/>";
			$(this).html(img);

			processing=1;
			$.post('subscribe.php',{email:$('#subscribe-txt').val()},function(data){
				var result = JSON.parse(data);
				if(result.type=='success'){
					$("#subscribe-button").css('box-shadow','inset 0px -38px green');
					$('#subscribe-input-notify').html(result.message);
					setTimeout(function(){
						$("#subscribe-input").css('left','-300px');	
						$("#subscribe-button").html('Submit');
						$("#subscribe-button").css('box-shadow','none');
						$("#subscribe-txt").val('');
					},3000);					
				}else{
					$('#subscribe-input-notify').html(result.message);
					setTimeout(function(){	
						$("#subscribe-button").html('Submit');
					},3000);
				}
				$('#subscribe-input-notify').css({'-webkit-animation':'flap 3000ms',
												'-moz-animation':'flap 3000ms',
												'-ms-animation':'flap 3000ms',
												'-o-animation':'flap 3000ms',
												'animation':'flap 3000ms',
												'color':'rgba(255,255,255,1)'
										});
			});
		}else{
			$('#subscribe-input-notify').html('Invalid Email Address');
			$('#subscribe-input-notify').css({'-webkit-animation':'flap 3000ms',
												'-moz-animation':'flap 3000ms',
												'-ms-animation':'flap 3000ms',
												'-o-animation':'flap 3000ms',
												'animation':'flap 3000ms',
												'color':'rgba(255,255,255,1)'
										});
		}
		
		var el     = $('#subscribe-input-notify'),  
 		newone = el.clone(true);
       
			el.after(newone);
    
			$('#subscribe-input-notify')[0].remove();
		processing=0;
	});

	$('#subscribe-txt').keydown(function(e){
	    if(e.keyCode == 13){
	        $("#subscribe-button").trigger("click");
	        return false;
	    }
	});

	$('#testimonials_link,#testimonials,#testimonials *').click(function(){
		$('#testimonials').css({'z-index':'99999','opacity':'1','left':'115px'});
	});
	////////////////
}

function awesome(current,next){
	if(current==next)return next;
	$('.plate').css('z-index','0');
	$(plates.get(next)).css('z-index','9999');
	$(plates.get(current)).css({'-webkit-animation':'hinge 1000ms ease-in forwards',
								'-moz-animation':'hinge 1000ms ease-in forwards',
								'-ms-animation':'hinge 1000ms ease-in forwards',
								'-o-animation':'hinge 1000ms ease-in forwards',
								'animation':'hinge 1000ms ease-in forwards'});
	$(plates.get(next)).css({'-webkit-animation':'fall 900ms ease-out forwards',
							'-moz-animation':'fall 900ms ease-out forwards',
							'-ms-animation':'fall 900ms ease-out forwards',
							'-o-animation':'fall 900ms ease-out forwards',
							'animation':'fall 900ms ease-out forwards'});
	return next;
	
}
                            