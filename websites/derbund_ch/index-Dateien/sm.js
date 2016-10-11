!(function($) {
    var config = require("framework/config").config,
        socialMedia = require("framework/socialMedia/socialMedia").socialMedia;

    socialMedia.configure(config);

    function closeShareDialogEvents() {
        $(".iconClose").on("click", hideDialog);
        $(".NnDialog").on("click", hideDialog);
        $(document).keyup(function(e) {
            if(e.keyCode === 27) hideDialog();
        });
    }

    function hideDialog() {
        $(".NnDialog").hide();
    }

    function insertSocialMediaBox(socialMedia, teaser, isAggregated, layoutType) {
        socialMedia.insert(teaser[0], teaser.attr("story_id"), {
            isAggregated: isAggregated,
            layoutType: layoutType || "",
            dialogBox: ".NnDialog"
        });        
    }

    $(document).ready(function() {
        // Append the NnDialog, which is used for the aggregated shares to display the popup on click.
        $("#mainContainer").append("<div class='NnDialog' name='close'><div><a class='iconClose'><span class='NnIcon closeIcon'></span></a><div></div></div></div>");

        // Social Media Box Left
        var socialMediaBoxLeft = $(".SocialMediaBox[content_typ='article_left']");
        if(socialMediaBoxLeft.length) {
            insertSocialMediaBox(socialMedia, socialMediaBoxLeft, false, "vertical");
        }

        // Social Media Box Bottom
        var socialMediaBoxBottom = $(".SocialMediaBox[content_typ='article_bottom']");
        if(socialMediaBoxBottom.length) {
            insertSocialMediaBox(socialMedia, socialMediaBoxBottom, false, "horizontal");
        }

        // Social Media Box Teaser
        var socialMediaBoxTeaser = $(".SocialMediaBox[content_typ='article_teaser']");
        if(socialMediaBoxTeaser.length) {
            socialMediaBoxTeaser.each(function() {
                insertSocialMediaBox(socialMedia, $(this), true);
            });
        }

        // Social Media Like Button Meistgelesen
        var socialMediaLikeButtonTop = $(".SocialMediaBox[content_typ='meistgelesen']");
        if(socialMediaLikeButtonTop.length) {
            socialMedia.insertLikeButton(socialMediaLikeButtonTop[0], {
                types: ["facebook", "twitter"]
            });
        }

        // Social Media Like Button Populär auf Facebook
        var socialMediaLikeButtonPopular = $(".SocialMediaBox[content_typ='fb_populaer']");
        if(socialMediaLikeButtonPopular.length) {
            socialMedia.insertLikeButton(socialMediaLikeButtonPopular[0], {
                types: ["facebook"]
            });
        }

        closeShareDialogEvents();
    });
}).call(this, cre_jq);