
          function blink (selector) {
            var defaults = {delay: 500};
            var options = $.extend(defaults, options);

            $(selector).animate({opacity: 0}, 2, "linear", function () {
                $(this).delay(800);
                $(this).animate({opacity: 1}, 2, function () {
                    blink(this);
                });
                $(this).delay(800);
                setTimeout("$(que).unblink();", 300);
            });

            /* return $(this).each(function(idx, itm) {
             var handle = setInterval(function() {
             if ($(itm).css("visibility") === "visible") {
             $(itm).css('visibility', 'hidden');
             $(itm).css('visibility', 'hidden');
             } else {
             $(itm).css('visibility', 'visible');
             }
             }, options.delay);

             $(itm).data('handle', handle);
             });*/
        }
(function ($) {
$.fn.unblink = function () {
    return $(this).each(function (idx, itm) {
        var handle = $(itm).data('handle');
        if (handle) {
            clearInterval(handle);
            $(itm).data('handle', null);
            $(itm).css('visibility', 'inherit');
        }
    });}}
(jQuery));

/**
 * Created by Caro on 14.09.17.
 */
