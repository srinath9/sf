var height=710;
var width=2754;
var spons=1;
var ajax_loader='<img src="/static/img/loading/loading.gif" style="padding:10%"/>';
var signin_open=false;
var register_open=false;
var archives_open = false;
var myktj_open = false;
var current='home';
var stop_parallax=1;
var rot=0;
var home_animation=0;
var rotation=0;
var animation=0;
var page_list=['home','events','sponsors','exhibitions','workshops','megashows','guests','contacts','results','mktj'];
var accessToken="";
var facebook=true;
var google=true;
var entered=false;
//Social Namespacing
var FBK='FB';
var GPL='GP';
var KTJ='';
var username="";
var email="";
//Social Namespacing
var glassBar = {
'events':['135px','40px'],
'guests':['140px','250px'],
'sponsors':['145px','82px'],
'exhibitions':['145px','124px'],
'megashows':['145px','208px'],
'workshops':['145px','166px'],
'contacts':['130px','292px'],
};

//FaceBook Signup
function FBsignup()
{
var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
var values=$('#signup_form').serialize();
values+='&social='+encodeURIComponent(FBK);
values+='&username='+username;
values+='&email='+email;
$('#register_div').html(ajax_loader);
$.ajax({
	url: URLS.ACCOUNTS+'facebook_signup',
    type: 'POST',
    data:values,
    success:function(data){$('#register_div').html(data)},
    error: function(jqXHR, textStatus, errorThrown) {
      },
});
}
//Facebook Signup

//GPlus Signup
function GPsignup()
{
var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
var values=$('#signup_form').serialize();
values+='&social='+encodeURIComponent(GPL);
values+='&username='+username;
values+='&email='+email;
values+='&password1='+new Date().getTime();
values+='&password2='+new Date().getTime();
$('#register_div').html(ajax_loader);
$.ajax({
	url: URLS.ACCOUNTS+'google_signup',
    type: 'POST',
    data:values,
    success:function(data){$('#register_div').html(data)},
    error: function(jqXHR, textStatus, errorThrown) {
      },
});
}
//GPlus Signup

//Checks whether User Logged in
function check_logged(success,fail,data2,data1)
{
	if(success==undefined)
	{
		success=pass;
	}
	if(fail==undefined)
	{
		fail=pass;
	}
	var logged=false;
	$.ajax({
		url:URLS.ACCOUNTS+'check_logged',
		type:'POST'}).done(function(data){
			var res=data;
			logged=res.logged;
			if(logged)
			{
				success();
			}
			else
			{
				fail();
			}
		});
}

//Checks profile with same username/email exists

function profile_exists(username,email,social,success,fail,data1,data2,data22)
{
	if(social==undefined)
	{
		social="";
	}
	var exists=false;
	$.ajax({
		url:URLS.ACCOUNTS+'profile_exists',
		data:{username:username,social:social,email:email},
		type:'POST',
		async:false,
		dataType:'json',}).done(function(data){
			//var res=JSON.parse(data);
			res=data;
			exists=res.exists;
			console.log(exists);
			if(exists)
			{
				if(data2!=undefined && data22!=undefined)
				{
				success(data2,data22);
				}
				else if(data2!=undefined)
				{
				success(data2);
				}
				else{
					success();
				}
			}
			else
			{
				if(data1!=undefined)
				{
				fail(data1);
				}
				else{
				fail();
				}
					
			}
		
	});
	
}

