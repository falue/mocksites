/*
    initialize the ad
*/
function initCreative() {
    'use strict';

    window.removeEventListener('load', initCreative);

    var animation;

    new ImagePreloaderClass(onImagesLoaded);

    function onImagesLoaded() {

        /*
            here is the space for clicktag specifications
        */

        /*  be sure to set the loop-parameter inside the brackets of AnimationClass() !!!
            0 = no loop, 1-98 = 1 to 98 loops, >= 99 = endless
		*/
        animation = new AnimationClass(99);

        // this starts your animation
        animation.startAnimation();
    }

    /*
        onExit-call
    */
    function onExit() {
        animation.stopAnimation();
    }
}

var AnimationClass = function(loop) {
    'use strict';

    var creative        = {};
    var loopCount       = 0;
    var maxCount        = loop;
    var infinite        = maxCount >= 99 ? true : false;
    var timelineMain;

    this.stopAnimation  = stopAnimation;
    this.startAnimation = startAnimation;

    // Call constructor
    construct();

    /*
        Constructor
    */
    function construct() {
        creative.dom = {};
        creative.dom.body = document.body;

        /* bind more elements
            e.g. creative.dom.cta = document.getElementById('cta'); */

        addListeners();
    }

    function addListeners() {

        var clickArea 			= document.getElementById('banner');
        var clickTAGvalue 		= dhtml.getVar('clickTAG', 'https://www.adform.com');
        var landingpagetarget	= dhtml.getVar('landingPageTarget', '_blank');

        clickArea.onclick = function() {
        	window.open(clickTAGvalue,landingpagetarget);
    	};

    }

    function startAnimation() {
        /*
         **  ANIMATE NOW
         */


         creative.dom.body.classList.add('animate');

         var timelineScene1 = new TimelineLite();

             timelineScene1.to('#image-1', 1, { autoAlpha: 1,ease: Power2.easeInOut});
             timelineScene1.to('.text-background', 1,  { autoAlpha: 1, ease: Power2.easeInOut},'-=1');
             timelineScene1.to('#text-1-1', 1.6,  { x: 0, ease: Power2.easeInOut},'-=1');
             timelineScene1.to('#image-1', 1.6, { scale: 1,ease: Power2.easeInOut},'+=1');
             timelineScene1.to('#text-1-1', 1,  { autoAlpha: 0, ease: Power2.easeInOut},'-=1.2');
             timelineScene1.to('#text-1-2', 1.6,  { x: 0, ease: Power2.easeInOut},'-=1');
             timelineScene1.to('#frame', 1,  { autoAlpha: 1, ease: Power2.easeInOut});



             timelineScene1.fromTo('#cta', 0.6,  { scale: 0.1, autoAlpha: 0},{ scale: 1,autoAlpha:1, ease: Back.easeOut},'+=1');
             timelineScene1.to('#pointer', 0.4,  { y: 0, autoAlpha: 1, ease: Power2.easeInOut},'+=0.6');

             timelineScene1.to('#pointer', 0.4,  { scale: 0.8, ease: Power2.easeInOut},'+=0.4');
             timelineScene1.to('#cta', 0.4,  { scale: 0.9, ease: Power2.easeInOut},'-=0.3');
             timelineScene1.to('#pointer', 0.4,  { scale: 1, ease: Power2.easeInOut});
             timelineScene1.to('#cta', 0.4,  { scale: 1, ease: Power2.easeInOut},'-=0.3');
             timelineScene1.to('#pointer', 0.4,  { autoAlpha: 0, ease: Power2.easeInOut},'+=0.4');

         var timelineOutro = new TimelineLite();

             timelineOutro.to('#cta', 1, { autoAlpha: 0, ease: Power2.easeInOut},'+=2');
             timelineOutro.to('.text-background', 1,  { autoAlpha: 0, ease: Power2.easeInOut},'-=1');
             timelineOutro.to('#frame', 1,  { autoAlpha: 0, ease: Power2.easeInOut},'-=1');
             timelineOutro.to('#image-1', 1, { autoAlpha: 0 , ease: Power2.easeInOut},'-=1');


         //create a TimelineLite instance and loop
         timelineMain = new TimelineLite({onComplete: onTimelineComplete});
         timelineMain.add(timelineScene1)
                     .add(timelineOutro);
    }

    //Defines what happens aufter animation ended
    function onTimelineComplete() {

        if (infinite === true) {
            timelineMain.pause(0, true); //Go back to the start (true is to suppress events)
            timelineMain.remove();
            timelineMain.restart(true);
        } else {
            loopCount++;
            if (loopCount < maxCount) {
                timelineMain.pause(0, true); //Go back to the start (true is to suppress events)
                timelineMain.remove();
                timelineMain.restart(true);
            }
        }
    }

    function stopAnimation() {

    }
};

var ImagePreloaderClass = function(callbackImagesLoaded) {

    'use strict';

    var preloadImages = document.querySelectorAll('img[data-src]');
    var imagesTotal = preloadImages.length;
    var imagesLoaded = 0;

    if (imagesTotal !== 0) {

        for (var i = 0; i < imagesTotal; i++) {
            var imageItem = preloadImages[i];
            var src = imageItem.getAttribute('data-src');

            imageItem.addEventListener('load', onLoadImage, false);
            imageItem.addEventListener('error', onLoadImageError, false);
            imageItem.setAttribute('src', src);
        }

    } else {
        callback();
    }

    function onLoadImage() {
        imagesLoaded++;
        if (imagesLoaded === imagesTotal) {
            callback();
        }
    }

    function onLoadImageError(e) {
        console.log('COULD NOT LOAD: ' + e.target.getAttribute('data-src'));
    }

    function callback() {
        if (typeof callbackImagesLoaded === 'function') {
            callbackImagesLoaded(); //console.log("NO IMAGES TO PRELOAD");
        }
    }
};


/*
    Window load event listener
*/
window.addEventListener('load', initCreative);
