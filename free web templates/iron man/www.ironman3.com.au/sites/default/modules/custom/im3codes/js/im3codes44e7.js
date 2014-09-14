if ( ! window.console ) console = { log: function(){} };

(function ($) {
  Drupal.behaviors.IM3CODES = {
    attach: function (context, settings) {
      // Your Javascript code goes here

      $('#im3-comp-form input, #im3-comp-form textarea').placeholder();

      $('#im3-comp-intro .enter-btn').click(function() {
            $('#im3-comp-intro').fadeOut();
            $('#im3-comp-form').fadeIn();
      });

      $('#im3-comp-form .comp-back').click(function() {
            $('#im3-comp-form').fadeOut();
             $('#im3-comp-intro').fadeIn();
      });

      $(".terms-fancybox").fancybox({
        maxWidth  : 960,
        maxHeight : 800,
        padding : 1,
        width : '80%',
        height : '80%',
        //type: 'ajax',
        autoSize  : true,
        /*ajax: {
          dataFilter: function(data) {
            return $(data).find('#terms')[0];
          }
        }*/
      });

      //Tooltips
      $('.tooltip-hint').tipsy({
        html:true,
        gravity: 'nw',
        delayOut:2000,
        fade: true,
        opacity: 1,
        title: function(){
          $('.tipsy').hide();
          return this.getAttribute('original-title');
        }
      });


      var browserWidth = $(window).width();
      $(window).resize(function() {
         browserWidth = $(window).width();
      });

      if (browserWidth > 680) {
        //$(".youtube").colorbox({iframe:true, innerWidth:'80%', innerHeight:'80%'});
        $(".hint-2-link").fancybox({ padding: 0 });

      }






     /* $('#im3_code_2 .tooltip-hint').tipsy({
        html:true,
        gravity: 'n',
        delayOut:2000,
        title: function(){
          $('.tipsy').hide();
          return this.getAttribute('original-title');
        }
      });
      $('#im3_code_3 .tooltip-hint').tipsy({
        html:true,
        gravity: 'ne',
        delayOut:2000,
        title: function(){
          $('.tipsy').hide();
          return this.getAttribute('original-title');
        }
      });*/


    }
  };

$(document).ready(function() {
   $('#jq-fb-feed').load( window.location.protocol + '//' + window.location.hostname + '/sites/default/modules/custom/im3codes/im3fb/fb-feed.php', function() {
      console.log('FB loaded');
  });

});

}(jQuery));

function fancyVideo() {
      alert('ran');
      console.log('run');
      /*jQuery.fancybox.open([{
        href: 'http://www.youtube.com/watch?v=vVace-ofGSI'
      }]);*/

};
