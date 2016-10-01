// Common functionality for all widget types.

var hasLpFusionScript = false;

$(window).on('message', function(event) {
    var data = event.originalEvent.data;

    if(data && data.hasLpFusionScript) {
        hasLpFusionScript = true;
    }
});

// Opens a widget in either an overlay or a new window.
// `item` should be an element with data attributes of the ad.
function widgetOpenAd(item, image) {
    if (!hasLpFusionScript) {
        var width = 300;
        var height = 600;

        if(image) {
            width = image[0].naturalWidth;
            height = image[0].naturalHeight;
        }

        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);

        window.open(item.data('image'), '_lp_fusion', 'menubar=no,status=no,toolbar=no,fullscreen=no,' +
            'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top, true);
    } else {
        parent.postMessage({
            lpFusionAd: true,
            id: item.data('id'),
            title: item.data('title'),
            image: item.data('image'),
            phoneNumber: item.data('phone-number'),
            email: item.data('email'),
            url: item.data('url'),
            address: item.data('address'),
            shareUrl: item.data('share-url')
        }, '*');
    }
}