function fail()
{

}

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '210461222454874', // App ID
    channelUrl : '//ktj.in/channel', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  


   
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
    FB.api('/me', function(response) {
    profile_exists(response.username,response.email,FBK,social_login,registerAPI,undefined,FBK);
    });
    } else if (response.status === 'not_authorized') {
      //FB.login(function(response){},{scope:'email'});
    } else {
      //facebook_login();
    }
    
  });
  };
  
  function login_social_fb(response)
  {
  	var access_token=FB.getAuthResponse()['accessToken'];
  	console.log(access_token);
	var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
  	$.ajax({
  			url:URLS.ACCOUNTS+'social_login',
  			type:'POST',
  			data:{username:response.username,email:response.email,access_token:access_token,social:FBK,csrfmiddlewaretoken:token},}).done(function(data){
  				console.log('Done');
  				logged_in();
  			});
  }
  
  function login_social_gp(response)
  {
  	var access_token=accessToken;
  	console.log(access_token);
	var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
  	$.ajax({
  			url:URLS.ACCOUNTS+'social_login',
  			type:'POST',
  			data:{username:response.name,email:response.email,access_token:access_token,social:GPL,csrfmiddlewaretoken:token},
  	}).done(function(data){
  				console.log('Done');
  				logged_in();
  		});
  }
  
  function social_login(social,res)
  {
  	if(social==FBK)
  	{
  	FB.api('/me', function(response) {
  		facebook=true;
      profile_exists(response.username,response.email,FBK,login_social_fb,registerAPI,undefined,response);
  	});
  	}
  	else if(social==GPL)
  	{
  		google=true;
      profile_exists(response.name,response.email,GPL,login_social_gp,GPRegister,undefined,res);
  	}
  	
  }

  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases.
  
  function FBRegisterAPI(response)
  {
  	$('#register_div').html(ajax_loader);
  	FB.api('/me', function(response) {
  		console.log('register');
  		$('#register_div').html(ajax_loader);
      	$('#register_div').load(URLS.ACCOUNTS+'facebook_signup',function(){
      	$('.register-wrap>#username-input').html(response.username);
      	username=response.username;
      	$('#email-input').html(response.email);
      	email=response.email;
      	$('#id_firstname').attr('value',response.first_name);
      	$('#id_lastname').attr('value',response.last_name);
      	$('#id_gender').attr('value',response.gender[0].toUpperCase());
      	var bd=response.birthday;
      	bd=bd.split('/');
      	$('#id_dateofbirth_month').attr('value',parseInt(bd[0]));
      	$('#id_dateofbirth_day').attr('value',bd[1]);
      	$('#id_dateofbirth_year').attr('value',bd[2]);
      	$('#password1-input').html("Not Required");
      	$('#password2-input').html("Not Required");});
      	});
  }
  
  function pass()
  {
  	return;
  }
   
  function registerAPI() {
  	FB.api('/me', function(response) {
      profile_exists(response.username,response.email,FBK,social_login,FBRegisterAPI,undefined,FBK);
   });
  }
  

  function facebook_login()
  {
  	$('register_div').html(ajax_loader);
  	$('login_div').html(ajax_loader);
  	FB.login(function(response){},{scope:'email,user_birthday'});
  	console.log('facebook_login');
  }
  
  function google_login()
  {
  	//Google_register
  	$('register_div').html(ajax_loader);
  	$('login_div').html(ajax_loader);
	gapi.signin.render('gplus_register', {
  	'callback':"GPRegister",
    'clientid':"406502212247.apps.googleusercontent.com",
    'cookiepolicy':"single_host_origin",
    'requestvisibleactions':"http://schemas.google.com/AddActivity",
    'scope':"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    });
    
    gapi.signin.render('gplus_login', {
  	'callback':"GPRegister",
    'clientid':"406502212247.apps.googleusercontent.com",
    'cookiepolicy':"single_host_origin",
    'requestvisibleactions':"http://schemas.google.com/AddActivity",
    'scope':"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    });
  }
  
  function cancelAuthorization()
  {
  	register();
  	 FB.api('/me/permissions','delete', function(response) {
  	 	username="";
  	 	email="";
  	 	$('#register_div').html(ajax_loader);
  	 	$('#register_div').load(URLS.ACCOUNTS+'signup');
  	 });
  }

//Facebook End

function GPRegisterAPI()
{
	register(false);
	$('#register_div').html(ajax_loader);
$('#register_div').load(URLS.ACCOUNTS+'google_signup',function(){
      		$('.register-wrap>#username-input').html(response.name);
      		username=response.name;
      		$('#email-input').html(response.email);
      		email=response.email;
      		$('#id_firstname').attr('value',response.given_name);
      		$('#id_lastname').attr('value',response.family_name);
      		$('#id_gender').attr('value',response.gender[0].toUpperCase());
      		var bd=response.birthday;
      		bd=bd.split('-');
      		$('#id_dateofbirth_month').attr('value',parseInt(bd[1]).toString());
      		$('#id_dateofbirth_day').attr('value',bd[2]);
      		$('#id_dateofbirth_year').attr('value',bd[0]);});
      		$('#password1-input').html("Not Required");
      	$('#password2-input').html("Not Required");
      }  		


//G+ signup
function GPRegister(authResult) {
  if (authResult['access_token']) {
  	//document.write(authResult);
  	accessToken=authResult.access_token;
  	$.ajax({
  		url:'https://www.googleapis.com/oauth2/v1/userinfo?access_token='+accessToken,
  		dataType:'json',
  		type:'GET'}).done(function(data){
  			response=data;
  			profile_exists(response.name,response.email,GPL,social_login,GPRegisterAPI,data,GPL,response);
  		});
  } else if (authResult['error']) {
    
  }
}
//G+ signup




//G+ cancel Authorization
function cancelGoogleAuthorization() {
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='+accessToken;
  // Perform an asynchronous GET request.
    	 $('#register_div').html(ajax_loader);
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
     username="";
  	 email="";
  	 $('#register_div').load(URLS.ACCOUNTS+'signup',function(){google_init();});
  	 google_login();
  	 check_logged(register);
    },
    error: function(e) {
      console.log(e);
    }
  });
}
//G+ cancel Authorization

//google_init
function google_init()
{
	//G+ signup
(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client:plusone.js?onload=google_login';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
//G+ signup

(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
  
}
//google_init

function showDialogue(content,header){
  if(content != undefined)
    $('#dialogue-content').html(content);
  if(header != undefined)
    $('#dialogue-header').html(header);
  $('#dialogue-wrapper').fadeIn();
}

function loadDialogue(link,header)
{
 $('#load-dialogue-content').load(link);
  $('#load-dialogue-wrapper').fadeIn();
}

//Workshops function 
function showMessage(tit,con){
var a=document.getElementById("myAlert");
a.innerHTML="<div id='myClose' onclick='removeMessage();'>&#9762;</div><h1>"+tit+"</h1>"+con;
a.style.opacity=1;
}
function removeMessage(){
var a=document.getElementById("myAlert");
document.body.removeChild(a);
var c=document.getElementById("pageFill");
document.body.removeChild(c);
}
//WorkShops Function
function logged_check(){
	$('#signup').hide();
	$('#myktj').show();
	$('#register').hide();
	$('#logout').show();
	$('#register_div').html('');
	$('#signin_reg').hide();
	$('#welcome').show();
	$('#login_div').html(ajax_loader);
	$('#login_div').load(URLS.ACCOUNTS+'profile');
	}

function logged_in()
{
	
	if(register_open==true)
	{
		register(true,logged_check);
	}
	signin(true,logged_check);
}

function myktj_other()
{
	showHome();
	myktj(false);
}


function logged_out()
{
	$('#myktj').hide();
	$('#register').show();
	$('#logout').hide();
	$('#signup').show();
	$('#register_div').html(ajax_loader);
	$('#register_div').load(URLS.ACCOUNTS+'signup');
	$('#login_div').html(ajax_loader);
	$('#login_div').load(URLS.ACCOUNTS+'login');
	$('#welcome').hide();
	$('#signin_reg').show();
}

function capitaliseFirstLetter(word)
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function changeUrl(page){
    console.log(page);
    var info = {a:page};
    if(page == 'home'){
	document.title = "Kshitij 2014 - Asia's largest techno management fest";
	history.pushState(info,page,'/');
    }
    else{
	document.title = "Kshitij 2014 - "+capitaliseFirstLetter(page);
	history.pushState(info,page,'/'+page);
    }
    console.log(info)
}

window.onpopstate = function(e){
    console.log(e.state);
    animation = 0;
    home_animation = 0;
    if(e.state == null || e.state.a == 'home'){
	showHome(true);
    }
    else{
	removeHome(e.state.a,glassBar[e.state.a][0],glassBar[e.state.a][1],showPage,true);
    }
};

function logout()
{
	if(facebook==true)
	{	
FB.logout(function(){facebook=false});
}	
else if(google==true)
{
	cancelGoogleAuthorization();
	google=false;
}
	$.ajax({
		url:URLS.ACCOUNTS+'logout',
		type:'POST'
	}).done(function(data){check_logged(pass,logged_out);});
	
	check_logged(pass,logged_out);
}

function myktj(callback)
{
if(myktj_open==false)
{
$('#myktj').transition({'left':'93%'});
$('#signin').transition({'left':'93%'});
$('#left_blank').transition({'width':'89.4%'});
$('#slider').transition({'right':'-90%'});
$('#right_blank').transition({'right':'-10%'});
$('#register').transition({'right':'-10%'},function(){$('#login_div').fadeIn();});
$('#logout').transition({'right':'-10%'});
$('#social').fadeOut();
myktj_open=true;
}
else if(myktj_open==true)
{
$('#myktj').transition({'left':'270px'});
$('#signin').transition({'left':'270px'});
$('#left_blank').transition({'width':'218px'});
$('#slider').transition({'right':'0px'});
$('#right_blank').transition({'right':'0px'});
$('#register').transition({'right':'60px'},function(){if(callback!=undefined){callback();}});
$('#logout').transition({'right':'60px'});
$('#social').fadeIn();
$('#login_div').fadeOut();
myktj_open=false;
}
}

// Mother of GOD document.ready
$('document').ready(function(){
	
	//Loader
	$('#id_state').live('change',function(){
		url=URLS.ACCOUNTS+'institutes/'+encodeURIComponent($(this).attr('value'));
		$.ajax({
			url:url,
		}).done(function(data){
			$('#id_institution').html("");
			for(i in data)
			{
			$('#id_institution').append('<option value="'+i+'">'+i+'</option>');
			}
		});
		
	})
  /*new megashow goes here */


    $("#mega1").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>Pyrolerra</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  });
  
    $("#mega2").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>BMX</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  });
    $("#mega3").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>Skate Driving</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  
  });
    $("#mega4").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>Roller Skating</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  });
    $("#mega5").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>Stunt Mania</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  });
    $("#mega6").click(function(){
  
  
  $('#mega_tri_write').hide();
  $('#mega_tri_write').html("<h1>EDM</h1>");
  $('#mega_tri_write').fadeIn();
  $('#megashow_text').html("Capcom-designed installment in their Vs. fighting game series, which includes the Marvel vs. Capcom and Capcom vs. SNK series, and the first to be fully rendered in 3D graphics. The game is designed around a simplified three-button attack system, which was inspired by the simplistic control schemes commonly used by both the Vs. series and the Wii. The game received generally positive reviews from critics, who praised its approachable gameplay for newcomers and depth for veteran players. However, reviewers had mixed experiences with its online component, and found Arcade mode lacking in replay value. ");
  
  $('#megashow_text').hide();
  $("#megashow_text").slideDown("slow");
  });
  
  
  /*new megashow end*/
  
	//Loader
	//my results
	//$('#results_back').show();

  $('#dialogue-box').click(function(){
    return false;
  });
  $('#dialogue-wrapper').bind('click',function(){
    $(this).fadeOut();
  });
  
   $('#load-dialogue-box').click(function(){
    return false;
  });
  $('#load-dialogue-wrapper').bind('click',function(){
    $(this).fadeOut();
  });
  
  


google_init();

check_logged(logged_in);

//div.page height init
$('div.page').css({'height':(window.height-120)+"px"})
	
//Set page adjust properties
setZoom();
//Page adjut properties end

//Parallax Initialization
var canvas = document.getElementById('parallax');
      var context = canvas.getContext('2d');
	  var WIDTH=canvas.width;
	  var HEIGHT=canvas.height;
	  var rint=Math.random();
	  var count=0;
 
	  function Circle(id) {
	 this.id=id;
    this.settings = {time_to_live:8000, x_maxspeed:1, y_maxspeed:2, radius_max:10, rt:1, x_origin:960, y_origin:540, random:true, blink:true};

    this.reset = function() {
        this.x = Math.random()*canvas.width+1;
        this.y = Math.random()*canvas.height+1;
        this.r = 5+Math.random()*5+1;
		this.lineWidth=10+Math.random()*10+1;
        this.dx = (Math.random()*this.settings.x_maxspeed) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random()*this.settings.y_maxspeed) * (Math.random() < .5 ? -1 : 1);
        this.hl = (this.settings.time_to_live/rint)*(this.r/this.settings.radius_max);
        this.rt = Math.random()*this.hl;
        this.settings.rt = Math.random()+1;
        this.stop = Math.random()*.2+.4;
        this.settings.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
        this.settings.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    this.fade = function() {
        this.rt += this.settings.rt;
    }

    this.draw = function() {
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.lineWidth = this.lineWidth;
      context.strokeStyle = 'rgba(255,255,255,0.5)';
      context.stroke();    
	  for(var i=this.id;i<count;i++)
	  {
	  if(Math.abs(pxs[i].x-this.x)<100 && Math.abs(pxs[i].y-this.y)<100)
	  {
	  context.beginPath();
	  context.lineWidth = 1;
      context.strokeStyle = 'rgba(255,255,255,1)';
      context.moveTo(pxs[i].x,pxs[i].y);
      context.lineTo(this.x,this.y);
      context.stroke();
	  }
	  }
	  
    }

    this.move = function() {
        this.x += (this.rt/this.hl)*this.dx;
        this.y += (this.rt/this.hl)*this.dy;
        if(this.x > WIDTH || this.x < 0) this.dx *= -1;
        if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }
}

	  var pxs={};
	  
	  window.start_parallax = function()
	  {
	  for(var i=0;i<25;i++)
	  {
      pxs[i] = new Circle(i);
	  count++;
      pxs[i].reset();
	  pxs[i].draw();
	  }
	  var rint=100+Math.random()*50;
	  setInterval(draw,rint);
	  }
	  
	  function draw() {
	  	if(animation==1 || home_animation==1 || stop_parallax==1)
	  	{
	  		return;
	  	}
    context.clearRect(0,0,WIDTH,HEIGHT);
    for(var i = 0; i < count; i++) {
        pxs[i].fade();
        pxs[i].move();
        pxs[i].draw();
    }
}

//End of Parallax Initialization

