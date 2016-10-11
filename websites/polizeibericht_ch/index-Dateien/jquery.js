/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));

$(function () {
    if (typeof($.Autocomplete) != 'undefined') {
        $('#search-autocomplete').autocomplete({
            serviceUrl: '/suche/',
            minChars: 1,
            onSelect: function (suggestion) {
                $('#search-autocomplete').val(suggestion.data);
                $('.search-page input[type=submit]').click();
            },
            onSearchStart:function(text) {
                if(text.query=='' || text.query=='Suchbegriff...') {
                    return false;
                } else {
                    return true;
                }
            }
        });
    }
});

function validateEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(email);
}

$(document).ready(function () {
    $('#comment-form input[type=submit]').click(function () {
        if ($.trim($('#comment-form input[name=name]').val()) == '' || $('#comment-form input[name=name]').val() == 'Ihr Name') {
            $('#comment-form input[name=name]').addClass('error_input');
        }

        if ($.trim($('#comment-form textarea').val()) == '' || $('#comment-form textarea').val() == 'Ihr Kommentar') {
            $('#comment-form textarea').addClass('error_input');
        }

        if ($.trim($('#comment-form input[name=email]').val()) == '') {
            $('#comment-form input[name=email]').addClass('error_input');
        }

        if (!validateEmail($('#comment-form input[name=email]').val())) {
            $('#comment-form input[name=email]').addClass('error_input');
        }

        if ($('.error_input').size() == 0) {
            $.ajax({
                url: '?newComment=1',
                dataType: 'json',
                data: {
                    name: $('#comment-form input[name=name]').val(),
                    text: $('#comment-form textarea').val(),
                    email: $('#comment-form input[name=email]').val(),
                    code: $('#comment-form input[name=code]').val()
                },
                success: function (data) {
                    if (data.error.length != 0) {
                        if (data.error.name) {
                            $('#comment-form input[name=name]').addClass('error_input');
                        }
                        if (data.error.text) {
                            $('#comment-form textarea').addClass('error_input');
                        }
                        if (data.error.email) {
                            $('#comment-form input[name=email]').addClass('error_input');
                        }
                        if (data.error.code) {
                            $('#comment-form input[name=code]').addClass('error_input');
                            var d = new Date();
                            $('#comment-form img').attr('src', '/antibot.php?' + d.getTime());
                        }
                    } else {
                        $('#comment-form input[name=name]').val('Ihr Name');
                        $('#comment-form input[name=email]').val('Ihre E-Mail-Adresse');
                        $('#comment-form textarea').val('Ihr Kommentar');
                        var d = new Date();
                        $('#comment-form img').attr('src', '/antibot.php?' + d.getTime());
                        $('#comments-list').append(
                            '<div id="comment-{$val.id}" class="comment">\
                                <div class="new-comment-span">\
                                Der Kommentar wird nach der Freigabe sichtbar\
                                </div><br>\
                            <div>\
                            ' + data.comment.text + '\
                            </div>\
                            <span class="comment-name">\
                            ' + data.comment.name + '\
                            </span>\
                                <span>\
                                sagte am ' + data.comment.date + '\
                                </span>\
                                <a href="#comment-' + data.comment.id + '">\
                                    <i>#</i>\
                                </a>\
                            </div>'
                        );
                    }
                }
            });
        }
        return false;
    });

    $('.hover-menu2').hover(function () {
        if ($(this).find('a.active').size() == 1) {
            return;
        }
        $('.sub_menu_v2_hover').show();
    }, function () {
        window['t'] = window.setTimeout(function () {
            $('.sub_menu_v2_hover').hide();
        }, 20);
    });

    $('.search input[type=text]').focus(function () {
        if ($.trim($(this).val()) == 'Suchbegriff...') {
            $(this).val('');
        }
    });

    $('.search input[type=text]').blur(function () {
        if ($.trim($(this).val()) == '') {
            $(this).val('Suchbegriff...');
        }
    });

    $('.hover-menu1').hover(function () {
        if ($(this).find('a.active').size() == 1) {
            return;
        }
        $('.sub_menu_v1_hover').show();
    }, function () {
        window['t'] = window.setTimeout(function () {
            $('.sub_menu_v1_hover').hide();
        }, 20);
    });

    $('.sub_menu-hover-v2').hover(function () {
        clearTimeout(window['t']);
    }, function () {
        $(this).hide();
    });

    $('.sub_menu-hover-v1').hover(function () {
        clearTimeout(window['t']);
    }, function () {
        $(this).hide();
    });

    $('.page-detail .comment-form input[name=name]').focus(function () {
        if ($(this).val() == 'Ihr Name') {
            $(this).val('').removeClass('error_input');
        }
        $(this).removeClass('error_input');
    }).blur(function () {
            if ($(this).val() == '') {
                $(this).val('Ihr Name');
            }
        });
    $('.page-detail .comment-form input[name=code]').focus(function () {
        $(this).val('').removeClass('error_input');
    });
    $('.page-detail .comment-form input[name=email]').focus(function () {
        if ($(this).val() == 'Ihre E-Mail-Adresse') {
            $(this).val('').removeClass('error_input');
        }
        $(this).removeClass('error_input');
    }).blur(function () {
            if ($(this).val() == '') {
                $(this).val('Ihre E-Mail-Adresse');
            }
        });

    $('.page-detail .comment-form textarea[name=text]').focus(function () {
        if ($(this).val() == 'Ihr Kommentar') {
            $(this).val('').removeClass('error_input');
        }
        $(this).removeClass('error_input');
    }).blur(function () {
            if ($(this).val() == '') {
                $(this).val('Ihr Kommentar');
            }
        });

    window['asideElement'] = $('.aside-holder');
    window['ads_holder'] = $('.adv444');
    window['onScrollFunction'] = function () {

        var ads_top = 112 - $(document).scrollTop();
        if (ads_top < 7) {
            ads_top = 7;
        }
        window['ads_holder'].css('top', ads_top + 'px');

        return;

        var x = 260;
        if ($('.content').height() <= window['asideElement'].height()) {
            return false;
        }

        if (($(document).scrollTop() + $(window).height() - x) > window['asideElement'].height()) {
            if ($('body').height() > ($(document).scrollTop() + $(window).height() + 217)) {
                window['asideElement'].addClass('right-block-fixed');
            }

            if ($(document).scrollTop() + $(window).height() > ($('body').height() - 167)) {
                window['asideElement'].addClass('right-block-fixed2')
                    .css('marginTop', +$('body').height() - window['asideElement'].height() - 427 + 'px');
            }
            else {
                window['asideElement'].removeClass('right-block-fixed2')
                    .css('marginTop', '0px');
            }
        } else {
            window['asideElement'].removeClass('right-block-fixed');
            window['asideElement'].css('marginTop', '0px');
        }
    }

    $(document).scroll(function () {
        window['onScrollFunction']();
    });


    window['updateRightBlockPosition'] = function () {
        window['onScrollFunction']();
        window.setTimeout(window['updateRightBlockPosition'], 30);
    }
    window['updateRightBlockPosition']();


    /**
     * vote
     */
    $('.votes input.button').click(function () {
        if ($(this).hasClass('disable')) {
            return;
        }

        if ($('.votes input[name=vote]:checked').size() == 0) {
            $('.votes label').stop().animate({opacity: 0}, 150, function () {
                $('.votes label').stop().animate({opacity: 1}, 150, function () {
                    $('.votes label').stop().animate({opacity: 0}, 150, function () {
                        $('.votes label').stop().animate({opacity: 1}, 150, function () {

                        })
                    })
                })
            })
        }
        else {
            $(this).addClass('disable');
            $.ajax({
                url: '?saveVote=1',
                data: {
                    vote: $('.votes input[name=vote]:checked').val(),
                    pollId: $(this).next('input[name=pollId]').val()
                },
                success: function (data) {
                    $('.votes').height($('.votes').height() + 'px');
                    var height = $('.vote-ajax-holder').height();
                    $('.vote-ajax-holder').html(data);

                    $('.votes').animate({
                            height: $('.votes').height() + ($('.vote-ajax-holder').height() - height) + 'px'},
                        function () {
                            $('.votes .unvisible-element').removeClass('unvisible-element');
                            $('.votes .vote-result').each(function () {
                                $(this).animate({width: $(this).attr('width') + '%'});
                            });
                            $(this).removeClass('disable');
                        }
                    );
                },
                error: function () {
                    $(this).removeClass('disable');
                }
            });
        }

    });

    $('#topNews').height($('#topNews').height() + 'px');
    $('#topNews').data('current', 0);
    window['toggleTopNews'] = function () {
        $('#topNews li:last').css('opacity', 0)
            .show()
            .prependTo($('#topNews'))
            .animate({opacity: 1});

        window.setTimeout(toggleTopNews, 8000);
    }
    window.setTimeout(toggleTopNews, 8000);


    $('#comment-holder').height($('#comment-holder').height() + 'px');
    $('#comment-holder').data('current', 0);

    window['toggleTopComment'] = function () {
        $('#comment-holder div.comment:hidden:last')
            .css('opacity', 0)
            .show()
            .animate({opacity: 1
            }, function () {

            });

        if ($('#comment-holder').data('current') == 40) {
            $('#comment-holder div.comment')
                .not(':eq(40)')
                .not(':eq(41)')
                .not(':eq(42)')
                .not(':eq(43)')
                .not(':eq(44)')
                .not(':eq(45)')
                .hide();
        }
        $('#comment-holder').data('current', $('#comment-holder').data('current') + 1);
        window.setTimeout(toggleTopComment, 8000);
    }
    window.setTimeout(toggleTopComment, 8000);
    $('ul.news li a').hover(function () {
        $(this).find('span.hider').stop().animate({opacity: 0.2}, 'fast');
    }, function () {
        $(this).find('span.hider').stop().animate({opacity: 0}, 'fast');
    });
    $('.newsletter form input[type=submit]').click(function () {
        if ($('.newsletter input[name=name]').val() == '' || $('.newsletter input[name=name]').val() == 'Name') {
            $('.newsletter input[name=name]').addClass('error_input');
        }
        if ($('.newsletter input[name=email]').val() == '' || $('.newsletter input[name=email]').val() == 'E-Mail') {
            $('.newsletter input[name=email]').addClass('error_input');
        }
        if (!validateEmail($('.newsletter input[name=email]').val())) {
            $('.newsletter input[name=email]').addClass('error_input');
        }
        if ($('.newsletter input[name=vorname]').val() == '' || $('.newsletter input[name=vorname]').val() == 'Vorname') {
            $('.newsletter input[name=vorname]').addClass('error_input');
        }

        if ($('.newsletter input.error_input').size() != 0) {
            return false;
        }

        $.ajax({
            url: '?newsletter=1',
            data: {
                name: $('.newsletter input[name=name]').val(),
                vorname: $('.newsletter input[name=vorname]').val(),
                email: $('.newsletter input[name=email]').val()
            },
            success: function () {
                $('.newsletter').html(
                    '<h3>Newsletter abonnieren</h3>' +
                        '<p>' +
                        'Besten Dank für Ihre Anmeldung!' +
                        '</p><br>' +
                        '<p>' +
                        'Freundliche Grüsse<br>' +
                        'Ihre POLIZEINEWS' +
                        '</p>'
                );
            }
        });
        return false;
    });
    $('.page-leserreporter .check-box span').click(function () {
        $(this).toggleClass('checked');
        $(this).find('input').val(
            $(this).hasClass('checked') ? 1 : 0
        );
        return false;
    })

    $('.newsletter form input[name=vorname]').focus(function () {
        $('.newsletter form').addClass('focused');
        $('.newsletter form').stop()
            .animate({opacity: 1});
        $(this).removeClass('error_input');
        if ($(this).val() == 'Vorname')
            $(this).val('');
    }).blur(function () {
            $('.newsletter form').removeClass('focused');
            if (!$('.newsletter form').hasClass('hovered')) {
                $('.newsletter form').stop()
                    .animate({opacity: 0.4});
            }
            if ($(this).val() == '')
                $(this).val('Vorname');
        });
    $('.newsletter form input[name=name]').focus(function () {
        $('.newsletter form').addClass('focused');
        $('.newsletter form').stop()
            .animate({opacity: 1});
        $(this).removeClass('error_input');
        if ($(this).val() == 'Name')
            $(this).val('');
    }).blur(function () {
            $('.newsletter form').removeClass('focused');
            if (!$('.newsletter form').hasClass('hovered')) {
                $('.newsletter form').stop()
                    .animate({opacity: 0.4});
            }
            if ($(this).val() == '')
                $(this).val('Name');
        });
    $('.newsletter form input[name=email]').focus(function () {
        $('.newsletter form').addClass('focused');
        $('.newsletter form').stop()
            .animate({opacity: 1});
        $(this).removeClass('error_input');
        if ($(this).val() == 'E-Mail')
            $(this).val('');
    }).blur(function () {
            $('.newsletter form').removeClass('focused');
            if (!$('.newsletter form').hasClass('hovered')) {
                $('.newsletter form').stop()
                    .animate({opacity: 0.4});
            }
            if ($(this).val() == '')
                $(this).val('E-Mail');
        });

    $('.newsletter form input[type=submit]').focus(function () {
        $('.newsletter form').addClass('focused');
        $('.newsletter form').stop()
            .animate({opacity: 1});
    }).blur(function () {
            $('.newsletter form').removeClass('focused');
            if (!$('.newsletter form').hasClass('hovered')) {
                $('.newsletter form').stop()
                    .animate({opacity: 0.4});
            }
        });

    $('.newsletter').hover(function () {
        $('.newsletter form').stop()
            .addClass('hovered')
            .animate({opacity: 1});
    }, function () {
        $('.newsletter form').removeClass('hovered');
        if (!$('.newsletter form').hasClass('focused')) {
            $('.newsletter form').stop()
                .animate({opacity: 0.4});
        }
    });


    $('.weather .arrow-bottom').click(function(){
        clearTimeout(window['weatherTimeOut']);
        $('.weather-list').stop();
        $('.weather-list')
            .show()
            .animate({
                opacity: 1
            });
    });

    $('.weather').hover(function () {

    }, function () {
        window['weatherTimeOut'] = window.setTimeout(function () {
            $('.weather-list').stop()
                .hide();
        }, 500);
    });

    $('.weather-list').hover(function () {
        clearTimeout(window['weatherTimeOut']);
        $('.weather-list').stop();

        $('.weather-list')
            .show()
            .css({
                opacity: 1
            });
    }, function () {
        window['weatherTimeOut'] = window.setTimeout(function () {
            $('.weather-list').stop()
                .animate({
                    opacity: 0
                }, function () {
                    $(this).hide();
                });
        }, 500);
    })

    $('.page .search input').focus(function () {
        $('.page .search').addClass('hovered');
    }).blur(function () {
            $('.page .search').removeClass('hovered');
        });

    $('.page .search-page input').focus(function () {
        $('.page .search-page').addClass('search-page-hovered');
    }).blur(function () {
            if($(this).val()!='Suchbegriff...' && $(this).val()!='') {
                $('.page .search-page').removeClass('search-page-hovered');
            }
        });

    $('.weather-list a').click(function () {
        $('.weather span:eq(2)').html(
            $(this).find('span:eq(0)').html()
        );
        $('.weather span:eq(3)').html(
            $(this).find('span:eq(1)').html()
        );
        $.cookie('weather', $(this).attr('id'));
        return false;
    });

    $('.gallery-middle a.nav').hover(function(){
        $(this).stop()
            .animate({
                opacity:1
            });
    },function(){
        $(this).stop()
            .animate({
                opacity:0.6
            });
    })
    $('.gallery-middle a.nav-right').click(function(){
        if(window['galleryLeft']==undefined) {
            window['galleryLeft'] = 0;
        }
        window['galleryLeft']++;
        if($('.gallery-middle .gallery-lenta div img').size()==window['galleryLeft']) {
            window['galleryLeft'] = 0;
        }
        $('.gallery-middle .gallery-lenta div').stop()
            .animate({
                marginLeft:'-' + (window['galleryLeft']*300) + 'px'
            })
        return false;
    });
    $('.gallery-middle a.nav-left').click(function(){
        if(window['galleryLeft']==undefined) {
            window['galleryLeft'] = 0;
        }
        window['galleryLeft']--;
        if(window['galleryLeft']==-1) {
            window['galleryLeft'] = $('.gallery-middle .gallery-lenta div img').size() - 1;
        }
        $('.gallery-middle .gallery-lenta div').stop()
            .animate({
                marginLeft:'-' + (window['galleryLeft']*300) + 'px'
            })
        return false;
    });
});

