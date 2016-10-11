if (window.adgroupid == undefined ) { window.adgroupid = Math.round(Math.random()*1000); } 
var ADTECH = ADTECH || {};
ADTECH.loadAd = function (container, adid, complete) {
    postscribe(container, '<script type="text/javascript" src="http://ad.dc2.adtech.de/addyn/3.0/1084/'+adid+'/0/509/ADTECH;loc=100;target=_blank;key='+mmKey1+'+'+mmKey2+'+'+mmKey3+'+'+mmKey4+';grp='+window.adgroupid+';misc='+new Date().getTime()+'"><\/script>', {done: complete});
};

$(document).ready(function() {
    var adContainer = $(".billboardAdContainer");
    var adid = adContainer.attr("data-id");

    $(document).bind("scroll", function() {
        var scrollTop = $(window).scrollTop();
        // Call the lazyload 400 Pixels before the Element is in the Viewport, because it needs some time to load and the user might not see it until it's loaded
        var elementTop = parseInt(adContainer.offset().top-400);
        var scrollBottom = scrollTop + $(window).height();

        if(scrollBottom >= elementTop) {
            ADTECH.loadAd(adContainer, adid);
            $(document).unbind("scroll");
        }
    });
});