//Loading Page Scripts
ie = false;
	if(navigator.appName == 'Microsoft Internet Explorer')
		ie = true;
	var angle1 = 0;
	$('#mantle').css('-webkit-transform','translate3d(0px,0px,80px)');
	$('#mantle').css('-moz-transform','translate3d(0px,0px,80px)');
	$('#mantle').css('-ms-transform','translate3d(0px,0px,80px)');

	$('#mantle_rev').css('-webkit-transform','translate3d(0px,0px,115px)');
	$('#mantle_rev').css('-moz-transform','translate3d(0px,0px,115px)');
	$('#mantle_rev').css('-ms-transform','translate3d(0px,0px,115px)');
	setInterval(function(){
		angle1 += 1;
		if(!ie)
		{
			$('#crust').css('-webkit-transform','translate3d(0px,0px,110px) rotate('+angle1+'deg)');
			$('#crust').css('-moz-transform','translate3d(0px,0px,110px) rotate('+angle1+'deg)');
			$('#crust').css('-ms-transform','translate3d(0px,0px,110px) rotate('+angle1+'deg)');
			}
		else
			$('#crust').rotate(angle1);	
	},90);
	var angle2 = 0;
	setInterval(function(){
		angle2 -= 1;
		if(!ie)
		{
			$('#mantle').css('-webkit-transform','translate3d(0px,0px,80px) rotate('+angle2+'deg)');
			$('#mantle').css('-moz-transform','translate3d(0px,0px,80px) rotate('+angle2+'deg)');
			$('#mantle').css('-ms-transform','translate3d(0px,0px,80px) rotate('+angle2+'deg)');
			//$('#mantle_rev').css('-webkit-transform','translate3d(0px,0px,115px) rotate('+angle2+'deg)');
		}
		else
		{
			$("#mantle").rotate(angle2);
			//$("#mantle_rev").rotate(-angle2);
		}
	},490);
	var angle3 = 0;
	setInterval(function(){
		angle3 -= 1;
		if(!ie)
		{
			$('#core_ring').css('-webkit-transform','translate3d(0px,0px,120px) rotate('+angle3+'deg)');
			$('#core_ring').css('-moz-transform','translate3d(0px,0px,120px) rotate('+angle3+'deg)');
			$('#core_ring').css('-ms-transform','translate3d(0px,0px,120px) rotate('+angle3+'deg)');
			}
		else
			$("#core_ring").rotate(angle3);
	},190);
	
	$('body').mousemove(function(event){
		var x = event.clientX;
		var y = event.clientY;
		//x = (x > 683)? (x-683):(683-x);
		//y = (y > 384)? (y-384):(384-y);
		x = x-683;
		y = 384-y;
		var degx = (x/1366)*50;
		var degy = (y/768)*30;
		//$('#mantle').css('-webkit-transform','translate3d(0px,0px,80px) rotate('+(x*0.05)+'deg)');
		$('#planet').css('-webkit-transform','rotateX('+degy+'deg) rotateY('+degx+'deg)');
		$('#planet').css('-moz-transform','rotateX('+degy+'deg) rotateY('+degx+'deg)');
	});
//End of Loading Page Scripts

//Social Buttons Script
$('.soc').hover(function(){
$(this).find('img.social').hide();
$(this).find('img.socialcolor').show();
},
function(){$('img.socialcolor').hide();$('img.social').show();});
//End of Social buttons script

//Register
$('#register_div').html(ajax_loader);
$('#register_div').load(URLS.ACCOUNTS+'signup');
$('#login_div').html(ajax_loader);
$('#login_div').load(URLS.ACCOUNTS+'login');
//Register End

//Campus Ambassador
function isLogged(callback)
{
    $.ajax({
        url:URLS.ACCOUNTS+'check_logged',
        type:'POST',
        success: function(data){callback(data.logged)}
    });
}

$('#campus_rep').click(function()
{   
  isLogged(function(value)
  {
    if (value)
    {
      if (confirm("You want to be Campus Ambassador?"))
      {
        $.ajax({
          url: '/campForm',
          type: 'GET',
          success: function(data){
            showDialogue(data, "<h4>Kshitij 2014 College Representative Form</h4><hr>");
          }
        });
      }
    }
    else
      alert("You need to sign in first");
  });
});


window.campFormValid = function()
{
  if ($('#id_contact').val() == '' ||
      $('#id_address').val() == '' ||
      $('#id_position').val() == '' ||
      $('#id_statement').val() == '')
  {
    $('#campFormErrors').html('All fields are required!');
    return false;
  }
  else if (!($.isNumeric($('#id_contact').val())))
  {
    $('#campFormErrors').html('Contact must be a number!');
    return false;
  }
  else
  {
    var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
    var values=$('#campForm').serialize();
    $.ajax({
      url: '/campForm',
      type: 'POST',
      data:values,
      success:function(data){$('#dialogue-wrapper').fadeOut();alert('Successfully Registered!');}
    });
    return true;
  }
  
}

$('#dialogue-close').click(function()
  {
    $('#dialogue-wrapper').fadeOut();
  });
  
 $('#load-dialogue-close').click(function()
  {
    $('#load-dialogue-wrapper').fadeOut();
  });
//Campus Ambassador End

$('#results_back').hide();
$('#results').click(function(){
	$('#results_back').show();
	$('#results_back').css({"display": "block"});
});
$('#results_close').click(function(){
	$('#results_back').hide();
});

$("#aero_work").click(function() {
  $("#feedback").show();
});



// Kokata Workshop
/*$("#aero_work").click(function()
{
    isLogged(function(value)
    {
        if(value)
        {
            
          $.ajax({
              url:'/kolkataReg',
              type:'GET',
              success: function (data){alert("Successfully Registered!");},
              error: function (data){console.log(data);}
          });
           
        }
        else
            alert("You need to login first");
    });
});*/
// Kokata Workshop End
//aero workshop
//$("#ws_reg").click(function()
//{
//    isLogged(function(value)
//    {
//        if(value)
//        {
//            if (confirm("You want to register for this?"))
//            {
//                $.ajax({
//                    url:'/wsReg',
//                    type:'GET',
//                    success: function (data){alert("Successfully Registered!");},
//                    error: function (data){console.log(data);}
//                });
//            }
//        }
//        else
//            alert("You need to login first");
//    });
//});
////Button wise Controllers
 current_selected_id = "#home_btn";
//Events Button controller
$('#events_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='events')
{
removeHome('events','135px','40px',showPage);
}

/*
 if(current_selected_id != "#events_btn")
 {
 $('#slide_btn_item').transition({'padding-top':'40px'});
 $('#slide_btn_item img').transition({'width':'135px'});
 $('#events_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
   current_selected_id ='#events_btn';
 }*/
});



$('#mktj_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='mktj')
{
removeHome('mktj','125px','325px',showPage);
$('#mktj').load('/user/myktj');
}
});

$('#acco_btn').click(function(){
loadDialogue('/acco','Accomodation');
});

$('#acco_btn-center').click(function(){
loadDialogue('/acco','Accomodation');
});

$('#acco_ws').click(function(){
loadDialogue('/acco','Accomodation');
});

//Guests Button controller
$('#guests_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='guests')
{
removeHome('guests','140px','250px',showPage);
}
/*
if(current_selected_id != "#guests_btn")
{
$('#slide_btn_item').transition({'padding-top':'250px'});
$('#slide_btn_item img').transition({'width':'140px'});
$('#guests_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#guests_btn';
}*/
});
//Contacts Button controller
$('#contacts_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='contacts')
{
removeHome('contacts','130px','292px',showPage);
}
/*
if(current_selected_id != "#contacts_btn")
{
$('#slide_btn_item').transition({'padding-top':'292px'});
$('#slide_btn_item img').transition({'width':'130px'});
$('#contacts_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#contacts_btn';
}*/
});

//Sponsors Button controller
$('#spons_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='spons')
{
removeHome('sponsors','145px','82px',showPage);
}
/*
if(current_selected_id != "#spons_btn")
{
$('#slide_btn_item').transition({'padding-top':'82px'});
$('#slide_btn_item img').transition({'width':'145px'});
$('#spons_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#spons_btn';
}*/

});
//Megashows Button controller
$('#megashows_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='megashows')
{
removeHome('megashows','145px','208px',showPage);
}
/*
if(current_selected_id != "#megashows_btn")
{
$('#slide_btn_item').transition({'padding-top':'208px'});
$('#slide_btn_item img').transition({'width':'145px'});
$('#megashows_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#megashows_btn';
}*/

});
//Workshops Button controller
$('#workshops_btn').click(function(){
  stop_animation=1;
  if(current!='workshops')
  {
  removeHome('workshops','145px','166px',showPage);
}
//  $("#workshop").delay(5000).show();
/*
if(current_selected_id != "#workshops_btn")
{
$('#slide_btn_item').transition({'padding-top':'166px'});
$('#slide_btn_item img').transition({'width':'145px'});
$('#workshops_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#workshops_btn';
}
*/
});

//Exhibitions Button controller
$('#exhibitions_btn').click(function(){
  $("#workshops").hide();
stop_animation=1;
if(current!='exhibitions')
{
removeHome('exhibitions','145px','124px',showPage);
}
/*
if(current_selected_id != "#exhibitions_btn")
{
$('#slide_btn_item').transition({'padding-top':'124px'});
$('#slide_btn_item img').transition({'width':'145px'});
$('#exhibitions_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#exhibitions_btn';
}
*/
});

//Forum Button controller
$('#forum_btn').click(function(){
stop_animation=1;
if(current!='forum')
{
removeHome('forum',showPage);
}
});

