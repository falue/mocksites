$(document).ready(function () {
    $('.fancybox').fancybox({
        padding: 0
    });
    $('.fancybox-map').fancybox({
        type: 'iframe',
        padding: 0
    });
    $('.fancybox-send').fancybox({
        width: 635,
        height: 300,
        minWidth: 635,
        minHeight: 300,
        maxWidth: 635,
        type: 'iframe',
        padding: 0
    });
    $('.fancybox-galery-main-page').fancybox({
        helpers: {
            title: {
                type: 'inside'
            }
        },
        showFinishGallery : true,
        padding: 0,
        beforeShow: function() {
            $('.fancybox-overlay-finish').remove();
            $('.photo-gallery-holder').remove();
        }
    })
    window['showFinishGallery'] = function() {
        $.ajax({
            url:'/?showGalleryInfoTotal=1',
            success:function(res){
                $('body').append(res);
            }
        });
    };

    $(document).on('click', '.fancybox-overlay-finish .close, .photo-gallery-holder .galery-link-small', function(){
        $('.fancybox-overlay-finish').remove();
        $('.photo-gallery-holder').remove();
    });

});