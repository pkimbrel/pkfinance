/**
 * Created by pkimbrel on 3/26/14.
 */
$(document).ready(function () {

    $('.sidebar').affix();
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.ajaxOptions = {
        type: "GET"
    };


});