//Results Button controller
$('#results_btn').click(function(){
if(current!='results')
{
removeHome('results',showPage);
}
});


//Home Button controller
$('#home_btn').click(function(){
  $("#workshops").hide();
if(current!='home')
{
showHome();
}

/*if(current_selected_id != "#home_btn")
{
$('#slide_btn_item').transition({'padding-top':'0px'});
$('#slide_btn_item img').transition({'width':'125px'});
$('#home_btn').transition({'zoom':'1.07'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#home_btn';
}*/

});

//Start Updates
update();
//Updates End

//Slider initialization
 $('#slider').nivoSlider({
 directionNav: false, // Next & Prev navigation
 controlNav: false,
 });
//end of slider init

//Start the parallax effect
//start_parallax();
//End parallax effect



$('#signin_reg span').click(function(){
  showHome();
  if ($(this).attr('id') == 'sign')
    signin(false);
  else
    register(false);
});

/*****************************EVENTS SCRIPT*************************************************/
setpos();
setpos2_events();
	
	$('#sub_headings li').click(function(){
    if(!$(this).is('.active')){
      if(running_animation == 0){
        running_animation = 1;
        var id = $(this).attr('id');
        $('#sub_headings li.active').removeClass('active');
        $(this).addClass('active');
        $('#sub_highlight').animate({top: ($(this).position().top)+'px'},300);
        var block_id = 'event_'+id;
        $('.event_matter.active div.matter_div').each(function(){ $(this).animate({left:'-=400px', opacity:'0'},500,function(){ if($(this).attr('id') == block_id) $(this).show(); else $(this).hide(); }).animate({left: '+=400px', opacity: '1'},500);});
        setTimeout('running_animation=0;',1000);
      }
	 }
  });

	$('#ribbon li').click(function(){
		//alert('yes');
		var clicked = $(this);
		$('#ribbon li.active').removeClass('active');
		//clicked.transition({'perspective':'300px', 'rotateX': '+=360px'},100);
		clicked.addClass('active');
		//$('#sub_headings ul').hide('drop', { direction : 'right' }, 300);
		//$('#sub_headings ul').show('drop', { direction : 'right' }, 300);
		load_matter(clicked.attr('id'));
	        history.replaceState({a:'events'},'events','/events/'+$(this).attr('id'));
		
	});

	$('.events_list li').mouseenter(function(){
		$(this).find('p').stop(true,true).css({'left':'-=200px','opacity':'0'}).animate({'left':'+=200px', 'opacity':'1'},500);
    //$(this).find('p').stop().css({'-webkit-transform': 'translateX(-100%) rotate(-90deg)', '-moz-transform': 'translateX(-100%) rotate(-90deg)', '-o-transform': 'translateX(-100%) rotate(-90deg)'}).animate({'rotate':'0deg'},500,'easeOutCubic');
		$(this).find('img').stop(true,true).css({'top': '-=100px' , 'opacity':'0'}).animate({'top': '+=100px', 'opacity': '1'},500,'easeOutCubic');
	});

  $('.page#events').on('keydown', function(e){
    if(e.which == 39){
      var target = parseInt($('.events_list li.active').attr('alt'))+1;
      var fin = $('.events_list li[alt='+target+']');
      if(fin.length != 0)
        genre_click(fin.attr('id'));
    }else if(e.which == 37){
      var target = parseInt($('.events_list li.active').attr('alt'))-1;
      var fin = $('.events_list li[alt='+target+']');
      if(fin.length != 0)
        genre_click(fin.attr('id'));
    }else if(e.which == 38){
      var prev = $('.genre_events.active li.active').prev();
      if(prev.length != 0)
        event_click(prev.attr('id'));
    }else if(e.which == 40){
      var next = $('.genre_events.active li.active').next();
      if(next.length != 0)
        event_click(next.attr('id'));
    }
  });

  $('.clickHere').click(function()
    {
      var val = {id:$(this).data('id')};
      isLogged(function(value)
      {
        if (value)
        {
            $.ajax({
                url:'/userReg',
                type:'POST',
                data:val,
                success:function(data){showDialogue(data, "<h4>Event Registration</h4>");},
                error:function(data){showDialogue(data.responseText, "<h4>Event Registration</h4>"); console.log(data);}
            });
        }
        else
          alert("You need to sign in first");
      });
    });

/************************EVENTS_END*********************************************************/

/**********************************************WORKSHOPS*****************************************/

    $('#ws_reg').click(function()
      {
        var val = {id:$(this).find('span').data('id')};
        isLogged(function(value)
        {
          if (value)
          {
              $.ajax({
                  url:'/workshopReg',
                  type:'POST',
                  data:val,
                  success:function(data){showDialogue(data, "<h4>Workshop Registration</h4>");},
                  error:function(data){showDialogue(data.responseText, "<h4>Workshop Registration</h4>"); console.log(data);}
              });
          }
          else
            alert("You need to sign in first");
        });
      });


			var deg;
			setpos1();			
			/*$(".circle").click(function(){
				//alert("yay");
				$(this).css({"-webkit-transform":"rotate(360deg) scale(0.5,0.5)","-moz-transform":"rotate(360deg) scale(2,2)","-o-transform":"rotate(360deg) scale(2,2)","transform":"rotate(360deg) scale(2,2)"});
			});*/
			var rot;
			var clicked_workshop;

/*			$(".workshop").click(function(){
				var count = 0;
				$('.workshop').each(function(){
					$(this).animate({"opacity":"0"},1000,function(){$(this).css("display","none");});
					count++;
				});
				deg = 360/count;
				clicked_workshop = $(this);
				$(this).addClass("active");
				var num = parseInt($(this).attr("alt"));
				rot = 270-(deg*num);
				rot = (rot > 31)?(rot):(360+rot);
				console.log(deg);
				setTimeout(function(){
					$("#parent").css({"-webkit-transform":"rotate("+rot+"deg)","-moz-transform":"rotate("+rot+"deg)","-o-transform":"rotate("+rot+"deg)","transform":"rotate("+rot+"deg)"});
					//clicked_workshop.animate({"width":"100","height":"100"},1000,function(){$(this).fadeOut();});
					$(".workshop").each(function(){
					//if($(this).attr("alt")!=num.toString())$(this).animate({"opacity":"0"},1000);
					
					});
					setTimeout(function(){$(".circle,#border").animate({"opacity":"0"},1000,function(){
						$("#small_circle").fadeIn();
						$("#content,div[alt="+num+"]").fadeIn();
					//gocircle();
					})},1000);},500);
			});

			$("#arrow1,#arrow").click(function(){
				var num =  parseInt(clicked_workshop.attr("alt"));
				$("#small_circle,#content,div[alt="+num+"]").fadeOut("slow");
				setTimeout(function(){
					//clicked_workshop.css({"width":"110","height":"50"});
					clicked_workshop.fadeIn("fast",function(){
            $(".workshop").css("display","block");
            $(".workshop,.circle,#border").animate({"opacity":"1"},1000,function(){
              $('#parent').css({"-webkit-transform":"rotate(60deg)","-moz-transform":"rotate(60deg)","-o-transform":"rotate(60deg)","transform":"rotate(60deg)"});
				    });
          });
					},1000);
				
			});
			
			$("#arrow1").mouseover(
				function(){
					$("#arrow1").css("display","none");
					$("#arrow").css("display","block");
				}
			);

			$("#arrow").mouseout(function(){
					$("#arrow").css("display","none");
					$("#arrow1").css("display","block");
				}
			);

*/
/*****************************************WORKSHOPS END**********************************************/


/******************GUESTS SCRIPTS**************************/
initial1();

	function initial1(){
		var count = 1;
		$(".cell").each(function(){
			count++;
		});
		var middle = count/2;
		middle = (count%2==0)?(middle):(middle+1);
		$(".cell").each(function(){
			if(parseInt($(this).attr('id'))==middle){
				$(this).css({"background-color":"rgba(11,111,153,0.9)"});
				$(this).addClass("active");
				var pos = (463-(216*(middle-1)))*$(window).width()/1366;
				var postn = pos.toString();
				$("#sguests").animate({left : postn+"px"},1000);
				updatedesc(middle.toString());

			}
		});
	}

	$('#sguests').mousemove(function(e){
		//alert(e.pageX+","+e.pageY);
		var move = parseInt(e.pageX)-650;
		var pos = 400+move;
		pos = 0-pos;
		//alert(move);
		$('#sguests').stop().animate({left : pos+"px"},100);
		//$('#sguests').css("-webkit-transform","translateX("+pos+"px)");
	});


	$('.cell').hover(
         function () {
         	if(!$(this).is('.active'))
           $(this).css({"background-color":"rgba(0,0,0,0.9)"});
         }, 
         function () {
         	if(!$(this).is('.active'))
           $(this).css({"background-color":"rgba(0,0,0,0.8)"});
         }
     );

	$('.cell').click(function(){
		$('.cell').each(function(){
			if($(this).is('.active'))$(this).removeClass('active');
			$(this).css({"background-color":"rgba(0,0,0,0.8)"});
		});
		$(this).css({"background-color":"rgba(11,111,153,0.9)"});
		$(this).addClass('active');
		var num = $(this).attr('id');
		clickslide(num);
		updatedesc(num);
	});


