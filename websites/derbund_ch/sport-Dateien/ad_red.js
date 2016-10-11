/* AdControl  Version1.13 Datum: 14.10.2014
---------------------------------------------------------*/


$(document).ready(function() {
    initAdStyles();
    $("#tamediaToolbarWrapper").bind("DOMSubtreeModified", initAdStyles);
});

function initAdStyles() {
    // Do Sticky Sky
    if ($('#sidebarSky').length && typeof stickyOn === "undefined") {
        stickySkyAction();
    } else {
        var tamediaTbHeight = getTamediaToolbarHeight();
        $('#sidebarSky').css({
            marginTop: tamediaTbHeight
        });

    }

    if (typeof skyWallpaperOn != "undefined") {
        setWallpaperDefaults();
    }

    // Do Wallpaper with custom Color
    if (typeof skyWallpaperBgColor != "undefined") {
        wallpaperColorAction();
    }

    // Do Wallpaper with Background Image
    if (typeof skyWallpaperBgImg != "undefined") {
        wallpaperImgAction();
    }
}

/* Wallpaper
---------------------------------------------------------*/

function wallpaperColorAction() {
    setWallpaperDefaults();
    $("body").css({
        backgroundColor: skyWallpaperBgColor
    });
}

function wallpaperImgAction() {
    setWallpaperDefaults();
    $("body").css({
        backgroundImage: skyWallpaperBgImg,
        backgroundRepeat: "repeat-x"

    });
}

function setWallpaperDefaults() {
    $("#mainContainer").css({
        width: 1028,
        paddingLeft: 24,
        paddingRight: 24
    });
    $("#adtopBanner").css({
        marginLeft: 1
    });
    $("#sidebarSky").css({
        marginTop: 51
    });
    $("#tamediaToolbarWrapper").css({
        backgroundColor: "#ffffff",
        width: 1028
    });
}

/* stickySky
---------------------------------------------------------*/

function stickySkyAction() {
    var adTopHeight = ($("#adtopBanner")) ? $("#adtopBanner").innerHeight() ? $("#adtopBanner").innerHeight() : $("#adtopBanner").height() : 0;
    var tamediaTbHeight = getTamediaToolbarHeight();

    // Calculated top Pos for Sky
    var stickyTop = adTopHeight + tamediaTbHeight + 10;
    var windowTop = (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) + 2;

    // Give Sky the right position, inital window is on top
    posSideBarSky(stickyTop, 0);

    $(window).scroll(function() {
        var windowTop = (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) + 2;
        posSideBarSky(stickyTop, windowTop);
    });
}

function posSideBarSky(stickyTop, windowTop) {
    if (stickyTop < windowTop) {
        $('#sidebarSky').css({
            position: 'fixed',
            top: 0,
            marginLeft: 1004,
            marginTop: 0
        });
    } else {
        $('#sidebarSky').css({
            position: 'absolute',
            top: 0,
            marginLeft: 1004,
            marginTop: stickyTop
        });
    }
}

/* posterAd
---------------------------------------------------------*/

function renderPosterAd() {
    $("html").addClass("posterAd");

    var adOuterHeight = $("#posterAdContainer .posterAdOuter").height();

    $("#posterAdSpacer").height($(window).height() / 2 + adOuterHeight / 2);

    $(window).bind("resize", function() {
        $("#posterAdSpacer").height($(window).height() / 2 + adOuterHeight / 2);
    })
};

/* Helpers
---------------------------------------------------------*/

function getTamediaToolbarHeight() {
    var tbHeight = 0;
    if ($("#tamediaToolbarWrapper") && $("#tamediaToolbarWrapper").length > 0) {
        tbHeight = $("#tamediaToolbarWrapper").innerHeight() ? $("#tamediaToolbarWrapper").innerHeight() : $("#tamediaToolbarWrapper").height();
    }
    tbHeight+=10;

    return tbHeight;
}
