var arr = [
	{src:"sponsor_images/sms_kaps.png",title:"SMS Partner"}
	];

		function slshow(id){
			function l(i){
				$("#"+id+">#spons_heading").html(arr[i].title);
				$("#"+id+">#image").attr('src',arr[i].src);
				i++;
				if(i==arr.length)i=0;
				setTimeout(function(){l(i);},3000);
			}
			l(0);
		}
var sdf = new slshow("spons_main");                                
                            