function clickslide(num){
	var pos = (463-(216*(parseInt(num))))*$(window).width()/1366;
	var postn = pos.toString();
	$("#sguests").unbind("mousemove"); 
	$("#sguests").animate({left : postn+"px"},1000,function(){$('#sguests').mousemove(function(e){
		//alert(e.pageX+","+e.pageY);
		var move = parseInt(e.pageX)-650;
		var pos = 400+move;
		//alert(move);
		$('#sguests').stop().animate({left : 0-pos+"px"},100);
	});});
}

function updatedesc(num){
	switch(num){
		case '1':var text='Undeniable is the notion that necessity is the mother of invention. <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Alan_Emtage" target="_blank">Alan Emtage</a> came to the rescue of the world when he invented Archie, the very first tool used for searching the internet. Born even before the World Wide Web had taken off, his creation was soon responsible for more than half of Canada&#39;s Internet traffic leading directly to today&#39;s Google, Yahoo and Bing. A founding member of the Internet Society, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Alan_Emtage" target="_blank">Mr. Emtage</a> went on to create and chair several working groups at the Internet Engineering Task Force (IETF), the standard-setting body for the Internet. Having featured on the highly praised PBS series &#39;Life on the Internet&#39;, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Alan_Emtage" target="_blank">Alan Emtage</a> is now heading to Kshitij 2013 to enlighten one and all on internet information systems and the impact of the internet on society.';
		         break;
		case '2':var text='<a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Dov_Frohman" target="_blank">Dov Frohman</a> is the man behind the EPROM, the device that eventually led to the advent of flash memory technology, the former Vice President of Intel Corporation, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Dov_Frohman" target="_blank">Mr. Dov Frohman</a> was, apart from a brilliant inventor, a leader with a vision. He pioneered the expansion of Intel&#39;s operations in Israel, transforming Intel Israel over 15 years into a global centre for high-tech research. IEEE&#39;s Edison medal awardee, winner of the Israel prize (Israel&#39;s highest honour) as well as an inductee into the National Inventors Hall of Fame, he argues that leadership is fundamentally an intrinsic quality. A strong proponent of the virtues of taking risks, nonconformity, and survivalism, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Dov_Frohman" target="_blank">Mr. Dov Frohman</a> will be coming to Kshitij to articulate his brand of unconventional risk taking in the light of his own experiences.';
		         break;
		case '3':var text='Modest is the individual who is chaste with merit. <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/D._Richard_Hipp" target="_blank">Mr. D. Richard Hipp</a> is one of those laudable personalities who chose to remain invisible even though his product SQLite, a self-contained database engine and client, made news world over. By disclaiming the copyright to his source code, and thus placing his creation in the public domain, he sent out a loud and clear message proclaiming free sharing of knowledge and information in this digital age. Winner of the Google-O&#39; Reilly Open Source Award, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/D._Richard_Hipp" target="_blank">Mr. Hipp</a>&#39;s other popular software include Fossil SCM, Lemon Parser Generator and CSVTrac. Kshitij gives you a golden opportunity to interact with this winsome personality as he now heads to IIT Kharagpur.';
		         break;
		case '4':var text='A man of many talents, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Bedabrata_Pain" target="_blank">Mr. Bedabrata Pain</a> has done it all. Senior scientist at NASA for 15 years, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Bedabrata_Pain" target="_blank">Mr. Pain</a> is now pursuing his passion for filmmaking. A painter, playwright and singer, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Bedabrata_Pain" target="_blank">Mr. Pain</a> is the director of the much applauded arthouse film &#39&#39Chittagong&#39&#39. This versatile personality is also the inventor of CMOS Image Sensors- a technology that has very much changed the world of digital imagery, being used in most cameras produced today. Winner of the Lew- Allen award for inventors with over 87 patents to his credit, he is also an inductee into the US Space Technology Hall of Fame. Kshitij 2013 welcomes <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Bedabrata_Pain" target="_blank">Mr. Bedabrata Pain</a> back to his alma mater, where he&#39;ll look to share the experiences of his stellar career.';
		         break;
		case '5':var text='This English mariner is the first man ever to sail single-handed and non-stop around the globe. Throughout his life, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Robin_Knox-Johnston" target="_blank">Sir Robin Knox-Johnston</a> has carried with him the same zeal as he did when his seafaring days started at a tender age of 18. After this amazing feat, this robust athlete has been actively participating in numerous round-the-world races. Recipient of the Jules Verne Trophy, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Robin_Knox-Johnston" target="_blank">Sir Knox-Johnston</a> is also the oldest yachtsman to complete a round the world solo voyage. He also received the prestigious Blue water Medal for a lifetime devoted to the advancement of sailing, sail training and youth development  Kshitij 2013 takes immense pleasure to play host to this self proclaimed old-fashioned gentleman, as he shares his treasure-trove of experiences with the audience.';
		         break;
		case '6':var text='A Fulbright scholar, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Subir_Gokarn" target="_blank">Dr. Subir Gokarn</a> has held many a distinguished position in top- rung financial institutions throughout his long and illustrious career. This ivy league educated Economist is a former Deputy Governor of the Reserve Bank of India, and was instrumental in formulating the monetary policies of the Indian economy through a time of acute crisis. A cultivated savant and an ardent writer, <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Subir_Gokarn" target="_blank">Dr. Gokarn</a> has been contributing a column every fortnight to the Business Standard, India&#39;s leading business newspaper, for the past 13 years. One of the finest analysts of the country, he has always been an integral part of the governance of this country. Kshitij 2013 is privileged to host <a style="color:#bbbbbb;font-weight:bold;"; href="http://en.wikipedia.org/wiki/Subir_Gokarn" target="_blank">Dr. Subir Gokarn</a>, a scholar with outstanding credentials, who looks to share the experiences of his sublime career. ';
		         break;
		case '7':var text='The oblivion beyond the confines of our mother Earth has an endless array of opportunities. <a style="color:#bbbbbb;font-weight:bold;";>Dr. Jacob Cohen</a>, the chief scientist for ISS utilization office, is one of the very few individuals who have been working relentlessly upon one such bright prospect, the challenge of designing organisms which will perform reliable functions that an astronaut may one day depend on. As a Director of the Ames Biology Office within the Engineering Directorate, at NASA Ames Research Centre, <a style="color:#bbbbbb;font-weight:bold;";>Dr. Cohen</a> has been the forerunner of the synthetic biology initiative at NASA Ames. Kshitij 2013 takes immense pride in playing host to this winsome personality who&#39;ll enlighten the attendees upon the employment of space for international and commercial strategies.';
		         break;
                case '8':var text='<a style="color:#bbbbbb;font-weight:bold;";>Mr. Claude Vallee</a> is a researcher at the French National Centre for Scientific Research (CNRS) and Centre de Physique des Particules de Marseille (CPPM). Chairman of the SPS and PS experiments Committee (SPSC) at CERN, he has participated in several high-energy physics experiments at CERN and DESY. An analyst of hidden unexplained phenomenon, <a style="color:#bbbbbb;font-weight:bold;">Mr. Vallee</a> is the father of the Cosmophone, a device that materializes the cosmic radiation in sound. The device was designed and built in 1998 by a team of researchers from the CPPM and the Laboratory of Mechanical Acoustics (LMA) of CNRS. The former student of the Ecole Polytechnique, Paris, <a style="color:#bbbbbb;font-weight:bold;" >Mr. Vallee</a> is recipient of the prestigious &#39;&#39;Prix Création de la Culture Scientifique&#39;&#39;, awarded in 1999 by the French Ministry of Research.';
		         break;
                case '9':var text='SOINN &minus; An Artificial Brain : Osamu Hasegawa is a Japanese researcher in the fields of computer science and robotics at Tokyo Institute of Technology. As the Principle Investigator (PI) of the Imaging Science and Engineering Laboratory, he is leading a research group to further develop an innovative learning mechanism, &quot;SOINN&quot; (Self &minus; Organizing Incremental Neural Network). In addition to being a PI, he is an appointed Associate Professor in the Department of Computational Intelligence and Systems Science, a position that he has held since.Although Professor Hasegawa&apos;s research interest spans across several categories, SOINN will be presented during Kshitij 2013. SOINN is an unsupervised online-learning method capable of incremental learning. By approximating the distribution of input data and the number of classes, a self-organized network is formed. SOINN offers the following advantages: network formation is not required to be predetermined beforehand, high robustness to noise, and reduced computational cost.During his seminal talk at Kshitij 2013, Professor Hasegawa will present his inspiration for creating SOINN as well as its future usage. He believes that in the near future, a SOINN device will accompany an individual from birth; this will allow the agent to share personal histories with its owner. In this occasion, a person&apos;s SOINN will know &quot;everything&quot; about its owner, lending assistance at any time and place throughout one&apos;s lifetime.Besides having a personal SOINN, an individual can install this self-enhanced agent into human-made products &minus; making use of learned preferences to make the system more efficient. If deemed non-confidential, an individual&apos;s SOINN could also autonomously communicate another SOINN to share information.Lastly, Professor Hasegawa and his students will give a demonstration of HIRO, a humanoid robot controlled by SOINN, showing the link between algorithm (brain) and machine tasking.';
        //break;      
	}
	$("#desc").fadeOut(function() {
  		//$(this).text(text).fadeIn();
                $(this).html(text).fadeIn();
	});
}