function popup(filename, width, height) {
    var winl = (screen.width - width) / 2;
    var wint = (screen.height - height) / 2;
    if (typeof fenster == 'undefined' || fenster.closed == true) {
        fenster = window.open('' + filename, 'jobs', 'scrollbars=yes,menubar=no,toolbar=no,status=yes,directories=no,location=no,width=' + width + ',height=' + height + ',top=' + wint + ',left=' + winl + ',resizable=yes');
    } else {
        fenster.close();
        fenster = window.open('' + filename, 'jobs', 'scrollbars=yes,menubar=no,toolbar=no,status=yes,directories=no,location=no,width=' + width + ',height=' + height + ',top=' + wint + ',left=' + winl + ',resizable=yes');
    }
    if (parseInt(navigator.appVersion) >= 4) {
        fenster.window.focus();
    }
}

function filterBerufsgruppe(berufsgruppe_id) {
    document.list.p.value = "";
    document.list.displayWeb.value = "";
    document.list.berufsgruppe.value = berufsgruppe_id;
    document.list.submit();
}

function filterBerufsgruppeSelect() {
    document.list.p.value = "";
    document.list.displayWeb.value = "";
    document.list.fachbereich_id.value = 0;
    document.list.submit();
}

function filterFachbereich(fachbereich_id) {
    document.list.p.value = "";
    document.list.displayWeb.value = "";
    document.list.fachbereich_id.value = fachbereich_id;
    document.list.submit();
}

function filter() {
    document.list.p.value = "";
    document.list.displayWeb.value = "";
    document.list.submit();
}

function unfilter(element) {
    if (element == "stichwort") {
        document.list.q.value = "";
    } else {
        document.list.unsetRubrik.value = 1;
    }
    document.list.p.value = "";
    document.list.displayWeb.value = "";
    document.list.submit();
}

function webResultate() {
    document.list.p.value = "";
    document.list.displayWeb.value = 1;
    document.list.submit();
}

function jobsResultate() {
    document.list.p.value = "";
    document.list.displayWeb.value = 0;
    document.list.submit();
}

function textSuche() {
    document.list.p.value = "";
    document.list.displayWeb.value = 0;
    document.list.submit();
}

function view(set) {
    document.list.p.value = set;
    document.list.submit();
}

function lang(code) {
    document.list.sprache.value = code;
    document.list.submit();
}