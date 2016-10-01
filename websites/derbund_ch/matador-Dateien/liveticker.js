(function($) {
    var config = require("framework/config").config,
        translations = require("framework/translations").translations,
        poll = require("framework/poll/module").poll,
        Scoreboard = require("framework/scoreboard/scoreboard").Scoreboard,
        Liveticker = require("framework/liveticker/liveticker").Liveticker;

    var livetickerBaseUrl = "/api", scoreboard = null;

    if (window.location.hostname.search(/devlocal/) >= 0) {
        // id = "5399c07487da8bbf5e049cec"; // articleId 16207926
        livetickerBaseUrl = "http://mobile2.tagesanzeiger.ch/api";
    }

    translations.configure(config.language);
    poll.configure(livetickerBaseUrl);

    window.renderScoreboard = function(id) {
        id = id || window.scoreboardId;
        // id = "5586942887da8b0c79000004";

        scoreboard = new Scoreboard("#newsnet-scoreboard", {
            id: id,
            baseUrl: livetickerBaseUrl,
            otherGamesCaption: translations.translate("Die anderen Spiele"),
            getRenderMode: function() { return "desktop"; }
        });
    };

    window.renderLiveticker = function(id) {
        id = id || window.livetickerId;

        var liveticker = new Liveticker("#newsnet-liveticker", {
            id: id,
            http: { baseUrl: livetickerBaseUrl },
            lang: config.language,
            loadingCaption: translations.translate("Liveticker wird geladen..."),
            activeCaption: translations.translate("Liveticker aktualisiert automatisch"),
            lastUpdatedAtText: "– " + translations.translate("letzte Meldung %s"),
            showMoreText: translations.translate("Mehr anzeigen..."),
            initialLimit: 30,
            limitIncreaseValue: 10,
            afterFetchMessageUpdates: function(messages, lastRequestedAt) {
                if (scoreboard && lastRequestedAt) {
                    /**
                     * Update scoreboard everytime the liveticker has fetched possible message updates if there
                     * is a scoreboard and if this is not the initial request of the liveticker to fetch
                     * messages (when lastRequestedAt is null, this means it is the initial request). We do not
                     * have to update the scoreboard with the initial liveticker request, because the scoreboard
                     * is already loaded when the page is rendered
                     */
                    scoreboard.update();
                }
            },
            renderInlineElement: function(message, inlineElement, callback) {
                switch (inlineElement.boxtype) {
                    case "slideshow":
                        return function() {
                            inlineElement._view = showSlideshow(inlineElement.slideshow.id, {
                                fullscreenOnly: false,
                                ads: true
                            }, $("#inlineElement_" + inlineElement.id)[0], inlineElement.slideshow);
                        };
                    break;

                    case "iframe":
                        html = '<iframe scrolling="no" frameborder="0" allowfullscreen' +
                            ' src="' + inlineElement.iframe_url + '"' +
                            ' width="' + (inlineElement.iframe_width ? inlineElement.iframe_width : '100%') + '"' +
                            ' height="' + (inlineElement.iframe_height ? inlineElement.iframe_height : '100%') + '"' +
                            ' class="' + (inlineElement.iframe_class_name ? inlineElement.iframe_class_name : '100%') + '"' +
                        '></iframe>';

                        if (inlineElement.caption) {
                            html+= '<div class="caption"><p>' + inlineElement.caption + '</p></div>';
                        }
                    return html;

                    case "livevideo":
                        html = '<iframe scrolling="no" frameborder="0" allowfullscreen' +
                            ' src="' + inlineElement.url + '"' +
                            ' width="100%"' +
                            ' height="353"' +
                            ' class="liveStream"' +
                        '></iframe>';

                        if (inlineElement.caption) {
                            html+= '<div class="caption"><p>' + inlineElement.caption + '</p></div>';
                        }
                    return html;

                    case "video":
                    return function() {
                        var videoId = inlineElement.video.url.match(/([0-9]+)[h]?\.mp4/i)[1];
                        var elementId = "inlineElement_" + inlineElement.id;

                        if (typeof(deconcept) !== 'undefined' && deconcept.SWFObjectUtil.getPlayerVersion().major >= 6) {
                            // Flash Video from inlineplayer.html.ep

                            var breite = 471;
                            var timestamp = new Date().getTime();
                            var so = new SWFObject("http://server065.newsnetz.tv/player_inline_videotv.swf?v=" + timestamp, "preview", breite, (breite / 16 * 9 + 24), "0", "#000000");
                            so.addParam("quality", "high");
                            so.addParam("wmode", "transparent");
                            so.addParam("scale", "noscale");
                            so.addParam("align", "TL");
                            so.addParam("salign", "TL");
                            so.addParam("allowScriptAccess", "always");
                            so.addParam("allowFullScreen", "true");
                            // <% unless ($player->{is_audio}){ %>so.addParam("salign","TL");<% } %>
                            // <% if ($player->{werbung}->{isRomandSite}) { %>so.addVariable("language", "fr"); <%  } %>
                            so.addVariable("video_quality", "m");
                            so.addVariable("showLogo", inlineElement.video.show_logo);
                            so.addVariable("autoStart", "false");
                            so.addVariable("channel_id", "");
                            so.addVariable("file1", videoId);
                            // so.addVariable("begin", "<%= $player->{begin} %>");
                            // so.addVariable("end", "<%= $player->{end} %>");
                            // so.addVariable("logo1", "<%= $player->{flag_logo} %>");
                            so.addVariable("video_id", videoId);
                            // so.addVariable("page_id", "<%= $player->{page_id} %>");
                            so.addVariable("video_pos", "");
                            so.addVariable("video_title", inlineElement.video.title);
                            so.addVariable("video_lead", inlineElement.video.lead);
                            so.addVariable("video_autor", "");
                            so.addVariable("show_ads", inlineElement.video.show_ad);
                            so.addVariable("inline", "true");
                            so.addVariable("softcutter", "false");
                            so.addVariable("playlist_host", "");
                            so.addVariable("playlist_file", "");
                            so.addVariable("logo_url", "/images/logos/LogoNegGross.png");
                            so.addVariable("movie_width", breite);
                            so.addVariable("extern", "true");
                            // so.addVariable("frames", "<%= $player->{apics}->[0] %>");
                            so.addVariable("storychannel_id", "590");
                            // <% if ($player->{is_audio}){ %>so.addVariable("audio", "true");<% } %>
                            // so.addVariable("channel_name", "<%= lc($player->{config}->{page_cat}) %>");
                            // so.addVariable("side_name", "<%= lc($player->{config}->{customer_name}) %>");
                            // so.addVariable("subchannel_name", "<%= lc($player->{config}->{page_sub_cat}) %>");
                            // so.addVariable("flag_werbung", "<%= $player->{werbung}->{flag_werbung} %>");
                            // <% if ($player->{werbung}->{debug} eq "true"){ %>so.addVariable("developer", "<%= $player->{werbung}->{debug} %>"); <% } %>
                            so.addVariable("imageURL", inlineElement.video.poster_picture_url);
                            so.write(elementId);
                        } else {
                            // HTML5 Video

                            var videos = [{
                                url: inlineElement.video.url,
                                type: "video/mp4"
                            }, {
                                url: "http://desktopvideo.newsnetz.tv/videos/" + videoId + ".webm",
                                type: "video/webm"
                            }];

                            var html = '<video preload="metadata" controls' +
                                ' poster="' + inlineElement.video.poster_picture_url + '"' +
                            '>';

                            for (var i = 0; i < videos.length; i++) {
                                html+= '<source type="' + videos[i].type + '"' +
                                    ' src="' + videos[i].url + '"' +
                                '>';
                            }

                            html+= '<p>' + Em.I18n.translations.liveticker.no_html5_video + '</p>' +
                                '</video>';

                            if (inlineElement.caption) {
                                html+= '<div class="caption"><p>' + inlineElement.caption + '</p></div>';
                            }

                            document.getElementById(elementId).innerHTML = html;
                        }
                    };

                    case "youtube":
                        html = '<iframe scrolling="no" frameborder="0" allowfullscreen width="100%" height="100%"' +
                            ' src="' + inlineElement.url + '"' +
                        '></iframe>';

                        if (inlineElement.caption) {
                            html+= '<div class="caption"><p>' + inlineElement.caption + '</p></div>';
                        }
                    return html;

                    case "audio":
                    return function() {
                        var audioId = inlineElement.audio.url.match(/([0-9]+)[h]?\.mp4/i)[1];
                        var elementId = "inlineElement_" + inlineElement.id;

                        if (typeof(deconcept) !== 'undefined' && deconcept.SWFObjectUtil.getPlayerVersion().major >= 6) {
                            var breite = 471;
                            var hoehe = 23;
                            var so = new SWFObject("http://files.newsnetz.ch/videotv/player_audio.swf", "preview", breite, hoehe, "0", "#ffffff");
                            so.addParam("quality", "high");
                            so.addParam("scale", "noscale");
                            so.addParam("align", "TL");
                            so.addParam("allowScriptAccess", "always");
                            so.addParam("allowFullScreen", "true");
                            so.addParam("wmode", "transparent");
                            so.addVariable("video_quality", "m");
                            so.addVariable("showLogo", "false");
                            so.addVariable("autoStart", "false");
                            so.addVariable("channel_id", "");
                            so.addVariable("file1", audioId);
                            so.addVariable("begin", "");
                            so.addVariable("end", "");
                            so.addVariable("logo1", "false");
                            so.addVariable("video_id", audioId);
                            so.addVariable("page_id", "");
                            so.addVariable("video_pos", "");
                            so.addVariable("video_title", inlineElement.audio.title);
                            so.addVariable("video_lead", inlineElement.audio.lead);
                            so.addVariable("video_autor", "");
                            so.addVariable("inline", "true");
                            so.addVariable("softcutter", "false");
                            so.addVariable("playlist_host", "");
                            so.addVariable("playlist_file", "");
                            so.addVariable("logo_url", "/images/logos/LogoNegGross.png");
                            so.addVariable("movie_width", breite);
                            so.addVariable("extern", "true");
                            so.addVariable("frames", "");
                            so.addVariable("audio", "true");
                            so.addVariable("imageURL", "");
                            so.write(elementId);
                        } else {
                            // HTML5 Audio

                            var audios = [{
                                url: inlineElement.audio.url,
                                type: "audio/mp4"
                            }, {
                                url: "http://desktopvideo.newsnetz.tv/videos/" + audioId + ".webm",
                                type: "audio/webm"
                            }];

                            var html = '<audio controls>';

                            for (var i = 0; i < audios.length; i++) {
                                html+= '<source type="' + audios[i].type + '"' +
                                    ' src="' + audios[i].url + '"' +
                                '>';
                            }

                            html+= '' +
                                '<p>' + Em.I18n.translations.liveticker.no_html5_audio + '</p>' +
                            '</audio>';

                            document.getElementById(elementId).innerHTML = html;
                        }
                    };

                    case "poll":
                        $.get(livetickerBaseUrl + "/polls/" + inlineElement.poll_id).then(function(payload) {
                            poll.init(
                                { payload: payload.poll },
                                inlineElement.poll_id,
                                require("framework/config").config.wemf.nn1.map(function(item) {
                                    return { provider: "wemf", url: item };
                                }),
                                location.pathname
                            );
                        });

                        html = '<div class="NnPollBox" data-pollId="' + inlineElement.poll_id + '"></div>';
                    return html;
                }
            },
            beforeDestroyInlineElement: function(message, inlineElement, el) {
                switch (inlineElement.boxtype) {
                    case "slideshow":
                        if (inlineElement._view) {
                            return inlineElement._view.destroy();
                        }
                    break;
                }
            },
            afterRenderMessage: function(message, el, action) {
                setTimeout(function() {
                    if (window.twttr) window.twttr.widgets.load(el);
                    if (window.instgrm) instgrm.Embeds.process();
                }, 0);

                $(el).find(".picture").on("click", function() {
                    return $(this).toggleClass("zoom");
                });
            }
        });
    };
}).call(this, cre_jq || $);