/********************GUESTS******************/

/********************************MEGASHOWS***************************************************/

$('img.mega_menu_item').click(function(){
if(!$(this).hasClass('mega_menu_item_active'))
{
$('img.mega_menu_item').removeClass('mega_menu_item_active');
$(this).addClass('mega_menu_item_active');
var id=$(this).attr('id')[4];
/*$('img.back_img').stop().addClass('content_inactive');
$('img.back_img').stop().hide('slide',{direction:'right'},0);
$('#b'+id).stop().show('slide',{direction:'left'},700);*/
$('#megashows').scrollTo('#b'+id,200,'easein');


$('.content').stop().fadeOut().addClass('content_inactive');
$('.content').animate({right:'-100%'},200);
$('#c'+id).stop().fadeIn('fast');
$('#c'+id).animate({right:'-25px'},200);
}
});

/****************************************megashows end*********************************************/

/******update******/

isUpdateVis = false;
$('div.update-head').click(function(){
  $('#updates_box').slideToggle(500);
  if (!isUpdateVis)
  {
    $('.update-head').html("Updates "+ "&#9650");
    isUpdateVis = true;
  }
  else
  {
    $('.update-head').html("Updates "+ "&#9660");
    isUpdateVis = false;
  }
});

});

//Resize Adjust Script
$(window).resize(function() {
   setZoom();
});
//Resize Adjust Script

//Events Functions
var running_animation = 0;
//var events = {'genesis': ['Woodstock', 'Forex', 'Excalibur', 'Mobile Wars 5.0', 'Cryptex', 'Mindsport', 'C-Monopoly', 'Relic Hunter', 'Math Challenge'], 'robotix': ['Marauders Map', 'Seeker', 'A.C.R.O.S.S', 'Lumos', 'Overhaul', 'Abyss', 'Robo Zest 13'], 'idp': ['IDP' ,'ACE' ], 'quizzard': ['Bizquiz', 'Techquiz', 'Green Quiz'], 'conceptualize': ['ASME SDE', 'B Plan', 'Eureka', 'Opensoft', 'Vision 2030', 'Smart Fields', 'Speak Out For Engineering'], 'theoryncore': ['Embetronix' ,'Kryotech' ,'Anadigix' ,'Ovenite'], 'abinitio': ['Laws of Motion', 'Race Pulse', 'Bay Strider', 'Nightshift'], 'strategia': ['Innovision', 'The Verdict', 'B Consigiliere'], 'tech4fun': ['Snappit', 'Techquilla','X-Games']};


function setpos(){
	console.log('setpos');
	$('.current_event.active').css({'top': '133px', 'left': '205px'});
	$('.current_event.active li#genesis').fadeIn('slow', function(){ $('.current_event li#genesis img').css({'width': '60px', 'height': '60px'}); });
	$('.events_list#first li#genesis').addClass('active');
	$('.event_matter#woodstock div#event_intro').fadeIn();
	$('.genre_events#genesis').addClass('active');
	$('.event_matter#woodstock').addClass('active');
	$('.genre_events#genesis li:first').addClass('active');
	$('#sub_headings ul#woodstock').addClass('active');
}
function setpos2_events(){
	$('.genre_events').each(function(){
      var num = 0;
      $(this).find('li').each(function(){
    		if (num >= 0 && num <= 2)
    			$(this).css('padding-right', '70px');
    		else if (num > 2 && num <= 4 )
    			$(this).css('padding-right', '75px');
    		else if (num > 4 && num < 7){
    			var calc = (num-4)*5+75;
    			$(this).css('padding-right', calc);
    		}else if(num >=7){
    			var calc = (num-6)*10+85;
    			$(this).css('padding-right',calc);
    		}
    		num++;
      });
	});
}
function postgenre(){

	$('.current_event:not(.active)').animate({left: '+=20', top: '+=100'},50,'linear').animate({left: '+=15', top: '+=50'},50,'linear').animate({left: '+=20', top: '+=100'},50,'linear',function(){$('.current_event.active').removeClass('active');
  $(this).addClass('active'); 
  $('.current_event:not(.active)').css({'top':'-120px','left':'150px','-webkit-transform': 'skewX(0deg)', '-moz-transform': 'skewX(0deg)', '-o-transform':'skewX(0deg)', '-ms-transform': 'skewX(0deg)'}); 
  setTimeout("running_animation = 0;", 50);/*$(this).css({'top': '-=100', 'left': '-=20'}); $('.current_event:not(.active)').css('webkit-transform', '');*/ }); 
	$('.genre_events.active li').removeClass('active');
  $('.genre_events.active li:first').addClass('active');
	change_genre();
}

function genre_click(genre_id){ 
		var i = 0;
		if (running_animation == 0 && ($('.events_list li.active').attr('id') != genre_id) ){
			running_animation = 1;
			console.log('about to animate');

			$('.genre_events#'+genre_id).fadeIn(50,function(){ 
				var i = 1;
				$('.genre_events.active li').each(function(){
					var id = $(this).attr('id');
					console.log('inside active li loop '+id);
					setTimeout("$('.genre_events li#"+id+"').css('display','none')",20*i);
					i++;
				});
				setTimeout("$('.genre_events.active').css('display','none').removeClass('active').find('li').css('display', 'list-item');$('.genre_events#"+genre_id+"').addClass('active');", 20*i);
			});
			var diff = (parseInt($('.events_list li#'+genre_id).attr('alt'))-parseInt($('.events_list li.active').attr('alt')))*($('.events_list li').width()+2);
			$('#genre_highlight').css({'left': '+='+diff+'px'});
			$('.current_event.active').css({'-webkit-transform':'skewX(-3deg)', '-moz-transform':'skewX(-3deg)', '-o-transform':'skewX(-3deg)', '-ms-transform':'skewX(-3deg)'}).animate({left: '+=10px', top: '+=50px'},50,'linear').css({'-webkit-transform':'skewX(-10deg)', '-moz-transform':'skewX(-10deg)', '-o-transform':'skewX(-10deg)', '-ms-transform':'skewX(-10deg)'}).animate({left: '+=15', top: '+=100'},50,'linear').css({'-webkit-transform':'skewX(-17deg)', '-moz-transform':'skewX(-17deg)', '-o-transform':'skewX(-17deg)', '-ms-transform':'skewX(-17deg)'}).animate({left: '-=10px',top:'+=100px'},50,'linear').css({'-webkit-transform':'skewX(-25deg)', '-moz-transform':'skewX(-25deg)', '-o-transform':'skewX(-25deg)', '-ms-transform':'skewX(-25deg)'}).animate({left: '-=22', top: '+=100'},50,'linear').css({'-webkit-transform':'skewX(-40deg)', '-moz-transform':'skewX(-40deg)', '-o-transform':'skewX(-40deg)', '-ms-transform':'skewX(-40deg)'}).animate({left: '-=50', top: '+=100'},50,'linear').css({'-webkit-transform':'skewX(-45deg)', '-moz-transform':'skewX(-45deg)', '-o-transform':'skewX(-45deg)', '-ms-transform':'skewX(-45deg)'}).animate({left:'-=70',top: '+=150'},62.5, 'linear',function(){ $('.current_event:not(.active) ul li').fadeOut();
			$('.current_event:not(.active) ul li#'+genre_id).fadeIn(); setTimeout('postgenre();', 50); });
			//$('#sub_headings ul').hide('drop', { direction : 'right' }, 300);
			$('.events_list li.active').removeClass('active'); $('.events_list li#'+genre_id).addClass('active');
			setpos2_events();
			load_matter($('.genre_events#'+genre_id+' li:first').attr('id'));
		}else{
			return false;
		}
	}


function show_current(genre){
	$('.current_event li').fadeOut();
	console.log('current');
	$('.current_event li#'+genre).fadeIn('fast', function(){$(this).css({'font-size':'0.7em'});});
	$('.current_event li#'+genre+' img').css({'width': '60px', 'height': '60px'});
	$('.current_event li#'+genre+' p').fadeIn();
}

function change_genre(){
	console.log('genred');
	$('#sub_headings ul li').removeClass('active');
	$('#sub_headings ul li#intro').addClass('active');
  $('#sub_highlight').css({'top':'36px'});
	//$('#sub_headings ul').show('drop', { direction : 'right' }, 300);
}

function event_click(event_name){
    //alert('yes');
  if(running_animation == 0){
    running_animation = 1;
    var clicked = $('.genre_events.active li#'+event_name);
    if(clicked != undefined){
      $('#ribbon li.active').each(function(){$(this).removeClass('active'); });
      //clicked.transition({'perspective':'300px', 'rotateX': '+=360px'},100);
      clicked.addClass('active');
      load_matter(clicked.attr('id'));
      setTimeout('running_animation=0;',1000);
    }
  }
}

function load_matter(event_name){
	console.log('hello '+event_name); 
	$('.event_matter.active').animate({left: '-=400px', opacity: '0'},500,function(){
		$('.event_matter.active').css('display','none');  
		$('.event_matter.active').removeClass('active'); 
		console.log('came');

		$('.event_matter#'+event_name).addClass('active').show();

    $('.event_matter#'+event_name).find('div.matter_div').each(function(){ $(this).hide(); });
    $('.event_matter#'+event_name).find('#event_intro').show();
	}).animate({left: '+=400px', opacity: '1'},500);
	
	$('#sub_headings').animate({right: '-=400px', opacity: '0'},500, function(){ 
		$('#sub_headings ul.active').css('display','none');
		$('#sub_headings ul.active').removeClass('active');
		$('#sub_headings ul#'+event_name).addClass('active').show();
    $('#sub_headings ul.active li').removeClass('active');
    $('#sub_headings ul.active li#intro').addClass('active');
		$('#sub_highlight').animate({top: '36px'},10);
	}).animate({right: '+=400px', opacity: '1'},500);
	$(".event_matter:not('active')").css('display','none');
}
//Events Functions

