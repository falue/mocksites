$(document).ready(function () {
    $('.reporter-form input, .reporter-form textarea').focus(function () {
        var id = $(this).attr('id');
        $(this).addClass('focus')
            .removeClass('error_input');
        $('label[for=' + id + ']').hide();
    }).blur(function () {
            $(this).removeClass('focus');
            var id = $(this).attr('id');
            if ($(this).val() == '')
                $('label[for=' + id + ']').show();
        });

    $('a.lossen').click(function(){
        var file_name = $(this).attr('subname');
        $(this).parents('span')
            .html('<input type="file" name="' + file_name + '">');

        return false;
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $('.fancybox-overlay-finish').remove();
            $('.reporter-form-ajax').hide();
        }
    });

    $('.news-repost a').click(function(){
        $('.reporter-form-ajax').show();
        $('body').append('<div class="fancybox-overlay-finish"></div>');
        $('.fancybox-overlay-finish').click(function(){
            $('.fancybox-overlay-finish').remove();
            $('.reporter-form-ajax').hide();
        });
        return false;
    });

    window['clearLabel'] = function () {
        $('.reporter-form input, .reporter-form textarea').each(function (n,el) {
            var id = $(el).attr('id');

            if ($(el).val() != '' || $(el).hasClass('focus')) {
                $('label[for=' + id + ']').hide();
            } else {
                $('label[for=' + id + ']').show();
            }
        })
        window.setTimeout(window['clearLabel'], 100);
    }
    window['clearLabel']();

    $('.reporter-form-ajax input[type=submit]').click(function(){
        if($.trim($('#vorname').val())==''){
            $('#vorname').addClass('error_input');
        }
        if($.trim($('#name').val())==''){
            $('#name').addClass('error_input');
        }
        if($.trim($('#text').val())==''){
            $('#text').addClass('error_input');
        }
        if($.trim($('#code').val())==''){
            $('#code').addClass('error_input');
        }

        if($('.reporter-form-ajax .error_input').size()==0) {
            if($(this).hasClass('submit-loading')) {
                return false;
            }
            $(this).addClass('submit-loading');
        } else {
            return false;
        }
    });
});