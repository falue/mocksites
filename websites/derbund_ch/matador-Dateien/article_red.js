(function($) {
    var config = require("framework/config").config,
        comments = require("framework/comments/comments").comments,
        Listicle = require("framework/listicles/listicle").Listicle;

    // Pass base configs (like language or apiUrl)
    comments.configure(config);

    // Module-individual config options
    comments.configure({
        showTeaserComments: true,
        showCommentsCount: false
    });

    var placePublireportage = function() {
        var $publireportage = $("#mainColRightPublireportage");

        $publireportage.find(".teaserEditorialContent").show();

        var mainColLeftHeight = $("#mainColLeft").outerHeight(true);
        var mainColRightHeight = $("#mainColRight").outerHeight(true) + parseInt($("#mainContent").css("margin-bottom"), 10);

        if (mainColLeftHeight > mainColRightHeight) {
            $publireportage.css({
                "position": "relative",
                "top": mainColLeftHeight - mainColRightHeight
            });
        }

        $publireportage.css("visibility", "visible");
    };

    $.easing.easeOutQuint = function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }

    $.easing.easeInExpo = function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }

    $.easing.easeOutExpo = function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }

    $(document).ready(function() {
        // Insert Listicle
        var $listicleContainer = $(".newsnet-listicle");

        if($listicleContainer.length) {
            new Listicle($listicleContainer, {
                id: $listicleContainer.data("id"),
                apiUrl: config.apiUrl,
                renderElement: function(payload, container) {
                    switch (payload.type) {
                        case "element_slideshow":
                            return showSlideshow(payload.legacy_id, { fullyResponsive: true }, container, payload);
                        break;
                    }
                }
            });
        }

        // Start comments
        if (window.articleLegacyId > 0) {
            var wemfUrls = config.wemf.nn1.map(function(wemfUrl) {
                // Add ressort + /comments
                return wemfUrl + window.location.pathname.split("/")[1] + "/comments";
            });

            $("<div id='Nn2commentsContainer'></div>").insertAfter("#viewport");

            comments.insert(document.getElementById("Nn2commentsContainer"), window.articleLegacyId, { wemfUrls: wemfUrls });
        } else {
            // In case of there is no Talkback, make sure to execute
            // FB.init() otherwise the Like-buttons don't appear
            FB.init(require("framework/config").config.facebook.init);
        }

        // Wrap things into a setTimeout of 0 to make sure the DOM is rendered
        // TODO: Remove this setTimeout for NN2, it won't be necessary there
        window.setTimeout(function() {
            placePublireportage();
        }, 1500);
    });
})(cre_jq);