function loadSponsors()
{
$('#spons').load('/sponsors_display');
}

function EnterSite()
{
animation=1;
$('#planet').fadeOut();
$('#ring-inner-landing').transition({'x':'-355'},1000,'easeOutCubic').transition({'opacity':'0'},10,function(){$('#landing').hide();});
$('#ring-outer-landing').transition({'x':'-355'},1000,'easeOutCubic').transition({'opacity':'0'},10);
$('#ring-landing').transition({'x':'-355'},1000,'easeOutCubic').transition({'opacity':'0'},10);
$('body').css('text-align','left');
$('#kgp_logo_loading').hide();
$('#unesco_logo_loading').hide();
SetUpHomeStart();
entered=true;
setTimeout(function(){
$('#container').show();
showMenu();
loadSponsors();
//showSpons(1);
showHomeStart();
animation=0;
},950);
setTimeout(function(){
//Url routing code
routeUrl();
start_parallax();
},2500);
}

function routeUrl(){
var counter = 0;
var path = location.pathname, eventsList = [], genresList = [];
/*$(".events_list > li").each(function(index, item){
genresList.push(item.id);
});*/
$("#ribbon > ul > li").each(function(index,el){
eventsList.push(el);
});
console.log(path);
page_list.forEach(function(page){
    if( path.indexOf(page) > -1){
	//if events
	if (page == 'events'){
	    eventsList.forEach(function(eventItem){
		if( path.indexOf(eventItem.id) > -1){
		    console.log("selected: ",eventItem);
		    removeHome(page,glassBar[page][0],glassBar[page][1],showPage);
		    setTimeout(function(){
			$("ul.events_list > li#"+eventItem.parentNode.id).click();
			setTimeout(function(){
				$(eventItem).click();
			},900);
		    },1200);
		    return;
		}
	    });
	}
	removeHome(page,glassBar[page][0],glassBar[page][1],showPage);
	return;
    }
});
}

/****Register****/	
	function signup()
	{
	var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
	var values=$('#signup_form').serialize();
	$('#register_div').html(ajax_loader);
	values += "&social=" + encodeURIComponent(KTJ);
	$.ajax({
    url: URLS.ACCOUNTS+'signup',
    type: 'POST',
    data:values,
    success:function(data){check_logged($('#register_div').html("Registered Successfully!! Login <a onclick='signin'>Here</a>"),$('#register_div').html(data));},
    error: function(jqXHR, textStatus, errorThrown) {
      
    },
});
	}

/****Register*****/


/*******Login******/

function login_ktj()
	{
	$('login_div').html(ajax_loader);
	var token = $('input[name="csrfmiddlewaretoken"]').prop('value');
	var values=$('#login_form').serialize();
	$('#login_div').html(ajax_loader);
	$.ajax({
    url: URLS.ACCOUNTS+'login',
    type: 'POST',
    data:values
    }).done(function(data){$('#login_div').html(data);check_logged(logged_in,signin);});
	}


/*******Login******/

function showPage(page,bar_width,bar_pos,callback)
{
        if (page == 'sponsors') page = 'spons';
	stop_animation=1;
	$('#'+page).fadeIn('slow',function(){stop_animation=0;});
	$('img.logo-wheel').attr('src','/static/img/'+page+'.png');
  callback(page,bar_width,bar_pos);
	current=page;
}

function showHomeStart()
{
if(home_animation==1)
{
return;
}
home_animation=1;
$('.page').fadeOut();$('#home').fadeIn();
$('#spons-box').transition({'right':'0px','opacity':'1'});
$('#spons-ring').transition({'right':'-280px','opacity':'1'});
$('#spons-ring-outer').transition({'right':'-262px','opacity':'1'});
rotateBounce(135);
$('#about').transition({ 'top':'0px','rotate': '0deg','opacity':'1'},500,'ease');
$('#slider').transition({ 'top':'0px','rotate': '0deg','opacity':'1'},500,'ease');
$('#signin').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#myktj').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#archives').transition({'top':'616px','rotate': '0deg','opacity':'1'},500,'ease');
$('#left_blank').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#right_blank').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#register').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease',function(){$('#update-wrap').css('background','transparent');$('img.logo-wheel').attr('src','/static/img/kshitij2014.png');home_animation=0;current='home';});
$('#logout').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease',function(){$('#update-wrap').css('background','transparent');$('img.logo-wheel').attr('src','/static/img/kshitij2014.png');home_animation=0;current='home';});
$('#header').transition({'height':'110px'},500);
$('#header-wrap').transition({'opacity':'1'});
$('#update-wrap').transition({'top':'110px'});
$('#header-wrap-small').transition({'opacity':'0','display':'none'});

}

function SetUpHomeStart()
{
$('#spons-box').transition({'right':'-500px','opacity':'0'});
$('#spons-ring').transition({'right':'-500px','opacity':'0'});
$('#spons-ring-outer').transition({'right':'-500px','opacity':'0'});
$('#update-wrap').css('background','#FFFFFF');
$('#about').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#slider').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#signin').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#myktj').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#archives').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#left_blank').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#right_blank').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').transition({'opacity':'0'});
$('#register').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').animate({'opacity':'0'},function(){home_animation=0;});
$('#logout').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },100,'ease').animate({'opacity':'0'},function(){home_animation=0;});
$('#header').transition({'height':'80px'},50);
$('#update-wrap').transition({'top':'84px'},50);
$('#header-wrap').transition({'opacity':'0'});
$('#header-wrap-small').transition({'opacity':'1','display':'none'});
}


//Remove Home
function removeHome(page,bar_width,bar_pos,callback)
{
if(home_animation==1)
{
return;
}
if(page==undefined)
{
page='home';
}
if (arguments.length == 4)
changeUrl(page);
home_animation=1;
$('#spons-box').transition({'right':'-500px','opacity':'0'});
$('#spons-ring').transition({'right':'-500px','opacity':'0'});
$('#spons-ring-outer').transition({'right':'-500px','opacity':'0'});
if(page_list.indexOf(page)>page_list.indexOf(current))
{
rotateBounceReverse(-360);
}
else
{
rotateBounce(360);
}
$('#update-wrap').css('background','#FFFFFF');
$('#about').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#slider').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#signin').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#myktj').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#archives').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#left_blank').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#right_blank').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').transition({'opacity':'0'});
$('#register').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').animate({'opacity':'0'},function(){home_animation=0;});
$('#logout').transition({ 'top':'-1000px','left':'-100','rotate': '-20deg' },1000,'ease').animate({'opacity':'0'},function(){home_animation=0;});
$('#header').transition({'height':'80px'},500);
$('#update-wrap').transition({'top':'84px'},500);
$('#header-wrap').transition({'opacity':'0'});
$('#header-wrap-small').animate({'opacity':'1'},300,function(){$('.page').fadeOut(); if(callback!=undefined){callback(page,bar_width,bar_pos,navigationTab);}});
$('#header-wrap-small').show();
}

function allowEnter()
{
$('#core').hide();
$('#core-enter').show();
$('#loading_dots').fadeOut();
$('#loading_ktj').fadeIn();
stop_parallax=0;
$('body').keypress(function(e) {
    if (e.which == 13 && entered==false) {
        EnterSite();
    }
});
}

