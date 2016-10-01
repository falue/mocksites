$(function() {
    var hasLopanAd = $('#lopan-ad').length > 0;
    var lopanAdCounter = SETTINGS.lopanAdInterval;
    var carousel = $('#carousel');
    var touchStart = 0;
    var swipeThreshold = 50;
    var swiping = false;
    var pauseTimeout = null;

    function init() {
        fixTooFewAds();

        if(!canShowAds()) {
            removeLopanAd();
        }

        carousel.carousel({
            interval: SETTINGS.lpAdDuration * 1000
        });

        if($('#lopan-ad.active').length > 0) {
            pauseForLopanAd();
        } else {
            carousel.find('.item').not('#lopan-ad').first().addClass('active');
        }

        // Prevent a blank frame caused by inactive ad campaigns or otherwise not loading lopan ads.
        setTimeout(function() {
            if(hasLopanAd && isAdServerAd() && !isAdServerActiveCampaign()) {
                resumeFromLopanAd();

                setTimeout(function() {
                    // The lopan ad can be removed if it still hasn't loaded after showing the first ad.
                    if(!isAdServerActiveCampaign()) {
                        removeLopanAd();
                    } else {
                        resetLopanAd();
                        lopanAdCounter = 0;
                        updateLopanAd();
                    }
                }, SETTINGS.lpAdDuration * 1000 - 500);
            }
        }, 500);
        
        loadImages();

        carousel.on('slid.bs.carousel', function () {
            if(hasLopanAd) {
                updateLopanAd();
            }
            
            loadImages();
        });
        
        $('[data-control=prev]').click(function() {
            manualNavigate('prev');
        });
        
        $('[data-control=next]').click(function() {
            manualNavigate('next');
        });
        
        $('body').on('click', '.item-body > img', function() {
            var image = $(this);
            var item = image.closest('.item');
            widgetOpenAd(item, image);
        });
        
        $(window).on('message', function(event) {
            var data = event.originalEvent.data;
            
            if(data && data.rotatorAction == 'stop') {
                carousel.carousel('pause');
            } else if(data && data.rotatorAction == 'resume') {
                carousel.carousel('cycle');
            }
        });

        carousel.on('touchstart', function(ev) {
            var touches = ev.originalEvent.touches;

            if(!touches || touches.length != 1) {
                return;
            }

            if($('#lopan-ad').hasClass('active')) {
                return;
            }

            touchStart = touches[0].pageX;
            swiping = true;
        });

        carousel.on('touchmove', function(ev) {
            var touches = ev.originalEvent.touches;

            if(!touches || !swiping) {
                return;
            }

            var delta = touchStart - touches[0].pageX;

            if(Math.abs(delta) >= swipeThreshold) {
                swiping = false;

                if(delta > 0) {
                    manualNavigate('next');
                } else {
                    manualNavigate('prev');
                }
            }
        });

        carousel.on('touchend', function() {
            swiping = false;
        });
    }

    function fixTooFewAds() {
        var items = carousel.find('.item').not('#lopan-ad');

        if(items.length == 1) {
            var item = items.last();
            carousel.find('.carousel-inner').append(item.clone());
        }
    }

    function removeLopanAd() {
        hasLopanAd = false;
        $('#lopan-ad').remove();

        if(carousel.find('.item.active').length == 0) {
            carousel.find('.item').first().addClass('active');
        }

        if(pauseTimeout) {
            clearTimeout(pauseTimeout);
            carousel.carousel('cycle');
            carousel.find('.carousel-control').removeClass('hidden');
        }
    }
    
    function manualNavigate(dir) {
        resetLopanAd();
        carousel.carousel(dir);
    }

    function resetLopanAd() {
        if(hasLopanAd) {
            lopanAdCounter = SETTINGS.lopanAdInterval;
            var ad = $('#lopan-ad');
            ad.removeClass('item');
            ad.addClass('hidden');
        }
    }
    
    function updateLopanAd() {
        lopanAdCounter -= 1;
        var ad = $('#lopan-ad');
        
        if(lopanAdCounter <= 0) {
            ad.addClass('item');
            ad.removeClass('hidden');

            // We cannot move the #lopan-ad element because copying would mean that the Ad script would be executed again,
            // therefore we need to move the elements around it.

            carousel.find('.item').removeClass('before-lopan').removeClass('after-lopan');
            ad.prevAll('.item').addClass('before-lopan');
            ad.nextAll('.item').addClass('after-lopan');

            var active = carousel.find('.item.active');

            if(active.hasClass('before-lopan')) {
                var before = active.nextAll('.before-lopan');
                ad.after(before.clone());
                before.remove();
            } else {
                var after = active.prevAll('.after-lopan');
                ad.before(after.clone());
                after.remove();
                
                ad.before(active.clone());
                active.remove();
            }

            lopanAdCounter = SETTINGS.lopanAdInterval + 1;
        } else {
            if(!ad.hasClass('active')) {
                ad.removeClass('item');
                ad.addClass('hidden');
            }
        }
        
        if(ad.hasClass('active')) {
            pauseForLopanAd();
        }
    }
    
    function loadImages() {
        var active = carousel.find('.item.active');
        
        var next = active.next();
        if(next.length == 0) {
            next = carousel.find('.item').first();
        }
        
        var prev = active.prev();
        if(prev.length == 0) {
            prev = carousel.find('.item').last();
        }
        
        $.each([active, next, prev], function(i, obj) {
            var img = obj.find('img');
            
            if(img.data('src')) {
                img.attr('src', img.data('src'));
                img.data('src', false);
            }
        });
    }
    
    function pauseForLopanAd() {
        carousel.carousel('pause');
        carousel.find('.carousel-control').addClass('hidden');

        if(pauseTimeout) {
            clearTimeout(pauseTimeout);
        }

        pauseTimeout = setTimeout(function() {
            resumeFromLopanAd();
        }, SETTINGS.lopanAdDuration*1000);
    }

    function resumeFromLopanAd() {
        if(pauseTimeout) {
            clearTimeout(pauseTimeout);
        }

        carousel.find('.carousel-control').removeClass('hidden');
        carousel.carousel('cycle');
        carousel.carousel('next');
    }

    // Checks if ads are not blocked by an ad blocker.
    function canShowAds() {
        return window.sas !== undefined;
    }

    // Checks if the LoPan ad script is one coming from AdServer.
    // Will only check for the existence of `sas.call` inside the script.
    function isAdServerAd() {
        var adServer = $('#lopan-ad script').filter(function(i, el) {
            return el.innerHTML.indexOf('sas.call') !== -1;
        });

        return adServer.length > 0;
    }

    function isAdServerActiveCampaign() {
        return $('div[id^=sas_] > a > img').length > 0 ||
            $('div[id^=sas_] > iframe:visible').length > 0 ||
            $('div[id^=sas_] > div[id^=sas-filmstrip]').length > 0;
    }

    init();
});
