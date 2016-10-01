(function() {
    var module = {
        name: "DimensionWatcher",
        version: "0.2.0"
    };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
      Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
          // closest thing possible to the ECMAScript 5 internal IsCallable function
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply(this instanceof fNOP && oThis
                                     ? this
                                     : oThis,
                                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
      };
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
      Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
          }

          var result = [], prop, i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }
          return result;
        };
      }());
    }

    // If there is not jQuery around, we gonna do our own wrapper for what we need here
    if (typeof $ === "undefined") {
        $ = function(obj) {
            var ready = function(callback) {
                // This is just a very basic ready method, not complete but covers the most important
                if (! document.body)
                    return setTimeout(function() { ready(callback); });
                callback();
            };

            var selector = {
                push: [].push,
                length: 0,
                bind: function (eventName, callback) {
                    for (var i = 0; i < this.length; i++) {
                        if (! this[i].events) this[i].events = {};
                        if (! this[i].events[eventName]) this[i].events[eventName] = [];
                        this[i].events[eventName].push(callback);
                    }
                },
                unbind: function (eventName) {
                    for (var i = 0; i < this.length; i++)
                        if (this[i].events && this[i].events[eventName] && this[i].events[eventName].length)
                            this[i].events[eventName].length = 0;
                },
                trigger: function (eventName, args) {
                    for (var i = 0; i < this.length; i++)
                        if (this[i].events && this[i].events[eventName] && this[i].events[eventName].length)
                            for (var e = 0; e < this[i].events[eventName].length; e++) {
                                args.unshift({}); // Simulate event object
                                this[i].events[eventName][e].apply(this, args);
                            }
                }
            };

            if (typeof obj === "function")
                ready(obj);
            else
                selector.push(obj);

            return selector;
        };
    } else {
        $.event.special.contentResize = {
            setup: function (data, namespaces) {
                if (this.nodeName.toUpperCase() !== "IFRAME") {
                    throw("$.event.special.contentResize: This event works with iframes with a src-attribute specified");
                }

                this._contentResizeId = new Date().getTime() + "|" + Math.random().toString().split(".").pop()

                $(window).bind("message." + this._contentResizeId, (function ($iframe, e) {
                    var eventData = getEventData(e);

                    if (! validateMessage(eventData)) {
                        return;
                    }

                    if (this.contentWindow !== e.originalEvent.source) {
                        return;
                    }

                    if (!$iframe.attr("src") || $iframe.attr("src").search(/^[a-z]+:\/\//g) < 0 || e.originalEvent.origin || $iframe.attr("src").match(/[a-z]+:\/\/[^\/]+/g)[0]) {
                        $iframe.trigger("contentResize", [
                            eventData.width,
                            eventData.height,
                            $iframe.width(),
                            $iframe.height()
                        ]);
                    }
                }).bind(this, $(this)));
            },

            teardown: function (namespaces) {
                $(window).unbind("message." + this._contentResizeId);
            }
        };
    }

    var _debug = function() {
        if (!DimensionWatcher.debug) {
            return;
        }

        var args = [].slice.call(arguments),
            message = args.join("&nbsp;&nbsp;");

        if ($("#dmwdebug").length <= 0) {
            $("<div id='dmwdebug'></div>").appendTo(document.body).css({
                "background": "white",
                "position": "fixed",
                "left": 0,
                "right": 0,
                "bottom": 0,
                "height": "30%",
                "border": "1px solid black",
                "overflow": "scroll",
                "border-radius": "8px",
                "padding": "0 8px"
            });
        }

        $("#dmwdebug").prepend("<p style='border-bottom: 1px solid #999; padding-bottom: 16px'>" + message + "</p>");
    };

    DimensionWatcher = function(width, height) {
        width = width || function() { return document.body.scrollWidth };
        height = height || function() { return document.body.scrollHeight };
        $(function($that) {
            this.interval = window.setInterval(function($that) {
                if (this.cache == undefined || (this.cache.width !== width() || this.cache.height !== height()))
                    $that.trigger("change", [ width(), height() ]);
                this.cache = { width: width(), height: height() };
            }.bind(this, $that), 100);
        }.bind(this, $(this)));
    };

    var validateMessage = function(message) {
        if (typeof message === "object" && typeof message.id !== "undefined" && typeof message.version !== "undefined") {
            return message.id === module.name;
        }

        return false;
    };

    var $dimensionWatcher,
        isEnabledOnAllIframes = false,
        globalEventNamespaceId = new Date().getTime() + "|" + Math.random().toString().split(".").pop();


    /*
     * Code for parent website
     */

    var queryParamTokens = window.location.search.substr(1).split("&"),
        queryParams = {};

    for (var q = 0; q < queryParamTokens.length; q++) {
        queryParams[queryParamTokens[q].split("=")[0]] = queryParamTokens[q].split("=")[1];
    }

    DimensionWatcher.debug = queryParams.debug || false;

    DimensionWatcher.watchIframeContent = function(selector, widthHandler, heightHandler) {
        if (arguments.length === 0 || typeof arguments[0] === "function") {
            enableOnAllIframes.apply(this, arguments);
        } else {
            enableOn.apply(this, arguments);
        }
    };

    DimensionWatcher.unwatchIframeContent = function(selector) {
        if (arguments.length === 0) {
            disableOnAllIframes.apply(this, arguments);
        } else {
            disableOn.apply(this, arguments);
        }
    };

    var getEventData = function(e) {
        if (typeof e.originalEvent === "object") {
            if (typeof e.originalEvent.data === "string") {
                try {
                    var eventData = JSON.parse(e.originalEvent.data);
                } catch (error) {
                    _debug("Warning! eventData could not be parsed:", error, e.originalEvent.data);
                }
            } else {
                var eventData = e.originalEvent.data;
            }
        }

        return eventData || {};
    };

    var enableOnAllIframes = function(widthHandler, heightHandler) {
        if (! isEnabledOnAllIframes) {
            isEnabledOnAllIframes = true;

            $(window).bind("message." + globalEventNamespaceId, function(e) {
                var eventData = getEventData(e);

                _debug("window got message", Object.keys(eventData).join(", "));

                if (validateMessage(eventData)) {
                    _debug("message has been validated");

                    var iframes = document.getElementsByTagName("iframe");

                    for (var i = 0; i < iframes.length; i++) {
                        var iframe = iframes[i],
                            $iframe = $(iframe);

                        if (iframe.contentWindow === e.originalEvent.source) {
                            _debug("found iframe for message", $iframe.attr("src"));

                            if (!$iframe.attr("src") || $iframe.attr("src").search(/^[a-z]+:\/\//g) < 0 || e.originalEvent.origin || $iframe.attr("src").match(/[a-z]+:\/\/[^\/]+/g)[0]) {
                                _debug("origin validated successful");

                                var widthBefore = $iframe.width(),
                                    heightBefore = $iframe.height(),
                                    width = eventData.width,
                                    height = eventData.height;

                                if (width !== widthBefore) {
                                    _debug("set width of", width);

                                    if (widthHandler) {
                                        _debug("use widthHandler to set width");
                                        widthHandler.call(iframe, width, widthBefore);
                                    } else {
                                        _debug("use jQuery to set width");
                                        $iframe.width(width);
                                    }

                                    _debug("done setting width");
                                }

                                if (height !== heightBefore) {
                                    _debug("set height of", height);

                                    if (heightHandler) {
                                        _debug("use heightHandler to set height");
                                        heightHandler.call(iframe, height, heightBefore);
                                    } else {
                                        _debug("use jQuery to set height");
                                        $iframe.height(height);
                                    }

                                    _debug("done setting height");
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    var disableOnAllIframes = function() {
        $(window).unbind("message." + globalEventNamespaceId);
        isEnabledOnAllIframes = false;
    };

    var enableOn = function(selector, widthHandler, heightHandler) {
        $(selector).bind("contentResize", function(e, width, height, widthBefore, heightBefore) {
            if (width !== widthBefore) {
                if (widthHandler) {
                    widthHandler.call(this, width, widthBefore);
                } else {
                    $(this).width(width);
                }
            }

            if (height !== heightBefore) {
                if (heightHandler) {
                    heightHandler.call(this, height, heightBefore);
                } else {
                    $(this).height(height);
                }
            }
        });
    };

    var disableOn = function(selector) {
        $(selector).unbind("contentResize");
    };

    var isIe = function() {
        return /MSIE /.test(window.navigator.userAgent);
    };


    /*
     * Code for iFrame contents
     */

    DimensionWatcher.enableParentNotification = function(widthHandler, heightHandler, targetOrigin) {
        targetOrigin = targetOrigin || "*";

        if (typeof $dimensionWatcher === "object") {
            DimensionWatcher.disableParentNotification();
        }

        ($dimensionWatcher = $(new this(widthHandler, heightHandler))).bind("change", function(e, width, height) {
            if (window.parent.postMessage)
                if (isIe()) {
                    // Send strings only for IE since IE8+9 only supports sending strings with postMessage
                    var message = JSON.stringify(
                        { width: width, height: height, id: module.name, version: module.version }
                    );
                } else {
                    var message = { width: width, height: height, id: module.name, version: module.version };
                }

                _debug("postMessage", message, targetOrigin);

                window.parent.postMessage(message, targetOrigin);

                _debug("message posted");
        });
    };

    DimensionWatcher.disableParentNotification = function() {
        $dimensionWatcher.unbind("change");
    };
}).call(window);