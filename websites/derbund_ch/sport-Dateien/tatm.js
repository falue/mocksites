"use strict";

var googletag = window.googletag || {},
    TATM = TATM || {
            dfpId: 46753895,
            gptadslots: [],
            requestedSlots: [],
            callbackSlots: {},
            pageTargeting: {},
            adHeader: false,
            adUnitPrefix: "tatm-",
            gptServicesEnabled: false,
            inMigration: false,
            debugMode: false
        };

googletag.cmd = window.googletag.cmd || [];

TATM.core = {
    loadLibs: function () {
        var gads = document.createElement("script"),
            node = document.getElementsByTagName("script")[0],
            useSSL = "https:" == document.location.protocol;
        gads.async = true;
        gads.type = "text/javascript";
        gads.src = (useSSL ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";
        node.parentNode.insertBefore(gads, node);
    },
    loadPageLibs: function () {
        var useSSL = "https:" == document.location.protocol,
            tmpPageName = (TATM.pageName.indexOf("de-") >= 0) ? TATM.pageName.substr(TATM.pageName.indexOf("de-")) : TATM.pageName.substr(TATM.pageName.indexOf("fr-")),
            tmpLibId = "tatm-cust-lib-" + tmpPageName,
            tmpLibSrc = (useSSL ? "https:" : "http:") + "//s3-eu-west-1.amazonaws.com/media.das.tamedia.ch/tatm/customer-libs/" + tmpPageName + "/lib.js",
            customerLib = document.createElement("script"),
            node = document.getElementsByTagName("script")[0];
        if (document.getElementById(tmpLibId) !== null) {
            node.parentNode.removeChild(document.getElementById(tmpLibId));
        }
        customerLib.async = true;
        customerLib.id = tmpLibId;
        customerLib.type = "text/javascript";
        customerLib.src = tmpLibSrc;
        node.parentNode.insertBefore(customerLib, node);
    },
    cleanViewQueue: function () {
        if (TATM.gptadslots.length > 0) {
            TATM.gptadslots.forEach(function (gptadslot) {
                if (document.getElementById(gptadslot.getSlotElementId()) !== null) {
                    document.getElementById(gptadslot.getSlotElementId()).parentNode.style.display = "";
                }
            });
            googletag.destroySlots();
        }
        TATM.gptadslots = [];
        TATM.requestedSlots = [];
        TATM.callbackSlots = {};
    },
    setViewParams: function (pageName, pagePath, pageTargeting, adHeader) {
        TATM.core.setPagename(pageName);
        TATM.core.setPagePath(pagePath);
        TATM.core.setAdHeader(adHeader);
        TATM.core.loadPageLibs();
        TATM.core.setTargeting(pageTargeting);
    },
    getViewportDimension: function () {
        var viewPortWidth,
            viewPortHeight;
        if (typeof innerWidth != "undefined") {
            viewPortWidth = innerWidth;
            viewPortHeight = innerHeight;
        } else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth;
            viewPortHeight = document.documentElement.clientHeight;
        } else {
            viewPortWidth = document.getElementsByTagName("body")[0].clientWidth;
            viewPortHeight = document.getElementsByTagName("body")[0].clientHeight;
        }
        return {viewportWidth: viewPortWidth, viewportHeight: viewPortHeight};
    },
    getAdunitSize: function (adUnitType) {
        var adUnitSizes = {
            "prestitial": [[320, 480], [480, 320], [768, 1024], [1024, 768], [1239, 800], [1920, 1080]],
            "overlay": [[320, 480], [480, 320], [768, 1024], [1024, 768], [1239, 800], [1920, 1080]],
            "overlay-whatsapp": [[320, 480], [480, 320]],
            "inside-full": [[300, 250], [320, 64], [320, 160], [336, 280], [640, 400], [728, 90], [760, 190], [760, 420], [828, 910], [890, 107], [960, 800], [970, 250], [994, 118], [994, 250], [994, 550]],
            "inside-half": [[468, 400], [640, 400]],
            "gallery": [[468, 400], [300, 250], [336, 280]],
            "inside-quarter": [[160, 600], [245, 770], [300, 250], [300, 600]],
            "outside-right": [[160, 600], [245, 770], [245, 600], [300, 600]],
            "outside-left": [[160, 600]],
            "content-ad": [[1, 1]]
        };
        if (adUnitType === "overlay-whatsapp") {
            return adUnitSizes["overlay-whatsapp"];
        } else {
            for (var key in adUnitSizes) {
                if (adUnitSizes.hasOwnProperty(key) && adUnitType.indexOf(key) === 0) {
                    return adUnitSizes[key];
                }
            }
        }
        return [];
    },
    sizeMapping: function (adUnitType) {
        var browserSize = this.getViewportDimension(),
            availableAdSizes = this.getAdunitSize(adUnitType),
            usedAdSizes = [];
        availableAdSizes.forEach(function (adSize) {
            if ((adSize[0] <= browserSize.viewportWidth && adSize[1] <= browserSize.viewportHeight) && (adUnitType !== "overlay" && adUnitType !== "prestitial")) {
                usedAdSizes.push(adSize);
            } else if (adSize[0] <= browserSize.viewportWidth && (adUnitType === "overlay" || adUnitType === "prestitial" || adUnitType === "overlay-whatsapp")) {
                usedAdSizes.push(adSize);
            }
        });
        return googletag.sizeMapping().addSize([browserSize.viewportWidth, browserSize.viewportHeight], usedAdSizes).build();
    },
    isOnScreen: function (elementId) {
        var preload = 350,
            o = document.getElementById(elementId).parentNode,
            r = o ? o.getBoundingClientRect() : false,
            w = window, y = w.innerHeight, x = w.innerWidth;
        return r && !(r.top > (y + preload) || r.left > x || r.bottom < (0 - preload) || r.right < 0);
    },
    visibleAdLoader: function () {
        if (TATM.debugMode) console.log("TATM - Scrollhandler - Exists");
        TATM.gptadslots.forEach(function (gptadslot) {
            if (TATM.requestedSlots.indexOf(gptadslot.getSlotElementId()) < 0 && (TATM.core.isOnScreen(gptadslot.getSlotElementId()) || (gptadslot.getAdUnitPath().indexOf("inside-") < 0 && gptadslot.getAdUnitPath().indexOf("gallery") < 0 ))) {
                if (TATM.debugMode) console.log("TATM - Refresh-AdUnit: " + gptadslot.getAdUnitPath() + " || Target-Container: " + gptadslot.getSlotElementId());
                googletag.pubads().refresh([gptadslot]);
                TATM.requestedSlots.push(gptadslot.getSlotElementId());
            }
            if (TATM.gptadslots.length === TATM.requestedSlots.length) {
                if (TATM.debugMode) console.log("TATM - Scrollhandler - Removed");
                window.removeEventListener("scroll", TATM.core.visibleAdLoader)
            }
        });
    },
    createAdHeader: function (adUnit) {
        var headerHolder = TATM.adUnitPrefix + "header-" + adUnit.targetContainerId;
        if (document.getElementById(headerHolder) !== null) {
            document.getElementById(headerHolder).innerHTML = adUnit.adHeader;
            return;
        }
        if (typeof adUnit.adHeader !== "undefined") {
            if (adUnit.adHeader === "") return;
            var tmpHeaderContainer = document.createElement("div");
            tmpHeaderContainer.id = headerHolder;
            tmpHeaderContainer.innerHTML = adUnit.adHeader;
            document.getElementById(adUnit.targetContainerId).appendChild(tmpHeaderContainer);
        } else if (TATM.adHeader) {
            var tmpHeaderContainer = document.createElement("div");
            tmpHeaderContainer.id = headerHolder;
            tmpHeaderContainer.innerHTML = TATM.adHeader;
            document.getElementById(adUnit.targetContainerId).appendChild(tmpHeaderContainer);
        }
    },
    createAdHolder: function (adUnit) {
        var adUnitHolder = TATM.adUnitPrefix + adUnit.targetContainerId;
        this.createAdHeader(adUnit);
        if (document.getElementById(adUnitHolder) === null) {
            var tmpAdHolder = document.createElement("div");
            tmpAdHolder.id = adUnitHolder;
            document.getElementById(adUnit.targetContainerId).appendChild(tmpAdHolder);
        }
        adUnit.targetContainerId = adUnitHolder;
    },
    buildAdUnitPath: function (adUnit) {
        var mainPath = "/" + TATM.dfpId + "/" + TATM.pageName + "/";
        if (adUnit.adUnitName === "overlay-whatsapp") {
            mainPath += adUnit.adUnitName + "";
        } else {
            mainPath += TATM.pagePath + "/" + adUnit.adUnitName + "";
        }
        return mainPath;
    },
    registerGptServices: function () {
        // Enable Google services
        googletag.pubads().enableSingleRequest();
        googletag.pubads().disableInitialLoad();
        googletag.pubads().collapseEmptyDivs(true);
        // Set Targeting
        for (var tKey in TATM.pageTargeting) {
            if (TATM.pageTargeting.hasOwnProperty(tKey)) {
                if (TATM.debugMode) console.log("TATM - Key: " + tKey + " Values: " + TATM.pageTargeting[tKey]);
                googletag.pubads().setTargeting(tKey, TATM.pageTargeting[tKey]);
            }
        }
        // Register callback
        googletag.pubads().addEventListener("slotRenderEnded", function (event) {
            if (event.isEmpty && !TATM.inMigration) {
                var adMainContainer = document.getElementById(event.slot.getSlotElementId()).parentNode;
                adMainContainer.style.display = "none";
            }
            if (typeof TATM.callbackSlots[event.slot.getSlotElementId()] !== "undefined") {
                TATM.callbackSlots[event.slot.getSlotElementId()](event);
            }
        });
        googletag.enableServices();
        TATM.gptServicesEnabled = true;
    },
    initAdUnits: function (adUnitsToInit) {
        googletag.cmd.push(function () {
            adUnitsToInit.forEach(function (adUnit) {
                if (document.getElementById(adUnit.targetContainerId) === null) {
                    console.warn("TATM - no matching ad-container for: " + adUnit.targetContainerId);
                    return;
                }
                TATM.core.createAdHolder(adUnit);
                TATM.gptadslots.push(googletag.defineSlot(TATM.core.buildAdUnitPath(adUnit), TATM.core.getAdunitSize(adUnit.adUnitName), adUnit.targetContainerId).defineSizeMapping(TATM.core.sizeMapping(adUnit.adUnitName)).addService(googletag.pubads()));
                if (typeof adUnit.callback !== "undefined" && adUnit.callback) {
                    TATM.callbackSlots[adUnit.targetContainerId] = adUnit.callback;
                }
            });
            if (!TATM.gptServicesEnabled) {
                TATM.core.registerGptServices();
            }
            adUnitsToInit.forEach(function (adUnit) {
                googletag.display(adUnit.targetContainerId);
            });
        });
    },
    setPagename: function (pageName) {
        TATM.pageName = pageName;
    },
    setPagePath: function (pagePath) {
        pagePath = pagePath.replace(/^\/{0,1}ro\//, "");
        pagePath = pagePath.replace(/^\/|\/$/gi, "");
        pagePath = pagePath.toLocaleLowerCase();
        TATM.pagePath = pagePath;
    },
    setAdHeader: function (adHeader) {
        if (typeof adHeader !== "undefined") {
            TATM.adHeader = adHeader
        }
    },
    setAdPreviewTargeting: function () {
        if (window.location.search !== "") {
            var previewParams = window.location.search.toLocaleLowerCase().match(/(adpreview|sbpreview)=([^&#]+)/gi);
            if (!(!previewParams)) {
                previewParams.forEach(function (previewParam) {
                    var previewMap = previewParam.split("=");
                    if (!(previewMap[0] in TATM.pageTargeting)) {
                        TATM.pageTargeting[previewMap[0]] = previewMap[1];
                    }
                });
            }
        }
    },
    setKruxTargeting: function () {
        if (typeof Krux !== "undefined") {
            TATM.pageTargeting.ksg = Krux.segments;
            TATM.pageTargeting.kuid = Krux.user;
        }
    },
    setDefaultTargeting: function () {
        var browserSize = TATM.core.getViewportDimension();
        TATM.pageTargeting.viewportwidth = browserSize.viewportWidth;
        TATM.pageTargeting.viewportheight = browserSize.viewportHeight;
        TATM.pageTargeting.screendensity = window.devicePixelRatio;
    },
    stingifyTargetingValues: function () {
        for (var k in TATM.pageTargeting) {
            if (TATM.pageTargeting.hasOwnProperty(k)) {
                if (typeof TATM.pageTargeting[k] === "number") {
                    TATM.pageTargeting[k] = String(TATM.pageTargeting[k]);
                }
            }
        }
    },
    setTargeting: function (pageTargeting) {
        if (typeof pageTargeting !== "undefined") {
            TATM.pageTargeting = pageTargeting;
            if (typeof TATM.pageTargeting.storyid !== "undefined" && !/^\d+$/.test(TATM.pageTargeting.storyid)) {
                TATM.pageTargeting.storyid = "";
            }
        } else {
            TATM.pageTargeting = {};
        }
        this.setDefaultTargeting();
        this.setKruxTargeting();
        this.setAdPreviewTargeting();
        this.stingifyTargetingValues();
    }
};

TATM.displayAds = function (singleAdUnit) {
    googletag.cmd.push(function () {
        TATM.gptadslots.forEach(function (gptadslot) {
            if (TATM.adUnitPrefix + singleAdUnit === gptadslot.getSlotElementId()) {
                googletag.pubads().refresh([gptadslot]);
                TATM.requestedSlots.push(gptadslot.getSlotElementId());
                return false;
            }
            else if (TATM.requestedSlots.indexOf(gptadslot.getSlotElementId()) < 0 && (TATM.core.isOnScreen(gptadslot.getSlotElementId()) || (gptadslot.getAdUnitPath().indexOf("inside-") < 0 && gptadslot.getAdUnitPath().indexOf("gallery") < 0 ))) {
                if (TATM.debugMode) console.log("TATM - Refresh-AdUnit: " + gptadslot.getAdUnitPath() + " || Target-Container: " + gptadslot.getSlotElementId());
                googletag.pubads().refresh([gptadslot]);
                TATM.requestedSlots.push(gptadslot.getSlotElementId());
            }
        });
        window.addEventListener("scroll", TATM.core.visibleAdLoader);
    });
};

TATM.initAdUnits = function (adUnitsToInit) {
    TATM.core.initAdUnits(adUnitsToInit);
};

TATM.updateView = function (pageName, pagePath, pageTargeting, adHeader) {
    googletag.cmd.push(function () {
        TATM.core.cleanViewQueue();
        TATM.core.setViewParams(pageName, pagePath, pageTargeting, adHeader);
    });
};

TATM.setMigrationFlag = function (isInMigration) {
    TATM.inMigration = isInMigration;
};

TATM.init = function (pageName, pagePath, pageTargeting, adHeader) {
    TATM.core.loadLibs();
    TATM.updateView(pageName, pagePath, pageTargeting, adHeader);
};