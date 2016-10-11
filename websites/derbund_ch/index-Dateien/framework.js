!(function($) {
window.defaultCustomer = 'tagesanzeiger'; window.api = 'local';
define('framework/ads/ad', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"caption\">{{caption}}</div>\n<div class=\"contentContainer\">\n    <div class=\"NnIcon closeIcon\"></div>\n    <div class=\"content\"></div>\n</div>");

});
define('framework/ads/ads', ['exports', 'framework/jquery', 'framework/string', 'framework/uuid'], function (exports, __dep0__, __dep1__, uuid) {

  'use strict';

  var AD_RENDER_MODE_AFTER_LOAD, AD_RENDER_MODE_IMMEDIATE, ads, createAdElement, createAdElementByImageUrl, createAdElementByScript, createAdElementByUrl, generateTargetString, generateUrl, getAdDimensions, getAdRenderMode, module, prerenderAd, renderAd, requestAd, stateMachine;

  module = {
    config: {
      caption: "WERBUNG",
      isEnabled: true,
      afterRenderAd: function(routeName, formatName) {},
      afterDestroyAd: function(routeName, formatName) {},
      generateDomId: function(routeName, formatName) {
        return "adbanner-" + (routeName ? routeName + "-" : "") + formatName;
      }
    }
  };

  AD_RENDER_MODE_IMMEDIATE = 0;

  AD_RENDER_MODE_AFTER_LOAD = 1;

  getAdRenderMode = function(payload) {
    var script;
    script = payload.html || payload.creativescript || "";
    if (script.indexOf("ads.rubiconproject.com") >= 0) {
      return AD_RENDER_MODE_AFTER_LOAD;
    } else {
      return AD_RENDER_MODE_IMMEDIATE;
    }
  };

  generateUrl = function(pageId, channelId, formatId, target) {
    var e, uid;
    if ((window.sas_master == null) || (window.sas_tmstp == null)) {
      ads.resetSas();
    }
    window.sas_master = window.sas_master != null ? "s" : "m";
    try {
      if (localStorage.getItem("smartadserverUid") != null) {
        uid = localStorage.getItem("smartadserverUid");
      } else {
        localStorage.setItem("smartadserverUid", uid = uuid.UUID.create());
      }
    } catch (_error) {
      e = _error;
      console.log(e, e.stack);
      uid = uuid.UUID.create();
    }
    if ((window.sas_master == null) && (window.sas_tmstp == null)) {
      ads.resetSas();
    }
    return "http://www6.smartadserver.com/ac?" + ["siteid=" + pageId, "pgname=" + channelId, "fmtid=" + formatId, "visit=" + window.sas_master, "tmstp=" + window.sas_tmstp, "tgt=" + (escape(target)), "uid=" + uid].join("&");
  };

  requestAd = function(pageId, channelId, formatId, target) {
    if (target == null) {
      target = "";
    }
    return $.get(generateUrl(pageId, channelId, formatId, target));
  };

  getAdDimensions = function(payload) {
    var height, width;
    if ((payload.creativeWidth != null) && (payload.creativeHeight != null)) {
      if (payload.creativeWidth.charAt(payload.creativeWidth.length - 1) === "%") {
        width = payload.creativeWidth;
      }
      if (payload.creativeHeight.charAt(payload.creativeHeight.length - 1) === "%") {
        height = payload.creativeHeight;
      }
      if (payload.creativeWidth <= $(window).width() && payload.creativeHeight <= $(window).height()) {
        if (width == null) {
          width = parseInt(payload.creativeWidth, 10);
        }
        if (height == null) {
          height = parseInt(payload.creativeHeight, 10);
        }
      } else {
        if (payload.creativeWidth / 2 <= $(window).width() && payload.creativeHeight / 2 <= $(window).height()) {
          if (width == null) {
            width = payload.creativeWidth / 2;
          }
          if (height == null) {
            height = payload.creativeHeight / 2;
          }
        } else if ((width == null) && (height == null)) {
          width = $(window).width();
          height = width / payload.creativeWidth * payload.creativeHeight;
        }
      }
    }
    return {
      width: width != null ? width : "",
      height: height != null ? height : ""
    };
  };

  prerenderAd = function(containerId, routeName, formatName, payload) {
    var $container, $content, height, padding, ref, width;
    ref = getAdDimensions(payload), width = ref.width, height = ref.height;
    if (!(width === 0 && height === 0)) {
      $content = ($container = $("#" + containerId).html(require("framework/ads/ad")["default"]({
        caption: module.config.caption || ""
      })).addClass($.merge(["adBanner"], module.config.formats[formatName].classNames).join(" "))).find(".content");
      if ((payload.bgcolor != null) && payload.bgcolor) {
        $container.find(".contentContainer").css("background-color", "#" + payload.bgcolor);
      }
      padding = $content.padding();
      $content.css({
        width: (width + padding.left + padding.right) + "px",
        height: (height + padding.top + padding.bottom) + "px"
      });
      if (getAdRenderMode(payload) === AD_RENDER_MODE_IMMEDIATE) {
        $container.show();
      }
    }
    return stateMachine.set(containerId, "state", stateMachine.AD_STATE_PRERENDERED);
  };

  createAdElement = function(payload, callback) {
    var height, ref, width;
    if (callback == null) {
      callback = function() {};
    }
    ref = getAdDimensions(payload), width = ref.width, height = ref.height;
    if (payload.creativetype != null) {
      switch (parseInt(payload.creativetype, 10)) {
        case 0:
          return createAdElementByImageUrl(payload.creativeurl, {
            clickUrl: payload.clickurl,
            impressionPixelUrls: [payload.impressionpixel, payload.agencyPortraitImpressionPixels],
            clickPixelUrl: payload.countclickurl,
            width: width,
            height: height
          }, callback);
        case 3:
          if (payload.creativeurl) {
            return createAdElementByUrl(payload.creativeurl, {
              impressionPixelUrls: [payload.impressionpixel, payload.agencyPortraitImpressionPixels],
              width: width,
              height: height
            }, callback);
          } else if (payload.creativescript) {
            return createAdElementByScript(payload.creativescript, {
              impressionPixelUrls: [payload.impressionpixel, payload.agencyPortraitImpressionPixels],
              width: width,
              height: height
            }, callback);
          }
      }
    } else {
      if (payload.newsnetImageUrl) {
        return createAdElementByImageUrl(payload.newsnetImageUrl, {
          clickUrl: payload.clickUrl,
          impressionPixelUrls: payload.impUrls.split(","),
          clickPixelUrl: payload.countClickUrl,
          width: width,
          height: height
        }, callback);
      } else if (payload.scriptUrl) {
        return createAdElementByUrl(payload.scriptUrl, {
          impressionPixelUrls: payload.impUrls.split(","),
          width: width,
          height: height
        }, callback);
      } else if (payload.html) {
        return createAdElementByScript(payload.html, {
          impressionPixelUrls: payload.impUrls.split(","),
          width: width,
          height: height
        }, callback);
      }
    }
  };

  createAdElementByImageUrl = function(imageUrl, arg, callback) {
    var $el, clickPixelUrl, clickUrl, el, height, impressionPixelUrls, width;
    clickUrl = arg.clickUrl, impressionPixelUrls = arg.impressionPixelUrls, clickPixelUrl = arg.clickPixelUrl, width = arg.width, height = arg.height;
    el = ($el = $(require("framework/ads/imageAd")["default"]({
      url: clickUrl,
      imageSrc: imageUrl,
      width: width,
      height: height
    })).bind("click", function(e) {
      var image;
      image = new Image;
      return image.src = clickPixelUrl + "&timestamp=" + new Date().getTime();
    }))[0];
    $el.find("img").bind("load", function() {
      var i, image, impressionPixelUrl, len;
      if (impressionPixelUrls && impressionPixelUrls.length) {
        for (i = 0, len = impressionPixelUrls.length; i < len; i++) {
          impressionPixelUrl = impressionPixelUrls[i];
          if (!(impressionPixelUrl)) {
            continue;
          }
          image = new Image;
          image.src = impressionPixelUrl + "&timestamp=" + new Date().getTime();
        }
      }
      return callback();
    });
    return el;
  };

  createAdElementByUrl = function(url, arg, callback) {
    var el, height, impressionPixelUrls, width;
    impressionPixelUrls = arg.impressionPixelUrls, width = arg.width, height = arg.height;
    $(el = document.createElement("iframe")).on("load", function() {
      var i, image, impressionPixelUrl, len;
      if (impressionPixelUrls && impressionPixelUrls.length) {
        for (i = 0, len = impressionPixelUrls.length; i < len; i++) {
          impressionPixelUrl = impressionPixelUrls[i];
          if (!(impressionPixelUrl)) {
            continue;
          }
          image = new Image;
          image.src = impressionPixelUrl + "&timestamp=" + new Date().getTime();
        }
      }
      return callback();
    }).attr({
      src: url,
      scrolling: "no"
    }).css({
      width: width + "px",
      height: height + "px"
    });
    return el;
  };

  createAdElementByScript = function(script, arg, callback) {
    var el, height, impressionPixelUrls, width;
    impressionPixelUrls = arg.impressionPixelUrls, width = arg.width, height = arg.height;
    $(el = document.createElement("iframe")).one("load", function() {
      return setTimeout((function(_this) {
        return function() {
          var iframeDocument;
          $(el).one("load", function() {
            var i, image, impressionPixelUrl, len;
            if (impressionPixelUrls && impressionPixelUrls.length) {
              for (i = 0, len = impressionPixelUrls.length; i < len; i++) {
                impressionPixelUrl = impressionPixelUrls[i];
                if (!(impressionPixelUrl)) {
                  continue;
                }
                image = new Image;
                image.src = impressionPixelUrl + "&timestamp=" + new Date().getTime();
              }
            }
            return callback();
          });
          iframeDocument = $(_this).contents().get(0);
          iframeDocument.open("text/html", "replace");
          iframeDocument.write('<html><head></head><body style="margin: 0; padding: 0;">' + script + '</body></html>');
          return iframeDocument.close();
        };
      })(this));
    }).attr({
      src: "about:blank",
      scrolling: "no"
    }).css({
      width: width + "px",
      height: height + "px"
    });
    return el;
  };

  renderAd = function(containerId, routeName, formatName, payload) {
    if (getAdRenderMode(payload) === AD_RENDER_MODE_AFTER_LOAD) {
      $("#" + containerId + " .content").append(createAdElement(payload, function() {
        return $("#" + containerId).show();
      }));
    } else {
      $("#" + containerId + " .content").append(createAdElement(payload));
    }
    if (payload.duration) {
      stateMachine.set(containerId, "timeout", setTimeout((function() {
        return ads.destroy(routeName, formatName);
      }), parseInt(payload.duration, 10) * 1000));
    }
    stateMachine.set(containerId, "state", stateMachine.AD_STATE_RENDERED);
    return module.config.afterRenderAd.call(this, routeName, formatName);
  };

  stateMachine = {
    AD_STATE_INIT: 0,
    AD_STATE_PRERENDERED: 1,
    AD_STATE_RENDERED: 2,
    _states: {},
    _messagingApiId: "adsMessagingApi_" + new Date().getTime(),
    _onMessage: function(e) {
      var data, ref;
      if (((ref = e.originalEvent) != null ? ref.data : void 0) != null) {
        data = e.originalEvent.data;
        if ((data.id != null) && (data.action != null)) {
          if (data.id === "ads") {
            switch (data.action) {
              case "destroy":
                return ads.destroy(data.routeName, data.formatName);
            }
          }
        }
      }
    },
    create: function(id) {
      if (this._states[id] != null) {
        throw "Error in ads module: state object for ad '" + id + "' already exists!";
      }
      if (this.count() === 0) {
        $(window).on("message." + this._messagingApiId, this._onMessage);
      }
      return this._states[id] = {
        state: this.AD_STATE_INIT,
        timeout: null,
        interval: null
      };
    },
    count: function() {
      return Object.keys(this._states).length;
    },
    get: function(id) {
      if (id != null) {
        return this._states[id];
      } else {
        return this._states;
      }
    },
    find: function(query, callback) {
      var id, matches, ref, ref1, ref2, regexp, results, state;
      if (query == null) {
        query = {
          id: "",
          routeName: "",
          formatName: ""
        };
      }
      if (query.id) {
        if (this._states[query.id]) {
          return callback(this._states[query.id], query.id);
        }
      } else if (query.routeName || query.formatName) {
        regexp = new RegExp("^" + module.config.generateDomId("(" + ((ref = query.routeName) != null ? ref : ".*") + ")", "(" + ((ref1 = query.formatName) != null ? ref1 : ".*") + ")") + "$");
        ref2 = this._states;
        results = [];
        for (id in ref2) {
          state = ref2[id];
          if (matches = regexp.exec(id)) {
            results.push(callback(state, id, matches[1], matches[2]));
          }
        }
        return results;
      } else {
        throw "Error in ads module: did not specify a query for find function!";
      }
    },
    set: function(id, key, value) {
      switch (key) {
        case "interval":
          if (!value) {
            clearInterval(this._states[id].interval);
          }
      }
      return this._states[id][key] = value;
    },
    remove: function(id) {
      if (this._states[id] != null) {
        if (this._states[id].timeout) {
          clearTimeout(this._states[id].timeout);
        }
        if (this._states[id].interval) {
          clearInterval(this._states[id].interval);
        }
        delete this._states[id];
        if (this.count() === 0) {
          return $(window).off("message." + this._messagingApiId, this._onMessage);
        }
      }
    }
  };

  generateTargetString = function(target) {
    var key, value;
    return ((function() {
      var results;
      results = [];
      for (key in target) {
        value = target[key];
        results.push(key + "=" + value);
      }
      return results;
    })()).join(",");
  };

  ads = {
    configure: function(config) {
      var defaultClassName, key, ref, results, value;
      $.extend(module.config, config);
      if ((module.config.formats != null) && $.type(module.config.formats) === "object") {
        ref = module.config.formats;
        results = [];
        for (key in ref) {
          value = ref[key];
          defaultClassName = "adBanner" + key.camelCase(true);
          if ((value.classNames != null) && $.isArray(value.classNames)) {
            if (!(value.classNames.indexOf(defaultClassName) >= 0)) {
              results.push(value.classNames.push(defaultClassName));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(value.classNames = [defaultClassName]);
          }
        }
        return results;
      }
    },
    resetSas: function() {
      window.sas_tmstp = new Date().getTime();
      return window.sas_master = null;
    },
    show: function(ads) {
      var $container, containerId, format, formatName, i, j, len, len1, promises, ref, ref1, routeName, target;
      target = $.extend({}, module.config.target);
      switch (arguments.length) {
        case 1:
          ads = {
            formats: arguments[0]
          };
          break;
        case 2:
          if ($.isArray(arguments[1])) {
            ads = {
              formats: arguments[1]
            };
            if ($.type(arguments[0]) === "object") {
              target = $.extend(target, arguments[0]);
            } else {
              ads.page_id = arguments[0];
            }
          } else {
            ads = arguments[0];
            routeName = arguments[1];
          }
          break;
        case 3:
          if ($.type(arguments[0]) === "string" && $.type(arguments[1]) === "object" && $.isArray(arguments[2])) {
            ads = {
              page_id: arguments[0],
              formats: arguments[2]
            };
            target = $.extend({}, arguments[1]);
          } else {
            ads = arguments[0];
            routeName = arguments[1];
            formatName = arguments[2];
          }
          break;
        default:
          throw "Ads.show: Wrong number of arguments";
      }
      if ((ads.page_id == null) && (module.config.pageId != null)) {
        ads.page_id = module.config.pageId;
      }
      if ($.isArray(ads.formats)) {
        ref = ads.formats;
        for (i = 0, len = ref.length; i < len; i++) {
          format = ref[i];
          if ((format.target != null) && $.type(format.target) === "object") {
            format.target = generateTargetString($.extend(target, format.target));
          } else {
            format.target = generateTargetString(target);
          }
        }
      }
      promises = [];
      if (module.config.isEnabled && ((ads != null ? ads.formats : void 0) != null)) {
        ref1 = ads.formats;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          format = ref1[j];
          if (!(format.name in module.config.formats && ((formatName == null) || format.name === formatName))) {
            continue;
          }
          containerId = module.config.generateDomId(routeName, format.name);
          $container = $("#" + containerId);
          if ((!stateMachine.get(containerId)) && $container.length > 0) {
            stateMachine.create(containerId);
            promises.push(new RSVP.Promise((function(_this) {
              return function(resolve, reject) {
                return stateMachine.set(containerId, "interval", setInterval((function(containerId, routeName, pageId, formatId, formatName, formatTarget) {
                  return function() {
                    var nonZeroValues, rect;
                    if ($("#" + containerId).isInViewport()) {
                      rect = $("#" + containerId)[0].getBoundingClientRect();
                      nonZeroValues = $.map(rect, function(value, key) {
                        if (value !== 0) {
                          return value;
                        }
                      });
                      if (nonZeroValues.length) {
                        stateMachine.set(containerId, "interval", null);
                        return requestAd(module.config.siteId, pageId, formatId, formatTarget).then(function(payload) {
                          if (stateMachine.get(containerId)) {
                            prerenderAd(containerId, routeName, formatName, payload.ad);
                            resolve();
                            return renderAd(containerId, routeName, formatName, payload.ad);
                          }
                        }, function(errorMessage) {
                          if (console.warn) {
                            console.warn(errorMessage);
                          }
                          stateMachine.remove(containerId);
                          return reject();
                        });
                      }
                    }
                  };
                })(containerId, routeName, ads.page_id, format.id, format.name, format.target), 100));
              };
            })(this)));
          }
        }
      }
      return RSVP.allSettled(promises);
    },
    showAdtechAd: function(siteId, placementId) {
      return $.loadExternalScript("http://aka-cdn.adtech.de/dt/common/DAC.js").then(function() {
        ADTECH.config.page = {
          protocol: "http",
          server: "adserver.adtech.de",
          network: "1625.1",
          siteid: "" + siteId,
          params: {
            loc: "100"
          }
        };
        ADTECH.config.placements[placementId] = {
          sizeid: 4,
          params: {
            alias: "",
            target: "_blank"
          }
        };
        ADTECH.enqueueAd(placementId);
        return ADTECH.executeQueue();
      });
    },
    destroy: function(routeName, formatName) {
      switch (arguments.length) {
        case 1:
          routeName = arguments[0];
          formatName = void 0;
          break;
        case 2:
          routeName = arguments[0];
          formatName = arguments[1];
          break;
        default:
          throw "Ads.destroy: Wrong number of arguments";
      }
      return stateMachine.find({
        routeName: routeName,
        formatName: formatName
      }, function(state, containerId, routeName, formatName) {
        stateMachine.remove(containerId);
        $("#" + containerId).removeClass().empty().find(".content").css({
          width: "",
          height: ""
        });
        return module.config.afterDestroyAd.call(this, routeName, formatName);
      });
    }
  };

  exports.ads = ads;

});
define('framework/ads/imageAd', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<a href=\"{{url}}\" target=\"_blank\">\n    <img src=\"{{imageSrc}}\" style=\"width: {{width}}px; height:{{height}}px;\">\n</a>");

});
define('framework/ads/xeebel', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"dynamic-widget\"></div>");

});
define('framework/array', function () {

  'use strict';

  if (!("indexOf" in Array.prototype)) {
    Array.prototype.indexOf = function(find, i) {
      var n;
      if (i === undefined) {
        i = 0;
      }
      if (i < 0) {
        i += this.length;
      }
      if (i < 0) {
        i = 0;
      }
      n = this.length;
      while (i < n) {
        if (i in this && this[i] === find) {
          return i;
        }
        i++;
      }
      return -1;
    };
  }

  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
      "use strict";
      var i, len, res, t, thisp, val;
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      t = Object(this);
      len = t.length >>> 0;
      if (typeof fun !== "function") {
        throw new TypeError();
      }
      res = [];
      thisp = arguments[1];
      i = 0;
      while (i < len) {
        if (i in t) {
          val = t[i];
          if (fun.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
        i++;
      }
      return res;
    };
  }

  if (!Array.prototype.some) {
    Array.prototype.some = function(fun) {
      "use strict";
      var i, j, len, ref, t, thisArg;
      if (this === null) {
        throw new "TypeError Array.prototype.some called on null or undefined";
      }
      if (typeof fun !== 'function') {
        throw new TypeError();
      }
      t = Object(this);
      len = t.length >>> 0;
      thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (i = j = 0, ref = len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (i in t && fun.call(thisArg, t[i], i, t)) {
          return true;
        }
      }
      return false;
    };
  }

  if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
      'use strict';
      var O, T, j, k, kValue, len, ref, testResult;
      if (this === null) {
        throw new TypeError('this is null or not defined');
      }
      O = Object(this);
      len = O.length >>> 0;
      if (typeof callbackfn !== 'function') {
        throw new TypeError();
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      k = 0;
      for (k = j = 0, ref = len - 1; 0 <= ref ? j <= ref : j >= ref; k = 0 <= ref ? ++j : --j) {
        if (k in O) {
          kValue = O[k];
          testResult = callbackfn.call(T, kValue, k, O);
          if (!testResult) {
            return false;
          }
        }
      }
      return true;
    };
  }

});
define('framework/browser', ['exports'], function (exports) {

  'use strict';

  var browser;

  browser = {
    browserName: null,
    browserVersion: null,
    isTouchScreen: function() {
      return "ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    },
    isiPhone: function() {
      return navigator.userAgent.indexOf("iPhone") > -1;
    },
    isiPhoneOriPod: function() {
      return navigator.userAgent.match(/iPhone|iPod/i);
    },
    supportsCors: function() {
      return window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest;
    },
    isDefaultAndroid: function() {
      return this.isAndroid() && this.isWebKit() && !this.isChrome();
    },
    isAndroid: function() {
      return navigator.userAgent.indexOf("Android") > -1;
    },
    isWebKit: function() {
      return navigator.userAgent.indexOf("WebKit") > -1;
    },
    isChrome: function() {
      return navigator.userAgent.indexOf("Chrome") > -1;
    },
    isWP: function() {
      return navigator.userAgent.indexOf("Windows Phone") > -1;
    },
    isIE8: function() {
      return navigator.userAgent.indexOf("MSIE 8") > -1;
    },
    isIE9: function() {
      return navigator.userAgent.indexOf("MSIE 9") > -1;
    },
    isIE10: function() {
      return navigator.userAgent.indexOf("MSIE 10") > -1;
    },
    isFirefox: function() {
      return navigator.userAgent.indexOf("Firefox") > -1;
    },
    isSafari: function() {
      return navigator.userAgent.indexOf("Safari") > -1;
    },
    isLocalhost: function() {
      return location.hostname.indexOf("localhost") > -1;
    },
    supportsRequirements: function(requirements) {
      var browserInfo, browserName, match, regExp, version;
      for (browserName in requirements) {
        version = requirements[browserName];
        regExp = new RegExp(browserName + " [^;]*");
        match = navigator.userAgent.match(regExp);
        if (match != null) {
          browserInfo = match.toString().split(" ");
          this.browserName = browserInfo[0];
          this.browserVersion = parseInt(browserInfo[1], 10);
          if (this.browserName === browserName && this.browserVersion < version) {
            alert("Ihre " + browserName + "-Version (v" + this.browserVersion + ") wird leider nicht mehr unterstützt, bitte aktualisieren Sie auf die Version v" + version + " oder höher");
            return false;
          }
        }
      }
      return true;
    },
    scrollTop: function($el) {
      return setTimeout(function() {
        $el.css("overflow", "hidden");
        return setTimeout(function() {
          $el.scrollTop(0);
          return setTimeout(function() {
            return $el.css("overflow", "auto");
          }, 0);
        }, 0);
      }, 0);
    },
    getTransitionEventName: function() {
      var el, key, transEndEventNames, value;
      el = document.createElement("fake");
      transEndEventNames = {
        "WebkitTransition": "webkitTransitionEnd",
        "MozTransition": "transitionend",
        "transition": "transitionend"
      };
      for (key in transEndEventNames) {
        value = transEndEventNames[key];
        if (el.style[key] !== void 0) {
          return transEndEventNames[key];
        }
      }
    },
    getPathname: function() {
      var delimiterPosition, facebookDelimiter, hash, target;
      target = location.pathname;
      hash = location.hash;
      if (target === "/") {
        if (hash) {
          facebookDelimiter = "?#";
          if ((delimiterPosition = hash.indexOf(facebookDelimiter)) > -1) {
            hash = hash.substr(0, delimiterPosition);
          }
          target = hash.replace("#", "");
        }
      } else {
        target += hash;
      }
      return target;
    },
    getQueryParam: function(param) {
      var i, key, queryParams, queryStringTokens, ref, value;
      queryStringTokens = window.location.search.split(/[&?]/);
      queryParams = {};
      i = 0;
      while (i < queryStringTokens.length) {
        if (queryStringTokens[i]) {
          ref = queryStringTokens[i].split('='), key = ref[0], value = ref[1];
          if (key === param) {
            return value;
          }
        }
        i++;
      }
    },
    addAndroidScrollFix: function($element) {
      if (this.isDefaultAndroid()) {
        $element.addClass("androidScrollFix");
        return setTimeout(function() {
          $element.removeClass("androidScrollFix");
          return setTimeout(function() {
            return $element.addClass("androidScrollFix", 100);
          });
        }, 5000);
      }
    }
  };

  exports.browser = browser;

});
define('framework/categorySlider/categorySlider', ['exports', 'framework/string', 'framework/store'], function (exports, __dep0__, store) {

  'use strict';

  var categorySlider;

  categorySlider = {
    insert: function(targetEl, pageElement, options) {
      return ReactDOM.render(React.createElement(require("framework/categorySlider/CategorySlider/component").CategorySlider, {
        data: pageElement,
        initialSlides: pageElement.articles,
        socialMedia: options.socialMedia
      }), targetEl);
    }
  };

  exports.categorySlider = categorySlider;

});
define('framework/categorySlider/CategorySlider/component', ['exports', 'framework/string', 'framework/store', 'framework/utils'], function (exports, __dep0__, store, utils) {

  'use strict';

  var CategorySlider;

  CategorySlider = React.createClass({
    getInitialState: function() {
      return {
        slides: [],
        isLoading: true
      };
    },
    componentWillMount: function() {
      this.categoryLength = 0;
      return this.hasSwiped = false;
    },
    componentDidMount: function() {
      var $el, articleCount;
      $el = $(ReactDOM.findDOMNode(this));
      articleCount = this.props.data.category_article_count;
      if (articleCount != null) {
        this.categoryLength = articleCount;
      } else {
        this.categoryLength = 30;
      }
      this.calculateProgress($el, 2, this.categoryLength);
      return this.setState({
        slides: this.createLoadingSlide()
      }, function() {
        var mySwiper;
        return mySwiper = new Swiper($el.find(".swiper-container")[0], {
          direction: "horizontal",
          slidesPerView: 2,
          resistance: "95%",
          onTouchEnd: (function(_this) {
            return function(swiper) {
              return _this.calculateProgress($el, swiper.activeIndex, _this.categoryLength + 2);
            };
          })(this),
          onTouchMove: (function(_this) {
            return function(swiper) {
              if (!_this.hasSwiped) {
                _this.loadCategory($el, swiper);
                return _this.hasSwiped = true;
              }
            };
          })(this)
        });
      });
    },
    createLoadingSlide: function() {
      var loadingSlideArray;
      loadingSlideArray = [];
      loadingSlideArray.push({});
      return loadingSlideArray;
    },
    loadCategory: function($el, swiper) {
      return store.store.load("categories", {
        id: this.props.data.linked_object_id
      }).then((function(_this) {
        return function(categoryPayload) {
          var articles, j, len, pageElement, ref;
          articles = [];
          ref = categoryPayload.payload.page_elements;
          for (j = 0, len = ref.length; j < len; j++) {
            pageElement = ref[j];
            if (pageElement.boxtype === "articles") {
              articles = articles.concat(pageElement.articles);
            }
          }
          _this.removeDuplicateEntries(articles);
          return _this.setState({
            slides: articles
          }, function() {
            var imageContainerHeight;
            imageContainerHeight = $el.find(".imageContainer").height();
            $el.find(".imageContainer").css("min-height", imageContainerHeight + "px");
            utils.utils.loopThroughArticlePreviews(articles, $el.find(".articlePreview"), {
              articlesRead: true,
              socialCounter: true,
              socialMedia: _this.props.socialMedia,
              colorize: {
                color: categoryPayload.payload.page_elements[0].color,
                type: "front"
              },
              specialIndex: 4
            });
            swiper.reInit();
            _this.categoryLength = articles.length;
            return _this.setState({
              isLoading: false
            });
          });
        };
      })(this));
    },
    removeDuplicateEntries: function(articles) {
      var i, initialSlide, results;
      i = articles.length;
      results = [];
      while (i--) {
        results.push((function() {
          var j, len, ref, results1;
          ref = this.props.initialSlides;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            initialSlide = ref[j];
            if (articles[i].id === initialSlide.id) {
              results1.push(articles.splice(i, 1));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    },
    calculateProgress: function($el, index, length) {
      var $paginationProgress, progressPercentage;
      progressPercentage = index / length * 100;
      $paginationProgress = $el.find(".paginationContainer .pagination .paginationProgress");
      return $paginationProgress.css("width", progressPercentage + "%");
    },
    render: function() {
      return require("framework/categorySlider/CategorySlider/template")["default"].apply(this);
    }
  });

  exports.CategorySlider = CategorySlider;

});
define('framework/categorySlider/CategorySlider/template', ['exports', 'framework/categorySlider/CategorySliderSlide/component'], function (exports, component) {

    'use strict';

    function repeatInitialSlide1(initialSlide, initialSlideIndex) {
        return React.createElement(component.CategorySliderSlide, {
            'slide': initialSlide,
            'key': initialSlide.id
        });
    }
    function repeatSlide2(slide, slideIndex) {
        return React.createElement(component.CategorySliderSlide, {
            'slide': slide,
            'isLoading': this.state.isLoading,
            'key': slideIndex
        });
    }
    exports['default'] = function () {
        return React.createElement('div', { 'className': 'NnCategorySlider' }, React.createElement('div', { 'className': 'swiper-container' }, React.createElement.apply(this, [
            'ul',
            { 'className': 'swiper-wrapper' }    /*  4 initial slides  */,
            _.map(this.props.initialSlides, repeatInitialSlide1.bind(this))    /*  all additional slides (and loading slides)  */,
            _.map(this.state.slides, repeatSlide2.bind(this))
        ])), React.createElement('div', { 'className': 'paginationContainer' }, React.createElement('div', { 'className': 'pagination' }, React.createElement('span', { 'className': 'paginationProgress' }))));
    };

});
define('framework/categorySlider/CategorySliderSlide/component', ['exports'], function (exports) {

  'use strict';

  var CategorySliderSlide;

  CategorySliderSlide = React.createClass({
    componentDidMount: function() {
      var that;
      that = this;
      return $(ReactDOM.findDOMNode(this)).find(">div >a").on("click", function() {
        return $(this).trigger({
          type: "clickedArticle",
          id: that.props.slide.id
        });
      });
    },
    render: function() {
      return require("framework/categorySlider/CategorySliderSlide/template")["default"].apply(this);
    }
  });

  exports.CategorySliderSlide = CategorySliderSlide;

});
define('framework/categorySlider/CategorySliderSlide/template', ['exports', 'framework/translations'], function (exports, translations) {

    'use strict';

    exports['default'] = function () {
        return React.createElement('li', { 'className': 'swiper-slide' }, React.createElement('div', { 'className': 'articlePreview teaser ' + (this.props.isLoading ? 'loading' : '') }, this.props.isLoading ? React.createElement('div', { 'className': 'preloader' }, React.createElement('div', {})) : null, React.createElement('a', { 'href': 'javascript:void(0);' }, React.createElement('div', {}, React.createElement('div', { 'className': 'imageContainer' }, React.createElement('div', { 'className': 'socialCounter' }), React.createElement('img', { 'src': this.props.slide.picture_small_url })), React.createElement('h5', {}, React.createElement('span', { 'className': 'keyword' }, this.props.slide.keyword), '\n                    ', this.props.slide.title_short, '\n                '), React.createElement('div', {})))));
    };

});
define('framework/comments/Comment/component', ['exports', 'framework/LocalStorageQueue', 'framework/translations', 'framework/utils', 'framework/facebook'], function (exports, LocalStorageQueue, translations, utils, facebook) {

  'use strict';

  var Comment, commentsSharedQueue, commentsUpratedQueue;

  commentsUpratedQueue = new LocalStorageQueue.LocalStorageQueue("Comments.uprated");

  commentsSharedQueue = new LocalStorageQueue.LocalStorageQueue("Comments.shared");

  Comment = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    maxLength: 800,
    getTimestamp: function() {
      return translations.translations.translate("vor") + " " + utils.utils.date.formatRelative(this.props.comment.created_at);
    },
    updateTimestampInterval: function() {
      if (this.isMounted()) {
        return this.setState({
          createdAt: this.getTimestamp()
        });
      }
    },
    getInitialState: function() {
      return {
        isCommentFormVisible: false,
        isCommentFormDisplayed: false,
        isBlameFormVisible: false,
        isBlameFormDisplayed: false,
        charsLeft: this.maxLength,
        uprates: this.props.comment.uprates,
        message: this.props.comment.message,
        isUprated: commentsUpratedQueue.contains(this.props.comment.id),
        isShared: commentsSharedQueue.contains(this.props.comment.id),
        createdAt: this.getTimestamp(),
        exceededChars: false
      };
    },
    focus: function() {
      var $comment;
      $comment = $(ReactDOM.findDOMNode(this));
      if (!$comment.hasClass("expanded")) {
        $comment.addClass("expanded");
        return this.props.defaults.hitWemf();
      }
    },
    getFromLocalStorage: function(key) {
      try {
        return localStorage.getItem("Comments." + key);
      } catch (_error) {}
    },
    componentDidMount: function() {
      setInterval(this.updateTimestampInterval, 60000);
      if (!this.props.comment.id) {
        return this.toggleCommentForm();
      }
    },
    componentWillUnmount: function() {
      return clearInterval(this.updateTimestampInterval);
    },
    componentDidUpdate: function(prevProps, prevState) {
      var charsLeft;
      if (prevState.text !== this.state.text) {
        charsLeft = this.maxLength - this.state.text.length;
        return this.setState({
          charsLeft: charsLeft,
          exceededChars: charsLeft < 0
        });
      }
    },
    submitCommentForm: function(e) {
      var $form, comment;
      e.preventDefault();
      $form = $(ReactDOM.findDOMNode(this.refs.commentForm));
      if ($form.validate()) {
        this.props.defaults.showLoader();
        comment = {
          message: $form.find("[name=text]").val(),
          article_id: this.props.defaults.commentsId,
          parent_id: this.props.comment.id,
          city: null,
          zip_code: null,
          created_at: new Date()
        };
        if (this.props.defaults.facebookUser) {
          comment.first_name = this.props.defaults.facebookUser.first_name;
          comment.last_name = this.props.defaults.facebookUser.last_name;
          comment.email = this.props.defaults.facebookUser.name + "@facebook.com";
        } else {
          comment.first_name = $form.find("[name=firstName]").val();
          comment.last_name = $form.find("[name=lastName]").val();
          comment.email = $form.find("[name=email]").val();
          comment.zip_code = $form.find("[name=zipCode]").val();
          comment.city = $form.find("[name=city]").val();
          try {
            localStorage.setItem("Comments.firstName", comment.first_name);
            localStorage.setItem("Comments.lastName", comment.last_name);
            localStorage.setItem("Comments.email", comment.email);
            localStorage.setItem("Comments.zipCode", comment.zip_code);
            localStorage.setItem("Comments.city", comment.city);
          } catch (_error) {}
        }
        return $.ajax({
          url: this.props.defaults.apiUrl + "/articles/" + this.props.defaults.commentsId + "/comments",
          type: "POST",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify({
            comment: comment
          }),
          success: (function(_this) {
            return function() {
              _this.toggleCommentForm();
              if ($form.find("[name=share]").prop("checked")) {
                _this.postOnMyWall(comment.message);
              }
              _this.setState({
                text: ""
              });
              $form.find("[type=checkbox]").prop("checked", false);
              _this.props.defaults.showDialog(translations.translations.translate("Kommentar versandt"), translations.translations.translate("Vielen Dank für Ihren Beitrag. Ihr Kommentar wurde versandt. Bis er von der Redaktion freigeschaltet wird, kann es eine gewisse Zeit dauern."));
              return _this.props.defaults.hitWemf();
            };
          })(this),
          error: (function(_this) {
            return function() {
              return _this.props.defaults.showDialog(translations.translations.translate("Senden fehlgeschlagen"), translations.translations.translate("Ihr Kommentar konnte aus technischen Gründen nicht übermittelt werden."));
            };
          })(this),
          complete: (function(_this) {
            return function() {
              return _this.props.defaults.hideLoader();
            };
          })(this)
        });
      } else {
        return this.props.defaults.showDialog(translations.translations.translate("Senden fehlgeschlagen"), translations.translations.translate("Bitte füllen Sie alle Felder korrekt aus und akzeptieren Sie die Regeln."));
      }
    },
    submitBlameForm: function(e) {
      var $form, blame;
      e.preventDefault();
      $form = $(ReactDOM.findDOMNode(this.refs.blameForm));
      if ($form.validate()) {
        this.props.defaults.showLoader();
        blame = {
          name: $form.find("[name=senderName]").val(),
          email: $form.find("[name=senderEmail]").val(),
          text: $form.find("[name=blameMessage]").val()
        };
        try {
          localStorage.setItem("Comments.senderName", blame.name);
          localStorage.setItem("Comments.senderEmail", blame.email);
        } catch (_error) {}
        return $.ajax({
          url: this.props.defaults.apiUrl + "/articles/" + this.props.defaults.commentsId + "/comments/" + this.props.comment.id + "/blames",
          type: "POST",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify({
            blame: blame
          }),
          success: (function(_this) {
            return function() {
              _this.toggleBlameForm();
              $form.find("[name=blameMessage]").val("");
              _this.props.defaults.showDialog(translations.translations.translate("Kommentar gemeldet"), translations.translations.translate("Danke. Unsere Moderatoren prüfen Ihren Hinweis so schnell wie möglich."));
              return _this.props.defaults.hitWemf();
            };
          })(this),
          error: (function(_this) {
            return function() {
              return _this.props.defaults.showDialog(translations.translations.translate("Senden fehlgeschlagen"), translations.translations.translate("Ihre Meldung konnte aus technischen Gründen nicht übermittelt werden."));
            };
          })(this),
          complete: (function(_this) {
            return function() {
              return _this.props.defaults.hideLoader();
            };
          })(this)
        });
      } else {
        return this.props.defaults.showDialog(translations.translations.translate("Senden fehlgeschlagen"), translations.translations.translate("Bitte füllen Sie alle Felder korrekt aus."));
      }
    },
    uprate: function() {
      if (this.state.isUprated) {
        return;
      }
      $.ajax({
        url: this.props.defaults.apiUrl + "/articles/" + this.props.defaults.commentsId + "/comments/" + this.props.comment.id + "/rates",
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({
          rate: {
            action: "up"
          }
        })
      });
      this.setState({
        isUprated: true,
        uprates: this.state.uprates + 1
      });
      return commentsUpratedQueue.add(this.props.comment.id);
    },
    toggleForm: function(form) {
      switch (form) {
        case "comment":
          return this.toggleCommentForm();
        case "blame":
          return this.toggleBlameForm();
      }
    },
    toggleCommentForm: function() {
      if (this.state.isBlameFormDisplayed) {
        ReactDOM.findDOMNode(this.refs.blameForm).style.display = "none";
      }
      if (this.state.isCommentFormDisplayed) {
        if (this.props.comment.id) {
          $(ReactDOM.findDOMNode(this.refs.commentForm)).toggle();
        }
      } else {
        this.setState({
          isCommentFormDisplayed: true
        }, (function(_this) {
          return function() {
            var $form;
            $form = $(ReactDOM.findDOMNode(_this.refs.commentForm));
            return $form.find("[placeholder]").simplePlaceholder({
              placeholderClass: "placeholderForLegacyBrowsers"
            });
          };
        })(this));
      }
      if (this.props.comment.id && !this.state.isCommentFormVisible) {
        this.props.defaults.hitWemf();
      }
      return this.setState({
        isCommentFormVisible: this.state.isCommentFormVisible ? false : true
      });
    },
    toggleBlameForm: function() {
      if (this.state.isCommentFormDisplayed) {
        ReactDOM.findDOMNode(this.refs.commentForm).style.display = "none";
      }
      if (this.state.isBlameFormDisplayed) {
        $(ReactDOM.findDOMNode(this.refs.blameForm)).toggle();
      } else {
        this.setState({
          isBlameFormDisplayed: true
        }, (function(_this) {
          return function() {
            var $form;
            $form = $(ReactDOM.findDOMNode(_this.refs.blameForm));
            return $form.find("[placeholder]").simplePlaceholder();
          };
        })(this));
      }
      if (this.props.comment.id && !this.state.isBlameFormVisible) {
        this.props.defaults.hitWemf();
      }
      return this.setState({
        isBlameFormVisible: this.state.isBlameFormVisible ? false : true
      });
    },
    toggleRules: function() {
      $(ReactDOM.findDOMNode(this)).find(".rules").toggle();
      return this.props.defaults.hitWemf();
    },
    share: function() {
      if (this.state.isShared) {
        return;
      }
      return this.postOnMyWall("\"" + this.props.comment.message.replaceNewLine() + "\"\n\n" + translations.translations.translate("Kommentar") + " " + translations.translations.translate("von") + " " + this.props.comment.first_name + " " + this.props.comment.last_name).then((function(_this) {
        return function() {
          _this.setState({
            isShared: true
          });
          return commentsSharedQueue.add(_this.props.comment.id);
        };
      })(this));
    },
    postOnMyWall: function(comment) {
      return facebook.facebook.postOnMyWall({
        message: comment,
        link: location.href
      });
    },
    render: function() {
      return require("framework/comments/Comment/template")["default"].apply(this);
    }
  });

  exports.Comment = Comment;

});
define('framework/comments/Comment/template', ['exports', 'framework/translations', 'framework/comments/Comment/component'], function (exports, translations, component) {

    'use strict';

    function onClick1(comment) {
        this.uprate();
    }
    function onClick2(comment) {
        this.toggleForm('blame');
    }
    function onClick3(comment) {
        this.share();
    }
    function onClick4(comment) {
        this.toggleForm('comment');
    }
    function onSubmit5(comment, e) {
        this.submitCommentForm(e);
    }
    function onFocus6(comment) {
        this.focus();
    }
    function onClick7(comment) {
        this.props.defaults.logout();
    }
    function onClick8(comment) {
        this.props.defaults.login();
    }
    function onClick9(comment) {
        this.toggleRules();
    }
    function onSubmit10(comment, e) {
        this.submitBlameForm(e);
    }
    function repeatComment11(comment, commentIndex) {
        return React.createElement(component.Comment, {
            'comment': comment,
            'key': comment.id,
            'defaults': this.props.defaults
        });
    }
    function scopeComment12() {
        var comment = this.props.comment;
        return React.createElement('li', { 'className': 'comment ' + (comment.id ? 'expanded' : '') }, comment.id ? React.createElement('p', { 'className': 'author' }, React.createElement('span', {}, '\n            ', comment.released ? comment.first_name + ' ' + comment.last_name : translations.translations.translate('Unbekannter Autor'), '\n        '), React.createElement('time', {}, this.state.createdAt)) : null, React.createElement('p', {
            'className': 'message',
            'dangerouslySetInnerHTML': { __html: comment.released ? comment.message : translations.translations.translate('Dieser Kommentar wurde wegen Regelverletzung gelöscht') }
        }), comment.id ? React.createElement('p', { 'className': 'menu' }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'className': this.state.isUprated ? 'inactive' : '',
            'onClick': onClick1.bind(this, comment),
            'name': 'uprate'
        }, React.createElement('span', { 'className': 'NnIcon upIcon' }), '\n            ', translations.translations.translate('Empfehlen'), ' (', this.state.uprates, ')\n        '), React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick2.bind(this, comment),
            'name': 'blame'
        }, translations.translations.translate('Melden')), React.createElement('a', {
            'href': 'javascript:void(0);',
            'className': this.state.isShared ? 'inactive' : '',
            'onClick': onClick3.bind(this, comment)
        }, translations.translations.translate('Teilen'))    /*  Only allow answering to answers, not deeper  */, this.props.defaults.isCommentingAllowed && comment.depth < 3 ? React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick4.bind(this, comment),
            'name': 'create'
        }, translations.translations.translate('Antworten')) : null) : null, this.state.isCommentFormDisplayed ? React.createElement('form', {
            'ref': 'commentForm',
            'onSubmit': onSubmit5.bind(this, comment),
            'className': 'commentForm'
        }, React.createElement('table', {}, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', { 'colSpan': '4' }, React.createElement('div', {}, React.createElement('textarea', {
            'name': 'text',
            'type': 'text',
            'data-validation': 'maxLength',
            'data-maxlength': this.maxLength,
            'onFocus': onFocus6.bind(this, comment),
            'valueLink': this.linkState('text'),
            'placeholder': translations.translations.translate('Schreiben Sie einen Kommentar...')
        }), React.createElement('div', { 'className': 'textareaFooter' }, React.createElement('p', { 'className': 'charsLeft ' + (this.state.exceededChars ? 'exceeded' : '') }, translations.translations.translate('Verbleibende Anzahl Zeichen'), ': ', this.state.charsLeft))), React.createElement('p', {
            'className': 'error',
            'data-label': 'text'
        }, translations.translations.translate('Kommentar bearbeiten')))))), React.createElement('table', { 'className': 'commentDetails' }, this.props.defaults.facebookUser ? React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {
            'colSpan': '4',
            'className': 'facebookUser'
        }, React.createElement('span', {}, this.props.defaults.facebookUser.first_name, ' ', this.props.defaults.facebookUser.last_name, ' '), React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick7.bind(this, comment)
        }, '(', translations.translations.translate('Abmelden'), ')'))), React.createElement('tr', {}, React.createElement('td', { 'colSpan': '4' }, React.createElement('label', {}, React.createElement('p', {}, React.createElement('input', {
            'type': 'checkbox',
            'name': 'share'
        })), React.createElement('p', {}, '\n                                ', translations.translations.translate('Kommentar auf Facebook teilen'), '\n                            '))))) : null, !this.props.defaults.facebookUser ? React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {
            'colSpan': '4',
            'className': 'facebookUser'
        }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick8.bind(this, comment)
        }, React.createElement('span', { 'className': 'NnIcon facebookIcon' }), translations.translations.translate('Mit Facebook anmelden'), '\n                        '))), React.createElement('tr', {}, React.createElement('td', {
            'colSpan': '2',
            'className': 'spaceRight'
        }, React.createElement('input', {
            'name': 'firstName',
            'type': 'text',
            'data-validation': 'nodigits',
            'placeholder': translations.translations.translate('Vorname'),
            'defaultValue': this.getFromLocalStorage('firstName')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'firstName'
        }, translations.translations.translate('Vorname'), ' ', translations.translations.translate('fehlt'))), React.createElement('td', {
            'colSpan': '2',
            'className': 'spaceLeft'
        }, React.createElement('input', {
            'name': 'lastName',
            'type': 'text',
            'data-validation': 'nodigits',
            'placeholder': translations.translations.translate('Name'),
            'defaultValue': this.getFromLocalStorage('lastName')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'lastName'
        }, translations.translations.translate('Name'), ' ', translations.translations.translate('fehlt')))), React.createElement('tr', {}, React.createElement('td', { 'className': 'spaceRight' }, React.createElement('input', {
            'name': 'zipCode',
            'type': 'text',
            'data-validation': 'digits',
            'placeholder': translations.translations.translate('PLZ'),
            'defaultValue': this.getFromLocalStorage('zipCode')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'zipCode'
        }, translations.translations.translate('PLZ'), ' ', translations.translations.translate('fehlt'))), React.createElement('td', {
            'colSpan': '3',
            'className': 'spaceLeft'
        }, React.createElement('input', {
            'name': 'city',
            'type': 'text',
            ',': true,
            'data-validation': 'nodigits',
            'placeholder': translations.translations.translate('Wohnort'),
            'defaultValue': this.getFromLocalStorage('city')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'city'
        }, translations.translations.translate('Wohnort'), ' ', translations.translations.translate('fehlt')))), React.createElement('tr', {}, React.createElement('td', { 'colSpan': '4' }, React.createElement('input', {
            'name': 'email',
            'type': 'text',
            'data-validation': 'email',
            'placeholder': translations.translations.translate('E-Mail-Adresse'),
            'defaultValue': this.getFromLocalStorage('email')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'email'
        }, translations.translations.translate('Bitte geben Sie eine korrekte E-Mail-Adresse ein'))))) : null, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', { 'colSpan': '4' }, React.createElement('label', { 'className': 'acceptRules' }, React.createElement('p', {}, React.createElement('input', {
            'type': 'checkbox',
            'data-validation': 'on',
            'name': 'rules'
        })), React.createElement('p', {}, '\n                                ', translations.translations.translate('Ich habe die'), ' ', React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick9.bind(this, comment)
        }, translations.translations.translate('Regeln')), ' ', translations.translations.translate('gelesen und erkläre mich einverstanden'), '\n                            ')), React.createElement('p', {
            'className': 'error',
            'data-label': 'rules'
        }, translations.translations.translate('Bitte lesen und akzeptieren Sie die Regeln')))), React.createElement('tr', {}, React.createElement('td', { 'colSpan': '4' }, React.createElement('input', {
            'type': 'submit',
            'className': 'button',
            'value': translations.translations.translate('Senden')
        }))))), React.createElement('p', {
            'className': 'rules',
            'dangerouslySetInnerHTML': { __html: this.props.defaults.rules }
        })) : null, this.state.isBlameFormDisplayed ? React.createElement('form', {
            'ref': 'blameForm',
            'onSubmit': onSubmit10.bind(this, comment),
            'className': 'blameForm'
        }, React.createElement('table', {}, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {}, React.createElement('p', {}, translations.translations.translate('Regelverstoss melden')))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('p', {}, translations.translations.translate('Sie sind der Meinung, dass dieser Kommentar gelöscht werden sollte? Dann füllen Sie bitte dieses Formular aus'), ':'))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('textarea', {
            'type': 'text',
            'name': 'blameMessage',
            'maxLength': '400',
            'placeholder': translations.translations.translate('Grund')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'blameMessage'
        }, translations.translations.translate('Grund'), ' ', translations.translations.translate('fehlt')))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('input', {
            'type': 'text',
            'name': 'senderName',
            'placeholder': translations.translations.translate('Name'),
            'data-validation': 'nodigits',
            'defaultValue': this.getFromLocalStorage('senderName')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'senderName'
        }, translations.translations.translate('Name'), ' ', translations.translations.translate('fehlt')))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('input', {
            'type': 'text',
            'name': 'senderEmail',
            'placeholder': translations.translations.translate('E-Mail-Adresse'),
            'data-validation': 'email',
            'defaultValue': this.getFromLocalStorage('senderEmail')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'senderEmail'
        }, translations.translations.translate('Bitte geben Sie eine korrekte E-Mail-Adresse ein')))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('input', {
            'type': 'submit',
            'className': 'button',
            'value': translations.translations.translate('Melden')
        })))))) : null, React.createElement.apply(this, [
            'ul',
            {},
            _.map(comment.children, repeatComment11.bind(this))
        ]));
    }
    exports['default'] = function () {
        return this.props.comment.released || this.props.comment.children.length ? scopeComment12.apply(this, []) : null;
    };

});
define('framework/comments/comments', ['exports', 'framework/string', 'framework/jquery', 'framework/utils', 'framework/store', 'framework/translations'], function (exports, __dep0__, __dep1__, utils, store, translations) {

  'use strict';

  var comments, idsInUse, module, throwError;

  module = {};

  module.config = {
    globalDialogSelector: "",
    globalFullscreenLoaderSelector: "",
    showTeaserComments: false,
    showCommentsCount: true,
    commentRules: "Ehrverletzende, rassistische, unsachliche, themenfremde Kommentare werden gelöscht.",
    env: ""
  };

  idsInUse = [];

  throwError = function(errorMessage) {
    throw "Comments error: " + errorMessage;
  };

  comments = {
    insert: function(targetEl, commentsId, options) {
      var $targetEl, callback;
      this.configure = function() {
        return throwError("configure() must not be called after insert()");
      };
      if (arguments.length <= 1) {
        throwError("Parameters missing, pass '<element id>, <comments id>, <callback>|<options>'");
      }
      if (idsInUse.indexOf(commentsId) > -1) {
        throwError("The provided comments id is already in use");
      }
      if (typeof options === "function") {
        callback = options;
      }
      options = $.extend({}, options);
      options.callback = options.callback || callback || function() {};
      $targetEl = $(targetEl);
      $targetEl.data("commentsId", commentsId);
      idsInUse.push(commentsId);
      $targetEl.addClass("NnComments");
      return ReactDOM.render(React.createElement(require("framework/comments/CommentsList/component")["default"], {
        commentsId: commentsId,
        callback: options.callback,
        globalDialogSelector: module.config.globalDialogSelector,
        globalFullscreenLoaderSelector: module.config.globalFullscreenLoaderSelector,
        apiUrl: module.config.apiUrl,
        wemfUrls: options.wemfUrls || [],
        showTeaserComments: module.config.showTeaserComments,
        showCommentsCount: module.config.showCommentsCount,
        rules: (function() {
          if (module.config.env === "mobile") {
            return module.config.commentRules.replace("%rulesLink%", "/articles/19367311");
          } else {
            return module.config.commentRules.replace("%rulesLink%", "/19367311");
          }
        })()
      }), targetEl);
    },
    configure: function(config) {
      $.extend(module.config, config);
      translations.translations.configure(module.config.language);
      utils.utils.configure({
        language: module.config.language
      });
      return store.store.configure({
        apiUrl: module.config.apiUrl
      });
    },
    remove: function(targetEl) {
      var commentsId;
      commentsId = $(targetEl).data("commentsId");
      idsInUse = _.without(idsInUse, commentsId);
      return ReactDOM.unmountComponentAtNode(targetEl);
    }
  };

  exports.comments = comments;

});
define('framework/comments/CommentsList/component', ['exports', 'framework/store', 'framework/utils', 'framework/browser', 'framework/facebook', 'framework/statistics'], function (exports, store, utils, browser, facebook, statistics) {

  'use strict';

  var CommentsList;

  CommentsList = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    allComments: [],
    filteredComments: [],
    defaultSortBy: "dateDesc",
    getInitialState: function() {
      return {
        comments: [],
        community: [],
        isCommentingAllowed: false,
        facebookUser: null
      };
    },
    getDefaultCommentProps: function() {
      return {
        isCommentingAllowed: this.state.isCommentingAllowed,
        facebookUser: this.state.facebookUser,
        commentsId: this.props.commentsId,
        apiUrl: this.props.apiUrl,
        showDialog: this.showDialog,
        login: this.login,
        logout: this.logout,
        showLoader: this.showLoader,
        hideLoader: this.hideLoader,
        hitWemf: this.hitWemf,
        rules: this.props.rules
      };
    },
    getLoader: function() {
      var $fullscreenLoader;
      $fullscreenLoader = $(ReactDOM.findDOMNode(this)).find(".fullscreenLoader");
      if (this.props.globalFullscreenLoaderSelector) {
        $fullscreenLoader = $("" + this.props.globalFullscreenLoaderSelector);
      }
      return $fullscreenLoader;
    },
    showLoader: function() {
      return this.getLoader().addClass("NnTransparency").show();
    },
    hideLoader: function() {
      return this.getLoader().removeClass("NnTransparency").hide();
    },
    componentDidMount: function() {
      var $el;
      $el = $(ReactDOM.findDOMNode(this));
      if (!this.props.globalFullscreenLoaderSelector) {
        $el.append(require("framework/loader/fullscreenLoader")["default"]());
      }
      if (!this.props.globalDialogSelector) {
        $el.append(require("framework/dialog/templates/dialog")["default"]());
        $el.find(".NnDialog").on("click", function(e) {
          return e.delegateTarget.style.display = "none";
        });
      }
      return RSVP.all([
        store.store.load("articles", {
          id: this.props.commentsId,
          subkey: "comments"
        }), store.store.load("articles", {
          id: this.props.commentsId,
          subkey: "communities"
        })
      ]).then((function(_this) {
        return function(payloads) {
          var commentsCommunity, communities, eachComment, flatten;
          _this.allComments = payloads[0].payload.comments;
          communities = payloads[1].payload.communities;
          (eachComment = function(comments, depth) {
            if (depth == null) {
              depth = 0;
            }
            depth++;
            return comments.forEach(function(comment) {
              comment.depth = depth;
              if (comment.children) {
                return eachComment(comment.children, depth);
              }
            });
          })(_this.allComments);
          _this.filteredComments = ((flatten = function(comments, result) {
            if (result == null) {
              result = [];
            }
            comments.forEach(function(comment) {
              result.push(comment);
              if (comment.children) {
                flatten(comment.children, result);
                return comment.children = [];
              }
            });
            return result;
          })($.extend(true, [], _this.allComments))).filter(function(comment) {
            return comment.selected === true;
          });
          _this.filteredComments.sort(function(a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
          });
          commentsCommunity = communities.filter(function(community) {
            return community.type === "comment";
          })[0];
          return _this.setState({
            comments: _this.allComments,
            community: commentsCommunity,
            isCommentingAllowed: utils.utils.isCommentingAllowed(commentsCommunity.allow_comments_weekdays, commentsCommunity.allow_comments_weekends)
          }, function() {
            this.setState({
              sortBy: (this.filteredComments.length ? "selected" : this.defaultSortBy)
            }, function() {
              var comment, i, index, len, originalSort, ref, teaserComments;
              if (this.props.showTeaserComments) {
                if (this.state.sortBy !== "selected") {
                  if (this.allComments.length) {
                    teaserComments = [];
                    ref = this.allComments.slice(0, 2);
                    for (index = i = 0, len = ref.length; i < len; index = ++i) {
                      comment = ref[index];
                      comment = $.extend(true, {}, comment);
                      if (comment.children.length !== 0) {
                        if (index === 1) {
                          comment.children = [];
                        } else {
                          this.spliceChildArray(comment.children, 1);
                        }
                        teaserComments.push(comment);
                        break;
                      } else {
                        comment.children = [];
                        teaserComments.push(comment);
                      }
                    }
                    this.setState({
                      comments: teaserComments
                    });
                  }
                }
              }
              originalSort = this.sort;
              return this.sort = (function(_this) {
                return function(property) {
                  originalSort(property);
                  if (_this.props.showTeaserComments) {
                    $(ReactDOM.findDOMNode(_this.refs.showAllComments)).hide();
                  }
                  return _this.hitWemf();
                };
              })(this);
            });
            facebook.facebook.init().then((function(_this) {
              return function() {
                _this.setState({
                  facebookUser: facebook.facebook.getUser()
                });
                return $(facebook.facebook).on("login logout", function(e, user) {
                  return _this.setState({
                    facebookUser: user
                  });
                });
              };
            })(this));
            if (this.props.callback) {
              this.props.callback(payloads);
            }
            if (!this.props.globalFullscreenLoaderSelector) {
              return this.hideLoader();
            }
          });
        };
      })(this));
    },
    componentWillUnmount: function() {
      return $(facebook.facebook).off("login logout");
    },
    spliceChildArray: function(childArray, index) {
      childArray.splice(index, childArray.length);
      if (childArray[0] != null) {
        return this.spliceChildArray(childArray[0].children, 0);
      }
    },
    sort: function(property) {
      switch (property) {
        case "popularity":
          return this.setState({
            comments: this.allComments.sort(function(a, b) {
              return b.uprates - a.uprates;
            })
          });
        case "dateDesc":
          return this.setState({
            comments: this.allComments.sort(function(a, b) {
              return new Date(b.created_at) - new Date(a.created_at);
            })
          });
        case "dateAsc":
          return this.setState({
            comments: this.allComments.sort(function(a, b) {
              return new Date(a.created_at) - new Date(b.created_at);
            })
          });
        case "selected":
          return this.setState({
            comments: this.filteredComments
          });
      }
    },
    login: function() {
      facebook.facebook.login();
      return this.hitWemf();
    },
    logout: function() {
      facebook.facebook.logout();
      return this.hitWemf();
    },
    hitWemf: function() {
      return statistics.statistics.trackPageView(null, this.props.wemfUrls.map(function(wemfUrl) {
        return {
          provider: "wemf",
          url: wemfUrl,
          desktop_url: wemfUrl
        };
      }));
    },
    showAllComments: function() {
      $(ReactDOM.findDOMNode(this.refs.showAllComments)).hide();
      this.setState({
        comments: this.allComments
      });
      if (this.props.showTeaserComments && this.state.sortBy === "selected") {
        return this.setState({
          sortBy: this.defaultSortBy
        });
      } else {
        return this.hitWemf();
      }
    },
    showDialog: function(title, lead) {
      return utils.utils.showDialog((this.props.globalDialogSelector ? "" + this.props.globalDialogSelector : $(ReactDOM.findDOMNode(this)).find(".NnDialog")[0]), title, lead);
    },
    render: function() {
      return require("framework/comments/CommentsList/template")["default"].apply(this);
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (prevState.sortBy !== this.state.sortBy) {
        return this.sort(this.state.sortBy);
      }
    }
  });

  exports['default'] = CommentsList;

});
define('framework/comments/CommentsList/template', ['exports', 'framework/translations', 'framework/comments/Comment/component'], function (exports, translations, component) {

    'use strict';

    function repeatComment1(comment, commentIndex) {
        return React.createElement(component.Comment, {
            'comment': comment,
            'key': comment.id,
            'defaults': this.getDefaultCommentProps()
        });
    }
    function onClick2() {
        this.showAllComments();
    }
    exports['default'] = function () {
        return React.createElement('div', {}, this.props.showCommentsCount ? React.createElement('h2', {}, '\n        ', this.state.community.count, ' ', this.state.community.comment_count_text, '\n    ') : null, React.createElement('ul', {}, this.state.isCommentingAllowed ? React.createElement(component.Comment, {
            'comment': { released: true },
            'defaults': this.getDefaultCommentProps()
        }) : null), this.state.comments.length ? React.createElement('div', { 'className': 'separator' }) : null, this.state.comments.length ? React.createElement('table', { 'className': 'NnSelect' }, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {}, React.createElement('span', { 'className': 'NnIcon downIcon' })), React.createElement('td', {}, React.createElement('select', { 'valueLink': this.linkState('sortBy') }, React.createElement('option', { 'value': 'dateDesc' }, translations.translations.translate('Neuste')), React.createElement('option', { 'value': 'popularity' }, translations.translations.translate('Beliebteste')), this.filteredComments.length ? React.createElement('option', { 'value': 'selected' }, translations.translations.translate('Wahl der Redaktion')) : null, React.createElement('option', { 'value': 'dateAsc' }, translations.translations.translate('Älteste'))))))) : null, React.createElement.apply(this, [
            'ul',
            { 'ref': 'commentsList' },
            _.map(this.state.comments, repeatComment1.bind(this))
        ]), this.props.showTeaserComments && this.state.comments.length ? React.createElement('a', {
            'href': 'javascript:void(0);',
            'className': 'showAllComments',
            'ref': 'showAllComments',
            'onClick': onClick2.bind(this)
        }, '\n        ', translations.translations.translate('Alle Kommentare anzeigen'), '\n        ', React.createElement('span', { 'className': 'NnIcon downIcon' })) : null);
    };

});
define('framework/config', ['exports'], function (exports) {

  'use strict';

  var config, currentCustomer, defaultTexts, type;

  defaultTexts = {
    rules: {
      dch: "Wir freuen uns, dass Sie bei uns einen Kommentar abgeben wollen. Ihr Onlinekommentar kann auch auf der Leserbriefseite der gedruckten Zeitung erscheinen. Bitte machen Sie sich vorab mit <a href=\"%rulesLink%\">unseren Kommentarregeln</a> vertraut. Die Redaktion behält sich vor, Beiträge nicht zu publizieren. Dies gilt ganz allgemein, aber insbesondere für ehrverletzende, rassistische, unsachliche, themenfremde Kommentare oder solche in Mundart oder Fremdsprachen. Kommentare mit Fantasienamen oder offensichtlich falschen Namen werden ebenfalls nicht veröffentlicht. Über die Entscheide der Redaktion wird weder Rechenschaft abgelegt, noch Korrespondenz geführt. Die Redaktion behält sich ausserdem vor, Leserkommentare zu kürzen. Bitte nehmen Sie zur Kenntnis, dass Ihre Beiträge auch von Google und anderen Suchmaschinen gefunden werden können und dass die Redaktion nichts unternehmen kann, um einen Kommentar aus dem Suchmaschinenindex zu löschen.",
      wch: "Nous nous réjouissons de votre contribution. Veuillez prendre connaissance des conditions d'utilisation suivantes: La rédaction se réserve le droit de ne pas publier un commentaire, et plus particulièrement pour les termes insultants, racistes, subjectifs ou inappropriés, ainsi que ceux rédigés en langues étrangères. Les commentaires avec des pseudonymes ou des fausses identités ne seront pas non plus publiés. La rédaction n'a pas à rendre de compte ou à communiquer au sujet de ses décisions. Aucune explication ne sera donnée par téléphone. La rédaction se réserve également le droit de raccourcir les commentaires des lecteurs. Veuillez également noter que votre commentaire pourra être indexé par Google et tout autre moteur de recherche. La rédaction ne pourra être tenue pour responsable, tout comme elle ne pourra supprimer un commentaire indexé par un moteur de recherche."
    },
    newest: {
      dch: "Live-Ansicht",
      wch: "En direct"
    },
    newestDescription: {
      dch: "Das Neuste zuerst in der <strong>Live-Ansicht</strong>",
      wch: "<strong>En direct</strong> toute l'actu minute par minute"
    }
  };

  config = {
    configure: function(config) {
      return $.extend(this, config);
    },
    version: window.version = "@@VERSION",
    api: window.api,
    apiUrl: "/api",
    defaultPathname: "/fronts/mobile",
    requestTimeout: 5000,
    requestRetries: 10,
    timeoutBetweenRetries: 1000,
    internalConsole: false,
    noNavigation: false,
    noHeader: false,
    initialTransition: true,
    isDebugMode: false,
    isNativeApp: false,
    language: "de",
    commentRules: defaultTexts.rules.dch,
    newest: defaultTexts.newest.dch,
    newestDescription: defaultTexts.newestDescription.dch,
    customers: {
      "24heures": {
        fullName: "24heures",
        shortName: "VQH",
        alternativeName: "24heures",
        language: "fr",
        locale: "fr_FR",
        appleAppId: 380349537,
        wemf: {
          survey: {
            szmvars: "24heures//CP//",
            url: "http://24heures.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/24heures/", "http://24heures.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "24heuresch"
        },
        facebook: {
          pageId: 10150100771335484,
          pageUrl: "https://facebook.com/24heures.ch",
          init: {
            appId: 251285271592561,
            version: "v2.6",
            channelUrl: "http://www.24heures.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        commentRules: defaultTexts.rules.wch,
        newest: defaultTexts.newest.wch,
        newestDescription: defaultTexts.newestDescription.wch
      },
      "bazonline": {
        fullName: "Baslerzeitung",
        shortName: "BaZ",
        alternativeName: "bazonline",
        locale: "de_DE",
        appleAppId: 327214089,
        wemf: {
          survey: {
            szmvars: "baz//CP//",
            url: "http://baz.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/baz/", "http://baz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "bazonline"
        },
        facebook: {
          pageId: 111236060676,
          pageUrl: "http://www.facebook.com/pages/Basler-Zeitung/111236060676",
          init: {
            appId: 185771024788811,
            version: "v2.6",
            channelUrl: "http://www.bazonline.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        commentRules: "Wir freuen uns, dass Sie bei uns einen Kommentar abgeben wollen. Ihr Onlinekommentar kann auch auf der Leserbriefseite der gedruckten Zeitung (mit Angabe Wohnort) erscheinen. Bitte nehmen Sie vorab folgende Regeln zur Kenntnis: Die Redaktion behält sich vor, Kommentare nicht zu publizieren. Dies gilt ganz allgemein, aber insbesondere für ehrverletzende, rassistische, unsachliche, themenfremde Kommentare oder solche in Mundart oder Fremdsprachen. Kommentare mit Fantasienamen oder mit ganz offensichtlich falschen Namen werden ebenfalls nicht veröffentlicht. Über die Entscheide der Redaktion wird weder Rechenschaft abgelegt, noch Korrespondenz geführt. Telefonische Auskünfte werden keine erteilt. Die Redaktion behält sich ausserdem vor, Leserkommentare online wie in der Printausgabe zu kürzen. Bitte nehmen Sie zur Kenntnis, dass Ihr Kommentar auch von Google und anderen Suchmaschinen gefunden werden kann und dass die Redaktion nichts unternehmen kann und wird, um einen einmal abgegebenen Kommentar aus dem Suchmaschinenindex zu löschen."
      },
      "bernerzeitung": {
        fullName: "Bernerzeitung",
        shortName: "BZ",
        alternativeName: "bernerzeitung",
        locale: "de_DE",
        appleAppId: 327210951,
        wemf: {
          survey: {
            szmvars: "bernerz//CP//",
            url: "http://bernerz.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/bernerz/", "http://bernerz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "BernerZeitung"
        },
        facebook: {
          pageId: 69474637264,
          pageUrl: "http://www.facebook.com/pages/wwwbernerzeitungch/69474637264",
          init: {
            appId: 151632851557044,
            version: "v2.6",
            channelUrl: "http://www.bernerzeitung.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        newest: "Newsticker",
        newestDescription: "Das Neuste zuerst im <strong>Newsticker</strong>"
      },
      "derbund": {
        fullName: "Der Bund",
        shortName: "B",
        alternativeName: "derbund",
        locale: "de_DE",
        appleAppId: 327212452,
        wemf: {
          survey: {
            szmvars: "derbund//CP//",
            url: "http://derbund.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/derbund/", "http://derbund.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "derbund"
        },
        facebook: {
          pageId: 178913512122277,
          pageUrl: "https://facebook.com/derbundch",
          init: {
            appId: 160395880675799,
            version: "v2.6",
            channelUrl: "http://www.derbund.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        }
      },
      "lematin": {
        fullName: "LeMatin",
        shortName: "LM",
        alternativeName: "lematin",
        language: "fr",
        locale: "fr_FR",
        appleAppId: 307368454,
        wemf: {
          survey: {
            url: "http://lematin.wemfbox.ch/2004/01/survey.js",
            szmvars: "lematin//CP//"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/lematin/", "http://lematin.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "lematinch"
        },
        facebook: {
          pageId: 107915992569379,
          pageUrl: "https://www.facebook.com/lematin.ch",
          init: {
            appId: 188734271214193,
            version: "v2.6",
            channelUrl: "http://www.tagesanzeiger.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        commentRules: defaultTexts.rules.wch,
        newest: defaultTexts.newest.wch,
        newestDescription: defaultTexts.newestDescription.wch
      },
      "tagesanzeiger": {
        fullName: "Tages-Anzeiger",
        shortName: "TA",
        alternativeName: "tagesanzeiger",
        locale: "de_DE",
        appleAppId: 322823380,
        wemf: {
          survey: {
            url: "http://tagesanz.wemfbox.ch/2004/01/survey.js",
            szmvars: "tagesanz//CP//"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/tagesanz/", "http://tagesanz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "tagesanzeiger"
        },
        facebook: {
          pageId: 177194474660,
          pageUrl: "https://facebook.com/Tagesanzeiger",
          init: {
            appId: 147124108642216,
            version: "v2.6",
            channelUrl: "http://www.tagesanzeiger.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        }
      },
      "tdg": {
        fullName: "Tribune de Genéve",
        shortName: "TDG",
        alternativeName: "tdg",
        language: "fr",
        locale: "fr_FR",
        appleAppId: 380351338,
        twitter: {
          accountName: "tdggeneve"
        },
        wemf: {
          survey: {
            url: "http://tdg.wemfbox.ch/2004/01/survey.js",
            szmvars: "tdg//CP//"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/tdg/", "http://tdg.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        facebook: {
          pageId: 105188432853984,
          pageUrl: "https://facebook.com/tdg.ch",
          init: {
            appId: 222318267841285,
            version: "v2.6",
            channelUrl: "http://www.derbund.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        commentRules: defaultTexts.rules.wch,
        newest: defaultTexts.newest.wch,
        newestDescription: defaultTexts.newestDescription.wch
      },
      "zsz": {
        fullName: "Zürichsee-Zeitung",
        shortName: "ZSZ",
        alternativeName: "zsz",
        locale: "de_DE",
        twitter: {
          accountName: "ZSZonline"
        },
        facebook: {
          pageId: 385968291506847,
          pageUrl: "https://www.facebook.com/pages/Z%C3%BCrichsee-Zeitung/385968291506847",
          init: {
            appId: 1538332599783320,
            version: "v2.6",
            channelUrl: "http://www.zsz.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        wemf: {
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/zsz/", "http://zsz.wemfbox.ch/cgi-bin/ivw/CP/"]
        }
      },
      "landbote": {
        fullName: "Landbote",
        shortName: "LB",
        alternativeName: "landbote",
        locale: "de_DE",
        twitter: {
          accountName: "landbote"
        },
        facebook: {
          pageId: 145683188797207,
          pageUrl: "https://www.facebook.com/landbote",
          init: {
            appId: 738531732909881,
            version: "v2.6",
            channelUrl: "http://www.landbote.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        wemf: {
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/winti/", "http://winti.wemfbox.ch/cgi-bin/ivw/CP/"]
        }
      },
      "zuonline": {
        fullName: "Zürcher Unterländer",
        shortName: "ZU",
        alternativeName: "zuonline",
        locale: "de_DE",
        twitter: {
          accountName: "ZUnterland"
        },
        facebook: {
          pageId: 588623241193743,
          pageUrl: "https://www.facebook.com/pages/Z%C3%BCrcher-Unterl%C3%A4nder/588623241193743",
          init: {
            appId: 900877159943131,
            version: "v2.6",
            channelUrl: "http://www.zuonline.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        wemf: {
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/zuonline/", "http://zuonline.wemfbox.ch/cgi-bin/ivw/CP/"]
        }
      },
      "berneroberlaender": {
        fullName: "Berner Oberländer",
        shortName: "BO",
        alternativeName: "berneroberlaender",
        locale: "de_DE",
        appleAppId: 994154918,
        wemf: {
          survey: {
            szmvars: "bernerz//CP//",
            url: "http://bernerz.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/bernerz/", "http://bernerz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "BernerZeitung"
        },
        facebook: {
          pageId: 69474637264,
          pageUrl: "http://www.facebook.com/pages/wwwbernerzeitungch/69474637264",
          init: {
            appId: 151632851557044,
            version: "v2.6",
            channelUrl: "http://www.bernerzeitung.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        newest: "Newsticker",
        newestDescription: "Das Neuste zuerst im <strong>Newsticker</strong>"
      },
      "thunertagblatt": {
        fullName: "Thuner Tagblatt",
        shortName: "TT",
        alternativeName: "thunertagblatt",
        locale: "de_DE",
        wemf: {
          survey: {
            szmvars: "bernerz//CP//",
            url: "http://bernerz.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/bernerz/", "http://bernerz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "BernerZeitung"
        },
        facebook: {
          pageId: 69474637264,
          pageUrl: "http://www.facebook.com/pages/wwwbernerzeitungch/69474637264",
          init: {
            appId: 151632851557044,
            version: "v2.6",
            channelUrl: "http://www.bernerzeitung.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        newest: "Newsticker",
        newestDescription: "Das Neuste zuerst im <strong>Newsticker</strong>"
      },
      "langenthalertagblatt": {
        fullName: "Langenthaler Tagblatt",
        shortName: "LT",
        alternativeName: "langenthalertagblatt",
        locale: "de_DE",
        appleAppId: 994154247,
        wemf: {
          survey: {
            szmvars: "bernerz//CP//",
            url: "http://bernerz.wemfbox.ch/2004/01/survey.js"
          },
          nn1: ["http://newsnetz.wemfbox.ch/cgi-bin/ivw/CP/bernerz/", "http://bernerz.wemfbox.ch/cgi-bin/ivw/CP/"]
        },
        twitter: {
          accountName: "BernerZeitung"
        },
        facebook: {
          pageId: 69474637264,
          pageUrl: "http://www.facebook.com/pages/wwwbernerzeitungch/69474637264",
          init: {
            appId: 151632851557044,
            version: "v2.6",
            channelUrl: "http://www.bernerzeitung.ch/channel.html",
            status: true,
            cookie: true,
            xfbml: true
          },
          login: {
            scope: "publish_actions,user_likes"
          }
        },
        newest: "Newsticker",
        newestDescription: "Das Neuste zuerst im <strong>Newsticker</strong>"
      },
      "12app": {
        shortName: "BOA",
        alternativeName: "12app",
        language: "de",
        locale: "de_DE",
        appleAppId: 985919437,
        productWebsite: "http://www.12app.ch/",
        itunesAppStoreUrl: "https://itunes.apple.com/us/app/12-app/id985919437?l=de&ls=1&mt=8",
        googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=ch.iagentur.i12app",
        twitter: {
          accountName: null
        },
        facebook: {
          init: {
            appId: 107213792968618,
            version: "v2.6",
            xfbml: true
          }
        },
        commentRules: defaultTexts.rules.dch,
        newest: defaultTexts.newest.dch,
        newestDescription: defaultTexts.newestDescription.dch
      }
    },
    paywall: {
      enabled: true,
      status: {
        enabled: 2,
        trackOnly: 1,
        disabled: 0
      },
      templateSets: "http://%subdomain%.%currentCustomer%.ch/cre-1.0/cockpit/platform/tamedia/shop/%alternativeName%/api/templatesets.js",
      templateClient: "http://%subdomain%.%currentCustomer%.ch/cre-1.0/static/tracking/1.0/templateclient.js",
      tracking: "http://%subdomain%.%currentCustomer%.ch/cre-1.0/tracking/tracking.js",
      logout: "https://%subdomain%.%currentCustomer%.ch/tamstorefront/logout?callerUri=http://" + window.location.host,
      abo: "http://%subdomain%.%currentCustomer%.ch",
      myAccount: "https://%subdomain%.%currentCustomer%.ch/tamstorefront/my-account"
    }
  };

  $.extend(config, window.configOverrides);

  if (navigator.userAgent.indexOf("app-ios-smartphone") > -1 || navigator.userAgent.indexOf("app-android-smartphone") > -1) {
    config.isNativeApp = true;
    config.noHeader = true;
    config.paywall.enabled = false;
    type = navigator.userAgent.substr(navigator.userAgent.lastIndexOf("-") + 1, navigator.userAgent.length);
    switch (type) {
      case "3":
        config.noHeader = false;
        config.noNavigation = true;
    }
  }

  config.currentCustomer = currentCustomer = window.location.hostname.split(".").reverse()[1];

  if (!config.customers[currentCustomer]) {
    currentCustomer = config.currentCustomer = window.defaultCustomer;
  }

  $.extend(config, config.customers[currentCustomer]);

  config.isProduction = (function() {
    if (config.env === "mobile") {
      return window.location.hostname.toLowerCase().indexOf("mobile2") > -1;
    } else {
      return ["localhost", "dev", "staging", "paywall"].every(function(value) {
        return window.location.hostname.toLowerCase().indexOf(value) < 0;
      });
    }
  })();

  exports.config = config;

});
define('framework/dialog/dialog', ['exports'], function (exports) {

  'use strict';

  var dialog;

  dialog = {
    init: function() {
      return $("#dialog").on("click", function(e) {
        return e.delegateTarget.style.display = "none";
      });
    }
  };

  exports.dialog = dialog;

});
define('framework/dialog/templates/dialog', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div {{#if id}}id=\"{{id}}\"{{/if}} class=\"NnDialog\" name=\"close\">\n    <div>\n        <a class=\"iconClose\"><span class=\"NnIcon closeIcon\"></span></a>\n\n        <h1></h1>\n        <h2></h2>\n        <div>\n            {{> loader}}\n        </div>\n    </div>\n</div>");

});
define('framework/eventsMixin', ['exports'], function (exports) {

  'use strict';

  var eventsMixin;

  eventsMixin = function() {
    this.registerEvent = function(eventName) {
      if (this.__eventListeners == null) {
        this.__eventListeners = {};
      }
      if (this.__eventListeners[eventName] == null) {
        this.__eventListeners[eventName] = [];
      }
      return this;
    };
    this.registerEvents = function(eventNames) {
      var eventName, j, len;
      for (j = 0, len = eventNames.length; j < len; j++) {
        eventName = eventNames[j];
        this.registerEvent(eventName);
      }
      return this;
    };
    this.on = function(eventName, eventListener) {
      var eventNames, j, len;
      eventNames = eventName.split(" ");
      for (j = 0, len = eventNames.length; j < len; j++) {
        eventName = eventNames[j];
        if (this.__eventListeners[eventName] != null) {
          this.__eventListeners[eventName].push(eventListener);
        }
      }
      return this;
    };
    this.off = function(eventName, eventListener) {
      var eventNames, i, j, k, len, ref;
      eventNames = eventName.split(" ");
      for (j = 0, len = eventNames.length; j < len; j++) {
        eventName = eventNames[j];
        if (this.__eventListeners[eventName] != null) {
          if (eventListener != null) {
            for (i = k = ref = this.__eventListeners[eventName].length - 1; k >= 0; i = k += -1) {
              if (this.__eventListeners[eventName][i] === eventListener) {
                this.__eventListeners[eventName].splice(i, 1);
              }
            }
          } else {
            this.__eventListeners[eventName].length = 0;
          }
        }
      }
      return this;
    };
    this.trigger = function(eventName, args) {
      var eventListener, j, len, ref;
      if (this.__eventListeners[eventName] != null) {
        ref = this.__eventListeners[eventName];
        for (j = 0, len = ref.length; j < len; j++) {
          eventListener = ref[j];
          if (args != null) {
            eventListener.apply(this, args.length != null ? args : [args]);
          } else {
            eventListener.call(this);
          }
        }
      }
      return this;
    };
    return this;
  };

  exports.eventsMixin = eventsMixin;

});
define('framework/facebook', ['exports', 'framework/config', 'framework/browser', 'framework/utils', 'framework/translations'], function (exports, config, browser, utils, translations) {

  'use strict';

  var facebook, facebookUser, hasInitStarted, isLoggedInPromise;

  isLoggedInPromise = RSVP.defer();

  hasInitStarted = false;

  facebookUser = null;

  facebook = {
    init: function() {
      if (!hasInitStarted) {
        hasInitStarted = true;
        $.loadExternalScript("//connect.facebook.net/" + config.config.locale + "/sdk.js#xfbml=1&version=v2.6&appId=" + config.config.facebook.init.appId).then((function(_this) {
          return function() {
            FB.init(config.config.facebook.init);
            return FB.getLoginStatus(function(response) {
              if (response.status === "connected") {
                return FB.api("/me?fields=first_name,last_name", function(response) {
                  facebookUser = response;
                  return isLoggedInPromise.resolve();
                });
              } else {
                return isLoggedInPromise.resolve();
              }
            });
          };
        })(this));
      }
      return isLoggedInPromise.promise;
    },
    getUser: function() {
      return facebookUser;
    },
    checkIfUserLikedPage: function() {
      var userLikePromise;
      userLikePromise = RSVP.defer();
      this.login().then(function() {
        return FB.api("/me/likes/" + config.config.facebook.pageId, function(response) {
          return userLikePromise.resolve(response.data.length > 0);
        });
      });
      return userLikePromise.promise;
    },
    login: function() {
      if (facebookUser) {
        return isLoggedInPromise.promise;
      }
      if (browser.browser.isWP() || config.config.isNativeApp) {
        location.href = "https://www.facebook.com/dialog/oauth?client_id=" + config.config.facebook.init.appId + "&response_type=token&redirect_uri=" + location.href;
      } else {
        if (window.FB) {
          isLoggedInPromise = RSVP.defer();
          FB.login(((function(_this) {
            return function(response) {
              if (response.authResponse) {
                return FB.api("/me?fields=first_name,last_name", function(response) {
                  facebookUser = response;
                  $(_this).triggerHandler("login", facebookUser);
                  return isLoggedInPromise.resolve(facebookUser);
                });
              }
            };
          })(this)), config.config.facebook.login);
        }
      }
      return isLoggedInPromise.promise;
    },
    logout: function() {
      if (window.FB) {
        facebookUser = null;
        $(this).triggerHandler("logout", facebookUser);
        return FB.logout();
      }
    },
    postOnMyWall: function(data) {
      return this.login().then(function() {
        return FB.api("/me/feed/", "post", data, function() {});
      });
    }
  };

  exports.facebook = facebook;

});
define('framework/handlebars/module', ['exports', 'framework/utils', 'framework/translations'], function (exports, utils, translations) {

  'use strict';

  var handlebars, module;

  module = {};

  module.config = null;

  handlebars = {
    configure: function(config) {
      return module.config = config;
    },
    init: function() {
      Handlebars.registerHelper("tamediaIcon", function(value, options) {
        return new Handlebars.SafeString('<span class="NnIcon ' + value + 'Icon"></span>');
      });
      Handlebars.registerHelper("generatePictureCaption", function(picture, options) {
        var annotation, annotation_type_text;
        annotation = "";
        if (picture.photographer || picture.provider) {
          annotation_type_text = (function() {
            switch (picture.annotation_type) {
              case "picture":
                return translations.translations.translate("Bild");
              case "video":
                return translations.translations.translate("Video");
              default:
                return "";
            }
          })();
          annotation += " ";
          if (picture.annotation_type) {
            annotation += annotation_type_text + ": ";
          }
          if (picture.photographer) {
            annotation += picture.photographer;
          }
          if (picture.photographer && picture.provider) {
            annotation += "/";
          }
          if (picture.provider) {
            annotation += picture.provider;
          }
        }
        return (picture.title ? "<b>" + picture.title + "</b>" : "") + picture.caption + (annotation ? "<span class=\"annotation\">" + annotation + "</span>" : "");
      });
      Handlebars.registerHelper("isCategoryLink", function(options) {
        if (this.linked_object_type === "category") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isWeatherLink", function(options) {
        if (this.linked_object_type === "weather") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isCommunityTypeComment", function(options) {
        if (this.type === "comment") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isCommunityTypeFacebook", function(options) {
        if (this.type === "facebook") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isCommunityTypeTwitter", function(options) {
        if (this.type === "twitter") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("times", function(n, options) {
        var accum, i;
        accum = "";
        i = 0;
        while (i < n) {
          accum += options.fn(i);
          ++i;
        }
        return accum;
      });
      Handlebars.registerHelper("isCommentingAllowed", function(commentsCommunity, options) {
        if (utils.utils.isCommentingAllowed(commentsCommunity.allow_comments_weekdays, commentsCommunity.allow_comments_weekends)) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("unlessMaxDepth", function(options) {
        if (this.depth < 3) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("stripAndTrimHtml", function(text) {
        var shortenedText, strippedText;
        if (text == null) {
          text = "";
        }
        strippedText = text.replace(/<[^>]+>/g, "");
        shortenedText = strippedText.substr(0, 85);
        if (/^\S/.test(strippedText.substr(85))) {
          shortenedText = shortenedText.replace(/\s+\S*$/, "");
        }
        return shortenedText + "...";
      });
      Handlebars.registerHelper("linkTo", function(url, options) {
        var attrs, key, ref, value;
        attrs = [];
        ref = options.hash;
        for (key in ref) {
          value = ref[key];
          if (url.indexOf(key) < 0 && ["href", "data-isLinkTo"].indexOf(key) < 0) {
            attrs.push(key + "=\"" + value + "\"");
          } else {
            url = url.replace(new RegExp("%" + key + "%"), value);
          }
        }
        if (!history.pushState) {
          url = "#" + url;
        }
        return "<a href=\"" + url + "\" data-isLinkTo=\"true\" " + (attrs.join(" ")) + ">" + (options.fn(this)) + "</a>";
      });
      Handlebars.registerHelper("stripHtml", function(text) {
        return utils.utils.stripHtml(text);
      });
      Handlebars.registerHelper("isSupportedBoxtype", function(options) {
        if (["articles", "slideshow", "picture", "video", "youtube", "info", "link", "chartMap", "chart", "livevideo", "picturevoting", "quiz", "iframe", "stock_exchange_chart", "poll"].indexOf(this.boxtype) >= 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("displayMediaType", function(options) {
        if (["slideshow", "video"].indexOf(this.mediatype) > -1) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isBreakingNewsArticlesBox", function(options) {
        if (this.boxtype === "articles" && this.layout_type === "breaking-news") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isArticlesBox", function(options) {
        if (this.boxtype === "articles" && this.layout_type !== "breaking-news" && this.layout_type !== "horizontal-slide") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isSlideshowOverviewBox", function(value) {
        if (this.boxtype === "slideshowoverview" || this.layout_type === "horizontal-slide") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isMeteonewsBox", function(value) {
        if (this.boxtype === "meteonews") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isMeteonewsBoxLM", function(value) {
        if (this.boxtype === "meteonewsLM") {
          return value.fn(this);
        } else {
          return vlaue.inverse(this);
        }
      });
      Handlebars.registerHelper("isSlideshowElement", function(value) {
        if (this.type === "element_slideshow") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isSlideshowBox", function(value) {
        var ref, ref1;
        if (this.boxtype === "slideshow" && (((ref = this.slideshow) != null ? (ref1 = ref.pictures) != null ? ref1.length : void 0 : void 0) != null) && this.slideshow.pictures.length > 0) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isPictureElement", function(value) {
        if (this.type === "element_picture") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isPictureBox", function(value) {
        if (this.boxtype === "picture") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isVideoElement", function(value) {
        if (this.type === "element_video") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isVideoBox", function(value) {
        if (this.boxtype === "video") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isAudioBox", function(value) {
        if (this.boxtype === "audio") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isYouTubeBox", function(value) {
        if (this.boxtype === "youtube") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isInfoBox", function(value) {
        if (this.boxtype === "info") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLinkBox", function(value) {
        if (this.boxtype === "link") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isHtmlElement", function(value) {
        if (this.type === "element_html") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isChartMap", function(value) {
        if (this.type === "element_chart_map" || this.type === "element_chart") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isChartMapBox", function(value) {
        if (this.boxtype === "chartMap") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isChartBox", function(value) {
        if (this.boxtype === "chart") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isStockExchangeChartBox", function(value) {
        if (this.boxtype === "stock_exchange_chart") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLiveStreamBox", function(value) {
        if (this.boxtype === "livevideo") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLiveticker", function(value) {
        if (this.liveticker_id) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isPictureVotingBox", function(value) {
        if (this.boxtype === "picturevoting") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isQuizBox", function(value) {
        if (this.boxtype === "quiz") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isIframeElement", function(value) {
        if (this.type === "element_iframe") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isIframeBox", function(value) {
        if (this.boxtype === "iframe") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isIframeBoxMap", function(value) {
        if (this.boxtype === "iframe" && (this.iframe_class_name === "chart" || this.iframe_class_name === "map")) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isPollElement", function(value) {
        if (this.type === "element_poll") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isPollBox", function(value) {
        if (this.boxtype === "poll") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTagsBox", function(value) {
        if (this.boxtype === "tags") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isBlogsBox", function(value) {
        if (this.boxtype === "blogs") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("hasIframeHeight", function(value) {
        if (this.iframe_class_name === "chart" || this.iframe_class_name === "fixed_height" || this.iframe_class_name === "map") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isNavigationTypeTitle", function(value) {
        if (this.navigation_type === "title") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isNavigationTypeCategory", function(value) {
        if (this.navigation_type === "category") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isString", function(object, value) {
        if (typeof object === "string") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isWertend", function(value) {
        if (typeof this !== "undefined" && this !== null) {
          if (this.layout_type === "analyse" || this.layout_type === "analyse_wide") {
            return value.fn(this);
          } else {
            return value.inverse(this);
          }
        }
      });
      Handlebars.registerHelper("isLeadDecoration", function(value) {
        if ((typeof this !== "undefined" && this !== null) && (this.decoration != null) && this.decoration.position === "lead") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTopDecoration", function(value) {
        if ((typeof this !== "undefined" && this !== null) && (this.decoration != null) && this.decoration.position === "top") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isBottomDecoration", function(value) {
        if ((typeof this !== "undefined" && this !== null) && (this.decoration != null) && this.decoration.position === "bottom") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("translate", function(key) {
        return translations.translations.translate(key);
      });
      Handlebars.registerHelper("appifyUrl", function(url, urlParams) {
        if (url != null) {
          url += (url.indexOf("?") >= 0 ? "&" : "?") + "appId=" + module.config.appId;
          return url + (urlParams != null ? "&" + urlParams : "");
        } else {
          return "";
        }
      });
      Handlebars.registerHelper("isPublireportage", function(value) {
        if (typeof this !== "undefined" && this !== null) {
          if (this.layout_type === "publireportage") {
            return value.fn(this);
          } else {
            return value.inverse(this);
          }
        }
      });
      Handlebars.registerHelper("isExternalArticle", function(value) {
        if (typeof this !== "undefined" && this !== null) {
          if (this.layout_type === "link") {
            return value.fn(this);
          } else {
            return value.inverse(this);
          }
        }
      });
      Handlebars.registerHelper("isTeaser", function(value) {
        switch (this.layout_type) {
          case "link_wide":
          case "link_wide_extended":
          case "category":
          case "quote":
          case "html_teaser":
            return value.inverse(this);
          default:
            return value.fn(this);
        }
      });
      Handlebars.registerHelper("isTeaserWide", function(value) {
        if (this.layout_type === "link_wide") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTeaserWideExtended", function(value) {
        if (this.layout_type === "link_wide_extended") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTeaserCollection", function(value) {
        if (this.layout_type === "category") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTeaserQuote", function(value) {
        if (this.layout_type === "quote") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isTeaserHtml", function(value) {
        if (this.layout_type === "html_teaser") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLayoutTypeCategory", function(options) {
        if (this.layout_type === "category") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper("isLayoutTypeSlideshow", function(value) {
        if (this.layout_type === "slideshow") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLayoutTypeListicle", function(value) {
        if (this.layout_type === "listicle") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLayoutTypeStoryBundle", function(value) {
        if (this.pageElementLayoutType === "storybundle") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLayoutTypeCollection", function(value) {
        if (this.pageElementLayoutType === "collection") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("toTwoDecimals", function(value) {
        if (value != null) {
          return value.toFixed(2);
        }
      });
      Handlebars.registerHelper("getPageElementLink", function() {
        switch (this.linked_object_type) {
          case "category":
            return "/categories/" + this.linked_object_id;
          case "weather":
            return "/weather";
          default:
            return "javascript:void(0);";
        }
      });
      Handlebars.registerHelper("getStockPerformanceColor", function(value) {
        if (value > 0) {
          return "green";
        } else if (value < 0) {
          return "red";
        } else {
          return "gray";
        }
      });
      Handlebars.registerHelper("join", function(array, key) {
        return array.map(function(el) {
          return el[key];
        }).join(", ");
      });
      Handlebars.registerHelper("getCustomerShortName", function() {
        return module.config.shortName;
      });
      Handlebars.registerHelper("isLematin", function(value) {
        if (module.config.shortName === "LM") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isLematinCategorySlider", function(value) {
        if (location.pathname.length === 1 && module.config.shortName === "LM" && this.linked_object_type === "category" && this.layout_type !== "publireportage") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("getProductWebsite", function() {
        return module.config.productWebsite;
      });
      Handlebars.registerHelper("getItunesAppStoreUrl", function() {
        return module.config.itunesAppStoreUrl + "&utm_source=sharingpage&utm_medium=" + module.config.env + "&utm_campaign=standard";
      });
      Handlebars.registerHelper("getGooglePlayStoreUrl", function() {
        return module.config.googlePlayStoreUrl + "&utm_source=sharingpage&utm_medium=" + module.config.env + "&utm_campaign=standard";
      });
      Handlebars.registerHelper("getFromLocalStorage", function(key) {
        try {
          return localStorage.getItem(key);
        } catch (_error) {}
      });
      Handlebars.registerHelper("getTime", function() {
        var date, minutes;
        date = new Date();
        minutes = date.getMinutes();
        if (minutes.toString().length === 1) {
          minutes = "0" + minutes;
        }
        return (date.getHours()) + ":" + minutes;
      });
      Handlebars.registerHelper("getTimestamp", function() {
        return Math.round(new Date().getTime() / 1000);
      });
      Handlebars.registerHelper("isInternalUrl", function(value) {
        if (this.navigation_type === "internal_url") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isWeatherPath", function(value) {
        if (this.path === "weather") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isFrontPath", function(value) {
        if (this.path === "") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("formatMeteonewsDay", function(timestamp) {
        var days;
        days = ["Sa", "So", "Mo", "Di", "Mi", "Do", "Fr"];
        return translations.translations.translate(days[new Date(timestamp).getDay()]);
      });
      Handlebars.registerHelper("formatDate", function(timestamp) {
        return utils.utils.date.format(timestamp);
      });
      Handlebars.registerHelper("formatDateShort", function(timestamp) {
        return utils.utils.date.formatShort(timestamp);
      });
      Handlebars.registerHelper("formatTime", function(timestamp) {
        return utils.utils.date.formatTime(timestamp);
      });
      Handlebars.registerHelper("isPaywallEnabled", function(value) {
        if (this.site.paywall_status === module.config.paywall.status.enabled && module.config.paywall.enabled) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isDch", function(value) {
        if (utils.utils.isDch()) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isDebugMode", function(value) {
        if (module.config.isDebugMode) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("unlessReleasedAndHasNoChildren", function(value) {
        if (typeof this === "function" ? this((typeof released !== "undefined" && released !== null) && this.released === false && this.children.length === 0) : void 0) {
          return value.inverse(this);
        } else {
          return value.fn(this);
        }
      });
      Handlebars.registerHelper("calculatePercent", function(value, total) {
        var newValue;
        newValue = value / total * 10;
        return Math.round(newValue * 100) / 10;
      });
      Handlebars.registerHelper("isSVGSupported", function(value) {
        if (document.createElement("svg").getAttributeNS) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isFirst", function(index, value) {
        if (index === 0) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isEmptyArticle", function(value) {
        if (!(this.timestamp_updated_at === 0 && this.title === null)) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("getArticlesCount", function() {
        return this.articles.filter(function(item) {
          return item.layout_type === "article";
        }).length;
      });
      Handlebars.registerHelper("getChannel", function() {
        if (this.video.channel != null) {
          return this.video.channel.toLowerCase();
        } else {
          return "mobile";
        }
      });
      Handlebars.registerHelper("isFooter", function(value) {
        if (this.type === "footer") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isDropdownMenu", function(value) {
        if (this.name === "Mehr") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("limit", function(arr, limit) {
        if (arr != null) {
          return arr.slice(0, limit);
        }
      });
      Handlebars.registerHelper("getMediaIcon", function() {
        if (this.mediatype === "picture" || this.mediatype === "iframe") {
          return "arrowRight";
        } else if (this.mediatype === "zattoo") {
          return "video";
        } else {
          return this.mediatype;
        }
      });
      Handlebars.registerHelper("getFirstListicleTitle", function(value) {
        var element, j, len, ref, results;
        if ((this.inline_elements != null) && this.inline_elements.length > 0) {
          ref = this.inline_elements;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            element = ref[j];
            if (element.boxtype === "element") {
              if (element.element.type === "element_listicle") {
                results.push(element.element.title);
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      });
      Handlebars.registerHelper("isShareElement", function(value) {
        if (this.type === "element_share") {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isNavigationActive", function(value) {
        if (this.navigation_visibility !== 0) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("isNavigationExpanded", function(value) {
        if (this.navigation_visibility === 2) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerHelper("showCardCount", function(index, value) {
        return (++index) + "/" + value.length;
      });
      Handlebars.registerHelper("isIndex", function(curIndex, index, value) {
        if (curIndex + 1 === index) {
          return value.fn(this);
        } else {
          return value.inverse(this);
        }
      });
      Handlebars.registerPartial("loader", function(context) {
        return require("framework/loader/loader")["default"](context);
      });
      Handlebars.registerPartial("dialog", function(context) {
        return require("framework/dialog/templates/dialog")["default"](context);
      });
      Handlebars.registerPartial("fullscreenLoader", function(context) {
        return require("framework/loader/fullscreenLoader")["default"](context);
      });
      Handlebars.registerPartial("cards", function(context) {
        return require("framework/listicles/templates/cards")["default"](context);
      });
      Handlebars.registerPartial("element", function(context) {
        return require("framework/listicles/templates/element")["default"](context);
      });
      return Handlebars.registerPartial("navigation", function(context) {
        return require("framework/listicles/templates/navigation")["default"](context);
      });
    }
  };

  exports.handlebars = handlebars;

});
define('framework/jquery', ['framework/utils', 'framework/browser'], function (utils, browser) {

  'use strict';

  var raiseAjaxError;

  $.fn.NnTransit = function(property, fromValue, toValue, duration, timingFn, callback) {
    var promises;
    promises = [];
    this.each(function() {
      return promises.push(new RSVP.Promise((function(_this) {
        return function(resolve, reject) {
          var $el;
          $el = $(_this);
          $el.css(property, fromValue);
          return (function($el) {
            return setTimeout(function() {
              var transitionEndEventName;
              transitionEndEventName = "transitionend";
              if (browser.browser.isWebKit()) {
                transitionEndEventName = "webkitTransitionEnd";
              }
              $el.css("transition", property + " " + duration + " " + timingFn);
              $el.css("transition");
              return $el.one(transitionEndEventName, function(e) {
                if (callback) {
                  callback();
                }
                $el.css("transition", "");
                return resolve(e.delegateTarget);
              }).css(property, toValue);
            }, 0);
          })($el);
        };
      })(this)));
    });
    return RSVP.all(promises);
  };

  $.fn.NnFadeIn = function() {
    return this.css("visibility", "visible").NnTransit("opacity", 0, 1, "0.1s", "ease-in-out");
  };

  $.fn.NnFadeOut = function() {
    return this.NnTransit("opacity", 1, 0, "0.1s", "ease-in-out").then((function(_this) {
      return function() {
        return _this.css("visibility", "hidden");
      };
    })(this));
  };

  $.fn.closestScrollable = function() {
    var el, elements, j, len;
    elements = [];
    for (j = 0, len = this.length; j < len; j++) {
      el = this[j];
      if ($(el).is(":scrollable")) {
        elements.push(el);
      } else {
        while (el = el.parentNode) {
          if (!($(el).is(":scrollable"))) {
            continue;
          }
          elements.push(el);
          break;
        }
      }
    }
    return $(elements);
  };

  $.fn.applyTargetToLinks = function(target) {
    this.find("a").attr("target", target);
    return this;
  };

  $.fn.isInViewport = function(isCompleteElementInViewport) {
    var rect;
    if (isCompleteElementInViewport == null) {
      isCompleteElementInViewport = false;
    }
    if (this.length === 0) {
      return false;
    } else if (this.length === 1) {
      rect = this[0].getBoundingClientRect();
      if (isCompleteElementInViewport) {
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= $(window).height() && rect.right <= $(window).width();
      } else {
        return rect.bottom >= 0 && rect.right >= 0 && rect.top <= $(window).height() && rect.left <= $(window).width();
      }
    } else {
      throw "Cannot use 'isInViewport' for collections";
    }
  };

  $.fn.padding = function() {
    var styles;
    if (this.length === 1) {
      styles = window.getComputedStyle(this[0]);
      return {
        top: parseFloat(styles["paddingTop"]),
        right: parseFloat(styles["paddingRight"]),
        bottom: parseFloat(styles["paddingBottom"]),
        left: parseFloat(styles["paddingLeft"])
      };
    } else {
      throw "Cannot get paddings over collections";
    }
  };

  $.fn.margin = function() {
    var styles;
    if (this.length === 1) {
      styles = window.getComputedStyle(this[0]);
      return {
        top: parseFloat(styles["marginTop"]),
        bottom: parseFloat(styles["marginBottom"])
      };
    } else {
      throw "Selector cannot get margins over collections";
    }
  };

  $.fn.validate = function() {
    var $el, el, errorField, fieldName, isValid, results;
    results = (function() {
      var j, len, ref, results1;
      ref = this.find("input, textarea");
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        el = ref[j];
        $el = $(el);
        $el.removeClass("invalid");
        isValid = (function() {
          switch ($el.attr("data-validation")) {
            case "nodigits":
              return /^[A-Za-z\u00C0-\u00FF\/. -]+$/.test($el.val());
            case "digits":
              return /^[0-9]+$/.test($el.val());
            case "email":
              return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($el.val());
            case "on":
              return $el[0].checked === true;
            case "maxLength":
              return $el.val().length <= $el.attr("data-maxlength") && $el.val() !== "";
            default:
              return $el.val() !== "";
          }
        })();
        fieldName = $el.attr("name");
        errorField = this.find("[data-label='" + fieldName + "']");
        if (!isValid) {
          errorField.show();
        } else {
          errorField.hide();
        }
        results1.push(isValid);
      }
      return results1;
    }).call(this);
    return results.indexOf(false) === -1;
  };

  $.fn.simulateDragDrop = function(options) {
    return this.each(function() {
      return new $.simulateDragDrop(this, options);
    });
  };

  $.simulateDragDrop = function(elem, options) {
    this.options = options;
    return this.simulateEvent(elem, options);
  };

  $.extend($.simulateDragDrop.prototype, {
    simulateEvent: function(elem, options) {
      var dragEndEvent, dropEvent, event, type;
      type = "dragstart";
      event = this.createEvent(type);
      this.dispatchEvent(elem, type, event);
      type = "drop";
      dropEvent = this.createEvent(type, {});
      dropEvent.dataTransfer = event.dataTransfer;
      this.dispatchEvent($(options.dropTarget)[0], type, dropEvent);
      type = "dragend";
      dragEndEvent = this.createEvent(type, {});
      dragEndEvent.dataTransfer = event.dataTransfer;
      return this.dispatchEvent(elem, type, dragEndEvent);
    },
    createEvent: function(type) {
      var event;
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(type, true, true, null);
      event.dataTransfer = {
        data: {},
        setData: function(type, val) {
          return this.data[type] = val;
        },
        getData: function(type) {
          return this.data[type];
        }
      };
      return event;
    },
    dispatchEvent: function(elem, type, event) {
      if (elem.dispatchEvent) {
        return elem.dispatchEvent(event);
      } else if (elem.fireEvent) {
        return elem.fireEvent("on" + type, event);
      }
    }
  });

  $.ajaxSettings = {
    timeout: null,
    contentType: null
  };

  $.ajaxSetup = function(options) {
    return $.extend($.ajaxSettings, options);
  };

  raiseAjaxError = function(xhr, options, error, statusText, reject) {
    if (options.error != null) {
      options.error.call(this);
    }
    reject(error);
    if (options.global) {
      return $(document).trigger("ajaxError", [
        {}, {
          statusText: statusText,
          url: options.url,
          type: options.type,
          timeout: xhr.timeout
        }
      ]);
    }
  };

  $.ajax = function(url, options) {
    var ajaxUrlParts, browserUrlParts, urlSplitter;
    if (arguments.length === 1 && typeof url === "object") {
      options = url;
      options = $.extend({}, $.ajaxSettings, options);
    } else {
      options = $.extend({}, $.ajaxSettings, options);
      options.url = url;
    }
    if (options.type == null) {
      options.type = "GET";
    }
    if (options.global == null) {
      options.global = true;
    }
    if (options.data == null) {
      options.data = "";
    }
    if (options.contentType == null) {
      options.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    }
    urlSplitter = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
    browserUrlParts = urlSplitter.exec(window.location.href) || [];
    ajaxUrlParts = urlSplitter.exec(options.url.toLowerCase()) || [];
    options.crossDomain = ajaxUrlParts.length > 0 && (browserUrlParts && (browserUrlParts[1] !== ajaxUrlParts[1] || browserUrlParts[2] !== ajaxUrlParts[2] || (browserUrlParts[3] || (browserUrlParts[1] === "http:" ? "80" : "443")) !== (ajaxUrlParts[3] || (ajaxUrlParts[1] === "http:" ? "80" : "443"))));
    if (options.cache === false) {
      options.url = utils.utils.addRnd(options.url);
    }
    return new RSVP.Promise(function(resolve, reject) {
      var jsonpUrl, xdr, xhr;
      if (options.dataType === "json" && options.url.indexOf("callback=?") > -1) {
        jsonpUrl = options.url.replace("callback=?", "callback=jsonpCallback");
        window.jsonpCallback = function(payload) {
          if (options.success != null) {
            options.success.call(this, payload);
          }
          return resolve(payload);
        };
        return $.loadExternalScript(jsonpUrl).then(function() {
          return delete window.jsonpCallback;
        });
      } else if (options.crossDomain && !browser.browser.supportsCors() && window.XDomainRequest && options.type === "GET") {
        xdr = new XDomainRequest();
        if (options.timeout != null) {
          xdr.timeout = options.timeout;
        }
        xdr.open(options.type, options.url);
        xdr.onprogress = function() {};
        xdr.onload = function() {
          var data, e;
          if (options.dataType === "json" || (options.dataType !== "text" && /\/json/i.test(xdr.contentType))) {
            if (xdr.responseText) {
              try {
                data = JSON.parse(xdr.responseText);
                if (options.success != null) {
                  options.success.call(this, data);
                }
                resolve(data);
              } catch (_error) {
                e = _error;
                raiseAjaxError(xdr, options, $.extend(e, {
                  message: "$.ajax() " + options.type + ": Error parsing: " + options.url
                }), "parsererror", reject);
              }
            } else {
              if (options.success != null) {
                options.success.call(this, "");
              }
              resolve("");
            }
          } else {
            throw "$.ajax: XDomainRequest only supports json requests until now";
          }
          if (options.complete != null) {
            return options.complete.call(this);
          }
        };
        xdr.onerror = function() {
          return raiseAjaxError(xdr, options, "$.ajax() " + options.type + ": Unknown error on: " + options.url + "\n " + xdr.responseText, "Error in XDomainRequest", reject);
        };
        xdr.ontimeout = function() {
          return raiseAjaxError(xdr, options, "$.ajax() " + options.type + ": " + options.url, "timeout", reject);
        };
        if (options.beforeSend != null) {
          options.beforeSend(xdr);
        }
        return xdr.send("");
      } else {
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        if (options.timeout != null) {
          xhr.timeout = options.timeout;
        }
        xhr.onreadystatechange = function() {
          var data, e, statusText;
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              if (xhr.responseText) {
                try {
                  data = JSON.parse(xhr.responseText);
                  if (options.success != null) {
                    options.success.call(this, data);
                  }
                  resolve(data);
                } catch (_error) {
                  e = _error;
                  raiseAjaxError(xhr, options, $.extend(e, {
                    message: "$.ajax() " + options.type + ": Error parsing: " + options.url
                  }), "parsererror", reject);
                }
              } else {
                if (options.success != null) {
                  options.success.call(this, "");
                }
                resolve("");
              }
            } else {
              statusText = xhr.status === 0 ? "Unknown error (might be CORS or a timeout)" : xhr.statusText;
              raiseAjaxError(xhr, options, "$.ajax() " + options.type + ": Status " + xhr.status + " \"" + statusText + "\" on: " + options.url, statusText, reject);
            }
            if (options.complete != null) {
              return options.complete.call(this);
            }
          }
        };
        xhr.setRequestHeader("Content-Type", options.contentType);
        if (options.beforeSend != null) {
          options.beforeSend(xhr);
        }
        return xhr.send(options.data);
      }
    });
  };

  $.get = function(url) {
    return $.ajax(url);
  };

  $.getJSON = function(url, data, success) {
    if ($.isFunction(data)) {
      success = data;
      data = void 0;
    }
    return $.ajax({
      dataType: "json",
      url: url,
      data: data,
      success: success
    });
  };

  $.post = function(url, data) {
    return $.ajax(url, {
      type: "POST",
      data: data
    });
  };

  $.loadExternalScript = function(url) {
    return new RSVP.Promise(function(resolve, reject) {
      var firstScript, script;
      script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = url;
      if (typeof document.attachEvent === "object") {
        script.onreadystatechange = function() {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            return resolve();
          }
        };
      } else {
        $(script).on("load", function() {
          return resolve();
        });
        $(script).on("error", function(e) {
          return reject($.extend(e, {
            message: "$.loadExternalScript(): Cannot load " + url
          }));
        });
      }
      firstScript = document.getElementsByTagName("script")[0];
      return firstScript.parentNode.insertBefore(script, firstScript);
    });
  };

  $.event.special.contentResize = {
    setup: function(data, namespaces) {
      if (this.nodeName.toUpperCase() !== "IFRAME") {
        throw "$.event.special.contentResize: This event works with iframes only, and they must have a src specified!";
      }
      this.__contentResizeId = Math.random().toString().split(".").pop();
      return $(window).on("message." + this.__contentResizeId, (function($iframe, e) {
        if (this.contentWindow !== e.originalEvent.source) {
          return;
        }
        if (!$iframe.attr("src") || $iframe.attr("src").search(/^[a-z]+:\/\//g) < 0 || e.originalEvent.origin === $iframe.attr("src").match(/[a-z]+:\/\/[^\/]+/g)[0]) {
          return $iframe.trigger("contentResize", [e.originalEvent.data.width, e.originalEvent.data.height, $iframe.width(), $iframe.height()]);
        }
      }).bind(this, $(this)));
    },
    teardown: function(namespaces) {
      return $(window).off("message." + this.__contentResizeId);
    }
  };

  (function($) {
    var props, re, reBody;
    props = ["", "-x", "-y"];
    re = /^(?:auto|scroll)$/i;
    reBody = /^(?:auto|scroll|visible)$/i;
    return $.expr[":"].scrollable = function(el) {
      var $el, isScrollable;
      isScrollable = false;
      $el = $(el);
      $.each(props, function(i, v) {
        return !(isScrollable = isScrollable || re.test($el.css("overflow" + v)) || ($.nodeName(el, "body") && reBody.test($el.css("overflow" + v))));
      });
      return isScrollable;
    };
  })($);

});
define('framework/listicles/listicle', ['exports', 'framework/jquery', 'framework/config', 'framework/store', 'framework/browser', 'framework/handlebars/module', 'framework/poll/module', 'framework/slideshow/slideshow', 'framework/facebook'], function (exports, __dep0__, framework__config, store, browser, module, poll__module, slideshow, facebook) {

  'use strict';

  var Listicle, bindNavigationEvents, createFloatingNavigation, getScrollElementForScrollContainer, handleIframeResize, load, loadElement, render, renderIframe, renderPoll, renderSlideshow, renderSocialMedia, renderSocialMediaWidgets, smoothScrollIntoView;

  renderSocialMediaWidgets = function(el) {
    if (twttr) {
      twttr.widgets.load(el);
    }
    if (instgrm) {
      return instgrm.Embeds.process();
    }
  };

  renderSlideshow = function(payload, container) {
    return new slideshow.Slideshow(container, payload.pictures, {
      fullyResponsive: true
    }).show();
  };

  renderPoll = function(payload) {
    return poll__module.poll.init({
      payload: payload
    }, payload.wrapped_id);
  };

  renderIframe = function(payload, container) {
    return handleIframeResize(payload.height, $(container).data("height", payload.height));
  };

  renderSocialMedia = function($container, listiclePayload, cardIndex) {
    var $card, actualCard, cardCount, escapedShareText, shareText, url;
    $card = $container.find(".card:eq(" + cardIndex + ")");
    actualCard = cardIndex + 1;
    cardCount = $container.find(".card").length;
    url = location.href.split("#")[0];
    shareText = listiclePayload.title + " (" + actualCard + "/" + cardCount + ") " + url + "#card" + actualCard;
    escapedShareText = encodeURIComponent(shareText);
    return $card.find(".share ul li a").on("click", function() {
      switch ($(this).attr("name")) {
        case "facebook":
          return facebook.facebook.init().then(function() {
            return FB.ui({
              method: "feed",
              name: listiclePayload.title,
              link: url + "#card" + actualCard,
              description: shareText
            });
          });
        case "whatsapp":
          return $(this).attr("href", "whatsapp://send?text=" + escapedShareText);
        case "email":
          return $(this).attr("href", "mailto:?subject=" + listiclePayload.title + "&body=" + escapedShareText);
        case "twitter":
          return $(this).attr("href", "https://twitter.com/intent/tweet?text=" + escapedShareText);
      }
    });
  };

  getScrollElementForScrollContainer = function(scrollContainer) {
    var $scrollContainer;
    $scrollContainer = $(scrollContainer);
    if ($.nodeName($scrollContainer[0], "body")) {
      return $(document);
    } else {
      return $scrollContainer;
    }
  };

  createFloatingNavigation = function(payload, $listicle, config) {
    var $firstCard, $floatingNavigation, $scrollContainer, firstCard, listicle, scrollContainer;
    if (payload.navigation_visibility === 0) {
      return;
    }
    scrollContainer = ($scrollContainer = $listicle.closestScrollable())[0];
    firstCard = ($firstCard = $listicle.find(".card:first"))[0];
    listicle = $listicle[0];
    ($.nodeName(scrollContainer, "body") ? $scrollContainer : $scrollContainer.parent()).append($floatingNavigation = $("<div id='NnListicleFloatingNav' class='" + config.floatingNavStyle + "'></div>").append($listicle.find("nav").clone(true).removeClass("expanded")));
    switch (config.floatingNavStyle) {
      case Listicle.FLOATING_NAV_STYLE_TOP:
        $floatingNavigation.find("nav").css({
          "width": $listicle.find("nav").outerWidth() + "px"
        });
    }
    getScrollElementForScrollContainer(scrollContainer).on("scroll", function() {
      var firstCardPositionTop, invisibleStyleClass, listicleBottomPositionTop, listicleTopPositionTop, scrollableParentOffsetTop, visibleStyleClass;
      scrollableParentOffsetTop = scrollContainer.getBoundingClientRect().top + $.css(scrollContainer, "borderTopWidth", true);
      firstCardPositionTop = firstCard.getBoundingClientRect().top - scrollableParentOffsetTop - $.css(firstCard, "marginTop", true) - $(document).scrollTop();
      listicleTopPositionTop = listicle.getBoundingClientRect().top - scrollableParentOffsetTop - $.css(listicle, "marginTop", true) - $(document).scrollTop();
      listicleBottomPositionTop = (function() {
        switch (config.floatingNavStyle) {
          case Listicle.FLOATING_NAV_STYLE_TOP:
            return listicleTopPositionTop + $listicle.outerHeight(true) - $listicle.find("nav").outerHeight(true);
          case Listicle.FLOATING_NAV_STYLE_TINY:
            return listicleTopPositionTop + $listicle.outerHeight(true);
        }
      })();
      visibleStyleClass = "visible";
      invisibleStyleClass = "invisible";
      if (config.hasAnimations) {
        visibleStyleClass += "Animated";
        invisibleStyleClass += "Animated";
      }
      if (firstCardPositionTop <= 0 + 1 && listicleBottomPositionTop >= 0 - 1) {
        if (!$floatingNavigation.hasClass(visibleStyleClass)) {
          return $floatingNavigation.addClass(visibleStyleClass).removeClass(invisibleStyleClass);
        }
      } else {
        if ($floatingNavigation.hasClass(visibleStyleClass)) {
          return $floatingNavigation.removeClass(visibleStyleClass).addClass(invisibleStyleClass);
        }
      }
    });
    return $floatingNavigation;
  };

  bindNavigationEvents = function($nav, $listicle, config) {
    $nav.find(">div").on("click", function() {
      return $(this).parent().toggleClass("expanded");
    });
    return $nav.find(">ul li").on("click", function() {
      $nav = $(this).parents("nav:first");
      $nav.removeClass("expanded");
      switch (config.floatingNavStyle) {
        case Listicle.FLOATING_NAV_STYLE_TOP:
          $("#NnListicleFloatingNav").addClass("visibleAnimated").removeClass("invisibleAnimated");
          return smoothScrollIntoView($listicle.closestScrollable(), $listicle.find(".card:eq(" + $(this).index() + ")"), $nav.outerHeight(), config);
        case Listicle.FLOATING_NAV_STYLE_TINY:
          return smoothScrollIntoView($listicle.closestScrollable(), $listicle.find(".card:eq(" + $(this).index() + ")"), void 0, config);
      }
    });
  };

  smoothScrollIntoView = function($scrollContainer, $targetEl, scrollOffsetTop, config) {
    var offsetTop, positionTop, scrollContainer, scrollableParentOffsetTop, targetEl, translateY;
    if (scrollOffsetTop == null) {
      scrollOffsetTop = 0;
    }
    scrollContainer = $scrollContainer[0];
    targetEl = $targetEl[0];
    scrollableParentOffsetTop = scrollContainer.getBoundingClientRect().top + $.css(scrollContainer, "borderTopWidth", true);
    positionTop = targetEl.getBoundingClientRect().top - scrollableParentOffsetTop - $.css(targetEl, "marginTop", true) - $(document).scrollTop();
    offsetTop = positionTop + getScrollElementForScrollContainer(scrollContainer).scrollTop() - scrollOffsetTop;
    translateY = positionTop * (-1) + scrollOffsetTop;
    if (browser.browser.getTransitionEventName() && (config != null ? config.hasAnimations : void 0)) {
      return $scrollContainer.find(">*:not(#NnListicleFloatingNav)").css({
        "transition": "transform 1s",
        "transform": "translateY(" + translateY + "px)",
        "-webkit-transition": "-webkit-transform 1s",
        "-webkit-transform": "translateY(" + translateY + "px)"
      }).parent().one(browser.browser.getTransitionEventName(), function(e) {
        $(this).find(">*:not(#NnListicleFloatingNav)").css({
          "transition": "",
          "transform": "",
          "-webkit-transition": "",
          "-webkit-transform": ""
        });
        getScrollElementForScrollContainer(this).scrollTop(offsetTop);
        return setTimeout(function() {
          return getScrollElementForScrollContainer(this).scrollTop(offsetTop + 1);
        }, 0);
      });
    } else {
      getScrollElementForScrollContainer(scrollContainer).scrollTop(offsetTop);
      return setTimeout(function() {
        return getScrollElementForScrollContainer(scrollContainer).scrollTop(offsetTop + 1);
      }, 0);
    }
  };

  loadElement = function(el) {
    return new RSVP.Promise(function(resolve, reject) {
      var isLoaded;
      switch (el.nodeName.toUpperCase()) {
        case "IFRAME":
          isLoaded = false;
          $(el).on("load", function() {
            isLoaded = true;
            return resolve();
          });
          return setTimeout(function() {
            if (!isLoaded) {
              return reject();
            }
          }, 5000);
        case "IMG":
          if (el.complete) {
            return resolve();
          } else {
            return $(el).on("load", function() {
              return resolve();
            }).on("error", function() {
              return reject();
            });
          }
      }
    });
  };

  handleIframeResize = function(height, $iframe) {
    if (height === 0) {
      return $iframe.on("contentResize", function(e, width, height, widthBefore, heightBefore) {
        if (height !== heightBefore) {
          return $(this).height(height);
        }
      });
    } else {
      return $iframe.outerHeight($iframe.outerWidth() * height / 612);
    }
  };

  load = function(id) {
    return new RSVP.Promise((function(_this) {
      return function(resolve) {
        return store.store.materialize({
          rootKey: "listicle",
          key: "element",
          id: id,
          callback: function(payload) {
            return resolve(payload);
          }
        });
      };
    })(this));
  };

  render = function($container, config, payload) {
    var card, cardIndex, element, elementContainer, elementIndex, i, j, len, len1, ref, ref1;
    if (!payload) {
      return $container.html(require("framework/listicles/templates/listicle")["default"]());
    } else {
      $container.find(".NnListicle").prepend(require("framework/listicles/templates/cards")["default"](payload)).prepend(require("framework/listicles/templates/navigation")["default"](payload)).find(".loader").remove();
      renderSocialMediaWidgets($container[0]);
      ref = payload.elements;
      for (cardIndex = i = 0, len = ref.length; i < len; cardIndex = ++i) {
        card = ref[cardIndex];
        if (config.hasSocialMedia) {
          renderSocialMedia($container, payload, cardIndex);
        } else {
          $(".share").hide();
        }
        ref1 = card.elements;
        for (elementIndex = j = 0, len1 = ref1.length; j < len1; elementIndex = ++j) {
          element = ref1[elementIndex];
          switch (element.type) {
            case "element_slideshow":
              if (!config.renderElement(element, elementContainer = $container.find(".slideshowContainer[data-id='" + element.id + "']")[0])) {
                renderSlideshow(element, elementContainer);
              }
              break;
            case "element_poll":
              if (!config.renderElement(element, $container.find("div[data-pollId='" + element.id + "']")[0])) {
                renderPoll(element);
              }
              break;
            case "element_iframe":
              if (!config.renderElement(element, elementContainer = $container.find(".card:eq(" + cardIndex + ") .elements > .element:eq(" + elementIndex + ") iframe")[0])) {
                renderIframe(element, elementContainer);
              }
          }
        }
      }
      bindNavigationEvents($container.find("nav"), $container, config);
      if (config.useFloatingNav) {
        createFloatingNavigation(payload, $container, config);
      }
      return RSVP.allSettled($container.find(".elements img, .elements iframe").map(function() {
        return loadElement(this);
      }).toArray()).then((function(_this) {
        return function() {
          if (location.hash) {
            smoothScrollIntoView($container.closestScrollable(), $container.find(".card:eq(" + (location.hash.substr(5) - 1) + ")"));
          }
          return $(window).on("resize", function() {
            return $container.find(".element_iframe > iframe").each(function() {
              return handleIframeResize($(this).data("height"), $(this));
            });
          });
        };
      })(this));
    }
  };

  Listicle = (function() {
    function Listicle(selector, config) {
      this._initialize();
      this._setup(selector, config);
      render(this._$container, this._config);
      load(this._config.id).then((function(_this) {
        return function(payload) {
          return render(_this._$container, _this._config, payload);
        };
      })(this));
    }

    Listicle.prototype._initialize = function() {
      this._config = null;
      return this._$container = null;
    };

    Listicle.prototype._setup = function(selector, _config) {
      var base, base1, base2, base3, base4, base5;
      this._config = _config;
      if ((base = this._config).apiUrl == null) {
        base.apiUrl = "";
      }
      if ((base1 = this._config).hasSocialMedia == null) {
        base1.hasSocialMedia = true;
      }
      if ((base2 = this._config).hasAnimations == null) {
        base2.hasAnimations = true;
      }
      if ((base3 = this._config).useFloatingNav == null) {
        base3.useFloatingNav = true;
      }
      if ((base4 = this._config).floatingNavStyle == null) {
        base4.floatingNavStyle = Listicle.FLOATING_NAV_STYLE_TOP;
      }
      if ((base5 = this._config).renderElement == null) {
        base5.renderElement = function() {};
      }
      this._$container = $(selector);
      module.handlebars.init();
      return poll__module.poll.configure(this._config.apiUrl);
    };

    return Listicle;

  })();

  $.extend(Listicle, {
    FLOATING_NAV_STYLE_TOP: "top",
    FLOATING_NAV_STYLE_TINY: "tiny"
  });

  exports.Listicle = Listicle;
  exports.handleIframeResize = handleIframeResize;

});
define('framework/listicles/templates/cards', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#each elements}}\n    <div class=\"card {{layout_type}}\">\n        <span>{{showCardCount @index ../elements}}</span>\n        <h3>{{title}}</h3>\n        <div class=\"elements\">\n            {{#each elements}}\n                <div class=\"element {{type}} {{#isPollElement}}NnPollBox{{/isPollElement}}\">\n                    {{> element}}\n                </div>\n            {{/each}}\n        </div>\n        <div class=\"share\">\n            <ul>\n                <li><a href=\"javascript:void(0);\" name=\"whatsapp\" class=\"NnIcon whatsappIcon\"></a></li>\n                <li><a href=\"javascript:void(0);\" name=\"facebook\" class=\"NnIcon facebookIcon\"></a></li>\n                <li><a href=\"javascript:void(0);\" name=\"email\" class=\"NnIcon emailIcon\"></a></li>\n                <li><a href=\"javascript:void(0);\" name=\"twitter\" class=\"NnIcon twitterIcon\"></a></li>\n            </ul>\n            <div class=\"clear\"></div>\n        </div>\n    </div>\n{{/each}}");

});
define('framework/listicles/templates/element', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#isHtmlElement}}\n    {{{value}}}\n{{/isHtmlElement}}\n\n{{#isPictureElement}}\n    <img src=\"{{url}}\"/>\n    <span>Quelle: {{source}}</span>\n{{/isPictureElement}}\n\n{{#isIframeElement}}\n    <iframe src=\"{{src}}\" scrolling=\"no\"></iframe>\n{{/isIframeElement}}\n\n{{#isSlideshowElement}}\n    <div class=\"slideshowContainer\" data-id=\"{{id}}\"></div>\n{{/isSlideshowElement}}\n\n{{#isPollElement}}\n    <div data-pollId=\"{{wrapped_id}}\">\n        {{!-- will be dynamically added in the article --}}\n    </div>\n{{/isPollElement}}");

});
define('framework/listicles/templates/listicle', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"NnListicle\">\n    {{> loader visible=\"true\"}}\n</div>");

});
define('framework/listicles/templates/navigation', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#isNavigationActive}}\n    {{#isNavigationExpanded}}<nav class=\"expanded\">{{else}}<nav>{{/isNavigationExpanded}}\n        <div>\n        <span class=\"NnIcon listIcon\"></span>\n        <h3>{{title}}</h3>\n        </div>\n        <ul>\n            {{#each elements}}\n                <li><a href=\"javascript:void(0);\">{{title}}</a></li>\n            {{/each}}\n        </ul>\n    </nav>\n{{/isNavigationActive}}");

});
define('framework/liveticker/liveticker', ['exports', 'framework/translations'], function (exports, translations) {

  'use strict';

  var Liveticker;

  Liveticker = (function() {
    function Liveticker(selector, config) {
      this._initialize();
      this._setup(selector, config);
      this._fetchWholeFeed((function(_this) {
        return function() {
          return _this._fetchMessageUpdates(function() {
            return _this._listenForMessageUpdates();
          });
        };
      })(this));
    }

    Liveticker.prototype.isLimitReached = function() {
      if (this._reactComponent) {
        return this._reactComponent.isLimitReached();
      }
    };

    Liveticker.prototype.increaseLimit = function() {
      return this._reactComponent.increaseLimit();
    };

    Liveticker.prototype.destroy = function() {
      return this._teardown();
    };

    Liveticker.prototype.isLoading = function() {
      return this._reactComponent.state.isLoading;
    };

    Liveticker.prototype.pause = function() {
      return this._isPaused = true;
    };

    Liveticker.prototype.resume = function() {
      this._isPaused = false;
      return this._listenForMessageUpdates();
    };

    Liveticker.prototype._initialize = function() {
      this._el = null;
      this._$el = null;
      clearTimeout(this._fetchMessageUpdatesTimeout);
      clearTimeout(this._listenForMessageUpdatesTimeout);
      clearTimeout(this._fetchWholeFeedTimeout);
      this._config = null;
      this._refetchIntervalInMs = null;
      this._fetchMessageUpdatesTimeout = null;
      this._listenForMessageUpdatesTimeout = null;
      this._fetchWholeFeedTimeout = null;
      this._lastRequestedAt = null;
      this._isFetchingWholeFeed = false;
      this._isFetchingMessageUpdates = false;
      this._isPaused = false;
      return this._reactComponent = null;
    };

    Liveticker.prototype._setup = function(selector, _config) {
      var base, base1, base10, base11, base12, base13, base14, base15, base16, base17, base18, base19, base2, base20, base21, base22, base23, base24, base25, base26, base3, base4, base5, base6, base7, base8, base9;
      this._config = _config;
      if ((base = this._config).afterFetchMessageUpdates == null) {
        base.afterFetchMessageUpdates = function() {
          return "";
        };
      }
      if ((base1 = this._config).renderInlineElement == null) {
        base1.renderInlineElement = function() {
          return "";
        };
      }
      if ((base2 = this._config).beforeDestroyInlineElement == null) {
        base2.beforeDestroyInlineElement = function() {};
      }
      if ((base3 = this._config).afterRenderMessage == null) {
        base3.afterRenderMessage = function() {};
      }
      if ((base4 = this._config).afterRender == null) {
        base4.afterRender = function() {};
      }
      if ((base5 = this._config).beforeDestroyMessage == null) {
        base5.beforeDestroyMessage = function() {};
      }
      if ((base6 = this._config).afterHandleMessages == null) {
        base6.afterHandleMessages = function() {};
      }
      if (this._config.initialLimit != null) {
        if ((base7 = this._config).limitStyle == null) {
          base7.limitStyle = "button";
        }
      }
      if ((base8 = this._config).markMessageChangedTimespan == null) {
        base8.markMessageChangedTimespan = 5000;
      }
      if ((base9 = this._config).initialLimit == null) {
        base9.initialLimit = 5;
      }
      if ((base10 = this._config).limitIncreaseValue == null) {
        base10.limitIncreaseValue = 5;
      }
      if ((base11 = this._config).iconClassPenalty == null) {
        base11.iconClassPenalty = "sprite-liveticker-penalty";
      }
      if ((base12 = this._config).iconClassYellowCard == null) {
        base12.iconClassYellowCard = "sprite-liveticker-yellowCard";
      }
      if ((base13 = this._config).iconClassRedCard == null) {
        base13.iconClassRedCard = "sprite-liveticker-redCard";
      }
      if ((base14 = this._config).iconClassYellowRedCard == null) {
        base14.iconClassYellowRedCard = "sprite-liveticker-yellowRedCard";
      }
      if ((base15 = this._config).iconClassGoal == null) {
        base15.iconClassGoal = "sprite-liveticker-goal";
      }
      if ((base16 = this._config).iconClassStart == null) {
        base16.iconClassStart = "sprite-liveticker-startEnd";
      }
      if ((base17 = this._config).iconClassEnd == null) {
        base17.iconClassEnd = "sprite-liveticker-startEnd";
      }
      if ((base18 = this._config).iconClassHockeyEnd == null) {
        base18.iconClassHockeyEnd = "sprite-liveticker-hockeyEnd";
      }
      if ((base19 = this._config).iconClassHockeyGoal == null) {
        base19.iconClassHockeyGoal = "sprite-liveticker-hockeyGoal";
      }
      if ((base20 = this._config).iconClassHockeyThirdEnd == null) {
        base20.iconClassHockeyThirdEnd = "sprite-liveticker-hockeyThirdEnd";
      }
      if ((base21 = this._config).iconClassMatchpoint == null) {
        base21.iconClassMatchpoint = "sprite-liveticker-matchpoint";
      }
      if ((base22 = this._config).iconClassSetpoint == null) {
        base22.iconClassSetpoint = "sprite-liveticker-setpoint";
      }
      if ((base23 = this._config).iconClassBreakpoint == null) {
        base23.iconClassBreakpoint = "sprite-liveticker-breakpoint";
      }
      if ((base24 = this._config).iconClassSubstitution == null) {
        base24.iconClassSubstitution = "sprite-liveticker-substitution";
      }
      if ((base25 = this._config).lang == null) {
        base25.lang = "de";
      }
      translations.translations.configure(this._config.lang);
      if ((base26 = this._config).lastUpdatedAtText == null) {
        base26.lastUpdatedAtText = translations.translations.translate("letzte Meldung %s");
      }
      this._id = this._config.id;
      this._el = (this._$el = $(selector))[0];
      return this._reactComponent = ReactDOM.render(React.createElement(require("framework/liveticker/Liveticker/component").Liveticker, {
        config: this._config
      }), this._el);
    };

    Liveticker.prototype._teardown = function() {
      ReactDOM.unmountComponentAtNode(this._el);
      return this._initialize();
    };

    Liveticker.prototype._fetchWholeFeed = function(callback) {
      var args;
      if (this._isFetchingWholeFeed || this._isPaused) {
        return;
      }
      this._isFetchingWholeFeed = true;
      args = arguments;
      return $.ajax({
        url: this._config.http.baseUrl + "/livetickers/" + this._id + "?type=preview",
        complete: (function(_this) {
          return function() {
            return _this._isFetchingWholeFeed = false;
          };
        })(this),
        success: (function(_this) {
          return function(data) {
            if (_this._reactComponent) {
              _this._reactComponent.setState({
                "isActive": data.liveticker.active,
                "orderBy": data.liveticker.order_by,
                "hasQuestionForm": (data.liveticker.question_list != null) && data.liveticker.question_list.active,
                "questionListId": data.liveticker.question_list != null ? data.liveticker.question_list.id : null
              });
              _this._id = data.liveticker.id;
              _this._refetchIntervalInMs = data.liveticker.interval_ms;
              if (callback != null) {
                return callback();
              }
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            return _this._fetchWholeFeedTimeout = setTimeout(function() {
              return _this._fetchWholeFeed.apply(_this, args);
            }, 5000);
          };
        })(this)
      });
    };

    Liveticker.prototype._listenForMessageUpdates = function() {
      if (this._reactComponent.state.isActive && !this._isPaused) {
        return this._listenForMessageUpdatesTimeout = setTimeout((function(_this) {
          return function() {
            return _this._fetchMessageUpdates(function() {
              _this._fetchWholeFeed();
              return _this._listenForMessageUpdates();
            });
          };
        })(this), this._refetchIntervalInMs);
      }
    };

    Liveticker.prototype._fetchMessageUpdates = function(callback) {
      var args, fetchUpdatesSince;
      if (this._isFetchingMessageUpdates || this._isPaused) {
        return;
      }
      this._isFetchingMessageUpdates = true;
      args = arguments;
      fetchUpdatesSince = this._lastRequestedAt || 0;
      return $.ajax({
        url: this._config.http.baseUrl + "/livetickers/" + this._id + "/liveticker_message_updates/" + fetchUpdatesSince,
        complete: (function(_this) {
          return function() {
            return _this._isFetchingMessageUpdates = false;
          };
        })(this),
        success: (function(_this) {
          return function(data) {
            var j, len, message, ref, timeDifferenceBetweenClientAndServer;
            if (_this._reactComponent) {
              _this._lastRequestedAt = data.liveticker_message_updates.request_time;
              timeDifferenceBetweenClientAndServer = new Date().getTime() - _this._lastRequestedAt;
              ref = data.liveticker_message_updates.liveticker_messages;
              for (j = 0, len = ref.length; j < len; j++) {
                message = ref[j];
                message.updated_at = message.updated_at + timeDifferenceBetweenClientAndServer;
                message.received_at = new Date().getTime();
              }
              if (data.liveticker_message_updates.liveticker_messages.length) {
                _this._reactComponent.setState({
                  messages: _this._reactComponent.handleMessages(data.liveticker_message_updates.liveticker_messages)
                });
              }
              _this._reactComponent.setState({
                isLoading: false
              });
              _this._config.afterFetchMessageUpdates.call(_this, data.liveticker_message_updates.liveticker_messages, fetchUpdatesSince);
              if (callback != null) {
                return callback();
              }
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            return _this._fetchMessageUpdatesTimeout = setTimeout(function() {
              return _this._fetchMessageUpdates.apply(_this, args);
            }, _this._refetchIntervalInMs);
          };
        })(this)
      });
    };

    Liveticker.prototype._updateTest = function() {
      var i, j, messages;
      messages = [];
      for (i = j = 0; j <= 2; i = ++j) {
        messages.push($.extend({}, this._reactComponent.state.messages[i], {
          sort: this._reactComponent.state.messages[i].sort + 1,
          updated_at: this._reactComponent.state.messages[i].updated_at + 1,
          received_at: new Date().getTime()
        }));
      }
      messages.push($.extend({}, this._reactComponent._messagesIndex["54acd69787da8b3ad2000002"], {
        text: "<p>Moinsen poinsen</p><p><!--{{inline_element('5500007687da8bbd1b00302f')}}--></p>",
        updated_at: new Date().getTime(),
        received_at: new Date().getTime()
      }));
      console.log("update " + messages.length + " messages");
      return this._reactComponent.setState({
        messages: this._reactComponent.handleMessages(messages)
      });
    };

    Liveticker.prototype._createTest = function() {
      return this._reactComponent.setState({
        messages: this._reactComponent.handleMessages([
          {
            icon_name: null,
            id: "moin" + new Date().getTime(),
            inline_elements: [],
            minute_of_play: null,
            picture_medium_url: null,
            picture_small_url: null,
            released: true,
            score_home: null,
            score_visitor: null,
            sort: new Date().getTime(),
            text: "<p>haha</p>",
            title: null,
            updated_at: new Date().getTime(),
            received_at: new Date().getTime()
          }
        ])
      });
    };

    Liveticker.prototype._deleteTest = function() {
      return this._reactComponent.setState({
        messages: this._reactComponent.handleMessages([
          {
            icon_name: null,
            id: "54acd69787da8b3ad2000002",
            inline_elements: [],
            minute_of_play: null,
            picture_medium_url: null,
            picture_small_url: null,
            released: false,
            score_home: null,
            score_visitor: null,
            sort: null,
            text: null,
            title: null,
            updated_at: new Date().getTime(),
            received_at: new Date().getTime()
          }
        ])
      });
    };

    Liveticker.prototype._deleteTestDouble = function() {
      return this._reactComponent.setState({
        messages: this._reactComponent.handleMessages([
          {
            icon_name: null,
            id: "5507eb7587da8ba2a2000002",
            inline_elements: [],
            legacy_id: 432968,
            minute_of_play: null,
            picture_medium_url: null,
            picture_small_url: null,
            released: false,
            score_home: null,
            score_visitor: null,
            sort: 40,
            text: "<p>6</p>",
            title: "6",
            updated_at: new Date().getTime(),
            received_at: new Date().getTime()
          }, {
            icon_name: null,
            id: "5507eb7587da8ba3d1000002",
            inline_elements: [],
            legacy_id: 432970,
            minute_of_play: null,
            picture_medium_url: null,
            picture_small_url: null,
            released: false,
            score_home: null,
            score_visitor: null,
            sort: 39,
            text: "<p>7</p>",
            title: "7",
            updated_at: new Date().getTime(),
            received_at: new Date().getTime()
          }
        ])
      });
    };

    return Liveticker;

  })();

  exports.Liveticker = Liveticker;

});
define('framework/liveticker/Liveticker/component', ['exports', 'framework/string', 'framework/translations', 'framework/utils'], function (exports, __dep0__, translations, utils) {

  'use strict';

  var Liveticker, m;

  Liveticker = React.createClass({
    getInitialState: function() {
      this._messagesIndex = {};
      this._inlineElementsIndex = {};
      this._visibleMessages = [];
      this._updateTimestampInterval = null;
      this._lastUpdatedAt = null;
      return {
        isActive: false,
        isLoading: true,
        messages: [],
        limit: this.props.config.initialLimit,
        orderBy: "desc",
        lastUpdatedAtText: "",
        hasQuestionForm: false,
        questionListId: null
      };
    },
    componentDidMount: function() {
      return m.lang(this.props.config.lang);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      var key, value;
      if (nextState.messages.length > 0) {
        for (key in nextState) {
          value = nextState[key];
          if (value !== this.state[key]) {
            return true;
          }
        }
      }
      return false;
    },
    componentWillUpdate: function(nextProps, nextState) {
      if (this.state.orderBy !== nextState.orderBy) {
        this._sortMessageArray(nextState.messages, nextState.orderBy);
      }
      this._visibleMessages = nextState.messages.slice(0, nextState.limit);
      if (nextState.isActive) {
        if ((this.props.config.lastUpdatedAtText != null) && (this._updateTimestampInterval == null)) {
          nextState.lastUpdatedAtText = this.props.config.lastUpdatedAtText.replace("%s", m.fromNow(this._lastUpdatedAt));
          return this._updateTimestampInterval = setInterval((function(_this) {
            return function() {
              return _this.setState({
                lastUpdatedAtText: _this.props.config.lastUpdatedAtText.replace("%s", m.fromNow(_this._lastUpdatedAt))
              });
            };
          })(this), 1000);
        }
      } else {
        if (this._updateTimestampInterval != null) {
          clearInterval(this._updateTimestampInterval);
          return this._updateTimestampInterval = null;
        }
      }
    },
    render: function() {
      return require("framework/liveticker/Liveticker/template")["default"].apply(this);
    },
    componentDidUpdate: function(prevProps, prevState) {
      var $form;
      if (!this._hasSimplePlaceholder()) {
        this._addSimplePlaceholder();
      }
      if (this.refs.questionForm) {
        $form = $(ReactDOM.findDOMNode(this.refs.questionForm));
        $form.off("submit.sendQuestion").on("submit.sendQuestion", this.sendQuestion);
      }
      return this.props.config.afterRender.call(this);
    },
    componentWillUnmount: function() {
      if (this._updateTimestampInterval != null) {
        clearInterval(this._updateTimestampInterval);
        return this._updateTimestampInterval = null;
      }
    },
    useButton: function() {
      return this.props.config.limitStyle === "button";
    },
    useLoader: function() {
      return this.props.config.limitStyle === "scroller";
    },
    isLimitReached: function() {
      return this.state.limit >= this.state.messages.length;
    },
    increaseLimit: function() {
      return this.setState({
        limit: Math.min(this.state.limit + this.props.config.limitIncreaseValue, this.state.messages.length)
      });
    },
    sendQuestion: function(e) {
      var $form, form;
      $form = $(form = ReactDOM.findDOMNode(this.refs.questionForm));
      if ($form.validate()) {
        $(ReactDOM.findDOMNode(this)).find(".fullscreenLoader").addClass("NnTransparency").show();
        $.ajax({
          url: this.props.config.http.baseUrl + "/questions/" + this.state.questionListId,
          type: "PUT",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify({
            "question": {
              "question": form.question.value,
              "firstname": form.firstName.value,
              "lastname": form.lastName.value,
              "city": form.city.value
            }
          }),
          success: (function(_this) {
            return function() {
              utils.utils.showDialog($(ReactDOM.findDOMNode(_this)).find(".NnDialog"), translations.translations.translate("Nachricht versandt"), translations.translations.translate("Vielen Dank für Ihren Beitrag. Ihre Nachricht wurde versandt. Die Redaktion wird ausgewählte Einsendungen veröffentlichen."));
              return _this._resetQuestionForm();
            };
          })(this),
          error: (function(_this) {
            return function() {
              return utils.utils.showDialog($(ReactDOM.findDOMNode(_this)).find(".NnDialog"), translations.translations.translate("Senden fehlgeschlagen"), translations.translations.translate("Ihre Nachricht konnte aus technischen Gründen nicht übermittelt werden."));
            };
          })(this),
          complete: (function(_this) {
            return function() {
              return $(ReactDOM.findDOMNode(_this)).find(".fullscreenLoader").hide().removeClass("NnTransparency");
            };
          })(this)
        });
      } else {
        this._removeSimplePlaceholderClasses();
      }
      return e.preventDefault();
    },
    handleMessages: function(messages) {
      var j, len, message, updatedMessages;
      if (messages.length) {
        updatedMessages = this.state.messages;
        for (j = 0, len = messages.length; j < len; j++) {
          message = messages[j];
          updatedMessages = this._handleMessage(message, updatedMessages);
        }
        this._sortMessageArray(updatedMessages);
        this.props.config.afterHandleMessages.call(this, updatedMessages);
        return updatedMessages;
      }
    },
    _handleMessage: function(message, messages) {
      var ref;
      if (message.released) {
        if (message.updated_at > this._lastUpdatedAt) {
          this._lastUpdatedAt = message.updated_at;
        }
        message.icon_class_name = this.props.config["iconClass" + ((ref = message.icon_name) != null ? ref : "").camelCase(true)];
        message.hasScore = (message.score_home != null) && (message.score_visitor != null);
        message.hasMinuteOfPlay = message.minute_of_play != null;
      }
      if (message.id in this._messagesIndex) {
        if (!message.released) {
          return this._deleteMessage(message, messages);
        } else {
          return this._updateMessage(message, messages);
        }
      } else {
        if (message.released) {
          return this._createMessage(message, messages);
        } else {
          return messages;
        }
      }
    },
    _createMessage: function(message, messages) {
      var create, updatedMessage, updatedMessages;
      create = {};
      create["$push"] = [message];
      updatedMessages = React.addons.update(messages, create);
      updatedMessage = updatedMessages[updatedMessages.length - 1];
      this._messagesIndex[updatedMessage.id] = updatedMessage;
      this._handleInlineElements(updatedMessage);
      return updatedMessages;
    },
    _updateMessage: function(message, messages) {
      var index, prevMessage, update, updatedMessage, updatedMessages;
      index = this._getMessageIndexById(message.id, messages);
      update = {};
      update[index] = {
        "$merge": message
      };
      updatedMessages = React.addons.update(messages, update);
      updatedMessage = updatedMessages[index];
      prevMessage = this._messagesIndex[updatedMessage.id];
      if (prevMessage.text !== updatedMessage.text) {
        this._deleteInlineElementsIndex(prevMessage);
      }
      this._messagesIndex[updatedMessage.id] = updatedMessage;
      this._handleInlineElements(updatedMessage);
      return updatedMessages;
    },
    _deleteMessage: function(message, messages) {
      var delte, index, updatedMessages;
      index = this._getMessageIndexById(message.id, messages);
      delte = {};
      delte["$splice"] = [[index, 1]];
      updatedMessages = React.addons.update(messages, delte);
      delete this._messagesIndex[message.id];
      this._deleteInlineElementsIndex(message);
      return updatedMessages;
    },
    _sortMessageArray: function(messages, direction) {
      if (direction == null) {
        direction = this.state.orderBy;
      }
      return messages.sort((function(_this) {
        return function(a, b) {
          if (a.sort > b.sort) {
            if (direction === "desc") {
              return -1;
            } else {
              return 1;
            }
          } else if (a.sort < b.sort) {
            if (direction === "desc") {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 0;
          }
        };
      })(this));
    },
    _getMessageIndexById: function(messageId, messages) {
      var index, j, len, message;
      if (messages == null) {
        messages = this.state.messages;
      }
      for (index = j = 0, len = messages.length; j < len; index = ++j) {
        message = messages[index];
        if (message.id === messageId) {
          return index;
        }
      }
    },
    _handleInlineElements: function(message) {
      var inlineElement, j, len, ref;
      ref = message.inline_elements;
      for (j = 0, len = ref.length; j < len; j++) {
        inlineElement = ref[j];
        this._inlineElementsIndex[inlineElement.id] = inlineElement;
      }
      return message.text_parts = this._extractInlineElements(message.text, message.inline_elements);
    },
    _deleteInlineElementsIndex: function(message) {
      var inlineElement, j, len, ref, results;
      ref = message.inline_elements;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        inlineElement = ref[j];
        results.push(delete this._inlineElementsIndex[inlineElement.id]);
      }
      return results;
    },
    _extractInlineElements: function(text, inlineElements) {
      var i, match, parts, regexp;
      parts = [];
      regexp = /<!--{{inline_element\(['"]?([a-fA-F0-9]+)['"]?\)}}-->/g;
      i = 0;
      if (typeof text === "string") {
        while (match = regexp.exec(text)) {
          if (match.index > i) {
            parts.push(match.input.substring(i, match.index));
          }
          if (match[1] in this._inlineElementsIndex) {
            parts.push(this._inlineElementsIndex[match[1]]);
          }
          i = match.index + match[0].length;
        }
        if (i < text.length) {
          parts.push(text.substring(i, text.length));
        }
      }
      return parts;
    },
    _hasSimplePlaceholder: function() {
      var $form;
      if (this.refs.questionForm) {
        $form = $(ReactDOM.findDOMNode(this.refs.questionForm));
        return $form.find(".simple-placeholder").length > 0;
      } else {
        return false;
      }
    },
    _addSimplePlaceholder: function() {
      var $form;
      if (this.refs.questionForm) {
        $form = $(ReactDOM.findDOMNode(this.refs.questionForm));
        return $form.find("[placeholder]:not(.placeholderForLegacyBrowsers)").simplePlaceholder({
          placeholderClass: "placeholderForLegacyBrowsers"
        });
      }
    },
    _removeSimplePlaceholderClasses: function() {
      var $form;
      if (this.refs.questionForm) {
        $form = $(ReactDOM.findDOMNode(this.refs.questionForm));
        return $form.find(".placeholderForLegacyBrowsers").removeClass("placeholderForLegacyBrowsers");
      }
    },
    _resetQuestionForm: function() {
      var form;
      if (this.refs.questionForm) {
        form = ReactDOM.findDOMNode(this.refs.questionForm);
        form.question.value = "";
        if (document.createElement("input").placeholder === void 0) {
          return $.simplePlaceholder.showPlaceholder.call(form.question);
        }
      }
    }
  });

  m = {
    _lang: "de",
    de: {
      relativeTime: {
        future: "in %s",
        past: "vor %s",
        s: "wenigen Sek.",
        ss: "wenigen Sek.",
        m: "1 Min.",
        mm: "%d Min.",
        h: "1 Std.",
        hh: "%d Std.",
        d: "1 Tag",
        dd: "%d Tg.",
        M: "1 Monat",
        MM: "%d Mnt.",
        y: "1 Jahr",
        yy: "%d Jhr."
      }
    },
    fr: {
      relativeTime: {
        future: "dans %s",
        past: "il y a %s",
        s: "quelques secondes",
        ss: "quelques secondes",
        m: "une minute",
        mm: "%d minutes",
        h: "une heure",
        hh: "%d heures",
        d: "un jour",
        dd: "%d jours",
        M: "un mois",
        MM: "%d mois",
        y: "un an",
        yy: "%d ans"
      }
    },
    lang: function(lang, obj) {
      this._lang = lang;
      if (obj != null) {
        return $.extend(this[lang], obj);
      }
    },
    fromNow: function(value, lang) {
      var entities, entity, string, timestamp;
      if (lang == null) {
        lang = this._lang;
      }
      timestamp = new Date().getTime();
      if (timestamp >= value) {
        string = this[lang].relativeTime.past;
        value = timestamp - value;
      } else {
        string = this[lang].relativeTime.future;
        value -= timestamp;
      }
      entities = ["ms", "s", "m", "h", "d", "M", "y"];
      entity = ((function(_this) {
        return function() {
          var i, j, len;
          for (i = j = 0, len = entities.length; j < len; i = ++j) {
            entity = entities[i];
            switch (entity) {
              case "ms":
                value /= 1000;
                break;
              case "s":
              case "m":
                if (value / 60 >= 1) {
                  value /= 60;
                } else {
                  return entity;
                }
                break;
              case "h":
                if (value / 24 >= 1) {
                  value /= 24;
                } else {
                  return entity;
                }
                break;
              case "d":
                if (value / 30 >= 1) {
                  value /= 30;
                } else {
                  return entity;
                }
                break;
              case "M":
                if (value / 365 >= 1) {
                  value /= 365;
                } else {
                  return entity;
                }
                break;
              default:
                return entity;
            }
          }
        };
      })(this))();
      if (value >= 2) {
        return string.replace("%s", this[lang].relativeTime[entity + entity].replace("%d", Math.floor(value)));
      } else {
        return string.replace("%s", this[lang].relativeTime[entity].replace("%d", Math.floor(value)));
      }
    }
  };

  exports.Liveticker = Liveticker;

});
define('framework/liveticker/Liveticker/template', ['exports', 'framework/translations', 'framework/liveticker/LivetickerMessage/component', 'framework/loader/loader', 'framework/loader/snakeLoader', 'framework/loader/fullscreenLoader', 'framework/dialog/templates/dialog'], function (exports, translations, component, loader, snakeLoader, fullscreenLoader, dialog) {

    'use strict';

    function repeatMessage1(config, message, messageIndex) {
        return React.createElement(component.LivetickerMessage, {
            'key': message.id,
            'message': message,
            'config': config,
            'parentState': this.state
        });
    }
    function scopeConfig2() {
        var config = this.props.config;
        return React.createElement('div', { 'className': 'NnLiveticker' + (this.state.isLoading ? ' loading' : '') + (this.state.isActive ? ' active' : '') }, this.state.hasQuestionForm ? React.createElement('div', { 'className': 'questionForm' }, React.createElement('h2', {}, 'Live-Chat'), React.createElement('form', { 'ref': 'questionForm' }, React.createElement('div', { 'dangerouslySetInnerHTML': { __html: fullscreenLoader['default']() } }), React.createElement('div', { 'dangerouslySetInnerHTML': { __html: dialog['default']() } }), React.createElement('table', {}, React.createElement('tr', {}, React.createElement('td', { 'colSpan': '3' }, React.createElement('textarea', {
            'name': 'question',
            'placeholder': translations.translations.translate('Ihre Frage...')
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'question'
        }, translations.translations.translate('Frage'), ' ', translations.translations.translate('fehlt')))), React.createElement('tr', {}, React.createElement('td', {}, React.createElement('input', {
            'type': 'text',
            'name': 'firstName',
            'placeholder': translations.translations.translate('Vorname'),
            'data-validation': 'nodigits'
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'firstName'
        }, translations.translations.translate('Vorname'), ' ', translations.translations.translate('fehlt'))), React.createElement('td', {}, React.createElement('input', {
            'type': 'text',
            'name': 'lastName',
            'placeholder': translations.translations.translate('Name'),
            'data-validation': 'nodigits'
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'lastName'
        }, translations.translations.translate('Name'), ' ', translations.translations.translate('fehlt'))), React.createElement('td', {}, React.createElement('input', {
            'type': 'text',
            'name': 'city',
            'placeholder': translations.translations.translate('Wohnort'),
            'data-validation': 'nodigits'
        }), React.createElement('p', {
            'className': 'error',
            'data-label': 'city'
        }, translations.translations.translate('Wohnort'), ' ', translations.translations.translate('fehlt'))))), '\n\n            ', translations.translations.translate('Der Live-Chat wird moderiert. Die Redaktion wird ausgewählte Einsendungen veröffentlichen.'), '\n            ', React.createElement('br', {}), React.createElement('button', { 'type': 'submit' }, translations.translations.translate('Senden')))) : null, React.createElement('div', { 'className': 'header' }, this.state.isLoading ? React.createElement('h2', { 'className': 'loadingCaption' }, translations.translations.translate('Liveticker wird geladen...')) : null, !this.state.isLoading && this.state.isActive ? React.createElement('h2', { 'className': 'activeCaption' }, React.createElement('div', {
            'className': 'waiter',
            'dangerouslySetInnerHTML': { __html: snakeLoader['default']({ visible: true }) }
        }), '\n            ', translations.translations.translate('Liveticker aktualisiert automatisch'), '\n            ', React.createElement('span', { 'className': 'lastUpdatedAt' }, this.state.lastUpdatedAtText)) : null, !this.state.isLoading && !this.state.isActive ? React.createElement('h2', { 'className': 'inactiveCaption' }) : null), React.createElement.apply(this, [
            'ul',
            { 'className': 'messages' },
            _.map(this._visibleMessages, repeatMessage1.bind(this, config))
        ]), React.createElement('div', { 'className': 'footer' }, !this.isLimitReached() && this.useLoader() || this.state.isLoading ? React.createElement('div', { 'dangerouslySetInnerHTML': { __html: loader['default']({ visible: true }) } }) : null, !this.isLimitReached() && this.useButton() ? React.createElement('button', { 'onClick': this.increaseLimit }, translations.translations.translate('Mehr anzeigen...')) : null));
    }
    exports['default'] = function () {
        return scopeConfig2.apply(this, []);
    };

});
define('framework/liveticker/LivetickerMessage/component', ['exports'], function (exports) {

  'use strict';

  var LivetickerMessage;

  LivetickerMessage = React.createClass({
    getInitialState: function() {
      this._markedAsChangedTimeout = null;
      this._renderInlineElementsCallbacks = [];
      this._ignoreChangedsInProperties = ["sort", "updated_at", "received_at", "inline_elements", "text_parts", "refresh", "cache"];
      return {
        markedAsChanged: false
      };
    },
    componentWillMount: function() {
      return this._renderInlineElements(this.props.message);
    },
    componentDidMount: function() {
      if (!this.props.parentState.isLoading) {
        this._markAsChanged();
      }
      this._callInlineElementCallbacks();
      return this.props.config.afterRenderMessage.call(this, this.props.message, ReactDOM.findDOMNode(this), "create");
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      var key, ref, value;
      if (nextState.markedAsChanged !== this.state.markedAsChanged) {
        return true;
      }
      ref = nextProps.message;
      for (key in ref) {
        value = ref[key];
        if (this._ignoreChangedsInProperties.indexOf(key) < 0 && value !== this.props.message[key]) {
          return true;
        }
      }
      return false;
    },
    componentWillUpdate: function(nextProps, nextState) {
      if (this.props.message.text !== nextProps.message.text) {
        this._destroyInlineElements();
        return this._renderInlineElements(nextProps.message);
      }
    },
    render: function() {
      return require("framework/liveticker/LivetickerMessage/template")["default"].apply(this);
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (prevState.markedAsChanged === this.state.markedAsChanged) {
        this._markAsChanged();
      }
      this._callInlineElementCallbacks();
      return this.props.config.afterRenderMessage.call(this, this.props.message, ReactDOM.findDOMNode(this), "update", true);
    },
    componentWillUnmount: function() {
      clearTimeout(this._markedAsChangedTimeout);
      this._markedAsChangedTimeout = null;
      this._destroyInlineElements();
      return this.props.config.beforeDestroyMessage.call(this, this.props.message, ReactDOM.findDOMNode(this));
    },
    _isDesktopScreen: function() {
      return screen.width > 640;
    },
    _markAsChanged: function() {
      if (this.props.config.markMessageChangedTimespan != null) {
        if ((new Date().getTime() - this.props.message.received_at) < 2000) {
          this.setState({
            markedAsChanged: true
          });
          if (this._markedAsChangedTimeout) {
            clearTimeout(this._markedAsChangedTimeout);
          }
          return this._markedAsChangedTimeout = setTimeout((function(_this) {
            return function() {
              if (_this.isMounted()) {
                return _this.setState({
                  markedAsChanged: false
                });
              }
            };
          })(this), this.props.config.markMessageChangedTimespan);
        }
      }
    },
    _destroyInlineElements: function() {
      var inlineElement, j, len, ref, results;
      ref = this.props.message.inline_elements;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        inlineElement = ref[j];
        results.push(this.props.config.beforeDestroyInlineElement.call(this, this.props.message, inlineElement, ReactDOM.findDOMNode(this)));
      }
      return results;
    },
    _renderInlineElements: function(message) {
      var i, j, len, ref, results, textPart;
      message.text_parts_rendered = "";
      ref = message.text_parts;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        textPart = ref[i];
        if (typeof textPart === "string") {
          results.push(message.text_parts_rendered += textPart);
        } else {
          results.push(((function(_this) {
            return function(textPart) {
              var renderedInlineElement;
              renderedInlineElement = _this.props.config.renderInlineElement.call(_this, message, textPart, function(html) {
                if (html != null) {
                  return $("#inlineElement_" + textPart.id).html(html);
                }
              });
              if (typeof renderedInlineElement === "string") {
                return message.text_parts_rendered += renderedInlineElement;
              } else {
                if (renderedInlineElement != null) {
                  message.text_parts_rendered += '<div id="inlineElement_' + textPart.id + '"></div>';
                  if ($.isFunction(renderedInlineElement)) {
                    return _this._renderInlineElementsCallbacks.push(renderedInlineElement);
                  }
                }
              }
            };
          })(this))(textPart));
        }
      }
      return results;
    },
    _callInlineElementCallbacks: function() {
      var callback, j, len, ref;
      ref = this._renderInlineElementsCallbacks;
      for (j = 0, len = ref.length; j < len; j++) {
        callback = ref[j];
        callback();
      }
      return this._renderInlineElementsCallbacks.length = 0;
    }
  });

  exports.LivetickerMessage = LivetickerMessage;

});
define('framework/liveticker/LivetickerMessage/template', ['exports'], function (exports) {

    'use strict';

    function scopeMessage1() {
        var message = this.props.message;
        return React.createElement('li', {
            'className': 'message' + (this.state.markedAsChanged ? ' changed' : ''),
            'id': 'message_' + message.id
        }, React.createElement('div', { 'className': 'header' }, message.title && !message.icon_class_name ? React.createElement('span', { 'className': 'title' }, message.title) : null, message.hasMinuteOfPlay ? React.createElement('span', { 'className': 'time' }, message.minute_of_play, '\'') : null, message.icon_class_name ? React.createElement('span', { 'className': 'spriteIcon ' + message.icon_class_name }) : null, message.icon_class_name ? React.createElement('span', { 'className': 'title' }, message.title) : null, message.hasScore ? React.createElement('span', { 'className': 'score' }, message.score_home, ':', message.score_visitor) : null)    /*  There will be a <p> element already inside text  */, React.createElement('div', { 'className': 'text' }, this._isDesktopScreen() && message.picture_medium_url ? React.createElement('img', {
            'src': message.picture_medium_url,
            'className': 'picture'
        }) : null, !this._isDesktopScreen() && message.picture_small_url ? React.createElement('img', {
            'src': message.picture_small_url,
            'className': 'picture'
        }) : null, React.createElement('div', { 'dangerouslySetInnerHTML': { __html: message.text_parts_rendered } })), React.createElement('div', { 'className': 'clear' }));
    }
    exports['default'] = function () {
        return scopeMessage1.apply(this, []);
    };

});
define('framework/loader/bubbleLoader', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"bubbleLoader\">\n    <div>\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>\n</div>");

});
define('framework/loader/fullscreenLoader', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"fullscreenLoader {{style}} {{#if visible}}visible{{/if}}\" {{#if id}}id=\"{{id}}\"{{/if}}>\n    <div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <span></span>\n    </div>\n</div>");

});
define('framework/loader/loader', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"loader {{style}} {{#if visible}}visible{{/if}}\">\n    <div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>\n</div>");

});
define('framework/loader/snakeLoader', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#if visible}}\n    <div class=\"snakeLoader visible {{style}}\">\n{{else}}\n    <div class=\"snakeLoader {{style}}\">\n{{/if}}\n    <div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>\n</div>");

});
define('framework/LocalStorageQueue', ['exports'], function (exports) {

  'use strict';

  var LocalStorageQueue;

  LocalStorageQueue = (function() {
    function LocalStorageQueue(lsKey, maxLength) {
      this.lsKey = lsKey;
      this.maxLength = maxLength != null ? maxLength : 250;
    }

    LocalStorageQueue.prototype.add = function(item) {
      if (!this.contains(item)) {
        if (this.queue.length >= this.maxLength) {
          this.queue.shift();
        }
        this.queue.push(item);
        try {
          return localStorage.setItem(this.lsKey, JSON.stringify(this.queue));
        } catch (_error) {}
      }
    };

    LocalStorageQueue.prototype.contains = function(item) {
      this.queue = this.getQueue(this.lsKey);
      return this.queue.indexOf(item) > -1;
    };

    LocalStorageQueue.prototype.getQueue = function() {
      var lsQueue, queue;
      queue = [];
      try {
        if (lsQueue = localStorage.getItem(this.lsKey)) {
          queue = JSON.parse(lsQueue);
        }
      } catch (_error) {}
      return queue;
    };

    LocalStorageQueue.prototype.removeItem = function(index) {
      var queue;
      queue = this.getQueue(this.lsKey);
      queue.splice(index, 1);
      try {
        return localStorage.setItem(this.lsKey, JSON.stringify(queue));
      } catch (_error) {}
    };

    return LocalStorageQueue;

  })();

  exports.LocalStorageQueue = LocalStorageQueue;

});
define('framework/paywallEventHandler', ['exports', 'framework/eventsMixin'], function (exports, eventsMixin) {

	'use strict';

	var PaywallEventHandler, paywallEventHandler;

	eventsMixin.eventsMixin.call((PaywallEventHandler = function() {}).prototype);

	paywallEventHandler = new PaywallEventHandler();

	paywallEventHandler.registerEvents(["Auth.afterLogin", "Auth.afterLogout"]);

	exports.paywallEventHandler = paywallEventHandler;

});
define('framework/paywallInterface', ['exports', 'framework/utils'], function (exports, utils) {

  'use strict';

  var LOGIN_STATE_LOGGED_IN, LOGIN_STATE_NONE, LOGIN_STATE_NOT_LOGGED_IN, getPaywallServiceId, getPaywallUserData, initedPromise, insertFakeMetaData, module, paywallInterface, subdomains;

  LOGIN_STATE_NONE = 2;

  LOGIN_STATE_LOGGED_IN = 1;

  LOGIN_STATE_NOT_LOGGED_IN = 0;

  module = {};

  module.config = null;

  module.urls = {};

  module.loginState = LOGIN_STATE_NONE;

  initedPromise = RSVP.defer();

  subdomains = {
    abo: "abo-igr",
    tgt: "tgt-igr",
    track: "track-igr"
  };

  insertFakeMetaData = function() {
    if ($("meta[name='c1_user_info']").length <= 0) {
      return $("head").append('<meta name="c1_user_info" content=\'{&quot;nickname&quot;:&quot;&quot;,&quot;email&quot;:&quot;raffael.wannenmacher@gmail.com&quot;,&quot;session_id&quot;:&quot;20b041d8b02d72867361ca46b5d74295&quot;,&quot;birth_date&quot;:&quot;&quot;,&quot;company&quot;:&quot;Tamedia AG&quot;,&quot;login&quot;:&quot;support@newsnet.ch&quot;,&quot;gender&quot;:&quot;&quot;,&quot;title&quot;:&quot;21&quot;,&quot;user_id&quot;:&quot;a0186312-fe62-4649-beeb-abb5fc6cba0e&quot;,&quot;last_name&quot;:&quot;Wannenmacher&quot;,&quot;first_name&quot;:&quot;Raffael&quot;,&quot;language&quot;:&quot;DE&quot;}\'>');
    }
  };

  getPaywallUserData = function() {
    try {
      return JSON.parse($("meta[name='c1_user_info']:first").attr("content"));
    } catch (_error) {}
  };

  getPaywallServiceId = function(customerName) {
    switch (customerName) {
      case "bazonline":
        return "baslerzeitung";
      default:
        return customerName;
    }
  };

  paywallInterface = {
    userData: null,
    configure: function(config) {
      var i, len, ref, results, value;
      module.config = config;
      if (module.config.isProduction) {
        subdomains.abo = "abo";
        subdomains.tgt = "tgt";
        subdomains.track = "track";
      }
      ref = ["logout", "abo", "myAccount", "templateSets", "templateClient", "tracking"];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        value = ref[i];
        if (module.urls[value]) {
          results.push(module.urls[value] = this.getUrl(value));
        }
      }
      return results;
    },
    init: function() {
      if (module.config.paywall_status > module.config.paywall.status.disabled && module.config.paywall.enabled) {
        if (module.config.isDebugMode) {
          insertFakeMetaData();
        }
        RSVP.all([$.loadExternalScript(this.getUrl("templateSets")), $.loadExternalScript(this.getUrl("templateClient")), $.loadExternalScript(this.getUrl("tracking"))]).then((function(_this) {
          return function() {
            var paywallUserData;
            if (paywallUserData = getPaywallUserData()) {
              module.loginState = LOGIN_STATE_LOGGED_IN;
              _this.userData = paywallUserData;
              module.config.eventHandler.trigger("Auth.afterLogin", paywallUserData);
            } else {
              module.loginState = LOGIN_STATE_NOT_LOGGED_IN;
              _this.userData = null;
              module.config.eventHandler.trigger("Auth.afterLogout");
            }
            if (module.config.paywall_status === module.config.paywall.status.enabled && module.config.paywall.enabled) {
              cre_templateclient.setup();
            }
            return initedPromise.resolve(paywallUserData);
          };
        })(this));
      } else {
        initedPromise.resolve();
      }
      return initedPromise.promise;
    },
    login: function() {
      return initedPromise.promise.then((function(_this) {
        return function() {
          if (module.loginState !== LOGIN_STATE_LOGGED_IN) {
            return window.cre_templateclient.show({
              "template_name": "overlay_anonymous"
            });
          }
        };
      })(this));
    },
    logout: function() {
      return window.location.href = this.getUrl("logout");
    },
    getUrl: function(urlName) {
      var subdomain;
      subdomain = (function() {
        switch (urlName) {
          case "templateSets":
          case "templateClient":
          case "tracking":
            return subdomains.track;
          case "abo":
          case "logout":
          case "myAccount":
            return subdomains.abo;
          default:
            return subdomains.tgt;
        }
      })();
      return module.config.paywall[urlName].replace("%subdomain%", subdomain).replace("%currentCustomer%", module.config.currentCustomer).replace("%alternativeName%", module.config.alternativeName).replace("%serviceId%", getPaywallServiceId(module.config.currentCustomer));
    },
    isLoggedIn: function() {
      return module.loginState === LOGIN_STATE_LOGGED_IN;
    },
    track: function(options) {
      return initedPromise.promise.then(function() {
        var serviceId;
        serviceId = getPaywallServiceId(module.config.currentCustomer);
        if (module.config.paywall_status > module.config.paywall.status.disabled && module.config.paywall.enabled) {
          cre_client.set_page_view();
          cre_client.set_origin(module.config.env === "desktop" ? "web" : module.config.env);
          cre_client.set_service_id(serviceId);
          cre_client.set_content_id(window.location.pathname);
          if (options.cms_id != null) {
            cre_client.set_cms_id(options.cms_id);
          }
          if (options.main_channel != null) {
            cre_client.set_channel(options.main_channel);
          }
          if (options.sub_channel != null) {
            cre_client.set_sub_channel(options.sub_channel);
          }
          cre_client.set_heading(document.title);
          cre_client.set_doc_type(options.doc_type);
          return cre_client.request();
        }
      });
    }
  };

  exports.paywallInterface = paywallInterface;

});
define('framework/paywallUserNavigation/paywallUserNavigation', ['exports'], function (exports) {

  'use strict';

  var PaywallUserNavigation;

  PaywallUserNavigation = {
    insert: function(container, options) {
      return ReactDOM.render(React.createElement(require("framework/paywallUserNavigation/PaywallUserNavigation/component")["default"], options), container);
    }
  };

  exports.PaywallUserNavigation = PaywallUserNavigation;

});
define('framework/paywallUserNavigation/PaywallUserNavigation/component', ['exports'], function (exports) {

  'use strict';

  var PaywallUserNavigation;

  PaywallUserNavigation = React.createClass({
    getInitialState: function() {
      return {
        isLoggedIn: this.props["interface"].isLoggedIn(),
        userData: this.props["interface"].userData
      };
    },
    componentWillMount: function() {
      this.props.eventHandler.on("Auth.afterLogin", this.onAfterLogin);
      return this.props.eventHandler.on("Auth.afterLogout", this.onAfterLogout);
    },
    render: function() {
      return require("framework/paywallUserNavigation/PaywallUserNavigation/template")["default"].apply(this);
    },
    componentWillUnmount: function() {
      this.props.eventHandler.off("Auth.afterLogin", this.onAfterLogin);
      return this.props.eventHandler.off("Auth.afterLogout", this.onAfterLogout);
    },
    onAfterLogin: function(userData) {
      return this.setState({
        isLoggedIn: true,
        userData: userData
      });
    },
    onAfterLogout: function() {
      return this.setState({
        isLoggedIn: false,
        userData: null
      });
    },
    login: function() {
      return this.props["interface"].login();
    },
    logout: function() {
      return this.props["interface"].logout();
    },
    openAboPage: function() {
      return window.location.href = this.props["interface"].getUrl("abo");
    },
    openMyAccountPage: function() {
      return window.location.href = this.props["interface"].getUrl("myAccount");
    }
  });

  exports['default'] = PaywallUserNavigation;

});
define('framework/paywallUserNavigation/PaywallUserNavigation/template', ['exports', 'framework/translations'], function (exports, translations) {

    'use strict';

    function onClick1() {
        this.login();
    }
    function onClick2() {
        this.openAboPage();
    }
    function onClick3() {
        this.openAboPage();
    }
    function onClick4() {
        this.openMyAccountPage();
    }
    function onClick5() {
        this.logout();
    }
    exports['default'] = function () {
        return React.createElement('nav', { 'className': 'NnPaywallUserNavigation' }, !this.state.isLoggedIn ? React.createElement('div', {}, React.createElement('div', { 'className': 'login' }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick1.bind(this)
        }, translations.translations.translate('Login'))), React.createElement('div', { 'className': 'subscribe' }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick2.bind(this)
        }, translations.translations.translate('Abonnieren')), React.createElement('div', { 'className': 'promotion' }, React.createElement('div', {}, React.createElement('p', {}, '\n                        ', translations.translations.translate('Digitale Abos ab'), '\n                        ', React.createElement('br', {}), '\n                        ', translations.translations.translate('CHF 1.- im ersten Monat.'), '\n                    '), React.createElement('p', {}, React.createElement('img', {
            'src': 'http://www.tagesanzeiger.ch/images/aboPromotion/gruppe.png',
            'alt': true
        })), React.createElement('p', {}, '\n                        ', translations.translations.translate('Jetzt testen und unbegrenzten Zugriff auf tagesanzeiger.ch und die mobilen Apps geniessen.'), '\n                    '), React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick3.bind(this)
        }, translations.translations.translate('Alle Angebote anzeigen')))))) : null, this.state.isLoggedIn ? React.createElement('div', {}, React.createElement('div', { 'className': 'welcome' }, '\n            ', translations.translations.translate('Guten Tag'), ',\n            ', this.state.userData.first_name && this.state.userData.last_name ? React.createElement('span', { 'className': 'username' }, this.state.userData.first_name, ' ', this.state.userData.last_name) : null, !(this.state.userData.first_name && this.state.userData.last_name) ? React.createElement('span', { 'className': 'username' }, this.state.userData.email) : null), React.createElement('div', { 'className': 'myAccount' }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick4.bind(this)
        }, translations.translations.translate('Mein Konto'))), React.createElement('div', { 'className': 'logout' }, React.createElement('a', {
            'href': 'javascript:void(0);',
            'onClick': onClick5.bind(this)
        }, translations.translations.translate('Logout')))) : null);
    };

});
define('framework/poll/box', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"NnPollBox\">\n    <h3>{{title}}</h3>\n\n    <p class=\"question\">{{question}}</p>\n\n    <div class=\"response\"></div>\n\n    {{> loader}}\n\n    <div class=\"votes\">\n        {{#each votes}}\n            <a data-pollVoteId=\"{{id}}\" href=\"javascript:void(0);\" >{{description}}</a>\n        {{/each}}\n    </div>\n\n    <div class=\"poll\">\n        {{#each votes}}\n            <p class=\"answer\">{{description}}</p>\n\n            <div class=\"bars\">\n                <div class=\"bar\" style=\"width: {{calculatePercent count ../total_count}}%\"></div>\n            </div>\n\n            <div class=\"percents\">\n                <span>{{calculatePercent count ../total_count}}%</span>\n            </div>\n\n            <div class=\"clear\"></div>\n        {{/each}}\n\n        <div class=\"clear\"></div>\n\n        <p class=\"total\">{{total_count}} Stimmen</p>\n    </div>\n</div>");

});
define('framework/poll/module', ['exports', 'framework/statistics', 'framework/eventsMixin'], function (exports, statistics, eventsMixin) {

  'use strict';

  var Poll, module, poll;

  module = {};

  module.polls = {};

  module.config = {};

  module.config.apiUrl = null;

  poll = {
    configure: function(apiUrl) {
      return module.config.apiUrl = apiUrl;
    },
    init: function(payload, pollId, stats, pathname) {
      return $("div[data-pollId='" + pollId + "']").each(function(index, el) {
        return module.polls[pollId] = new Poll(el, payload.payload, {
          apiUrl: module.config.apiUrl
        }).on("afterVote", function() {
          return statistics.statistics.trackPageView(pathname, stats, "polls");
        }).show();
      });
    },
    destroy: function(pollId) {
      if (module.polls[pollId]) {
        module.polls[pollId].destroy();
        return delete module.polls[pollId];
      }
    }
  };

  Poll = (function() {
    function Poll(container, payload, options) {
      this.registerEvent("afterVote");
      this._container = container;
      this._reactComponent = ReactDOM.render(React.createElement(require("framework/poll/Poll/component").Poll, {
        config: options,
        eventHandler: this
      }), container);
      if (payload instanceof RSVP.Promise || payload.constructor.name === "lib$rsvp$promise$$Promise") {
        payload.then((function(_this) {
          return function(payload) {
            return _this._reactComponent.setState({
              isLoading: false,
              payload: payload.payload
            });
          };
        })(this));
      } else {
        this._reactComponent.setState({
          isLoading: false,
          payload: payload
        });
      }
      this;
    }

    Poll.prototype.show = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      this._reactComponent.setState({
        isVisible: true
      }, (function(_this) {
        return function() {
          return callback.call(_this);
        };
      })(this));
      return this;
    };

    Poll.prototype.destroy = function() {
      return ReactDOM.unmountComponentAtNode(this._container);
    };

    return Poll;

  })();

  eventsMixin.eventsMixin.call(Poll.prototype);

  exports.poll = poll;
  exports.Poll = Poll;

});
define('framework/poll/Poll/component', ['exports', 'framework/translations', 'framework/LocalStorageQueue'], function (exports, translations, LocalStorageQueue) {

  'use strict';

  var Poll, hasUserVotedAlready, localStorageVotes;

  localStorageVotes = new LocalStorageQueue.LocalStorageQueue("Polls.sent");

  hasUserVotedAlready = function(pollId) {
    return localStorageVotes.getQueue().some(function(localStoragePollId) {
      if (pollId === localStoragePollId) {
        return true;
      }
    });
  };

  Poll = React.createClass({
    getInitialState: function() {
      return {
        isVisible: false,
        isLoading: true,
        isVoteable: true,
        successMessage: "",
        errorMessage: "",
        payload: {
          title: "",
          question: "",
          votes: null,
          total_count: 0
        }
      };
    },
    render: function() {
      return require("framework/poll/Poll/template")["default"].apply(this);
    },
    componentWillUpdate: function(nextProps, nextState) {
      return nextState.isVoteable = nextState.payload.active && (!hasUserVotedAlready(nextState.payload.id));
    },
    vote: function(e) {
      var voteId;
      voteId = $(e.target).data("poll-vote-id");
      this.setState({
        isLoading: true
      });
      return $.ajax({
        url: this.props.config.apiUrl + "/polls/" + this.state.payload.legacy_id + "/votes/" + voteId,
        type: "PUT",
        success: (function(_this) {
          return function(data) {
            localStorageVotes.add(_this.state.payload.id);
            _this.setState({
              isLoading: false,
              isVoteable: false,
              successMessage: data.message,
              errorMessage: ""
            });
            if (_this.props.eventHandler) {
              return _this.props.eventHandler.trigger("afterVote", [_this.state.payload.id, voteId]);
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            return _this.setState({
              isLoading: false,
              isVoteable: true,
              successMessage: "",
              errorMessage: translations.translations.translate("Verbindung fehlgeschlagen, bitte versuchen Sie es später erneut.")
            });
          };
        })(this)
      });
    },
    calculatePercent: function(voteCount) {
      return Math.round(voteCount / this.state.payload.total_count * 100);
    }
  });

  exports.Poll = Poll;

});
define('framework/poll/Poll/template', ['exports', 'framework/loader/loader'], function (exports, loader) {

    'use strict';

    function repeatVote1(vote, voteIndex) {
        return React.createElement('a', {
            'key': vote.id,
            'data-poll-vote-id': vote.id,
            'href': 'javascript: void(0);',
            'onClick': this.vote
        }, vote.description);
    }
    function repeatVote2(vote, voteIndex) {
        return React.createElement('div', { 'key': vote.id }, React.createElement('p', { 'className': 'answer' }, vote.description), React.createElement('div', { 'className': 'bars' }, React.createElement('div', {
            'className': 'bar',
            'style': { width: this.calculatePercent(vote.count) + '%' }
        })), React.createElement('div', { 'className': 'percents' }, React.createElement('span', {}, this.calculatePercent(vote.count), '%')), React.createElement('div', { 'className': 'clear' }));
    }
    exports['default'] = function () {
        return this.state.isVisible ? React.createElement('div', { 'className': 'NnPollBox' }, this.state.isLoading ? React.createElement('div', { 'dangerouslySetInnerHTML': { __html: loader['default']({ visible: true }) } }) : null, !this.state.isLoading ? React.createElement('div', {}, React.createElement('h3', {}, this.state.payload.title), React.createElement('p', { 'className': 'question' }, this.state.payload.question), this.state.successMessage ? React.createElement('div', { 'className': 'successMessage' }, this.state.successMessage) : null, this.state.errorMessage ? React.createElement('div', { 'className': 'errorMessage' }, this.state.errorMessage) : null, this.state.isVoteable ? React.createElement.apply(this, [
            'div',
            { 'className': 'poll' },
            _.map(this.state.payload.votes, repeatVote1.bind(this))
        ]) : null, !this.state.isVoteable ? React.createElement.apply(this, [
            'div',
            { 'className': 'votes' },
            _.map(this.state.payload.votes, repeatVote2.bind(this)),
            React.createElement('div', { 'className': 'clear' }),
            React.createElement('p', { 'className': 'total' }, this.state.payload.total_count, ' Stimmen')
        ]) : null) : null) : null;
    };

});
define('framework/router', ['exports', 'framework/store', 'framework/viewManager', 'framework/browser', 'framework/translations', 'framework/config'], function (exports, store, viewManager, browser, translations, framework__config) {

  'use strict';

  var isFirstTransition, module, previousTransition, router, routes;

  module = {};

  module.config = null;

  routes = {};

  isFirstTransition = true;

  previousTransition = {
    routeName: null,
    id: null
  };

  router = {
    configure: function(config) {
      return module.config = config;
    },
    register: function(routeName, route) {
      route.name = routeName;
      routes[routeName] = route;
      routes[routeName].router = this;
      routes[routeName].store = store.store;
      return routes[routeName].applicationRoute = routes.application;
    },
    back: function() {
      if (history.length === 1) {
        return this.transitionTo("/");
      } else {
        return history.back();
      }
    },
    init: function() {
      if (module.config.initialTransition) {
        return this.transitionTo(browser.browser.getPathname());
      }
    },
    getRouteInfo: function(pathname) {
      var ref, ref1, routeInfo, segments;
      if (pathname === "/") {
        pathname = module.config.defaultPathname;
      }
      pathname = pathname.substr(1);
      pathname = pathname.split("#")[0];
      segments = pathname.split("/");
      routeInfo = {
        path: (ref = segments[2]) != null ? ref : segments[0],
        id: (ref1 = segments[3]) != null ? ref1 : segments[1]
      };
      if (segments[2]) {
        routeInfo.parentPath = segments[0];
        routeInfo.parentId = segments[1];
      }
      return routeInfo;
    },
    transitionTo: function(pathname, doPushState) {
      var doRerender, finishTransition, fromRoute, loadData, renderTemplate, rerenderTemplate, routeInfo, toRoute, transition, url;
      if (doPushState == null) {
        doPushState = true;
      }
      routeInfo = this.getRouteInfo(pathname);
      transition = {
        from: $.extend(previousTransition),
        to: {
          routeName: routeInfo.path.singularize(),
          id: routeInfo.id,
          pathname: pathname
        }
      };
      if (routeInfo.parentPath) {
        transition.to.parentRouteName = routeInfo.parentPath.singularize();
      }
      if (routeInfo.parentId) {
        transition.to.parentId = routeInfo.parentId;
      }
      fromRoute = routes[transition.from.routeName];
      toRoute = routes[transition.to.routeName];
      url = toRoute.urlPattern;
      if (transition.to.id) {
        url = url.replace("[id]", transition.to.id);
      }
      doRerender = !((toRoute.currentRenderedId != null) && toRoute.currentRenderedId === transition.to.id);
      toRoute.currentRenderedId = transition.to.id;
      renderTemplate = function() {
        if (doRerender) {
          if (toRoute.renderTemplate != null) {
            return toRoute.renderTemplate(transition);
          } else {
            return viewManager.viewManager.renderTemplate(transition.to.routeName, {
              config: framework__config.config
            });
          }
        }
      };
      loadData = function() {
        var promises;
        promises = [];
        if (toRoute.loadData != null) {
          promises = promises.concat($.makeArray(toRoute.loadData(transition)));
        } else {
          promises.push(store.store.load(transition.to.routeName.pluralize(), {
            id: transition.to.id
          }));
        }
        if (routes.application.loadData != null) {
          promises = promises.concat($.makeArray(routes.application.loadData(transition)));
        }
        return RSVP.all(promises);
      };
      rerenderTemplate = function(payload, stream, node) {
        if (routes.application.rerenderTemplate != null) {
          routes.application.rerenderTemplate(transition, payload);
        }
        if (stream) {
          stream.node(node, function(nodeElement, path) {
            return toRoute.streamNode(nodeElement, path[path.length - 1], transition, payload);
          });
          if (routes.application.afterStream != null) {
            if (stream.isDone) {
              routes.application.afterStream.call(stream, transition);
            } else {
              stream.done(routes.application.afterStream.bind(this, transition));
            }
          }
          if (toRoute.afterStream != null) {
            if (stream.isDone) {
              return toRoute.afterStream.call(stream, transition);
            } else {
              return stream.done(toRoute.afterStream.bind(this, transition));
            }
          }
        } else {
          if (toRoute.rerenderTemplate != null) {
            return toRoute.rerenderTemplate(transition, payload);
          } else {
            return viewManager.viewManager.renderTemplate(transition.to.routeName, payload);
          }
        }
      };
      finishTransition = (function(_this) {
        return function(payload) {
          var title;
          if (toRoute.getTitle != null) {
            title = document.title = toRoute.getTitle(transition);
          } else {
            title = document.title = payload.title + " - " + store.store.get("sites", "default").title;
          }
          if (routes.application.enter != null) {
            routes.application.enter(transition, payload, doRerender, doPushState);
          }
          if (toRoute.enter != null) {
            toRoute.enter(transition, payload, doRerender, doPushState);
          }
          if (isFirstTransition) {
            $(window).on("popstate hashchange", function() {
              if (!browser.browser.isWP()) {
                if (history.replaceState) {
                  history.replaceState(null, null, browser.browser.getPathname());
                }
              }
              return _this.transitionTo(browser.browser.getPathname(), false);
            });
            return isFirstTransition = false;
          }
        };
      })(this);
      return new RSVP.Promise((function(_this) {
        return function(resolve) {
          var $fullscreenLoader;
          if (transition.from.routeName === transition.to.routeName && transition.from.id === transition.to.id) {
            return resolve(transition);
          }
          if (doPushState && history.pushState) {
            if (!isFirstTransition) {
              history.pushState(null, null, url);
            }
          }
          if ((toRoute != null ? toRoute.beforeTransition : void 0) != null) {
            toRoute.beforeTransition(transition);
          }
          if (routes.application.beforeTransition != null) {
            routes.application.beforeTransition(transition);
          }
          if ((fromRoute != null ? fromRoute.exit : void 0) != null) {
            fromRoute.exit(transition);
          }
          if (routes.application.exit != null) {
            routes.application.exit(transition);
          }
          if (doRerender) {
            if (routes.application.beforeRender != null) {
              routes.application.beforeRender(transition);
            }
            if (toRoute.beforeRender != null) {
              toRoute.beforeRender(transition);
            }
            renderTemplate();
          }
          $fullscreenLoader = $("#" + transition.to.routeName + " .fullscreenLoader");
          if (doRerender && !framework__config.config.isNativeApp) {
            $fullscreenLoader.show();
          }
          viewManager.viewManager.show(transition.to.routeName, transition.from.routeName, toRoute.animationDirection).then(function() {
            var failure, retriesLeft, success;
            success = function(payloads) {
              var node, payload, promises, stream;
              promises = [];
              payload = payloads[0].payload;
              stream = payloads[0].stream;
              node = payloads[0].node;
              if (doRerender) {
                if (routes.application.beforeRerender != null) {
                  routes.application.beforeRerender(transition, payload);
                }
                if (toRoute.beforeRerender != null) {
                  toRoute.beforeRerender(transition, payload);
                }
                rerenderTemplate(payload, stream, node);
                if (routes.application.afterRerender != null) {
                  promises = promises.concat($.makeArray(routes.application.afterRerender(transition, payload)));
                }
                if (toRoute.afterRerender != null) {
                  promises = promises.concat($.makeArray(toRoute.afterRerender(transition, payload)));
                }
                if (!stream && (routes.application.afterStream != null)) {
                  routes.application.afterStream(transition);
                }
                if (!stream && (toRoute.afterStream != null)) {
                  toRoute.afterStream(transition);
                }
              }
              finishTransition(payload);
              $fullscreenLoader.find("span").empty();
              $fullscreenLoader.hide();
              return RSVP.all(promises).then(function() {
                return resolve(transition);
              });
            };
            failure = function(error) {
              if (retriesLeft) {
                if (retriesLeft <= module.config.requestRetries - 2) {
                  $fullscreenLoader.find("span").text(translations.translations.translate("Verbindung fehlgeschlagen, erneuter Versuch..."));
                }
                retriesLeft--;
                setTimeout(function() {
                  return loadData().then(success, failure);
                }, module.config.timeoutBetweenRetries);
              } else {
                $fullscreenLoader.find(">div>div").hide();
                $fullscreenLoader.find("span").text(translations.translations.translate("Verbindung fehlgeschlagen, bitte versuchen Sie es später erneut."));
              }
              return console.log(error.stack);
            };
            retriesLeft = module.config.requestRetries;
            return loadData().then(success, failure);
          });
          previousTransition.routeName = transition.to.routeName;
          previousTransition.id = transition.to.id;
          if (transition.to.parentRouteName) {
            previousTransition.parentRouteName = transition.to.parentRouteName;
          }
          if (transition.to.parentId) {
            return previousTransition.parentId = transition.to.parentId;
          }
        };
      })(this));
    }
  };

  exports.router = router;

});
define('framework/scoreboard/scoreboard', ['exports'], function (exports) {

  'use strict';

  var Scoreboard;

  Scoreboard = (function() {
    function Scoreboard(selector, config) {
      this._config = $.extend({
        templateName: "template",
        getRenderMode: function() {
          if ($(window).width() < 800 || $(window).height() < 600) {
            return "mobile";
          } else {
            return "desktop";
          }
        }
      }, config);
      this._id = this._config.id;
      this._container = (this._$container = $(selector))[0];
      $(window).on("resize." + this._id + " orientationchange." + this._id, (function(_this) {
        return function(e) {
          return _this._onResize();
        };
      })(this));
      this._reactComponent = ReactDOM.render(React.createElement(require("framework/scoreboard/Scoreboard/component").Scoreboard, {
        config: this._config
      }), this._container);
      this._$scoreboard = $(ReactDOM.findDOMNode(this._reactComponent));
      this._onResize();
      this._requestData();
    }

    Scoreboard.prototype.update = function() {
      return this._requestData();
    };

    Scoreboard.prototype.destroy = function() {
      $(window).off("resize." + this._id + " orientationchange." + this._id);
      return ReactDOM.unmountComponentAtNode(this._container);
    };

    Scoreboard.prototype._onResize = function() {
      if (this._config.getRenderMode() === "mobile") {
        return this._$scoreboard.removeClass("desktop").addClass("mobile");
      } else {
        return this._$scoreboard.removeClass("mobile").addClass("desktop");
      }
    };

    Scoreboard.prototype._requestData = function(callback) {
      if (this._isRequestingData) {
        return;
      }
      this._isRequestingData;
      return $.ajax({
        url: this._config.baseUrl + "/scoreboards/" + this._id,
        complete: (function(_this) {
          return function() {
            return _this._isRequestingData;
          };
        })(this),
        success: (function(_this) {
          return function(data) {
            if (_this._reactComponent) {
              _this._reactComponent.setState($.extend(data.scoreboard, {
                isLoading: false
              }));
              if (callback != null) {
                return callback();
              }
            }
          };
        })(this)
      });
    };

    return Scoreboard;

  })();

  exports.Scoreboard = Scoreboard;

});
define('framework/scoreboard/Scoreboard/20min-template', ['exports', 'framework/translations', 'framework/loader/loader'], function (exports, translations, loader) {

    'use strict';

    function repeatSet1(scoreboard, result, set, setIndex) {
        return React.createElement('span', { 'key': set.id }, set.score_left !== undefined && set.score_right !== undefined ? React.createElement('span', {}, set.score_left, ':', set.score_right) : null);
    }
    function scopeResult2(scoreboard) {
        var result = scoreboard.tennis_result;
        return React.createElement('div', { 'className': 'tennis' }, React.createElement('div', { 'className': 'overview' }, React.createElement('div', { 'className': 'score min20' }, React.createElement.apply(this, [
            'span',
            { 'className': 'numbers' },
            _.map(result.sets, repeatSet1.bind(this, scoreboard, result))
        ]), React.createElement('div', { 'className': 'serve' }, React.createElement('div', { 'className': this.isLeftPlayersTurn() ? 'active' : '' }), React.createElement('div', { 'className': this.isRightPlayersTurn() ? 'active' : '' }))), React.createElement('div', { 'className': 'name home' }, result.player_left), React.createElement('div', { 'className': 'name guest' }, result.player_right), result.icon_home ? React.createElement('img', {
            'className': 'avatar',
            'src': result.icon_home
        }) : null, result.icon_visitor ? React.createElement('img', {
            'className': 'avatar',
            'src': result.icon_visitor
        }) : null));
    }
    function repeatEvent3(scoreboard, result, event, eventIndex) {
        return React.createElement('span', { 'key': event.id }, scoreboard.type == 'soccer' ? React.createElement('span', { 'className': 'sprite-scoreboard-goal' }) : null, scoreboard.type == 'hockey' ? React.createElement('span', { 'className': 'sprite-scoreboard-hockeyGoal' }) : null, '\n                    ', event.minute, '. ', event.event, '\n                    ', React.createElement('br', {}));
    }
    function repeatEvent4(scoreboard, result, event, eventIndex) {
        return React.createElement('span', { 'key': event.id }, scoreboard.type == 'soccer' ? React.createElement('span', { 'className': 'sprite-scoreboard-goal' }) : null, scoreboard.type == 'hockey' ? React.createElement('span', { 'className': 'sprite-scoreboard-hockeyGoal' }) : null, '\n                    ', event.minute, '. ', event.event, '\n                    ', React.createElement('br', {}));
    }
    function repeatAdditionalResult5(scoreboard, result, additionalResult, additionalResultIndex) {
        return React.createElement('tr', { 'key': additionalResult.id }, React.createElement('td', {}, additionalResult.name_home), React.createElement('td', {}, '-'), React.createElement('td', {}, additionalResult.name_visitor), React.createElement('td', {}, additionalResult.score_home, ':', additionalResult.score_visitor));
    }
    function scopeResult6(scoreboard) {
        var result = scoreboard.teamsport_result;
        return React.createElement('div', { 'className': 'teamsport' }, React.createElement('table', {}, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {}, result.icon_home ? React.createElement('img', { 'src': result.icon_home }) : null, React.createElement('br', {}), React.createElement('span', {}, result.name_home)), React.createElement('td', {}, result.score_home, ' : ', result.score_visitor), React.createElement('td', {}, result.icon_visitor ? React.createElement('img', { 'src': result.icon_visitor }) : null, React.createElement('br', {}), React.createElement('span', {}, result.name_visitor))))), React.createElement('div', { 'className': 'events' }, React.createElement.apply(this, [
            'div',
            { 'className': 'eventsHome' },
            _.map(result.events_home, repeatEvent3.bind(this, scoreboard, result))
        ]), React.createElement.apply(this, [
            'div',
            { 'className': 'eventsVisitor' },
            _.map(result.events_visitor, repeatEvent4.bind(this, scoreboard, result))
        ]), React.createElement('div', { 'className': 'clear' })), this.hasAdditionalResults() ? React.createElement('div', { 'className': 'additionalResults' }, React.createElement('span', {}, translations.translations.translate('Die anderen Spiele')), React.createElement('table', {}, React.createElement.apply(this, [
            'tbody',
            {},
            _.map(scoreboard.additional_results, repeatAdditionalResult5.bind(this, scoreboard, result))
        ]))) : null);
    }
    function scopeScoreboard7() {
        var scoreboard = this.state;
        return React.createElement('div', { 'className': 'NnScoreboard ' + scoreboard.type }, scoreboard.isLoading ? React.createElement('div', { 'dangerouslySetInnerHTML': { __html: loader['default']({ visible: true }) } }) : null, this.isTennisResult() ? scopeResult2.apply(this, [scoreboard]) : null, this.isTeamsportResult() ? scopeResult6.apply(this, [scoreboard]) : null);
    }
    exports['default'] = function () {
        return scopeScoreboard7.apply(this, []);
    };

});
define('framework/scoreboard/Scoreboard/component', ['exports'], function (exports) {

  'use strict';

  var Scoreboard;

  Scoreboard = React.createClass({
    getInitialState: function() {
      return {
        isLoading: true
      };
    },
    componentWillUpdate: function(nextProps, nextState) {
      var results, sets;
      if (nextState.type === "tennis") {
        sets = nextState.tennis_result.sets;
        results = [];
        while (sets.length < nextState.tennis_result.number_of_sets) {
          results.push(sets.push({
            set_number: sets.length + 1
          }));
        }
        return results;
      }
    },
    render: function() {
      return require("framework/scoreboard/Scoreboard/" + this.props.config.templateName)["default"].apply(this);
    },
    isTennisResult: function() {
      return this.state.type === "tennis";
    },
    isTeamsportResult: function() {
      return this.state.type && this.state.type !== "tennis";
    },
    hasAdditionalResults: function() {
      return this.state.additional_results && this.state.additional_results.length;
    },
    isLeftPlayersTurn: function() {
      return this.state.tennis_result.initial_server === "player_left" && !this.state.tennis_result.winner;
    },
    isRightPlayersTurn: function() {
      return this.state.tennis_result.initial_server === "player_right" && !this.state.tennis_result.winner;
    },
    hasLeftPlayerWon: function(set) {
      return set.winner === "player_left";
    },
    hasRightPlayerWon: function(set) {
      return set.winner === "player_right";
    }
  });

  exports.Scoreboard = Scoreboard;

});
define('framework/scoreboard/Scoreboard/template', ['exports', 'framework/translations', 'framework/loader/loader'], function (exports, translations, loader) {

    'use strict';

    function repeatSet1(scoreboard, result, set, setIndex) {
        return React.createElement('td', { 'key': set.id }, set.set_number, '. S');
    }
    function repeatSet2(scoreboard, result, set, setIndex) {
        return React.createElement('td', {
            'key': set.id,
            'className': this.hasLeftPlayerWon(set) ? 'winner' : ''
        }, set.score_left);
    }
    function repeatSet3(scoreboard, result, set, setIndex) {
        return React.createElement('td', {
            'key': set.id,
            'className': this.hasRightPlayerWon(set) ? 'winner' : ''
        }, set.score_right);
    }
    function scopeResult4(scoreboard) {
        var result = scoreboard.tennis_result;
        return React.createElement('div', { 'className': 'tennis' }, React.createElement('table', {}, React.createElement('thead', {}, React.createElement.apply(this, [
            'tr',
            {},
            React.createElement('td', {}),
            _.map(result.sets, repeatSet1.bind(this, scoreboard, result))
        ])), React.createElement('tbody', {}, React.createElement.apply(this, [
            'tr',
            {},
            React.createElement('td', {}, '\n                        ', result.player_left, '\n\n                        ', this.isLeftPlayersTurn() ? React.createElement('span', { 'className': 'sprite-scoreboard-tennisRacket' }) : null),
            _.map(result.sets, repeatSet2.bind(this, scoreboard, result))
        ]), React.createElement.apply(this, [
            'tr',
            {},
            React.createElement('td', {}, '\n                        ', result.player_right, '\n\n                        ', this.isRightPlayersTurn() ? React.createElement('span', { 'className': 'sprite-scoreboard-tennisRacket' }) : null),
            _.map(result.sets, repeatSet3.bind(this, scoreboard, result))
        ]))));
    }
    function repeatEvent5(scoreboard, result, event, eventIndex) {
        return React.createElement('span', { 'key': event.id }, scoreboard.type == 'soccer' ? React.createElement('span', { 'className': 'sprite-scoreboard-goal' }) : null, scoreboard.type == 'hockey' ? React.createElement('span', { 'className': 'sprite-scoreboard-hockeyGoal' }) : null, '\n                    ', event.minute, '. ', event.event, '\n                    ', React.createElement('br', {}));
    }
    function repeatEvent6(scoreboard, result, event, eventIndex) {
        return React.createElement('span', { 'key': event.id }, scoreboard.type == 'soccer' ? React.createElement('span', { 'className': 'sprite-scoreboard-goal' }) : null, scoreboard.type == 'hockey' ? React.createElement('span', { 'className': 'sprite-scoreboard-hockeyGoal' }) : null, '\n                    ', event.minute, '. ', event.event, '\n                    ', React.createElement('br', {}));
    }
    function repeatAdditionalResult7(scoreboard, result, additionalResult, additionalResultIndex) {
        return React.createElement('tr', { 'key': additionalResult.id }, React.createElement('td', {}, additionalResult.name_home), React.createElement('td', {}, '-'), React.createElement('td', {}, additionalResult.name_visitor), React.createElement('td', {}, additionalResult.score_home, ':', additionalResult.score_visitor));
    }
    function scopeResult8(scoreboard) {
        var result = scoreboard.teamsport_result;
        return React.createElement('div', { 'className': 'teamsport' }, React.createElement('table', {}, React.createElement('tbody', {}, React.createElement('tr', {}, React.createElement('td', {}, result.icon_home ? React.createElement('img', { 'src': result.icon_home }) : null, React.createElement('br', {}), React.createElement('span', {}, result.name_home)), React.createElement('td', {}, result.score_home, ' : ', result.score_visitor), React.createElement('td', {}, result.icon_visitor ? React.createElement('img', { 'src': result.icon_visitor }) : null, React.createElement('br', {}), React.createElement('span', {}, result.name_visitor))))), React.createElement('div', { 'className': 'events' }, React.createElement.apply(this, [
            'div',
            { 'className': 'eventsHome' },
            _.map(result.events_home, repeatEvent5.bind(this, scoreboard, result))
        ]), React.createElement.apply(this, [
            'div',
            { 'className': 'eventsVisitor' },
            _.map(result.events_visitor, repeatEvent6.bind(this, scoreboard, result))
        ]), React.createElement('div', { 'className': 'clear' })), this.hasAdditionalResults() ? React.createElement('div', { 'className': 'additionalResults' }, React.createElement('span', {}, translations.translations.translate('Die anderen Spiele')), React.createElement('table', {}, React.createElement.apply(this, [
            'tbody',
            {},
            _.map(scoreboard.additional_results, repeatAdditionalResult7.bind(this, scoreboard, result))
        ]))) : null);
    }
    function scopeScoreboard9() {
        var scoreboard = this.state;
        return React.createElement('div', { 'className': 'NnScoreboard ' + scoreboard.type }, scoreboard.isLoading ? React.createElement('div', { 'dangerouslySetInnerHTML': { __html: loader['default']({ visible: true }) } }) : null, this.isTennisResult() ? scopeResult4.apply(this, [scoreboard]) : null, this.isTeamsportResult() ? scopeResult8.apply(this, [scoreboard]) : null);
    }
    exports['default'] = function () {
        return scopeScoreboard9.apply(this, []);
    };

});
define('framework/slideshow/slideshow', ['exports', 'framework/jquery', 'framework/string', 'framework/browser', 'framework/handlebars/module', 'framework/translations'], function (exports, __dep0__, __dep1__, browser, module, translations) {

  'use strict';

  var Slideshow, SlideshowZoomer, fitToNumberRange, isAdPageIndex,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.handlebars.init();

  isAdPageIndex = function(n) {
    return ((n / .5) % 2) === 1;
  };

  fitToNumberRange = function(n, max, min) {
    if (min == null) {
      min = 0;
    }
    if (n > max) {
      n = fitToNumberRange(min + (n - (max + 1)), max, min);
    } else if (n < min) {
      n = fitToNumberRange(max + 1 + n, max, min);
    }
    return n;
  };

  Slideshow = (function() {
    function Slideshow(container, images, options) {
      this._onTapEventHandler = bind(this._onTapEventHandler, this);
      $.extend(this, {
        _id: null,
        _$: null,
        _$container: null,
        _$swiperContainer: null,
        _currentIndex: 0,
        _lastProcessedImageIndex: null,
        _images: [],
        _isSliding: false,
        _isSwiperCreated: false,
        _options: {
          template: require("framework/slideshow/templates/slideshow")["default"],
          pictureCaptionTemplate: require("framework/slideshow/templates/pictureCaption")["default"],
          linksTemplate: require("framework/slideshow/templates/links")["default"],
          pagingTemplate: require("framework/slideshow/templates/paging")["default"],
          paginationTemplate: require("framework/slideshow/templates/pagination")["default"],
          pagination: false,
          state: "inline",
          ads: false,
          adInterval: 4,
          prerenderedSlides: 4,
          fullscreenOnly: false,
          enableFullscreen: true,
          fullyResponsive: false,
          enableZoom: true,
          enableKeyBindings: true,
          getTitle: function() {
            return "";
          },
          getSubtitle: function() {
            return "";
          },
          getImageUrl: function(obj, index) {
            return obj.url;
          },
          getImagePaging: function(obj, index, options) {
            if (options.isAdPage) {
              return translations.translations.translate("Werbung");
            } else if (options.template) {
              return options.template({
                currentImage: index + 1,
                totalImages: this.getImageCount()
              });
            } else {
              return "";
            }
          },
          getImageCaption: function(obj, index) {
            return obj.caption;
          },
          getLinks: function() {
            return "";
          },
          getAdUrl: function() {
            return "";
          },
          getRenderMode: function() {
            if ($(window).width() < 768 || $(window).height() < 600) {
              return "mobile";
            } else {
              return "desktop";
            }
          },
          backButtonClickCallback: null
        }
      });
      $.extend(this._options, options != null ? options : {});
      this._id = new Date().getTime() + "NnSlideshow";
      this._$container = $(container).empty().append(this._options.template()).find(".NnSlideshowContainer").addClass("imagesLoading");
      this._$ = this._$container.find(".NnSlideshow");
      this._$swiperContainer = this._$.find(".swiper-container");
      this._$container.addClass(browser.browser.isTouchScreen() ? "touch" : "noTouch");
      this._$container.addClass(this._options.enableFullscreen ? "fullscreenEnabled" : "fullscreenDisabled");
      this._$container.addClass(this._options.pagination ? "paginationEnabled" : "paginationDisabled");
      this._bindEventListeners();
      if (images instanceof RSVP.Promise || images.constructor.name === "lib$rsvp$promise$$Promise") {
        images.then((function(_this) {
          return function(images) {
            _this._initImages(images);
            return _this._createSwiper();
          };
        })(this));
      } else {
        this._initImages(images);
        this._createSwiper();
      }
      this;
    }

    Slideshow.prototype.isDesktop = function() {
      return this._$container.hasClass("desktop");
    };

    Slideshow.prototype.isMobile = function() {
      return this._$container.hasClass("mobile");
    };

    Slideshow.prototype.isFullscreen = function() {
      return this._options.state === "fullscreen";
    };

    Slideshow.prototype.getImageCount = function() {
      return this._images.length;
    };

    Slideshow.prototype.getDomNode = function() {
      return this._$[0];
    };

    Slideshow.prototype.disableAds = function() {
      return this._options.ads = false;
    };

    Slideshow.prototype.show = function(options) {
      var oldIndex, ref;
      if (options == null) {
        options = {};
      }
      options.pageIndex = (ref = options.pageIndex) != null ? ref : 0;
      options.fullscreen = this._options.fullscreenOnly ? true : options.fullscreen;
      this._$container.addClass("visible").removeClass("hidden");
      this.transitionTo(options.fullscreen ? "fullscreen" : "inline");
      oldIndex = this._currentIndex;
      this._currentIndex = options.pageIndex;
      if (this._isSwiperCreated && oldIndex !== this._currentIndex) {
        return this._reinitSwiper(this._swiper, options.pageIndex);
      }
    };

    Slideshow.prototype.refresh = function(index) {
      return this._reinitSwiper(this._swiper, index);
    };

    Slideshow.prototype.hide = function() {
      return this._$container.addClass("hidden").removeClass("visible");
    };

    Slideshow.prototype.prev = function() {
      if (this._isSliding) {
        return;
      }
      this._isSliding = true;
      return this._swiper.swipePrev();
    };

    Slideshow.prototype.next = function() {
      if (this._isSliding) {
        return;
      }
      this._isSliding = true;
      return this._swiper.swipeNext();
    };

    Slideshow.prototype.transitionTo = function(state) {
      var beforeTransitionEvent, oldState;
      if (!this._options.enableFullscreen && state === "fullscreen") {
        return;
      }
      if (this._isSliding) {
        return;
      }
      oldState = this._options.state;
      beforeTransitionEvent = $.Event("beforeTransition");
      $(this).trigger(beforeTransitionEvent, [this._images[this._currentIndex], this._currentIndex, state, oldState]);
      if (beforeTransitionEvent.cancelTransition) {
        return;
      }
      if (this._options.fullscreenOnly && state !== "fullscreen") {
        return this.destroy();
      } else {
        if (state === "fullscreen") {
          if (this._options.enableZoom && this.isMobile()) {
            this._slideshowZoomer = new SlideshowZoomer(this, this._$swiperContainer[0], {
              onTap: this._onTapEventHandler,
              onDoubleTap: (function(_this) {
                return function() {
                  return _this._isSliding = false;
                };
              })(this),
              onPinchEnd: (function(_this) {
                return function() {
                  return _this._isSliding = false;
                };
              })(this),
              onPanEnd: (function(_this) {
                return function() {
                  return _this._isSliding = false;
                };
              })(this)
            });
          }
        } else {
          if (this._slideshowZoomer) {
            this._slideshowZoomer.destroy();
            this._slideshowZoomer = null;
          }
        }
        this._options.state = state;
        this._$container.removeClass(oldState).addClass(state);
        this._renderPage();
        this._onResize("afterTransition");
        return $(this).trigger("afterTransition", [this._images[this._currentIndex], this._currentIndex, state, oldState]);
      }
    };

    Slideshow.prototype.destroy = function() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      if (this._isSwiperCreated) {
        this._swiper.destroy(true);
      }
      if (this._slideshowZoomer) {
        this._slideshowZoomer.destroy();
        this._slideshowZoomer = null;
      }
      this._unbindEventListeners();
      return this._$container.remove();
    };

    Slideshow.prototype._bindEventListeners = function() {
      $(window).on("resize." + this._id + " orientationchange." + this._id, (function(_this) {
        return function(e) {
          return _this._onResize(e.type);
        };
      })(this));
      if (this._options.enableKeyBindings) {
        $(document).on("keydown." + this._id, (function(_this) {
          return function(e) {
            if (_this.isFullscreen()) {
              if (e.keyCode === 27) {
                _this.transitionTo("inline");
              }
            }
            if (_this.isFullscreen() || _this._$.filter(":visible").isInViewport(true)) {
              if (e.keyCode === 37) {
                return _this.prev();
              } else if (e.keyCode === 39) {
                return _this.next();
              }
            }
          };
        })(this));
      }
      this._$container.on("click", (function(_this) {
        return function(e) {
          if ($(e.target).hasClass("NnSlideshowContainer")) {
            return _this.transitionTo("inline");
          }
        };
      })(this));
      this._$.find(".header .closeButton").on("click", (function(_this) {
        return function(e) {
          return _this.transitionTo("inline");
        };
      })(this));
      this._$.find(".header .backButton").on("click", (function(_this) {
        return function(e) {
          if ($.isFunction(_this._options.backButtonClickCallback)) {
            return _this._options.backButtonClickCallback.call(_this, e);
          } else {
            return _this.transitionTo("inline");
          }
        };
      })(this));
      this._$.find(".nav .back").on("click", (function(_this) {
        return function(e) {
          return _this.prev();
        };
      })(this));
      this._$.find(".enlarge").on("click", (function(_this) {
        return function(e) {
          return _this.transitionTo("fullscreen");
        };
      })(this));
      return this._$.find(".nav .forward").on("click", (function(_this) {
        return function(e) {
          return _this.next();
        };
      })(this));
    };

    Slideshow.prototype._unbindEventListeners = function() {
      $(window).off("." + this._id);
      return $(document).off("." + this._id);
    };

    Slideshow.prototype._initImages = function(images) {
      var i, image, len;
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        this._images.push(image);
      }
      return this._$container.removeClass("imagesLoading").addClass("imagesLoaded");
    };

    Slideshow.prototype._onResize = function(originEventName) {
      var clearSwiperDimensions, css, finishItUp, height, maxHeight, maxWidth, minHeight, minWidth, newHeight, newWidth, width, windowHeight, windowWidth;
      windowWidth = $(window).width();
      windowHeight = $(window).height();
      clearSwiperDimensions = (function(_this) {
        return function() {
          return _this._$.find(".swiper-container,.swiper-wrapper,.swiper-slide").css({
            "width": "",
            "height": ""
          });
        };
      })(this);
      switch (this._options.getRenderMode.call(this)) {
        case "mobile":
          if (this.isDesktop() || !this.isMobile()) {
            this._$container.removeClass("desktop").addClass("mobile");
            if (this._isSwiperCreated) {
              this._destroyAd();
              this._reinitSwiper(this._swiper, Math.floor(this._currentIndex));
            }
            clearSwiperDimensions();
          }
          break;
        case "desktop":
          if (this.isMobile() || !this.isDesktop()) {
            this._$container.removeClass("mobile").addClass("desktop");
            if (this._isSwiperCreated) {
              this._reinitSwiper(this._swiper, this._currentIndex);
            }
            clearSwiperDimensions();
          }
      }
      if (originEventName === "afterTransition") {
        clearSwiperDimensions();
      }
      if (this.isDesktop() && this.isFullscreen()) {
        width = this._$.width();
        height = this._$.height();
        if (browser.browser.isIE9() && this._$[0].currentStyle) {
          minWidth = parseInt(this._$[0].currentStyle.minWidth, 10);
          maxWidth = parseInt(this._$[0].currentStyle.maxWidth, 10);
          minHeight = parseInt(this._$[0].currentStyle.minHeight, 10);
          maxHeight = parseInt(this._$[0].currentStyle.maxHeight, 10);
        } else {
          minWidth = parseInt(this._$.css("min-width"), 10);
          maxWidth = parseInt(this._$.css("max-width"), 10);
          minHeight = parseInt(this._$.css("min-height"), 10);
          maxHeight = parseInt(this._$.css("max-height"), 10);
        }
        if ((minWidth && width > windowWidth && windowWidth >= minWidth) || (maxWidth && width < windowWidth)) {
          newWidth = windowWidth > maxWidth ? maxWidth : windowWidth;
          this._$swiperContainer.css("width", (this._$swiperContainer.parent().width() - (this._$.outerWidth() - newWidth)) + "px");
          this._$.css("width", newWidth + "px");
        }
        if ((minHeight && height > windowHeight && windowHeight >= minHeight) || (maxHeight && height < windowHeight)) {
          newHeight = windowHeight > maxHeight ? maxHeight : windowHeight;
          this._$swiperContainer.css("height", (this._$swiperContainer.parent().height() - (this._$.outerHeight() - newHeight)) + "px");
        }
        this._$.css("margin-top", -this._$.height() / 2);
        this._$.css("margin-left", -this._$.width() / 2);
      } else {
        css = {
          "width": "",
          "margin-top": "",
          "margin-left": ""
        };
        if (this._options.fullyResponsive) {
          width = this._$container.parent().width();
          this._$swiperContainer.width(width);
          css.width = width + "px";
        }
        this._$.css(css);
      }
      finishItUp = (function(_this) {
        return function() {
          if (_this._isSwiperCreated) {
            if (_this.resizeTimeout) {
              clearTimeout(_this.resizeTimeout);
            }
            return _this.resizeTimeout = setTimeout(function() {
              _this.resizeTimeout = null;
              return _this._swiper.resizeFix();
            }, originEventName === "resize" ? 500 : 0);
          }
        };
      })(this);
      if (this.isMobile() && this.isFullscreen() && originEventName === "orientationchange") {
        return setTimeout((function(_this) {
          return function() {
            scrollTo(0, 0);
            return finishItUp();
          };
        })(this), 100);
      } else {
        return finishItUp();
      }
    };

    Slideshow.prototype._renderPage = function(index) {
      var $footer, generateExternalLinks, linksHtml;
      if (index == null) {
        index = this._currentIndex;
      }
      if (this._isSwiperCreated && this._images.length) {
        this._$.find("h1").html(this._options.getTitle.call(this, this._images[index], index));
        this._$.find("h2").html(this._options.getSubtitle.call(this, this._images[index], index));
        if (this._options.footerTemplate) {
          $footer = $(this._options.footerTemplate());
        } else {
          $footer = this._$.find(".footer");
        }
        this._$.find(".header").add($footer).find(".paging").html(this._options.getImagePaging.call(this, this._images[index], index, {
          isAdPage: isAdPageIndex(index),
          template: this._options.pagingTemplate
        }));
        if (this.isDesktop()) {
          generateExternalLinks = function(html) {
            var _$;
            _$ = $("<div>" + html + "</div>");
            _$.find("a").on("click", (function(_this) {
              return function() {
                return _this.transitionTo("inline");
              };
            })(this));
            return _$.children();
          };
          if (this._options.linksTemplate) {
            linksHtml = this._options.getLinks.call(this, this._images[index], index, this._options.linksTemplate).trim();
          }
          if (linksHtml) {
            $footer.find(".links").html(generateExternalLinks(linksHtml)).css("display", "");
          } else {
            $footer.find(".links").hide();
          }
        } else {
          $footer.find(".links").hide();
        }
        if (isAdPageIndex(index)) {
          $footer.find(".caption").html("");
        } else {
          if (this._options.pagination && this._options.paginationTemplate) {
            $footer.find(".pagination").html(this._options.paginationTemplate({
              images: this._images
            })).find(".bubble").removeClass("active").eq(index).addClass("active");
          }
          if (this._options.pictureCaptionTemplate) {
            $footer.find(".caption").html(this._options.getImageCaption.call(this, this._images[index], index, this._options.pictureCaptionTemplate));
            $footer.find(".caption .pictures").on("click", (function(_this) {
              return function() {
                return _this.transitionTo("fullscreen");
              };
            })(this));
          }
        }
        if (this._options.footerTemplate) {
          return this._$.find(".footer").replaceWith($footer);
        }
      }
    };

    Slideshow.prototype._renderAd = function(adEl) {
      var $adEl, adUrl, div;
      this._$container.addClass("adPage");
      $adEl = $(adEl);
      adUrl = this._options.getAdUrl.call(this);
      if ((!adEl.isLoading) && adUrl) {
        adEl.isLoading = true;
        div = document.createElement("div");
        div.style.display = "none";
        document.body.appendChild(div);
        return postscribe(div, "<script type=\"text/javascript\" src=\"" + adUrl + "\"></" + "script>", {
          done: function() {
            if (adEl.isActive()) {
              $(div).appendTo(adEl).show();
            } else {
              $(div).remove();
            }
            return adEl.isLoading = false;
          }
        });
      }
    };

    Slideshow.prototype._destroyAd = function() {
      this._$swiperContainer.find(".adContainer").empty();
      return this._$container.removeClass("adPage");
    };

    Slideshow.prototype._onTapEventHandler = function() {
      this._isSliding = false;
      if (!this.isFullscreen()) {
        return this.transitionTo("fullscreen");
      } else {
        return this._$container.toggleClass("inactive");
      }
    };

    Slideshow.prototype._createSwiper = function() {
      if (!this._isSwiperCreated && this._images.length) {
        return this._swiper = new Swiper(this._$swiperContainer[0], {
          grabCursor: true,
          noSwiping: this._options.enableZoom && this._options.getRenderMode.call(this) === "mobile",
          queueEndCallbacks: true,
          onSwiperCreated: (function(_this) {
            return function(swiper) {
              _this._swiper = swiper;
              _this._isSwiperCreated = true;
              return _this._reinitSwiper(swiper);
            };
          })(this),
          onSlideTouch: (function(_this) {
            return function(swiper) {
              return _this._isSliding = true;
            };
          })(this),
          onSlideClick: (function(_this) {
            return function(swiper) {
              if (!_this._slideshowZoomer) {
                return _this._onTapEventHandler.apply(_this, arguments);
              }
            };
          })(this),
          onSlideReset: (function(_this) {
            return function(swiper) {
              return _this._isSliding = false;
            };
          })(this),
          onSlideChangeStart: (function(_this) {
            return function(swiper, direction) {
              var indices;
              if (direction === "toNext") {
                direction = "next";
              }
              if (direction === "toPrev") {
                direction = "prev";
              }
              indices = _this._calculateSwiperIndices(swiper, _this._calculateSwiperIndices(swiper, _this._currentIndex)[direction]);
              _this._currentIndex = indices.current;
              _this._renderPage();
              if (isAdPageIndex(indices.current)) {
                return _this._renderAd(_this._getSlideByImageIndex(swiper, indices.current));
              } else if (isAdPageIndex(indices.prev) || isAdPageIndex(indices.next)) {
                return _this._$container.removeClass("adPage");
              }
            };
          })(this),
          onSlideChangeEnd: (function(_this) {
            return function(swiper, direction) {
              var currentIndex, finishItUp, indices;
              if (direction === "toNext") {
                direction = "next";
              }
              if (direction === "toPrev") {
                direction = "prev";
              }
              currentIndex = _this._lastProcessedImageIndex;
              while (currentIndex !== _this._currentIndex) {
                indices = _this._calculateSwiperIndices(swiper, _this._calculateSwiperIndices(swiper, currentIndex)[direction]);
                if (direction === "next") {
                  _this._createSlide(swiper, indices.last).append();
                  swiper.removeSlide(0);
                } else if (direction === "prev") {
                  _this._createSlide(swiper, indices.first).prepend();
                  swiper.removeLastSlide();
                }
                if (isAdPageIndex(indices.prev) || isAdPageIndex(indices.next)) {
                  _this._destroyAd();
                }
                currentIndex = indices.current;
              }
              _this._lastProcessedImageIndex = currentIndex;
              finishItUp = function() {
                swiper.swipeTo(indices.positionOfCurrentIndex, 0, false);
                $(_this).trigger("afterSlide", [_this._images[currentIndex], currentIndex, direction]);
                return _this._isSliding = false;
              };
              if (browser.browser.isIE8() || browser.browser.isIE9()) {
                return setTimeout(function() {
                  return finishItUp();
                });
              } else {
                return finishItUp();
              }
            };
          })(this)
        });
      }
    };

    Slideshow.prototype._reinitSwiper = function(swiper, index) {
      var i, indices, len;
      if (index == null) {
        index = this._currentIndex;
      }
      index = this._currentIndex = fitToNumberRange(index, this._images.length - 1);
      indices = this._calculateSwiperIndices(swiper, index);
      swiper.removeAllSlides();
      for (i = 0, len = indices.length; i < len; i++) {
        index = indices[i];
        this._createSlide(swiper, index).append();
      }
      this._lastProcessedImageIndex = indices.current;
      if (browser.browser.isIE8() || browser.browser.isIE9()) {
        return setTimeout((function(_this) {
          return function() {
            swiper.swipeTo(indices.positionOfCurrentIndex, 0, false);
            _this._renderPage();
            return _this._onResize();
          };
        })(this));
      } else {
        swiper.swipeTo(indices.positionOfCurrentIndex, 0, false);
        this._renderPage();
        return this._onResize();
      }
    };

    Slideshow.prototype._createSlide = function(swiper, index) {
      var slide;
      slide = swiper.createSlide();
      if (isAdPageIndex(index)) {
        $(slide).addClass("adContainer");
      } else {
        $(slide).css("background-image", "url(" + this._options.getImageUrl.call(this, this._images[index], index) + ")");
      }
      slide.getImageIndex = function() {
        return parseFloat(this.data("imageIndex"));
      };
      return slide.data("imageIndex", index);
    };

    Slideshow.prototype._getSlideByImageIndex = function(swiper, imageIndex) {
      return this._$swiperContainer.find(".swiper-slide[data-imageindex='" + imageIndex + "']")[0];
    };

    Slideshow.prototype._calculateSwiperIndices = function(swiper, currentIndex, prerenderedSlides) {
      var i, imageCount, includeAds, index, indicesArray, insertedIndices, j, prevIndex, ref, ref1;
      if (prerenderedSlides == null) {
        prerenderedSlides = this._options.prerenderedSlides;
      }
      includeAds = this._options.ads && this.isDesktop();
      imageCount = this.getImageCount();
      indicesArray = [];
      if (imageCount === 1) {
        prerenderedSlides = 0;
      } else {
        while (prerenderedSlides && imageCount <= prerenderedSlides && prerenderedSlides > 2) {
          prerenderedSlides -= 2;
        }
      }
      if (prerenderedSlides) {
        index = currentIndex;
        for (insertedIndices = i = 1, ref = prerenderedSlides / 2; 1 <= ref ? i <= ref : i >= ref; insertedIndices = 1 <= ref ? ++i : --i) {
          prevIndex = fitToNumberRange(index - 1, imageCount - 1);
          if (includeAds && (prevIndex + 1) % this._options.adInterval === 0) {
            indicesArray.unshift(index = prevIndex + .5);
          } else {
            indicesArray.unshift(index = Math.ceil(prevIndex));
          }
        }
      }
      indicesArray.positionOfCurrentIndex = indicesArray.push(currentIndex) - 1;
      if (prerenderedSlides) {
        index = currentIndex;
        for (insertedIndices = j = 1, ref1 = prerenderedSlides / 2; 1 <= ref1 ? j <= ref1 : j >= ref1; insertedIndices = 1 <= ref1 ? ++j : --j) {
          if (includeAds && (index + 1) % this._options.adInterval === 0) {
            indicesArray.push(index += .5);
          } else {
            indicesArray.push(index = fitToNumberRange(Math.floor(index) + 1, imageCount - 1));
          }
        }
      }
      indicesArray.first = indicesArray[0];
      indicesArray.prev = indicesArray[Math.max(indicesArray.positionOfCurrentIndex - 1, 0)];
      indicesArray.current = indicesArray[indicesArray.positionOfCurrentIndex];
      indicesArray.next = indicesArray[Math.min(indicesArray.positionOfCurrentIndex + 1, indicesArray.length - 1)];
      indicesArray.last = indicesArray[indicesArray.length - 1];
      return indicesArray;
    };

    return Slideshow;

  })();

  SlideshowZoomer = (function() {
    function SlideshowZoomer(slideshow, container, options) {
      var hammertime;
      $.extend(this, options);
      $.extend(this, {
        _container: container,
        _slideshow: slideshow,
        _scale: 1.0,
        _scaleOnPinchStart: 1.0,
        _panStartPosition: {},
        _lastPinchEnd: 0
      });
      this._slideshow._$container.addClass("zoomer");
      this._hammertime = hammertime = new Hammer.Manager(container);
      hammertime.add(new Hammer.Tap({
        event: "doubletap",
        taps: 2,
        posThreshold: 100
      }));
      hammertime.add(new Hammer.Tap({
        event: "singletap"
      }));
      hammertime.add(new Hammer.Pinch({
        event: "pinch",
        enable: true
      }));
      hammertime.add(new Hammer.Pan({
        event: "pan"
      }));
      hammertime.get("doubletap").recognizeWith("singletap");
      hammertime.get("singletap").requireFailure("doubletap");
      hammertime.on("singletap", (function(_this) {
        return function(e) {
          return _this.onTap.call(_this, e);
        };
      })(this));
      hammertime.on("doubletap", (function(_this) {
        return function(e) {
          _this.onDoubleTap.call(_this, e);
          if (_this._slideshow.isFullscreen()) {
            $(e.target).addClass("smoothRepositioning");
            return _this._applyScale(e.target, (_this._scale === 1.0 ? 2.5 : 1.0), e);
          }
        };
      })(this));
      hammertime.on("pinchstart", (function(_this) {
        return function(e) {
          if (_this._slideshow.isFullscreen()) {
            $(e.target).removeClass("smoothRepositioning");
            return _this._scaleOnPinchStart = _this._scale;
          }
        };
      })(this));
      hammertime.on("pinch", (function(_this) {
        return function(e) {
          if (_this._slideshow.isFullscreen()) {
            return _this._applyScale(e.target, _this._scaleOnPinchStart * e.scale, e);
          }
        };
      })(this));
      hammertime.on("pinchend", (function(_this) {
        return function(e) {
          _this.onPinchEnd.call(_this, e);
          if (_this._slideshow.isFullscreen()) {
            $(e.target).addClass("smoothRepositioning");
            _this._lastPinchEnd = new Date().getTime();
            if (_this._scale < 1.0) {
              return _this._applyScale(e.target, 1.0, e);
            } else if (_this._scale > 10.0) {
              return _this._applyScale(e.target, 10.0, e);
            } else if (_this._scale > 1.0) {
              return _this._transformImage(e.target, _this._getCorrectImagePosition(e.target));
            }
          }
        };
      })(this));
      hammertime.on("panstart", (function(_this) {
        return function(e) {
          var ref, tAngleA, tAngleB, tScaleX, tScaleY, tX, tY;
          if (_this._slideshow.isFullscreen()) {
            if (_this._lastPinchEnd < new Date().getTime() - 300) {
              $(e.target).removeClass("smoothRepositioning");
              _this._lastPinchEnd = 0;
              if (_this._scale > 1.0) {
                ref = _this._getTransformMatrix(e.target), tScaleX = ref[0], tAngleA = ref[1], tAngleB = ref[2], tScaleY = ref[3], tX = ref[4], tY = ref[5];
                return _this._transformImage(e.target, _this._panStartPosition = {
                  "x": tX / tScaleX,
                  "y": tY / tScaleY
                });
              }
            }
          }
        };
      })(this));
      hammertime.on("pan", (function(_this) {
        return function(e) {
          if (_this._slideshow.isFullscreen() && _this._lastPinchEnd === 0) {
            if (_this._scale > 1.0) {
              return _this._transformImage(e.target, {
                "x": _this._panStartPosition.x + e.deltaX / _this._scale,
                "y": _this._panStartPosition.y + e.deltaY / _this._scale
              });
            }
          }
        };
      })(this));
      hammertime.on("panend", (function(_this) {
        return function(e) {
          _this.onPanEnd.call(_this, e);
          if (_this._slideshow.isFullscreen() && _this._lastPinchEnd === 0) {
            $(e.target).addClass("smoothRepositioning");
            if (_this._scale > 1.0) {
              return _this._transformImage(e.target, _this._getCorrectImagePosition(e.target));
            }
          }
        };
      })(this));
    }

    SlideshowZoomer.prototype.destroy = function() {
      if (this._hammertime) {
        return this._hammertime.destroy();
      }
    };

    SlideshowZoomer.prototype.onTap = function() {};

    SlideshowZoomer.prototype.onDoubleTap = function() {};

    SlideshowZoomer.prototype.onPinchEnd = function() {};

    SlideshowZoomer.prototype.onPanEnd = function() {};

    SlideshowZoomer.prototype._applyScale = function(el, scale, e) {
      var $container, $el;
      $container = $(this._container);
      $el = $(el);
      scale = Math.max(scale, .3);
      if (scale !== 1.0 && this._scale === 1.0) {
        $el.addClass(this._slideshow._swiper.params.noSwipingClass);
        this._slideshow._$container.addClass("hideNonActiveSlides");
        if (scale === 2.5 && this._scale === 1.0) {
          this._transformImage(el, $.extend(this._getCenterImagePosition(el, scale, e.center), {
            "scale": scale
          }));
        } else {
          this._transformImage(el, $.extend(this._getScaledImagePosition(el, this._scale, scale, e.center), {
            "scale": scale
          }));
        }
      } else if (scale === 1.0 && this._scale !== 1.0) {
        this._transformImage(el, {
          "scale": scale,
          "x": 0,
          "y": 0
        }, (function(_this) {
          return function() {
            $el.removeClass(_this._slideshow._swiper.params.noSwipingClass);
            return _this._slideshow._$container.removeClass("hideNonActiveSlides");
          };
        })(this));
      } else {
        this._transformImage(el, $.extend(this._getScaledImagePosition(el, this._scale, scale, e.center), {
          "scale": scale
        }));
      }
      return this._scale = scale;
    };

    SlideshowZoomer.prototype._getCorrectImagePosition = function(el, scale, x, y, width, height) {
      var $container, $el, options, ref, tAngleA, tAngleB, tScaleX, tScaleY, tX, tY;
      options = {};
      $container = $(this._container);
      $el = $(el);
      ref = this._getTransformMatrix(el), tScaleX = ref[0], tAngleA = ref[1], tAngleB = ref[2], tScaleY = ref[3], tX = ref[4], tY = ref[5];
      if (scale == null) {
        scale = this._scale;
      }
      x = (x != null ? x * scale : tX) - this._getImageScaleOffset(el, scale).x;
      y = (y != null ? y * scale : tY) - this._getImageScaleOffset(el, scale).y;
      width = $el.width() * scale;
      height = $el.height() * scale;
      options.x = (function() {
        switch (false) {
          case !(x > 0):
            return this._getImageScaleOffset(el, scale).x / scale;
          case !(x + width < $container.width()):
            return ((this._getImageScaleOffset(el, scale).x + $container.width()) - width) / scale;
        }
      }).call(this);
      options.y = (function() {
        switch (false) {
          case !(y > 0):
            return this._getImageScaleOffset(el, scale).y / scale;
          case !(y + height < $container.height()):
            return ((this._getImageScaleOffset(el, scale).y + $container.height()) - height) / scale;
        }
      }).call(this);
      return options;
    };

    SlideshowZoomer.prototype._getScaledImagePosition = function(el, oldScale, newScale, center) {
      var $el, newPointerX, newPointerY, pointerX, pointerY, ratio;
      return;
      $el = $(el);
      pointerX = center.x - $el.offset().left;
      pointerY = center.y - $el.offset().top;
      ratio = newScale / oldScale;
      newPointerX = pointerX * ratio;
      newPointerY = pointerY * ratio;
      if (ratio !== 1.0) {
        return {
          "x": this._getImageScaleOffset(el, newScale).x / newScale - (newPointerX - center.x) / newScale,
          "y": this._getImageScaleOffset(el, newScale).y / newScale - (newPointerY - center.y) / newScale
        };
      }
    };

    SlideshowZoomer.prototype._getCenterImagePosition = function(el, scale, center) {
      var $container, $el, correctImagePosition, pointerX, pointerY, ref, ref1, x, y;
      $container = $(this._container);
      $el = $(el);
      pointerX = center.x - $el.offset().left;
      pointerY = center.y - $el.offset().top;
      x = $container.width() / 2 - $el.width() / 2;
      y = $container.height() / 2 - $el.height() / 2;
      x -= pointerX - $el.width() / 2;
      y -= pointerY - $el.height() / 2;
      correctImagePosition = this._getCorrectImagePosition(el, scale, x, y);
      return {
        "x": (ref = correctImagePosition.x) != null ? ref : x,
        "y": (ref1 = correctImagePosition.y) != null ? ref1 : y
      };
    };

    SlideshowZoomer.prototype._transformImage = function(el, arg, callback) {
      var $el, hasChanged, options, scale, transformMatrix, x, y;
      scale = arg.scale, x = arg.x, y = arg.y;
      if (callback == null) {
        callback = function() {};
      }
      options = {};
      $el = $(el);
      if (scale == null) {
        scale = this._scale;
      }
      transformMatrix = this._getTransformMatrix(el);
      transformMatrix[0] = transformMatrix[3] = scale;
      transformMatrix[1] = transformMatrix[2] = 0;
      if (x != null) {
        transformMatrix[4] = x * scale;
        options.left = this._getTransformMatrix($el.parent())[4] * (-1);
      }
      if (y != null) {
        transformMatrix[5] = y * scale;
        options.top = this._getTransformMatrix($el.parent())[5] * (-1);
      }
      options["transform"] = options["-webkit-transform"] = "matrix(" + transformMatrix.join(", ") + ")";
      hasChanged = ($el.css("transform") || $el.css("-webkit-transform") || "").replace(/\s/g, "") !== options["transform"].replace(/\s/g, "");
      if (hasChanged) {
        $el.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", (function(_this) {
          return function(e) {
            return callback.call(_this);
          };
        })(this));
        return setTimeout((function(_this) {
          return function() {
            return $el.css(options);
          };
        })(this));
      } else {
        return callback.call(this);
      }
    };

    SlideshowZoomer.prototype._getTransformMatrix = function(el) {
      return ($(el).css("transform") || $(el).css("-webkit-transform")).split(/[,\(\)]/).slice(1, -1).map(parseFloat);
    };

    SlideshowZoomer.prototype._getImageScaleOffset = function(el, scale) {
      var $el;
      $el = $(el);
      return {
        "x": ($el.width() * scale - $el.width()) / 2,
        "y": ($el.height() * scale - $el.height()) / 2
      };
    };

    return SlideshowZoomer;

  })();

  exports.Slideshow = Slideshow;

});
define('framework/slideshow/templates/links', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#if articleLinkUri}}\n    <p class=\"relatedArticle\">\n        <a href=\"{{{articleLinkUri}}}\"><span class=\"NnIcon linkIcon\"></span><span class=\"title\">{{translate \"Artikel zur Bildstrecke\"}}</span></a> {{{articleLinkText}}}\n    </p>\n{{/if}}\n\n{{#if slideshowOverviewUri}}\n    <p class=\"slideshowOverview\">\n        <a href=\"{{{slideshowOverviewUri}}}\"><span class=\"NnIcon slideshowIcon\"></span><span class=\"title\">{{translate \"Alle Bildstrecken\"}}</span></a>\n    </p>\n{{/if}}");

});
define('framework/slideshow/templates/pagination', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("{{#each images}}<span class=\"bubble\"></span>{{/each}}");

});
define('framework/slideshow/templates/paging', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<span class=\"index\">{{currentImage}}</span> <span class=\"separator\"></span> {{totalImages}}");

});
define('framework/slideshow/templates/pictureCaption', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div>\n    {{#if slideshowTitle}}\n        <h4>\n            {{#displayMediaType}}\n                <span class=\"NnIcon {{mediatype}}Icon\"></span>\n            {{else}}\n                {{#if keyword}}\n                    <span>{{keyword}}</span>\n                {{else}}\n                    {{#if decoration}}\n                        <span style=\"color: #{{decoration.color}}\">{{decoration.name}}</span>\n                    {{else}}\n                        <span style=\"color: #{{genre.color}}\">{{genre.name}}</span>\n                    {{/if}}\n                {{/if}}\n            {{/displayMediaType}}\n                {{slideshowTitle}}\n        </h4>\n    {{/if}}\n\n    {{#if title}}\n        <b>{{title}}</b>\n    {{/if}}\n\n    {{{caption}}} <span class=\"annotation\">{{annotation}}</span>\n\n    {{#if isFirstPicture}}\n        <a class=\"pictures\">({{imageCount}} {{translate \"Bilder\"}})</a>\n    {{/if}}\n\n    {{#if linkUrl}}\n        {{#if linkText}}\n            <a href=\"{{linkUrl}}\" target=\"_blank\" class=\"link\"><span class =\"NnIcon linkIcon\"></span>{{linkText}}</a>\n        {{/if}}\n    {{/if}}\n\n    {{#if shareUrl}}\n        <div class=\"socialMedia\">\n            <iframe src=\"//platform.twitter.com/widgets/tweet_button.html?lang={{language}}&amp;text={{shareText}}&amp;via={{shareTwitterVia}}&amp;url={{shareUrl}}\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:20px;\" allowTransparency=\"true\"></iframe>\n            <iframe src=\"//www.facebook.com/plugins/like.php?locale={{locale}}&amp;href={{shareUrl}}&amp;width&amp;layout=button_count&amp;action=recommend&amp;show_faces=false&amp;share=false&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>\n        </div>\n    {{/if}}\n</div>");

});
define('framework/slideshow/templates/pictureTitles', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div>\n    <b><span class=\"NnIcon slideshowIcon\"></span> {{title}}</b>\n</div>");

});
define('framework/slideshow/templates/slideshow', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"NnSlideshowContainer\">\n    <div class=\"NnSlideshow\">\n        <div class=\"header\">\n            <div class=\"backButton\"><a>{{translate \"Zurück\"}}</a></div>\n\n            <div class=\"row title\">\n                <h1 class=\"cell\"></h1>\n            </div>\n\n            <div class=\"row subtitle\">\n                <h2 class=\"cell\"></h2>\n            </div>\n\n            <div class=\"paging\"></div>\n\n            <a class=\"closeButton\"></a>\n        </div>\n\n        <div class=\"row body\">\n            <div class=\"cell\">\n                <div class=\"nav\">\n                    <a class=\"back\"></a>\n                    <a class=\"NnIcon enlarge\"></a>\n                    <a class=\"forward\"></a>\n                </div>\n\n                <div class=\"swiper-container\">\n                    {{> fullscreenLoader style=\"transparent\" visible=\"true\"}}\n                    <div class=\"swiper-wrapper\"></div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row footerContainer\">\n            <div class=\"footer cell\">\n                <div class=\"pagination\"></div>\n                \n                <div class=\"footerWrapper\">\n                    <div class=\"paging\"></div>\n                    <div class=\"caption\"></div>\n                    <div class=\"links\"></div>\n                    <div class=\"nav\">\n                        <a class=\"back\"></a>\n                        <a class=\"forward\"></a>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"spacer row\">\n            <div class=\"cell\"></div>\n        </div>\n    </div>\n</div>");

});
define('framework/slideshow/templates/twistedFooter', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div class=\"footer cell\">\n    <div class=\"footerWrapper\">\n        <div class=\"paging\"></div>\n        <div class=\"caption\"></div>\n        <div class=\"links\"></div>\n    </div>\n\n    <div class=\"pagination\"></div>\n</div>");

});
define('framework/smartAppBanner/box', ['exports'], function (exports) {

	'use strict';

	exports['default'] = Handlebars.compile("<div id=\"smartAppBanner\">\n    <div class=\"iconClose\">\n        <a href=\"javascript:void(0);\">\n            &times;\n        </a>\n    </div>\n    <div class=\"customerLogo\">\n        <img src=\"{{artworkUrl512}}\">\n    </div>\n    <div class=\"description\">\n        <p>{{trackName}}</p>\n        <div class=\"starRating\">\n        {{!-- Each loop times helper over rating Stars here --}}\n        {{#times averageUserRating}}\n            <span class=\"NnIcon starIcon {{isFilled}}\"></span>\n        {{/times}}\n        </div>\n        <div class=\"price\">{{translate \"Preis\"}} - {{formattedPrice}}</div>\n    </div>\n    <div class=\"linkStore\">\n        <a href=\"{{trackViewUrl}}\" target=\"_blank\" >{{translate \"Öffnen\"}}</a>\n    </div>\n</div>    ");

});
define('framework/smartAppBanner/module', ['exports', 'framework/config', 'framework/browser', 'framework/translations', 'framework/LocalStorageQueue', 'framework/handlebars/module', 'framework/statistics'], function (exports, config, browser, translations, LocalStorageQueue, handlebars__module, statistics) {

  'use strict';

  var addToSmartbannerQueue, buildQueue, clearQueueinHours, initApp, loadApi, module, removeMe, showBanner, smartAppBanner, smartAppBannerQueue;

  module = {};

  module.config = null;

  handlebars__module.handlebars.init();

  smartAppBannerQueue = new LocalStorageQueue.LocalStorageQueue("Framework.smartAppBanner");

  initApp = function(container, options, callback) {
    var appId;
    appId = config.config.customers[config.config.currentCustomer].appleAppId;
    translations.translations.configure({
      language: config.config.language
    });
    if (showBanner(appId, options.hoursUntilExpiration)) {
      return loadApi(appId).then(function(payload) {
        var template;
        statistics.statistics.trackGtmEvent("smartAppBanner", {
          "isDisplayed": true
        });
        template = require("framework/smartAppBanner/box")["default"](payload.results[0]);
        $(container).before(template);
        addToSmartbannerQueue(appId);
        return callback();
      });
    }
  };

  loadApi = function(appId) {
    return new RSVP.Promise(function(resolve, reject) {
      return $.ajax({
        url: "http://itunes.apple.com/ch/lookup?id=" + appId + "&lang=" + config.config.language + "&callback=?",
        type: "get",
        dataType: "json",
        error: function(jqXHR, textStatus, error) {
          return reject();
        },
        success: function(payload, textStatus, jqXHR) {
          return resolve(payload);
        }
      });
    });
  };

  showBanner = function(appId, hoursUntilExpiration) {
    var displayedApps, queueIndex, queueObject;
    displayedApps = smartAppBannerQueue.getQueue();
    queueObject = null;
    queueIndex = 0;
    displayedApps.filter(function(element, index) {
      if (element.id === appId) {
        queueObject = element;
        return queueIndex = index;
      }
    });
    if (queueObject == null) {
      return true;
    } else {
      if (hoursUntilExpiration != null) {
        return clearQueueinHours(hoursUntilExpiration, queueObject, queueIndex);
      } else {
        return !(appId === queueObject.id);
      }
    }
  };

  buildQueue = function(appId) {
    var myObject, today;
    today = new Date().getTime();
    myObject = {
      id: appId,
      date: today
    };
    return smartAppBannerQueue.add(myObject);
  };

  clearQueueinHours = function(hoursUntilExpiration, queueObject, queueIndex) {
    var now, refreshTimeInMillis, timeDiff;
    refreshTimeInMillis = hoursUntilExpiration * 60 * 60 * 1000;
    now = new Date().getTime();
    timeDiff = now - queueObject.date;
    if (timeDiff > refreshTimeInMillis) {
      smartAppBannerQueue.removeItem(queueIndex);
      return true;
    }
  };

  addToSmartbannerQueue = function(appId) {
    $(".iconClose").on("click", function(e) {
      e.preventDefault();
      statistics.statistics.trackGtmEvent("smartAppBanner", {
        "clickedClose": true
      });
      buildQueue(appId);
      return removeMe();
    });
    return $(".linkStore a").on("click", function(e) {
      statistics.statistics.trackGtmEvent("smartAppBanner", {
        "clickedAppStore": true
      });
      buildQueue(appId);
      return removeMe();
    });
  };

  removeMe = function() {
    $("#smartAppBanner").remove();
    return typeof smartAppBanner.afterRemove === "function" ? smartAppBanner.afterRemove() : void 0;
  };

  smartAppBanner = {
    afterRemove: null,
    init: function(container, options, callback) {
      if (browser.browser.isiPhoneOriPod()) {
        if (config.config.isNativeApp === false) {
          if (options.afterRemove != null) {
            this.afterRemove = options.afterRemove;
          }
          return initApp(container, options, callback);
        }
      } else {

      }
    }
  };

  exports.smartAppBanner = smartAppBanner;

});
define('framework/socialMedia/socialMedia', ['exports', 'framework/jquery', 'framework/store', 'framework/translations'], function (exports, __dep0__, store, translations) {

  'use strict';

  var module, socialMedia;

  module = {};

  module.config = {};

  socialMedia = {
    configure: function(config) {
      $.extend(module.config, config);
      translations.translations.configure(module.config.language);
      return store.store.configure({
        apiUrl: module.config.apiUrl
      });
    },
    insert: function(targetEl, articleId, options) {
      options = $.extend({}, options);
      return ReactDOM.render(React.createElement(require("framework/socialMedia/SocialMediaContainer/component").SocialMediaContainer, {
        articleId: articleId,
        isAggregated: options.isAggregated || false,
        dialogBox: options.dialogBox || null,
        layoutType: options.layoutType || "horizontal",
        env: module.config.env,
        apiUrl: module.config.apiUrl,
        customSocialInfo: options.customSocialInfo,
        router: options.router
      }), targetEl);
    },
    insertLikeButton: function(targetEl, options) {
      options = $.extend({}, options);
      return ReactDOM.render(React.createElement(require("framework/socialMedia/SocialMediaLikeButton/component").SocialMediaLikeButton, {
        types: options.types,
        customerName: module.config.fullName,
        facebookPageId: module.config.facebook.pageId,
        twitterName: module.config.twitter.accountName
      }), targetEl);
    }
  };

  exports.socialMedia = socialMedia;

});
define('framework/socialMedia/SocialMediaBox/component', ['exports', 'framework/string'], function (exports) {

  'use strict';

  var SocialMediaBox;

  SocialMediaBox = React.createClass({
    getInitialState: function() {
      return {
        communities: [],
        layoutType: "horizontal"
      };
    },
    componentWillMount: function() {
      return this.testingFeed = [
        {
          type: "comment",
          count: 9999
        }, {
          type: "dark",
          count: 0
        }, {
          type: "whatsapp",
          count: 9999
        }, {
          type: "share",
          count: 9999
        }, {
          type: "facebook",
          count: 9999
        }, {
          type: "twitter",
          count: 9999
        }
      ];
    },
    componentDidMount: function() {
      var aggregatedShare, communities, layoutType, totalShareCount;
      layoutType = this.props.layoutType;
      totalShareCount = 0;
      communities = this.props.communities.filter((function(_this) {
        return function(el) {
          if (el.type !== "comment") {
            totalShareCount += el.count;
          }
          return el.count = _this.kilonize(el.count);
        };
      })(this));
      if (this.props.isAggregated) {
        communities = this.props.communities.filter(function(el) {
          if (el.type === "comment") {
            return el.count > 0;
          }
        });
        if (!(this.props.communities[0].type === "comment" && this.props.communities.length === 1)) {
          aggregatedShare = {
            type: "shareV",
            count: this.kilonize(totalShareCount)
          };
          communities.push(aggregatedShare);
        }
      } else {
        communities = this.props.communities.filter(function(el) {
          return el.type !== "dark";
        });
        if (this.props.env === "desktop") {
          communities = communities.filter(function(el) {
            return el.type !== "whatsapp";
          });
          if (layoutType === "horizontal") {
            communities = communities.filter(function(el) {
              return el.type !== "comment";
            });
          }
        }
      }
      return this.setState({
        communities: communities,
        layoutType: layoutType
      });
    },
    remove: function() {
      return ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
    },
    kilonize: function(count) {
      if (count >= 10000) {
        return Math.round(count / 1000) + "k";
      } else {
        return count;
      }
    },
    render: function() {
      return require("framework/socialMedia/SocialMediaBox/template")["default"].apply(this);
    }
  });

  exports.SocialMediaBox = SocialMediaBox;

});
define('framework/socialMedia/SocialMediaBox/template', ['exports', 'framework/socialMedia/SocialMediaBoxItem/component'], function (exports, component) {

    'use strict';

    function repeatCommunity1(community, communityIndex) {
        return React.createElement(component.SocialMediaBoxItem, {
            'name': community.name,
            'count': community.count,
            'type': community.type,
            'url': community.url,
            'description': community.description,
            'shareTypeId': community.share_type_id,
            'title': community.title,
            'via': community.via,
            'articleId': this.props.articleId,
            'customSocialInfo': this.props.customSocialInfo,
            'dialogBox': this.props.dialogBox,
            'shareBox': this.props.shareBox,
            'layoutType': this.props.layoutType,
            'isAggregated': this.props.isAggregated,
            'apiUrl': this.props.apiUrl,
            'env': this.props.env,
            'router': this.props.router,
            'key': communityIndex
        });
    }
    exports['default'] = function () {
        return React.createElement('div', { 'className': 'NnSocialMediaBox' }, React.createElement('div', {}, React.createElement.apply(this, [
            'ul',
            { 'className': this.state.layoutType + ' ' + this.props.env + ' ' + (this.props.isAggregated ? 'aggregated' : '') },
            _.map(this.state.communities, repeatCommunity1.bind(this))
        ])));
    };

});
define('framework/socialMedia/SocialMediaBoxItem/component', ['exports', 'framework/facebook'], function (exports, facebook) {

  'use strict';

  var SocialMediaBoxItem;

  SocialMediaBoxItem = React.createClass({
    twitterUrl: "https://twitter.com/intent/tweet?",
    componentDidMount: function() {
      var $dialog, $shareBox, el, that;
      el = $(ReactDOM.findDOMNode(this));
      $dialog = $(this.props.dialogBox);
      $shareBox = $(this.props.shareBox);
      that = this;
      return el.find("a").on("click", function(e) {
        if (that.props.isAggregated) {
          $dialog.find(">div").html($shareBox.find(">div").clone(true, true));
          $dialog.addClass("shareBox");
          $dialog.show();
          e.stopPropagation();
          return $(this).trigger("openedShareDialog");
        } else {
          e.stopPropagation();
          return that.share($(e.delegateTarget), that.props.type, that.props.url);
        }
      });
    },
    share: function(el, type, url) {
      var articleUrl, customInfo;
      window.dataLayer.push({
        event: "tracksocial",
        socialNetwork: type,
        socialAction: "click",
        socialTarget: this.props.env === "mobile" ? location.protocol + "//" + location.hostname + "/articles/" + this.props.articleId : location.protocol + "//" + location.hostname + "/" + this.props.articleId
      });
      if (type === "comment") {
        if (this.props.env === "mobile") {
          $("#dialog").hide();
          if (this.props.router != null) {
            this.props.router.transitionTo("/articles/" + this.props.articleId + "/comments");
          } else {
            url = "/articles/" + this.props.articleId + "/comments";
          }
        } else {
          if (this.props.dialogBox == null) {
            url = "/" + this.props.articleId + "#mostPopularComment";
          } else {
            url = "#mostPopularComment";
          }
        }
      } else {
        $.ajax({
          url: this.props.apiUrl + "/communities/" + this.props.articleId + "/counts/" + this.props.shareTypeId,
          type: "POST"
        });
        switch (type) {
          case "share":
            url = $("<textarea/>").html(url).text();
            break;
          case "whatsapp":
            url = "whatsapp://send?text=" + url;
            break;
          case "facebook":
            customInfo = {
              method: "share",
              href: url
            };
            facebook.facebook.init().then(function() {
              return FB.ui(customInfo);
            });
            return;
          case "twitter":
            articleUrl = url;
            url = this.twitterUrl;
            url += "text=" + this.props.title + "&url=" + articleUrl + "&via=" + this.props.via;
            el.attr("target", "blank");
            break;
        }
      }
      return el.attr("href", url);
    },
    render: function() {
      return require("framework/socialMedia/SocialMediaBoxItem/template")["default"].apply(this);
    }
  });

  exports.SocialMediaBoxItem = SocialMediaBoxItem;

});
define('framework/socialMedia/SocialMediaBoxItem/template', ['exports'], function (exports) {

    'use strict';

    exports['default'] = function () {
        return React.createElement('li', {}, React.createElement('a', {
            'href': 'javascript:void(0)',
            'name': this.props.type
        }, React.createElement('span', { 'className': 'button ' + this.props.type }, React.createElement('span', { 'className': 'NnIcon ' + this.props.type + 'Icon' }), React.createElement('span', {}, this.props.name), React.createElement('span', {}, this.props.count), React.createElement('span', {}, this.props.name)), React.createElement('span', {}, this.props.description)));
    };

});
define('framework/socialMedia/SocialMediaContainer/component', ['exports', 'framework/store'], function (exports, store) {

  'use strict';

  var SocialMediaContainer;

  SocialMediaContainer = React.createClass({
    getInitialState: function() {
      return {
        communities: [],
        isLoading: true,
        dialogBox: null,
        shareBox: null
      };
    },
    componentDidMount: function() {
      var $dialog, $el, $shareBox;
      $el = $(ReactDOM.findDOMNode(this));
      $dialog = $(this.props.dialogBox);
      $shareBox = $el.find(".shareBox");
      return store.store.load("communities", {
        id: this.props.articleId
      }).then((function(_this) {
        return function(communitiesPayload) {
          return _this.setState({
            communities: communitiesPayload.payload.communities,
            dialogBox: $dialog,
            shareBox: $shareBox
          }, function() {
            return this.setState({
              isLoading: false
            });
          });
        };
      })(this));
    },
    render: function() {
      return require("framework/socialMedia/SocialMediaContainer/template")["default"].apply(this);
    }
  });

  exports.SocialMediaContainer = SocialMediaContainer;

});
define('framework/socialMedia/SocialMediaContainer/template', ['exports', 'framework/loader/bubbleLoader', 'framework/socialMedia/SocialMediaBox/component'], function (exports, bubbleLoader, component) {

    'use strict';

    exports['default'] = function () {
        return React.createElement('div', { 'className': 'NnSocialMediaContainer' }, this.state.isLoading ? React.createElement('div', { 'dangerouslySetInnerHTML': { __html: bubbleLoader['default']() } }) : null, this.state.communities.length ? React.createElement(component.SocialMediaBox, {
            'communities': this.state.communities,
            'isAggregated': this.props.isAggregated,
            'layoutType': this.props.layoutType,
            'dialogBox': this.state.dialogBox,
            'shareBox': this.state.shareBox,
            'articleId': this.props.articleId,
            'apiUrl': this.props.apiUrl,
            'env': this.props.env,
            'router': this.props.router
        }) : null, this.props.isAggregated ? React.createElement('div', { 'className': 'shareBox' }, React.createElement('div', {}, React.createElement('a', { 'className': 'iconClose' }, React.createElement('span', { 'className': 'NnIcon closeIcon' })), React.createElement('h1', {}), React.createElement('h2', {}), React.createElement('div', {}, this.state.communities.length ? React.createElement(component.SocialMediaBox, {
            'communities': this.state.communities,
            'isAggregated': !this.props.isAggregated,
            'layoutType': 'vertical',
            'articleId': this.props.articleId,
            'apiUrl': this.props.apiUrl,
            'env': this.props.env,
            'router': this.props.router
        }) : null))) : null);
    };

});
define('framework/socialMedia/SocialMediaLikeButton/component', ['exports', 'framework/translations'], function (exports, translations) {

  'use strict';

  var SocialMediaLikeButton;

  SocialMediaLikeButton = React.createClass({
    getInitialState: function() {
      return {
        types: []
      };
    },
    componentDidMount: function() {
      var i, len, likeButtonType, likeButtonTypes, ref, type;
      likeButtonTypes = [];
      ref = this.props.types;
      for (i = 0, len = ref.length; i < len; i++) {
        type = ref[i];
        likeButtonType = {
          name: type,
          customerName: this.props.customerName
        };
        switch (type) {
          case "facebook":
            $.extend(likeButtonType, {
              facebookPageId: this.props.facebookPageId
            });
            likeButtonTypes.push(likeButtonType);
            break;
          case "twitter":
            $.extend(likeButtonType, {
              twitterName: this.props.twitterName
            });
            likeButtonTypes.push(likeButtonType);
        }
      }
      return this.setState({
        types: likeButtonTypes
      });
    },
    render: function() {
      return require("framework/socialMedia/SocialMediaLikeButton/template")["default"].apply(this);
    }
  });

  exports.SocialMediaLikeButton = SocialMediaLikeButton;

});
define('framework/socialMedia/SocialMediaLikeButton/template', ['exports', 'framework/socialMedia/SocialMediaLikeButtonItem/component'], function (exports, component) {

    'use strict';

    function repeatType1(type, typeIndex) {
        return React.createElement(component.SocialMediaLikeButtonItem, {
            'key': typeIndex,
            'type': type
        });
    }
    exports['default'] = function () {
        return React.createElement.apply(this, [
            'div',
            {},
            _.map(this.state.types, repeatType1.bind(this))
        ]);
    };

});
define('framework/socialMedia/SocialMediaLikeButtonItem/component', ['exports', 'framework/translations'], function (exports, translations) {

  'use strict';

  var SocialMediaLikeButtonItem;

  SocialMediaLikeButtonItem = React.createClass({
    getInitialState: function() {
      return {
        description: "",
        link: ""
      };
    },
    componentDidMount: function() {
      var description, link;
      switch (this.props.type.name) {
        case "facebook":
          description = this.props.type.customerName + " " + (translations.translations.translate('auf Facebook'));
          link = "http://www.facebook.com/" + this.props.type.facebookPageId;
          break;
        case "twitter":
          description = this.props.type.customerName + " " + (translations.translations.translate('auf Twitter'));
          link = "http://www.twitter.com/" + this.props.type.twitterName;
      }
      return this.setState({
        description: description,
        link: link
      });
    },
    render: function() {
      return require("framework/socialMedia/SocialMediaLikeButtonItem/template")["default"].apply(this);
    }
  });

  exports.SocialMediaLikeButtonItem = SocialMediaLikeButtonItem;

});
define('framework/socialMedia/SocialMediaLikeButtonItem/template', ['exports'], function (exports) {

    'use strict';

    exports['default'] = function () {
        return React.createElement('div', { 'className': 'NnLikeButton' }, React.createElement('a', {
            'href': this.state.link,
            'target': '_blank'
        }, React.createElement('span', { 'className': 'button ' + this.props.type.name }, React.createElement('span', { 'className': 'NnIcon ' + this.props.type.name + 'Icon' }), React.createElement('span', {}, this.state.description))));
    };

});
define('framework/statistics', ['exports', 'framework/utils'], function (exports, utils) {

  'use strict';

  var gaDimensionMappings, hitPixel, initedPromise, module, statistics;

  module = {
    config: null,
    providersDefaultParams: null
  };

  initedPromise = RSVP.defer();

  gaDimensionMappings = {
    "device_characteristics": "dimension1",
    "app_mode": "dimension2",
    "page_type": "dimension3",
    "parent_category": "dimension4",
    "sub_category": "dimension5",
    "version": "dimension6",
    "ad_blocker": "dimension7"
  };

  hitPixel = function(url) {
    var image;
    image = new Image;
    return image.src = utils.utils.addRnd(url);
  };

  statistics = {
    init: function(config, providersDefaultParams) {
      var customVar, customVars, i, j, k, len, len1, ref, ref1, tracker;
      module.config = config;
      module.providersDefaultParams = providersDefaultParams;
      if (module.config.ga != null) {
        ref = module.config.ga.trackers;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          tracker = ref[i];
          ga("create", {
            trackingId: tracker.id,
            cookieDomain: "auto",
            name: i + 1
          });
          if (customVars = (ref1 = module.providersDefaultParams["google_analytics"]) != null ? ref1.customVars : void 0) {
            for (k = 0, len1 = customVars.length; k < len1; k++) {
              customVar = customVars[k];
              if (gaDimensionMappings[customVar.name] != null) {
                ga((i + 1) + ".set", gaDimensionMappings[customVar.name], customVar.value);
              }
            }
          }
        }
      }
      if ((module.config.gtm != null) && module.config.gtm.id) {
        (window.dataLayer != null ? window.dataLayer : window.dataLayer = []).push({
          "gtm.start": new Date().getTime(),
          "event": "gtm.js"
        });
        return $.loadExternalScript("//www.googletagmanager.com/gtm.js?id=" + module.config.gtm.id).then(function() {
          return initedPromise.resolve();
        });
      } else {
        return initedPromise.resolve();
      }
    },
    trackPageView: function(pathname, providers, customWemfUrl, providersAdditionalParams) {
      return initedPromise.promise.then(function() {
        var _provider, additionalParams, additionalParamsKey, customVar, i, j, k, key, len, len1, options, provider, ref, ref1, results, tracker, url, value;
        results = [];
        for (j = 0, len = providers.length; j < len; j++) {
          provider = providers[j];
          _provider = $.extend({}, provider);
          for (additionalParamsKey in providersAdditionalParams) {
            additionalParams = providersAdditionalParams[additionalParamsKey];
            if (additionalParamsKey === _provider.provider) {
              $.extend(_provider, additionalParams);
            }
          }
          switch (_provider.provider) {
            case "gtm":
              options = $.extend({}, {
                "event": "pageChange",
                "page": pathname
              }, _provider);
              delete options.provider;
              delete options.id;
              ref = module.providersDefaultParams["gtm"];
              for (key in ref) {
                value = ref[key];
                options[key] = $.isFunction(value) ? value() : value;
              }
              if ((module.config.gtm != null) && module.config.gtm.id) {
                results.push(window.dataLayer.push(options));
              } else {
                results.push(void 0);
              }
              break;
            case "google_analytics":
              options = {
                "page": pathname
              };
              ref1 = _provider.customVars;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                customVar = ref1[k];
                if (gaDimensionMappings[customVar.name] != null) {
                  options[gaDimensionMappings[customVar.name]] = customVar.value;
                }
              }
              if (module.config.ga != null) {
                results.push((function() {
                  var l, len2, ref2, results1;
                  ref2 = module.config.ga.trackers;
                  results1 = [];
                  for (i = l = 0, len2 = ref2.length; l < len2; i = ++l) {
                    tracker = ref2[i];
                    results1.push(ga((i + 1) + ".send", "pageview", options));
                  }
                  return results1;
                })());
              } else {
                results.push(void 0);
              }
              break;
            case "wemf":
              if (module.config.env === "desktop") {
                url = _provider.desktop_url;
              } else if (_provider.webapp_url) {
                url = _provider.webapp_url;
              } else {
                url = _provider.url;
              }
              if ($.type(customWemfUrl) === "string" && customWemfUrl) {
                url = url.slice(0, url.lastIndexOf("/")).concat("/", customWemfUrl);
              }
              results.push(hitPixel(url));
              break;
            case "webseismo":
              if (module.config.env === "desktop") {
                url = _provider.url_desktop;
              } else if (_provider.url_webapp) {
                url = _provider.url_webapp;
              } else {
                url = _provider.url;
              }
              results.push(hitPixel(url));
              break;
            default:
              results.push(void 0);
          }
        }
        return results;
      });
    },
    trackGoogleAnalyticsEvent: function(category, action, label, value) {
      var i, j, len, ref, results, tracker;
      if (module.config.ga != null) {
        ref = module.config.ga.trackers;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          tracker = ref[i];
          results.push(ga((i + 1) + ".send", "event", category, action, label, value));
        }
        return results;
      }
    },
    trackGtmEvent: function(name, options) {
      if (options == null) {
        options = {};
      }
      if ((module.config.gtm != null) && module.config.gtm.id) {
        return window.dataLayer.push($.extend({}, {
          "event": name
        }, options));
      }
    }
  };

  exports.statistics = statistics;

});
define('framework/store', ['exports'], function (exports) {

  'use strict';

  var StreamWrapper, embeddedRecordMappings, getAtPath, module, store;

  module = {};

  module.config = {
    apiUrl: "/api",
    requestTimeout: 5000,
    stream: true
  };

  embeddedRecordMappings = {
    "fronts": "page_elements",
    "lists": "page_elements",
    "categories": "page_elements",
    "page_elements": ["articles", "slideshow_overviews.slideshows"],
    "articles": ["top_element.slideshow", "inline_elements.slideshow", "article_elements.slideshow"],
    "articleElements": "slideshow"
  };

  getAtPath = function(path, payload, callback) {
    var _payload, i, j, len, pathPart, pathParts, results;
    pathParts = path.split(".");
    results = [];
    for (i = j = 0, len = pathParts.length; j < len; i = ++j) {
      pathPart = pathParts[i];
      if (payload != null) {
        if ($.isArray(payload[pathPart])) {
          results.push((function() {
            var k, len1, ref, results1;
            ref = payload[pathPart];
            results1 = [];
            for (k = 0, len1 = ref.length; k < len1; k++) {
              _payload = ref[k];
              if (i < pathParts.length - 1) {
                results1.push(getAtPath(pathParts.slice(i + 1).join("."), _payload, callback));
              } else {
                results1.push(callback(pathParts[pathParts.length - 1], _payload));
              }
            }
            return results1;
          })());
        } else if (payload[pathPart] != null) {
          if (i === pathParts.length - 1) {
            results.push(callback(pathPart, payload[pathPart]));
          } else {
            results.push(payload = payload[pathPart]);
          }
        } else {
          break;
        }
      }
    }
    return results;
  };

  StreamWrapper = (function() {
    StreamWrapper.prototype.stream = null;

    StreamWrapper.prototype.events = {};

    StreamWrapper.prototype.queue = {};

    function StreamWrapper(stream1) {
      this.stream = stream1;
    }

    StreamWrapper.prototype.node = function(node, callback) {
      return this.on("node-" + node, callback);
    };

    StreamWrapper.prototype.done = function(callback) {
      return this.on("done", callback);
    };

    StreamWrapper.prototype.on = function(event, fn) {
      var base, ref;
      while (((ref = this.queue[event]) != null ? ref.length : void 0) > 0) {
        fn.apply(this, $.makeArray(this.queue[event].shift().args));
      }
      return ((base = this.events)[event] != null ? base[event] : base[event] = []).push({
        fn: fn
      });
    };

    StreamWrapper.prototype.trigger = function(event, args) {
      var base, e, j, len, ref, results;
      if (this.events[event] != null) {
        ref = this.events[event];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          e = ref[j];
          results.push(e.fn.apply(this, $.makeArray(args)));
        }
        return results;
      } else {
        return ((base = this.queue)[event] != null ? base[event] : base[event] = []).push({
          args: args
        });
      }
    };

    return StreamWrapper;

  })();

  store = {
    configure: function(config) {
      return $.extend(module.config, config);
    },
    get: function(key, id) {
      var j, len, payload, ref;
      if (this[key]) {
        if (id) {
          ref = this[key];
          for (j = 0, len = ref.length; j < len; j++) {
            payload = ref[j];
            if (payload.id.toString() === id.toString()) {
              return payload;
            }
          }
        } else {
          payload = {};
          payload[key] = this[key];
          return payload;
        }
      }
    },
    reload: function(key, arg) {
      var i, id, j, ref, subid, subkey;
      id = arg.id, subkey = arg.subkey, subid = arg.subid;
      if (subkey != null) {
        key = (key.singularize() + "_" + subkey).camelCase();
      }
      if (subid != null) {
        throw "store.reload with subid's is not implemented yet.";
      }
      if (this[key]) {
        for (i = j = ref = this[key].length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
          if ((id == null) || this[key][i].id === id) {
            this[key].splice(i, 1);
          }
        }
      }
      return this.load.apply(this, arguments);
    },
    load: function(key, arg) {
      var id, node, nodeCallback, query, ref, subid, subkey, url;
      ref = arg != null ? arg : {}, id = ref.id, subkey = ref.subkey, subid = ref.subid, query = ref.query, node = ref.node, nodeCallback = ref.nodeCallback;
      if (id == null) {
        id = "";
      }
      if (subkey != null) {
        url = module.config.apiUrl + "/" + key + "/" + id + "/" + subkey;
        if (subid != null) {
          url += "/" + subid;
        }
        key = (key.singularize() + "_" + subkey).camelCase();
      } else if (id) {
        url = module.config.apiUrl + "/" + key + "/" + id;
      } else {
        url = module.config.apiUrl + "/" + key;
      }
      return new RSVP.Promise((function(_this) {
        return function(resolve, reject) {
          var cache, hasFirstNodeArrived, stream, streamWrapper;
          cache = _this.get(key, id);
          if ((cache != null) && ((id && (query == null)) || ((query != null) && !id))) {
            return resolve({
              payload: cache
            });
          } else {
            if (query != null) {
              url += "?" + (function() {
                var _key, _value;
                return ((function() {
                  var results;
                  results = [];
                  for (_key in query) {
                    _value = query[_key];
                    results.push(_key + "=" + _value);
                  }
                  return results;
                })()).join("&");
              })();
            }
            if ((node != null) && module.config.stream) {
              hasFirstNodeArrived = false;
              streamWrapper = new StreamWrapper(stream = oboe(url).node(node, function(payload, path, ancestors) {
                var index, tmpObj, type;
                index = path[path.length - 1];
                type = path[path.length - 2];
                if (index === 0) {
                  hasFirstNodeArrived = true;
                  _this.save(ancestors[0]);
                  resolve({
                    payload: ancestors[0][key.singularize()],
                    stream: streamWrapper,
                    node: node
                  });
                } else {
                  tmpObj = {};
                  tmpObj[type] = payload;
                  _this.save(tmpObj);
                }
                return streamWrapper.trigger("node-" + node, [payload, path, ancestors]);
              }).done(function(payload) {
                streamWrapper.isDone = true;
                _this.save(payload);
                return streamWrapper.trigger("done", [payload]);
              }).fail(function(error) {
                return reject($.extend(error, {
                  message: "Stream .node(\"" + node + "\"): Status " + error.statusCode + " \"" + error.body + "\" on: " + url
                }));
              }));
              return setTimeout(function() {
                if (!hasFirstNodeArrived) {
                  stream.abort();
                  return reject("Stream .node(\"" + node + "\"): Timeout " + module.config.requestTimeout + "ms reached: " + url);
                }
              }, module.config.requestTimeout);
            } else {
              return $.get(url).then(function(payload) {
                var sourceKey, targetKey;
                if ((subkey != null) || ((payload[key.singularize()] == null) && (query == null))) {
                  sourceKey = Object.keys(payload)[0];
                  targetKey = key.singularize();
                  payload[targetKey] = {};
                  payload[targetKey][sourceKey] = payload[sourceKey].splice(0, payload[sourceKey].length);
                  payload[targetKey].id = id;
                  delete payload[sourceKey];
                }
                _this.save(payload);
                if ((query != null) && id === "") {
                  return resolve({
                    payload: payload
                  });
                } else {
                  if (id !== "") {
                    payload = payload[key.singularize()];
                  }
                  return resolve({
                    payload: payload
                  });
                }
              }, function(error) {
                return reject(error);
              });
            }
          }
        };
      })(this));
    },
    save: function(payload) {
      var entry, j, key, len, path, property, ref, results, tmpObj;
      results = [];
      for (property in payload) {
        key = property.pluralize();
        if (key in embeddedRecordMappings) {
          ref = $.makeArray(embeddedRecordMappings[key]);
          for (j = 0, len = ref.length; j < len; j++) {
            path = ref[j];
            getAtPath(path, payload[property], (function(_this) {
              return function(_key, _payload) {
                var tmpObj;
                tmpObj = {};
                tmpObj[_key] = _payload;
                return _this.save(tmpObj);
              };
            })(this));
          }
        }
        if (this[key] == null) {
          this[key] = [];
        }
        if ($.isArray(payload[property])) {
          results.push((function() {
            var k, len1, ref1, results1;
            ref1 = payload[property];
            results1 = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              entry = ref1[k];
              tmpObj = {};
              tmpObj[property] = entry;
              results1.push(this.save(tmpObj));
            }
            return results1;
          }).call(this));
        } else {
          if (!this.get(property.pluralize(), payload[property].id)) {
            results.push(this[key].push(payload[property]));
          } else {
            results.push(void 0);
          }
        }
      }
      return results;
    },
    materialize: function(config) {
      var counter, id, key, rootObject;
      id = config.id;
      key = config.key.pluralize();
      if (config.rootKey != null) {
        key = config.rootKey.pluralize();
      }
      counter = 0;
      rootObject = {};
      return $.get(module.config.apiUrl + "/" + key + "/" + id).then(function(payload) {
        var _materialize;
        rootObject = payload[key.singularize()];
        if (config.rootKey != null) {
          key = config.key.pluralize();
        }
        return (_materialize = function(object, key, callback) {
          var ids;
          if (object[key] && (ids = object[key]).length) {
            counter += ids.length;
            _.chunk(ids, 50).reverse().forEach(function(ids) {
              return $.get(module.config.apiUrl + "/" + key + "/" + ids.join(",")).then(function(payloads) {
                if (!payloads[key]) {
                  payloads[key] = [payloads[key.singularize()]];
                }
                return _.forEach(payloads[key], function(payload) {
                  var cacheKey, obj;
                  object[key][object[key].indexOf(payload.id)] = payload;
                  if (payload.type) {
                    cacheKey = payload.type.replace(/^element_/, "").camelCase();
                    store.save((
                      obj = {},
                      obj["" + cacheKey] = payload,
                      obj
                    ));
                  }
                  counter--;
                  return _materialize(payload, key, callback);
                });
              });
            });
          }
          if (counter === 0) {
            return callback(rootObject);
          }
        })(rootObject, key, config.callback);
      });
    }
  };

  exports.store = store;

});
define('framework/string', function () {

  'use strict';

  if (String.prototype.trim == null) {
    (function() {
      var rtrim;
      rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      return String.prototype.trim = function() {
        return this.replace(rtrim, "");
      };
    })();
  }

  String.prototype.singularize = function() {
    if (this.slice(-3) === "ies") {
      return this.slice(0, -3).concat("y");
    } else if (this.slice(-1) === "s") {
      return this.slice(0, -1);
    } else {
      return this;
    }
  };

  String.prototype.pluralize = function() {
    if (this.slice(-1) === "y") {
      return this.slice(0, -1).concat("ies");
    } else {
      if (this.slice(-1) !== "s") {
        return this + "s";
      } else {
        return this;
      }
    }
  };

  String.prototype.camelCase = function(upperCamelCase) {
    var regexp;
    if (upperCamelCase == null) {
      upperCamelCase = false;
    }
    if (upperCamelCase) {
      regexp = new RegExp("(([-_]|^)[a-z])", "g");
    } else {
      regexp = new RegExp("(([-_])[a-z])", "g");
    }
    return this.replace(regexp, function($1) {
      return $1.toUpperCase().replace(/[-_]/, "");
    });
  };

  String.prototype.replaceNewLine = function() {
    var string;
    string = $("<div>" + this + "</div>").html();
    return string.replace(/<br>/g, " ");
  };

});
define('framework/translations', ['exports'], function (exports) {

  'use strict';

  var module, translations;

  module = {};

  module.config = {
    language: "de"
  };

  translations = {
    texts: {
      "Frontseite": "Au top",
      "letztes Update": "dernière mise à jour",
      "Kommentare": "Commentaires",
      "Zurück": "Retour",
      "Bild": "Image",
      "Bilder": "Images",
      "Video": "Vidéo",
      "Artikel zur Bildstrecke": "Un article est lié à cette galerie",
      "Alle Bildstrecken": "Toutes les galeries de photos",
      "von": "de",
      "vor": "il y a",
      "Vor": "Il y a",
      "wenigen Sek": "quelques secondes",
      "Min": "min",
      "Minuten": "minutes",
      "Tg": "jrs",
      "Tagen": "jours",
      "Std": "h",
      "Stunden": "heures",
      "Mnt": "mois",
      "Monaten": "mois",
      "Jahr": "an",
      "Jahren": "ans",
      "Mehr": "Plus",
      "Artikel": "Articles",
      "Mo": "Lu",
      "Di": "Ma",
      "Mi": "Me",
      "Do": "Je",
      "Fr": "Ve",
      "Sa": "Sa",
      "So": "Di",
      "Montag": "Lundi",
      "Dienstag": "Mardi",
      "Mittwoch": "Mercredi",
      "Donnerstag": "Jeudi",
      "Freitag": "Vendredi",
      "Samstag": "Samedi",
      "Sonntag": "Dimanche",
      "Januar": "Janvier",
      "Februar": "Février",
      "März": "Mars",
      "April": "Avril",
      "Mai": "Mai",
      "Juni": "Juin",
      "Juli": "Juillet",
      "August": "Août",
      "September": "Septembre",
      "Oktober": "Octobre",
      "November": "Novembre",
      "Dezember": "Décembre",
      "Kommentar": "Commentaire",
      "Empfehlen": "Recommander",
      "Antworten": "Répondre",
      "Melden": "Signaler",
      "Senden": "Envoyer",
      "Unbekannter Autor": "Auteur inconnu",
      "Schreiben Sie einen Kommentar...": "Laisser un commentaire...",
      "Verbleibende Anzahl Zeichen": "Nombre de signes disponible",
      "Vorname": "Prénom",
      "Name": "Nom",
      "PLZ": "NPA",
      "Wohnort": "Lieu d'habitation",
      "E-Mail-Adresse": "Adresse E-Mail",
      "Grund": "Raison",
      "Ich habe die": "J'ai pris connaissance des",
      "Regeln": "conditions d'utilisation",
      "gelesen und erkläre mich einverstanden": "et les accepte",
      "fehlt": "manquant",
      "Bitte geben Sie eine korrekte E-Mail-Adresse ein": "Veuillez donner une adresse e-mail valide",
      "Bitte lesen und akzeptieren Sie die Regeln": "Prière de lire et d'accepter les règles",
      "Bitte füllen Sie alle Felder korrekt aus.": "Veuillez Veuillez remplir tous les champs correctement.",
      "Bitte füllen Sie alle Felder korrekt aus und akzeptieren Sie die Regeln.": "Veuillez remplir tous les champs correctement et accepter les conditions.",
      "Dieser Kommentar wurde wegen Regelverletzung gelöscht": "Ce commentaire a été supprimé car il ne respectait pas notre charte",
      "Kommentar versandt": "Commentaire envoyé",
      "Kommentar gemeldet": "Commentaire prévenu",
      "Kommentar bearbeiten": "Modifier le commentaire",
      "Vielen Dank für Ihren Beitrag. Ihr Kommentar wurde versandt. Bis er von der Redaktion freigeschaltet wird, kann es eine gewisse Zeit dauern.": "Merci pour votre contribution. Votre commentaire a été envoyé. Veuillez prévoir un délai avant qu'il ne soit validé par la rédaction.",
      "Danke. Unsere Moderatoren prüfen Ihren Hinweis so schnell wie möglich.": "Votre annonce va être étudiée.",
      "Senden fehlgeschlagen": "Echec de l'envoi",
      "Ihr Kommentar konnte aus technischen Gründen nicht übermittelt werden.": "Votre commentaire n'a pas pu être envoyé pour des raisons techniques.",
      "Ihre Meldung konnte aus technischen Gründen nicht übermittelt werden.": "Votre signalement n'a pas pu être envoyé pour des raisons techniques.",
      "Neuste": "Les plus récents",
      "Neuster": "Le plus récent",
      "Beliebteste": "Les plus lus",
      "Wahl der Redaktion": "Choix de la rédaction",
      "Älteste": "Les plus anciens",
      "Regelverstoss melden": "Signaler un abus",
      "Sie sind der Meinung, dass dieser Kommentar gelöscht werden sollte? Dann füllen Sie bitte dieses Formular aus": "Vous pensez que ce commentaire devrait être supprimé? Alors SVP remplissez ce formulaire",
      "Mit Facebook anmelden": "Se connecter via Facebook",
      "Abmelden": "Déconnecter",
      "Kommentar auf Facebook teilen": "Partager commentaire sur Facebook",
      "Teilen": "Partager",
      "Alle Kommentare anzeigen": "Afficher tous les commentaires",
      "Facebook Login Fehler": "Facebook Login Erreur",
      "Ein Login-Fehler ist aufgetreten. Bitte laden Sie die Seite neu und versuchen Sie sich erneut bei Facebook anzumelden.": "Une erreur s'est produite lors de la connexion. Merci de rafraichir la page et d'essayer à nouveau de vous connecter avec votre compte facebook.",
      "Die anderen Spiele": "Autres matchs",
      "Frage": "Question",
      "Ihre Frage...": "Votre question...",
      "Der Live-Chat wird moderiert. Die Redaktion wird ausgewählte Einsendungen veröffentlichen.": "Le live chat est modéré. La rédaction sélectionnera parmi les messages reçus.",
      "Nachricht versandt": "Message envoyé",
      "Vielen Dank für Ihren Beitrag. Ihre Nachricht wurde versandt. Die Redaktion wird ausgewählte Einsendungen veröffentlichen.": "Merci pour votre commentaire. Il a bien été envoyé. La rédaction sélectionnera parmi les messages reçus.",
      "Ihre Nachricht konnte aus technischen Gründen nicht übermittelt werden.": "Votre message n'a pas pu être envoyé pour des raisons techniques. ",
      "Liveticker aktualisiert automatisch": "Le ticker s'actualise automatiquement",
      "letzte Meldung %s": "dernière nouvelle %s",
      "Liveticker wird geladen...": "Live en cours de chargement...",
      "Mehr anzeigen...": "Afficher plus...",
      "Unterkategorien": "Sous-rubriques",
      "Verbindung fehlgeschlagen, erneuter Versuch...": "Echec de la connexion, nouvelle tentative en cours...",
      "Verbindung fehlgeschlagen, bitte versuchen Sie es später erneut.": "Echec de la connexion, veuillez réessayer plus tard.",
      "Artikel teilen": "Partager l’article",
      "Mail": "Mail",
      "Twitter": "Twitter",
      "Facebook": "Facebook",
      "Zur Desktop-Ansicht wechseln": "Afficher le site web classique",
      "Über diese Version": "Sur cette version",
      "Werbung": "Publicité",
      "WERBUNG": "PUBLICITÉ",
      "Meine Abos": "Mon abonnement",
      "Preis": "Prix",
      "Öffnen": "Ouvrir",
      "Video Empfehlungen": "Vidéos recommandées",
      "auf Facebook": "sur Facebook",
      "auf Twitter": "sur Twitter",
      "Jetzt testen und unbegrenzten Zugriff auf tagesanzeiger.ch und die mobilen Apps geniessen.": "",
      "Alle Angebote anzeigen": "",
      "Digitale Abos ab": "",
      "CHF 1.- im ersten Monat.": "",
      "Abonnieren": "Abonnements",
      "Login": "Login",
      "Guten Tag": "Bonjour",
      "Mein Konto": "Mon Compte",
      "Logout": "Déconnexion"
    },
    configure: function(options) {
      var key, ref, results, value;
      if (typeof options === "string") {
        options = {
          language: options
        };
      }
      if (options.language != null) {
        module.config.language = options.language;
      }
      if (options.texts != null) {
        ref = options.texts;
        results = [];
        for (key in ref) {
          value = ref[key];
          if (options.texts.hasOwnProperty(key)) {
            results.push(translations.texts[key] = value);
          }
        }
        return results;
      }
    },
    translate: function(key) {
      if (module.config.language === "de") {
        return key;
      } else {
        return this.texts[key];
      }
    }
  };

  exports.translations = translations;

});
define('framework/utils', ['exports', 'framework/translations', 'framework/LocalStorageQueue'], function (exports, translations, LocalStorageQueue) {

  'use strict';

  var articlesReadQueue, module, utils;

  module = {};

  module.config = {
    language: "de"
  };

  articlesReadQueue = new LocalStorageQueue.LocalStorageQueue("Mobile.articlesRead");

  utils = {
    configure: function(config) {
      return $.extend(module.config, config);
    },
    addRnd: function(url) {
      return (url + "?_=") + new Date().getTime();
    },
    checkIfOneHourPassed: function(timestamp) {
      return new Date().getTime() <= parseInt(timestamp) + (1000 * 60 * 60);
    },
    isProduction: function() {
      return window.location.hostname.toLowerCase().indexOf("mobile2") > -1;
    },
    isCommentingAllowed: function(isAllowedWeekdays, isAllowedWeekends) {
      var isWeekday;
      isWeekday = [0, 6].indexOf(new Date().getDay()) < 0;
      return (isAllowedWeekdays && isWeekday) || (isAllowedWeekends && !isWeekday);
    },
    hideAddressBar: function() {
      if (this.windowOuterHeight == null) {
        this.windowOuterHeight = window.outerHeight;
      }
      document.body.style.height = (this.windowOuterHeight + 1) + "px";
      return window.scrollTo(0, 1);
    },
    showDialog: function(selector, title, lead) {
      var $dialog;
      $dialog = $(selector);
      $dialog.one("click", function(e) {
        return e.delegateTarget.style.display = "none";
      });
      $dialog.find("h1").text(title);
      $dialog.find("h2").text(lead);
      $dialog.find(">div>div").empty();
      return $dialog.show();
    },
    isDch: function() {
      return module.config.language === "de";
    },
    extractInlineElements: function(text, inlineElements) {
      var i, match, regexp, textParts;
      textParts = [];
      regexp = /<!--{{inline_element\(['"]?([a-fA-F0-9]+)['"]?\)}}-->/g;
      i = 0;
      while (match = regexp.exec(text)) {
        if (match.index > i) {
          textParts.push(match.input.substring(i, match.index));
        }
        textParts.push(inlineElements.filter(function(el) {
          return el.id === match[1];
        })[0]);
        i = match.index + match[0].length;
      }
      if (i < text.length) {
        textParts.push(text.substring(i, text.length));
      }
      return textParts;
    },
    calculateAndInsertTime: function($els, isRelative) {
      var that;
      that = this;
      return $els.each(function() {
        if (isRelative) {
          return this.innerHTML = that.date.formatRelative(this.getAttribute("data-timestamp"));
        } else {
          return this.innerHTML = that.date.formatTime(this.getAttribute("data-timestamp"));
        }
      });
    },
    stripHtml: function(text) {
      if (text) {
        return text.replace(/<[^>]+>/g, "");
      }
    },
    date: {
      format: function(timestamp) {
        var days, months;
        days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        timestamp = new Date(timestamp * 1000);
        return translations.translations.translate(days[timestamp.getDay()]) + " " + timestamp.getDate() + (function() {
          if (utils.isDch()) {
            return ". ";
          } else {
            return " ";
          }
        })() + translations.translations.translate(months[timestamp.getMonth()]) + " " + timestamp.getFullYear();
      },
      formatShort: function(timestamp) {
        var day, month;
        timestamp = new Date(timestamp * 1000);
        day = timestamp.getDate();
        if (day.toString().length === 1) {
          day = "0" + day;
        }
        month = timestamp.getMonth() + 1;
        if (month.toString().length === 1) {
          month = "0" + month;
        }
        return day + "." + month + "." + timestamp.getFullYear();
      },
      formatRelative: function(timestamp) {
        var minutesSinceLastUpdatedAt, relativeTimestamp;
        if (isNaN(new Date(timestamp).getTime())) {
          timestamp = timestamp * 1000;
        }
        minutesSinceLastUpdatedAt = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        relativeTimestamp = "";
        if (minutesSinceLastUpdatedAt >= 1051200) {
          return relativeTimestamp = (Math.floor(minutesSinceLastUpdatedAt / 60 / 24 / 365)) + " " + (translations.translations.translate("Jahren")) + ".";
        } else if (minutesSinceLastUpdatedAt >= 525600) {
          return relativeTimestamp = (Math.floor(minutesSinceLastUpdatedAt / 60 / 24 / 365)) + " " + (translations.translations.translate("Jahr")) + ".";
        } else if (minutesSinceLastUpdatedAt >= 43200) {
          return relativeTimestamp = (Math.floor(minutesSinceLastUpdatedAt / 60 / 24 / 30)) + " " + (translations.translations.translate("Mnt")) + ".";
        } else if (minutesSinceLastUpdatedAt >= 1440) {
          return relativeTimestamp = (Math.floor(minutesSinceLastUpdatedAt / 60 / 24)) + " " + (translations.translations.translate("Tg")) + ".";
        } else if (minutesSinceLastUpdatedAt >= 60) {
          return relativeTimestamp = (Math.floor(minutesSinceLastUpdatedAt / 60)) + " " + (translations.translations.translate("Std")) + ".";
        } else if (minutesSinceLastUpdatedAt >= 1) {
          return relativeTimestamp = minutesSinceLastUpdatedAt + " " + (translations.translations.translate("Min")) + ".";
        } else {
          return relativeTimestamp = (translations.translations.translate("wenigen Sek")) + ".";
        }
      },
      formatTime: function(timestamp) {
        var hours, minutes;
        timestamp = new Date(timestamp * 1000);
        hours = timestamp.getHours();
        if (hours.toString().length === 1) {
          hours = "0" + hours;
        }
        minutes = timestamp.getMinutes();
        if (minutes.toString().length === 1) {
          minutes = "0" + minutes;
        }
        return hours + ":" + minutes;
      }
    },
    isInvalidPageElement: function(pageElement) {
      var validLayoutTypes;
      switch (pageElement.boxtype) {
        case "meteonews":
        case "iframe":
        case "socialmedia_like":
          return false;
        case "articles":
          validLayoutTypes = [null, "analyse", "breaking-news", "collection", "front", "horizontal-slide", "multimedia", "publireportage", "storybundle"];
          return validLayoutTypes.indexOf(pageElement.layout_type) < 0;
        default:
          return true;
      }
    },
    loopThroughArticlePreviews: function(articles, articleDOMElement, options) {
      var $articleElement, article, color, index, j, len, results, socialCounter;
      if (options == null) {
        options = {};
      }
      results = [];
      for (index = j = 0, len = articles.length; j < len; index = ++j) {
        article = articles[index];
        if (options.specialIndex) {
          index += options.specialIndex;
        }
        $articleElement = $(articleDOMElement).eq(index);
        if (options.articlesRead != null) {
          if (articlesReadQueue.contains(article.id)) {
            $(articleDOMElement).find("a[href*='" + article.id + "']").addClass("read");
          }
        }
        if (options.socialCounter != null) {
          socialCounter = $articleElement.find(".socialCounter")[0];
          if (socialCounter != null) {
            options.socialMedia.insert(socialCounter, article.id, {
              isAggregated: true,
              dialogBox: "#dialog",
              router: options.router
            });
          }
        }
        false;
        if (options.colorize != null) {
          if (options.colorize.color) {
            color = options.colorize.color;
          } else {
            if (options.colorize.type === "front" || options.colorize.type === "newest") {
              color = article.category_for_site.color;
            }
          }
          if (((options.colorize.type === "category" || options.colorize.type === "newest") && $articleElement.hasClass("featured")) || options.colorize.type === "front") {
            $articleElement.css("background-color", "#" + color);
          } else {
            $articleElement.find(".keyword").css("color", "#" + color);
          }
          results.push($articleElement.find(".socialCounter").css("background-color", "#" + color));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    colorize: function(parentSelector, selectors, cssProperty, categoryColor) {
      return $(parentSelector).find(selectors).css(cssProperty, "#" + categoryColor);
    },
    markArticleAsRead: function(id) {
      $("a[href*='" + id + "']").addClass("read");
      return articlesReadQueue.add(id);
    }
  };

  exports.utils = utils;

});
define('framework/uuid', ['exports'], function (exports) {

    'use strict';

    //UUID/Guid Generator
    // use: UUID.create() or UUID.createSequential()
    // convenience:  UUID.empty, UUID.tryParse(string)
    // From http://baagoe.com/en/RandomMusings/javascript/
    // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
    function Mash() {
        var n = 0xefc8249d;

        var mash = function(data) {
            data = data.toString();
            for (var i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                var h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000; // 2^32
            }
            return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
        };

        mash.version = 'Mash 0.9';
        return mash;
    }

    // From http://baagoe.com/en/RandomMusings/javascript/
    function Kybos() {
        return (function(args) {
            // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
            var s0 = 0;
            var s1 = 0;
            var s2 = 0;
            var c = 1;
            var s = [];
            var k = 0;

            var mash = Mash();
            var s0 = mash(' ');
            var s1 = mash(' ');
            var s2 = mash(' ');
            for (var j = 0; j < 8; j++) {
                s[j] = mash(' ');
            }

            if (args.length == 0) {
                args = [+new Date];
            }
            for (var i = 0; i < args.length; i++) {
                s0 -= mash(args[i]);
                if (s0 < 0) {
                    s0 += 1;
                }
                s1 -= mash(args[i]);
                if (s1 < 0) {
                    s1 += 1;
                }
                s2 -= mash(args[i]);
                if (s2 < 0) {
                    s2 += 1;
                }
                for (var j = 0; j < 8; j++) {
                    s[j] -= mash(args[i]);
                    if (s[j] < 0) {
                        s[j] += 1;
                    }
                }
            }

            var random = function() {
                var a = 2091639;
                k = s[k] * 8 | 0;
                var r = s[k];
                var t = a * s0 + c * 2.3283064365386963e-10; // 2^-32
                s0 = s1;
                s1 = s2;
                s2 = t - (c = t | 0);
                s[k] -= s2;
                if (s[k] < 0) {
                    s[k] += 1;
                }
                return r;
            };
            random.uint32 = function() {
                return random() * 0x100000000; // 2^32
            };
            random.fract53 = function() {
                return random() +
                    (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
            };
            random.addNoise = function() {
                for (var i = arguments.length - 1; i >= 0; i--) {
                    for (j = 0; j < 8; j++) {
                        s[j] -= mash(arguments[i]);
                        if (s[j] < 0) {
                            s[j] += 1;
                        }
                    }
                }
            };
            random.version = 'Kybos 0.9';
            random.args = args;
            return random;

        }(Array.prototype.slice.call(arguments)));
    };

    var rnd = Kybos();

    // UUID/GUID implementation from http://frugalcoder.us/post/2012/01/13/javascript-guid-uuid-generator.aspx
    var UUID = {
        "empty": "00000000-0000-0000-0000-000000000000",
        "parse": function(input) {
            var ret = input.toString().trim().toLowerCase().replace(/^[\s\r\n]+|[\{\}]|[\s\r\n]+$/g, "");
            if ((/[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/).test(ret))
                return ret;
            else
                throw new Error("Unable to parse UUID");
        },
        "createSequential": function() {
            var ret = new Date().valueOf().toString(16).replace("-", "")
            for (; ret.length < 12; ret = "0" + ret);
            ret = ret.substr(ret.length - 12, 12); //only least significant part
            for (; ret.length < 32; ret += Math.floor(rnd() * 0xffffffff).toString(16));
            return [ret.substr(0, 8), ret.substr(8, 4), "4" + ret.substr(12, 3), "89AB" [Math.floor(Math.random() * 4)] + ret.substr(16, 3), ret.substr(20, 12)].join("-");
        },
        "create": function() {
            var ret = "";
            for (; ret.length < 32; ret += Math.floor(rnd() * 0xffffffff).toString(16));
            return [ret.substr(0, 8), ret.substr(8, 4), "4" + ret.substr(12, 3), "89AB" [Math.floor(Math.random() * 4)] + ret.substr(16, 3), ret.substr(20, 12)].join("-");
        },
        "random": function() {
            return rnd();
        },
        "tryParse": function(input) {
            try {
                return UUID.parse(input);
            } catch (ex) {
                return UUID.empty;
            }
        }
    };
    UUID["new"] = UUID.create;

    exports.UUID = UUID;

});
define('framework/viewManager', ['exports'], function (exports) {

  'use strict';

  var viewManager;

  viewManager = {
    renderTemplate: function(routeName, payload, templateName) {
      if (templateName == null) {
        templateName = routeName;
      }
      return $("#" + routeName).html(require("app/templates/" + templateName)["default"](payload));
    },
    show: function(toRouteName, fromRouteName) {
      return new RSVP.Promise((function(_this) {
        return function(resolve) {
          $("section").hide();
          $("#" + toRouteName).css("zIndex", 3).show();
          return resolve();
        };
      })(this));
    }
  };

  exports.viewManager = viewManager;

}); }).call(this, window.cre_jq || $);
