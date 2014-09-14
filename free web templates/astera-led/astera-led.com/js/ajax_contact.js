$(document).ready(function() {

		// any form with ajax_contact will be dynamic.
		$('form.ajax_contact').submit(function(e) {
			e.preventDefault();
			var thisform = $(this);

			var errorsClass = $(this).attr("data-errorsClass");
			var successClass = $(this).attr("data-successClass");
	
			$('.'+errorsClass).remove();
			var hasError = false;

			if(!hasError) {
				var formInput = $(this).serialize();

				$.post('js/php/ajax_contact.html',formInput, function(data){
					if(data == 'sent')
					{
						thisform.slideUp("fast", function() {				   
							$(this).before('<p class="'+successClass+'">Thank you, your message was sent.</p>');
						});
					}
					else
					{
						thisform.parent().append('<p class="'+errorsClass+'">'+data+'</p>');
					}


				});
			}
			
			return false;	

		});


});
