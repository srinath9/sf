// Disney Forced Timestamp

(function ($) {

  Drupal.behaviors.timeWarp = {
    attach: function(context, settings) {
      $('#edit-forced-timestamp').change(function() {
        if (! isNaN($(this).val())) {
          $(this).parents('form').submit();
        } else {
          $('#block-dimg-forced-timestamp-dimg-timewarp-popup').show();
        }
      });
      $('#timewarp_popup_close').click(function() {
        $('#block-dimg-forced-timestamp-dimg-timewarp-popup').hide();
      });
    }
  };

})(jQuery);