function navigationTab(page,bar_width,bar_pos)
{
  $('#slide_btn_item').transition({'padding-top':bar_pos});
$('#slide_btn_item img').transition({'width':bar_width});
$('#'+page+'_btn').transition({'zoom':'1.1'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#'+page+'_btn';
}

//Show Home
function showHome()
{
if(home_animation==1)
{
return;
}
if(arguments.length < 1)
changeUrl('home');
home_animation=1;
$('.page').fadeOut();$('#home').fadeIn();
$('#spons-box').transition({'right':'0px','opacity':'1'});
$('#spons-ring').transition({'right':'-280px','opacity':'1'});
$('#spons-ring-outer').transition({'right':'-262px','opacity':'1'});
rotateBounce(360);
$('#about').transition({ 'top':'0px','rotate': '0deg','opacity':'1'},500,'ease-off');
$('#slider').transition({ 'top':'0px','rotate': '0deg','opacity':'1'},500,'ease');
$('#signin').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#myktj').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#archives').transition({ 'top':'616px','rotate': '0deg','opacity':'1'},500,'ease');
$('#left_blank').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#right_blank').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease');
$('#register').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease',function(){$('#update-wrap').css('background','transparent');$('img.logo-wheel').attr('src','/static/img/kshitij2014.png');home_animation=0;current='home';});
$('#logout').transition({ 'top':'144px','rotate': '0deg','opacity':'1'},500,'ease',function(){$('#update-wrap').css('background','transparent');$('img.logo-wheel').attr('src','/static/img/kshitij2014.png');home_animation=0;current='home';});
$('#header').transition({'height':'110px'},500);
$('#header-wrap').transition({'opacity':'1'});
$('#update-wrap').transition({'top':'110px'});
$('#header-wrap-small').transition({'opacity':'0','display':'none'});
$('#slide_btn_item').transition({'padding-top':'0px'});
$('#slide_btn_item img').transition({'width':'125px'});
$('#home_btn').transition({'zoom':'1.1'});
 $(current_selected_id).transition({'zoom':'1'});
 current_selected_id ='#home_btn';
}

//Updates Function
function update()
{
foo = $('#updates');
foo.typer(updates);
console.log(updates);
}



//Show Sponsors
function showSpons(id, backgrounds)
{
  if(backgrounds[id-2] == undefined)
    var prev = backgrounds[backgrounds.length-1];
  else
    var prev = backgrounds[id-2];
  if(backgrounds[id-1] != prev){
    $("#spons-ring-outer").transition({'rotate':'-180deg'});
    $('#spons-box').animate({'margin-right':'-300px'},function(){
      $('.spons_slides').hide();
      $("#spons-ring-outer").css({'transform':'rotate(180deg)'});
      $("#spons-ring-outer").css({'background-image':'url('+backgrounds[id-1]+')'});
      $('#spons_'+id).show();
      $("#spons-ring-outer").transition({'rotate':'0deg'},500);
    }).transition({'margin-right':'0px'});
  }else{
    $('#spons-box').animate({'margin-right': '-300px'},function(){ 
      $('.spons_slides').hide();
      $('#spons_'+id).show();
    }).transition({'margin-right': '0px'});
  }
}

//Adjust Screen Properties
function setZoom(){
 var h = $(window).height();
   var w = $(window).width();
   var move_left = w/11;
   zoomh =h/height*100;
   zoomw = w/width*100;
   if(zoomh>zoomw)
     zoom = zoomw;
   else
     zoom = zoomh;
	zoom=zoomh;
   $("body").css("zoom",zoom+"%");
}


//Signin Animation
function signin(force,callback)
{
	if(force!=undefined)
	{
		signin_open=force;
		if(signin_open!=register_open)
		{
			if(force!=true)
			{
			register();
			}
		}
	}
if(signin_open==false)
{
$('#signin').transition({'left':'93%'});
$('#myktj').transition({'left':'93%'});
$('#left_blank').transition({'width':'89.4%'});
$('#slider').transition({'right':'-90%'});
$('#right_blank').transition({'right':'-10%'});
$('#register').transition({'right':'-10%'},function(){$('#login_div').fadeIn();});
$('#logout').transition({'right':'-10%'});
$('#social').fadeOut();
signin_open=true;
}
else if(signin_open==true)
{
$('#signin').transition({'left':'270px'});
$('#myktj').transition({'left':'270px'});
$('#left_blank').transition({'width':'218px'});
$('#slider').transition({'right':'0px'});
$('#right_blank').transition({'right':'0px'});
$('#register').transition({'right':'60px'},function(){if(callback!=undefined){callback();}});
$('#logout').transition({'right':'60px'});
$('#social').fadeIn();
$('#login_div').fadeOut();
signin_open=false;
}



}

//archives animation

function archives()
{
 
if(archives_open==false)
{
$('#archives_blank').transition({'left':'155px'});
$('#archives_div').fadeIn();
archives_open=true;
}
else if(archives_open==true)
{
$('#archives_div').fadeOut();
$('#archives_blank').transition({'left':'50px'});
archives_open=false;
}

}

//Register animation
function register(force)
{
if(force !=undefined)
{
	register_open=force;
	if(register_open!=signin_open)
	{
		signin();
	}
}
if(register_open==false)
{
$('#signin').transition({'left':'-20%'});
$('#myktj').transition({'left':'-20%'});
$('#left_blank').transition({'left':'-30%'});
$('#slider').transition({'right':'81%'});
$('#right_blank').transition({'width':'78.5%'});
$('#logout').transition({'right':'77%'});
$('#register').transition({'right':'77%'},function(){$('#register_div').fadeIn();});
register_open=true;
}
else if(register_open==true)
{
$('#signin').transition({'left':'270px'});
$('#myktj').transition({'left':'270px'});
$('#left_blank').transition({'left':'100px'});
$('#slider').transition({'right':'0px'});
$('#right_blank').transition({'width':'80px'});
$('#register').transition({'right':'60px'});
$('#logout').transition({'right':'60px'});
$('#register_div').fadeOut();
register_open=false;
}

}


//Menu Animation
function showMenu()
{
$('.menu-item').each(function(i){
$(this).delay(200*i).transition({marginLeft: "0px"}, 500);
$(this).delay(10*i).transition({marginLeft: "-10px"}, 100);
$(this).delay(10*i).transition({marginLeft: "10px"}, 200);
$(this).delay(10*i).transition({marginLeft: "0px"}, 100);

});
}


//Left Ring Rotate Function with bounce
function rotateBounce(deg)
{
$('#ring').stop().transition({ rotate: parseInt(rot)+deg+10+'deg' },900,'easeInOutExpo').transition({ rotate: parseInt(rot)+deg-5+'deg' },500,'ease').transition({ rotate: parseInt(rot)+deg+'deg' },700,'ease');
rot+=deg;
}

//Left Ring Rotate Function Reverse with bounce
function rotateBounceReverse(deg)
{
$('#ring').transition({ rotate: parseInt(rot)+deg-10+'deg' },900,'easeInOutExpo').transition({ rotate: parseInt(rot)+deg+5+'deg' },500,'ease').transition({ rotate: parseInt(rot)+deg+'deg' },700,'ease');
rot+=deg;
}

//Left Ring Rotate function
function rotate(deg)
{
//rot=$('#ring').css('rotate');
$('#ring').transition({ rotate: parseInt(rot)+deg+'deg' },1000,'ease');
rot+=deg;
}





function setpos1(){
				var count = 0;
				$('.workshop').each(function(){
					count++;
				});
				var i = 0;
				var theta = 2*Math.PI/count;
				deg = 360/count;
				var angle = 0;
				$('.workshop').each(function(){
					var y = 220-290*Math.cos(angle)-25;/*(width/2)-rad*sin-(imgheight)*/
					var x = 220+290*Math.sin(angle)-95;
					var total = (i*deg)+270;
					if((total>=414)&&(total<590)){total+=180;$(this).css("text-align","right");if(total==450){x+=10;}else if(total==495){y+=10;x-=10;}else if(total==540){x-=30;}else if(total==585){x-=10;y-=10;}}
					$(this).css({"top" : y.toString()+"px" , "left" : x.toString()+"px" , "-webkit-transform" : "rotate("+total+"deg)", "-moz-transform" : "rotate("+total+"deg)", "-o-transform" : "rotate("+total+"deg)", "transform" : "rotate("+total+"deg)"});
					angle += theta;
					i++;
				});
				i=0;
				angle=0;
				$('.dot').each(function(){
					var y = 180-180*Math.cos(angle)-11;
					var x = 180-180*Math.sin(angle)-11;
					$(this).css({"top" : y.toString()+"px" , "left" : x.toString()+"px"});
					angle += theta;
					i++;
				});
				$('#parent').css({"-webkit-transform":"rotate(60deg)","-moz-transform":"rotate(60deg)","-o-transform":"rotate(60deg)","transform":"rotate(60deg)"});
}

function reg_work(con)
{ $("#load").load("update_work.php?ws="+con);
}


function goto(pos,rem)
{
console.log('entered goto');
$('img#item'+rem).removeClass('mega_menu_item_active');
$('img#item'+pos).addClass('mega_menu_item_active');
//var id=$('img#'+pos).attr('id');
/*$('#b'+id).stop().show('slide',{direction:'left'},700);
$('#b'+rem).stop().hide('slide',{direction:'right'},0);*/
$('#megashows').scrollTo('#b'+pos,200,'easein');
$('.content').stop().fadeOut().addClass('content_inactive');
$('.content').animate({right:'-100%'},200);
$('#c'+pos).stop().fadeIn('fast');
$('#c'+pos).animate({right:'-25px'},200);
}


function next()
{
var pos=parseInt($('img.mega_menu_item_active').attr('id')[4]);
console.log(pos);
if(pos>=4)
{
var id=1;
}
else
{
var id=pos+1;
}
console.log(id);
goto(id,pos);
}

function prev()
{
var pos=parseInt($('img.mega_menu_item_active').attr('id')[4]);
console.log(pos);
if(pos<=1)
{
var id=4;
}
else
{
var id=pos-1;
}
console.log(id);
goto(id,pos);
}

function showSP(elem)
{
        if ($(elem).hasClass('spons_visible')) return;
        $('div.sponsorsTab > a.spons_visible').removeClass('spons_visible');
        $(elem).addClass('spons_visible');
        $('div.sponsors > div.sponsorsPage.spons_visible').removeClass('spons_visible');
        $('div.sponsors > div.sponsorsPage:nth-child('+($(elem).index()+1)+')').addClass('spons_visible');
}

function save_acco()
  {
   var values=$('#acco-form').serialize();
   $.ajax({
   	url:'/acco/save',	
   	data:values,
   	type:'POST',
   	success:function(data){ 
   		$('#load-dialogue-content').html(data);
  		$('#load-dialogue-wrapper').fadeIn();
  		}
   	
   });
  }


