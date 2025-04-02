$.getScript("https://cdn.jsdelivr.net/gh/twbs/bootstrap@v3.3.5/js/tooltip.min.js");

let curLayoutID;
if ((curLayoutID = /\/layout\/(\d+)\//.exec(document.currentScript.src)) !== null)
    curLayoutID = curLayoutID[1];

$( () => {
    setTimeout( () => {

        if (typeof window.gcAccountUserMenu == "undefined" || !window.gcAccountUserMenu)
            return;

        $(window).on('load resize', () => {
            if ($('#gcAccountUserMenu').is(':visible')) {
                $('body .gc-main-content:not(.front-page-content)').parent().css('min-height', $('#gcAccountUserMenu .inner-wrapper-sticky').height());
            }
        }
        );

        $.each(window.gcAccountUserMenu.items, (i, el) => {
            $('#gcAccountUserMenu .menu-item-' + el.id).append('<div class="submenu-wrapper"/>');
            if (typeof el.subitems !== "undefined" && el.subitems.length > 0) {
                if (el.subitems.length > 1) {
                    $('#gcAccountUserMenu .menu-item-' + el.id + ' a').append('<div class="submenu-arrow" />')
                    $.each(el.subitems, (i2, el2) => {
                        el2.url = el2.url == "/user/my/profile" ? "/profile" : el2.url;
                        el2.url = el2.url == "/user/my/changePassword" ? "/change-password" : el2.url;
                        el2.url = el2.url.indexOf("/pl/chatium/school/enter") > -1 ? el2.url.replace("/pl/chatium/school/enter", "/chatium") : el2.url;
                        $('#gcAccountUserMenu .menu-item-' + el.id + ' .submenu-wrapper').append(`
           <a href="${el2.url}" class="submenu-item submenu-item-${el2.id}">
             <span>${el2.label}</span>
             <span class="submenu-notify-count"></span>
           </a>
          `);
                    }
                    );
                } else {
                    el.subitems[0].url = el.subitems[0].url == "/user/my/profile" ? "/profile" : el.subitems[0].url;
                    el.subitems[0].url = el.subitems[0].url == "/user/my/changePassword" ? "/change-password" : el.subitems[0].url;
                    el.subitems[0].url = el.subitems[0].url == "/pl/chatium/school/enter" ? "/chatium" : el.subitems[0].url;
                    $('#gcAccountUserMenu .menu-item-' + el.id + ' a').attr('href', el.subitems[0].url);
                }
            }
            $('#gcAccountUserMenu').addClass('menu-ready');
        }
        );

        let m_profile = $('#gcAccountUserMenu .gc-account-user-menu li.menu-item-profile');
        $(m_profile).find('a .menu-item-icon[src="/public/img/default_profile_50.png"]').wrapAll('<div class="defaut-img-wrapper" />');
        $(m_profile).children('a').attr('data-username', window.accountSafeUserName);
        $.getJSON("/c/sa/user/profile/" + window.accountUserId, function(userdata) {
            if (typeof userdata.success !== "undefined" && userdata.success === true) {
                $.each(userdata.data.blocks, (i, bl) => {
                    if (typeof bl.title !== "undefined" && /(.+)@(.+){2,}\.(.+){2,}/.test(bl.title)) {
                        $(m_profile).children('a').attr('data-username', window.accountSafeUserName).attr('data-email', bl.title);
                    }
                }
                );
            }
        });

        $(document).click( (e) => {

            // Если были открыты уведомления, то при клике вне их, закрыть их.
            var $target = $(e.target);
            let submenu = '#gcAccountUserMenu .gc-account-user-submenu-bar';
            let except_btn = '#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li.menu-item-notifications_button_small';
            if (!$target.closest(submenu + ", " + except_btn).length)
                $(submenu).hide();

            // Если было развёрнуто меню из компактного режима, то, при клике вне меню, свернуть обратно в компактный.  
            if (!$('body').hasClass('compact-menu') && (Cookies.get('compact-menu') === "true" || $('body').hasClass('compact-menu-by-default')) && !$(e.target).closest('#gcAccountUserMenu').length) {
                $('body').addClass('compact-menu');
                $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').removeClass('selected').nextAll('.submenu-wrapper:visible').slideUp('fast');
                m_updateStickyInterval();
                $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').tooltip('enable');
            }

        }
        );

        /*
  $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li.menu-item-notifications_button_small').click((e)=>{ 
    if(window.matchMedia("(max-width: 768px)").matches) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); 
      window.location.href = "/notifications/notifications/all";
    }       
  });
  */
        $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li:not(.menu-item-notifications_button_small) > a').off();
        $(document).on('click', '#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li:not(.menu-item-notifications_button_small) > a', (e) => {
            if (window.matchMedia("(max-width: 768px)").matches && $(e.target).is('#gcAccountUserMenu .gc-account-leftbar.expanded .gc-account-user-menu li.menu-item-profile .submenu-arrow')) {
                hideMobMenu(e);
                return false;
            }
            let submenu_wrapper = $(e.currentTarget).nextAll('.submenu-wrapper:not(:empty)');
            if ($(submenu_wrapper).length > 0) {
                if ($('body').hasClass('compact-menu')) {
                    $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').trigger('mouseout').tooltip('hide').tooltip('disable');
                    $('body').removeClass('compact-menu');
                    setTimeout( () => {
                        $(e.currentTarget).toggleClass('selected');
                        $(submenu_wrapper).stop().slideToggle();
                    }
                    , 300);
                } else {
                    $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').not(e.currentTarget).removeClass('selected');
                    $('.submenu-wrapper').stop().slideUp();
                    setTimeout( () => {
                        $(e.currentTarget).toggleClass('selected');
                        $(submenu_wrapper).stop().slideToggle();
                    }
                    );
                }
                m_updateStickyInterval();
                return false;
            }
        }
        );
        $('#gcAccountUserMenu .gc-account-user-menu').after(`
    <div class="custom-btns-wrapper">
      <a class="custom-btn" href="javascript:void(0)" onclick="m_custom_btn_click()"><span></span></a>
      <a class="menutoggle-btn" href="javascript:void(0)"><span>cвернуть</span></a>
    </div>
  `);
        if (window.location.href.indexOf('/pl/tasks/resp') > -1 && (["", `"javascript://$('.activated-talks-widget').data('gc-talksWidget').showTalksWindow()"`].indexOf(getComputedStyle($('#gcAccountUserMenu')[0]).getPropertyValue('--m-custom-btn-url').trim()) > -1)) {
            $("#gcAccountUserMenu .custom-btns-wrapper .custom-btn").hide();
        }

        $('#gcAccountUserMenu .menutoggle-btn').on('click touchend', (e) => {
            if ($('#gcAccountUserMenu .gc-account-leftbar').is('.expanded')) {
                hideMobMenu(e);
                return false;
            }
            if ($('body').hasClass('compact-menu')) {
                $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').trigger('mouseout').tooltip('hide').tooltip('disable');
                Cookies.set('compact-menu', false, {
                    expires: 10000,
                    path: '/'
                });
            } else {
                $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').tooltip('enable');
                Cookies.set('compact-menu', true, {
                    expires: 10000,
                    path: '/'
                });
                $('#gcAccountUserMenu .gc-account-leftbar').animate({
                    top: 0
                }, 300);
            }
            $('body').toggleClass('compact-menu');
            $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').removeClass('selected').nextAll('.submenu-wrapper:visible').slideUp('fast');
            m_updateStickyInterval();
            return false;
        }
        );

        // Fix для Safari
        if ($('#gcAccountUserMenu .gc-account-leftbar').length) {
            $('#gcAccountUserMenu .gc-account-leftbar')[0].addEventListener('affixed.top.stickySidebar', () => {
                $('#gcAccountUserMenu .gc-account-leftbar .inner-wrapper-sticky').css({
                    'transform': ''
                });
            }
            );
        }

        $('#gcAccountUserMenu .gc-account-user-menu li.menu-item > a').each( (i, el) => {
            let title = $(el).attr("title");
            title = title == "Служба поддержки" ? "Сообщения" : title;
            title = $(el).parent().is('.menu-item-notifications_button_small') ? "Уведомления" : title;
            $(el).removeAttr("title");
            $(el).attr("data-title", title);
        }
        );

        // Убираем рекламу марафона
        $('#gcAccountUserMenu li.menu-item-marathon:has(a[href="https://getcourse.ru/course/marafon"])').hide();

        // Добавляем кастомные ГКшные стили меню
        let LMenuCustomStyles = $('style:contains(".custom-menu ")');
        if (LMenuCustomStyles.length) {
            let assoc = {
                ".custom-menu .gc-account-leftbar, .custom-menu .gc-account-leftbar .gc-account-user-menu, .custom-menu .gc-account-leftbar .toggle-link background-color": "menu_color_bg",
                ".custom-menu .gc-account-leftbar .gc-account-user-menu li a background-color": "menu_color_bg_item",
                ".custom-menu .gc-account-leftbar .gc-account-user-menu li.active a, .custom-menu .gc-account-leftbar .gc-account-user-menu li.selected a background-color": "menu_color_bg_item_active",
                ".custom-menu .gc-account-leftbar .gc-account-user-menu li a:hover background-color": "menu_color_bg_item_hover",
                ".custom-menu .gc-account-leftbar .gc-account-user-submenu-bar, .custom-menu .gc-account-leftbar .gc-account-user-submenu-bar-notifications_button_small .notification-group.notification-status-viewed background-color": "menu_color_bg_submenu",
                ".custom-menu .gc-account-user-submenu-bar .gc-account-user-submenu li a:hover background-color": "menu_color_bg_submenu_hover",
                ".custom-menu .gc-account-leftbar .gc-account-user-menu li .notify-count, .custom-menu .gc-account-leftbar .gc-account-user-submenu li .notify-count background-color": "menu_notification",
                ".custom-menu .gc-account-leftbar .menu-item-label color": "menu_font_color_label",
                ".custom-menu .gc-account-leftbar li.active .menu-item-label, .custom-menu .gc-account-leftbar li.selected .menu-item-label color": "menu_font_color_item_active",
                ".custom-menu .gc-account-user-submenu-bar .gc-account-user-submenu a, .custom-menu .gc-account-leftbar .gc-account-user-submenu-bar-notifications_button_small .notification-group.notification-status-viewed, .custom-menu .gc-account-leftbar .gc-account-user-submenu-bar-notifications_button_small .notification-group .date color": "menu_font_color_submenu",
                ".custom-menu .gc-account-user-submenu-bar h3 color": "menu_font_color_submenu_header",
                ".custom-menu .gc-account-leftbar .menu-item-label font-family": "menu_font_style_label",
                ".custom-menu .gc-account-user-submenu-bar .gc-account-user-submenu li a, .custom-menu .gc-account-user-submenu-bar h3 font-family": "menu_font_style_item",
            }
            let LMCustomCSSVariables = "<style>:root{";
            $.each(LMenuCustomStyles.get(0).sheet.cssRules, (i, rule) => {
                if (typeof rule.style[0] !== "undefined") {
                    let key = rule.selectorText + " " + rule.style[0];
                    if (typeof assoc[key] !== "undefined") {
                        let value = rule.style[rule.style[0]];
                        value = rule.style[0] == "font-family" ? value + ", Jost, Lato, Helvetica, Arial, sans-serif" : value;
                        LMCustomCSSVariables += "--cslm-" + assoc[key] + ":" + value + ";";
                    }
                }
            }
            );
            LMCustomCSSVariables += "}</style>";
            $('head').append(LMCustomCSSVariables);
        }

        $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').tooltip({
            container: 'body',
            boundary: 'window',
            placement: 'right',
            trigger: 'hover',
            template: `
      <div class="tooltip remake-menu-tooltip" role="tooltip">
        <div class="tooltip-inner"></div>
        <style>
          .remake-menu-tooltip.tooltip.right {
            padding: 0 5px;
            margin-left: 18px;
          }
          .remake-menu-tooltip.tooltip.in {
            filter: alpha(opacity=100);
            opacity: 1;
          }
          .remake-menu-tooltip .tooltip-inner {
            max-width: 200px;
            padding: 3px 8px;
            color: var(--color-0);
            text-align: center;
            background-color: var(--color-1);
            border-radius: 6px;
            font-size: 13px;
            font-family: var(--font-family-2);
            font-style: normal;
            font-weight: 400;
            box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.05);
          }
        </style>
      </div>`,
            title: $(this).attr('data-title'),
        });
        if (!$('body').hasClass('compact-menu')) {
            $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li > a').trigger('mouseout').tooltip('hide').tooltip('disable');
        }

        // Fix отступа в рассылках
        if (window.location.href.indexOf('/notifications/control/mailings/update/') > -1) {
            $('body').append(`<style>
        body .main-page-block { padding-bottom: 200px!important;' }
      </style>`);
        }

        //Новая мобилка
        if ($(window).width() <= 768) {
            $('.custom-btns-wrapper').after(`<a class="custom-btn-close-menu" href="javascript:void(0)" onclick="$('.gc-account-leftbar').removeClass('expanded')">Закрыть меню</a>`);
        }

        //Фикс уведомлений
        $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu li:not(.menu-item-notifications_button_small) > a').click(function() {
            $('#gcAccountUserMenu .gc-account-user-submenu-bar.gc-account-user-submenu-bar-notifications_button_small').hide()
        })

    }
    )
}
);
function hideMobMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    $('#gcAccountUserMenu .gc-account-leftbar').removeClass("expanded").find('.gc-account-user-menu').hide();
    $('html').removeClass('open-menu');
}
function showMobMenu(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    $('#gcAccountUserMenu .gc-account-leftbar').toggleClass("expanded")
    //.find('.gc-account-user-menu').toggle();
    $('html').toggleClass('open-menu');
    $('#gcAccountUserMenu .gc-account-leftbar>.inner-wrapper-sticky').scrollTop(0);
}
function showNotifications(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (window.PageChecker.isChatium) {
        window.location.href = "/notifications/notifications/all";
    } else {
        $('#gcAccountUserMenu .gc-account-leftbar .gc-account-user-menu>li.menu-item-notifications_button_small a').trigger("click");
    }
}
function m_custom_btn_click() {
    let btn_action = getComputedStyle($('#gcAccountUserMenu')[0]).getPropertyValue('--m-custom-btn-url');
    if (btn_action != "") {
        btn_action = btn_action.replace(/^\s*?"|^\s*?'|"\s*?$|'\s*?$/g, '');
        // очищаем от кавычек в начале и в конце
        if (btn_action.indexOf('javascript://') > -1) {
            $.globalEval(btn_action.replace('javascript://', ''));
        } else {
            location.href = btn_action;
        }
    } else
        $('.activated-talks-widget').data('gc-talksWidget').showTalksWindow();
}
function m_updateStickyInterval() {
    let updateStickyInterval_i = 0;
    let updateStickyInterval = setInterval( () => {
        $('.gc-account-leftbar').stickySidebar("updateSticky");
        updateStickyInterval_i++;
        if (updateStickyInterval_i >= 30) {
            clearInterval(updateStickyInterval);
            updateStickyInterval_i = 0;
        }
    }
    , 10);
}

function addRemakeSubmenuBtn(section, position, name, url, class_name) {
    let new_node = `<a href="${url}" class="submenu-item ${class_name}"><span>${name}</span></a>`;
    let $submenu_wrp = $(`#gcAccountUserMenu .${section} .submenu-wrapper`);
    if (position <= $submenu_wrp.find('.submenu-item').length) {
        $submenu_wrp.find('.submenu-item').eq(position - 1).before(new_node);
    } else {
        $submenu_wrp.append(new_node);
    }
}

function addRemakeMenuBtn(position, name, url, class_name) {
    let new_node = `
    <li class="menu-item ${class_name}">
      <a href="${(url ? url : 'javascript:void(0)')}" data-title="${name}"></a>
      <div class="submenu-wrapper"></div>
    </li>`;
    let $menu_wrp = $(`#gcAccountUserMenu .gc-account-user-menu`);
    if (position <= $menu_wrp.find('.menu-item').length) {
        $menu_wrp.find('.menu-item').eq(position - 1).before(new_node);
    } else {
        $menu_wrp.append(new_node);
    }
}
function subloginMenuBtn(id) {
    $.get('/user/control/user/update/id/' + id, function(data) {
        var CSRF = $(data).find('input[name="YII_CSRF_TOKEN"]').val();
        $.ajax({
            type: "POST",
            url: "/user/control/user/update/id/" + id,
            data: {
                YII_CSRF_TOKEN: CSRF,
                "action": "sublogin"
            },
            success: () => {
                window.location.reload();
            }
        })
    });
}

function showManagerBox(page_link) {
    $('#gcAccountUserMenu .gc-account-user-menu').append(`<li class="m-manager-box"></li>`);
    ajaxEmbedPage(page_link, '.lt-onecolumn', '#gcAccountUserMenu .m-manager-box', () => {
        let $imagebox = $('#gcAccountUserMenu .m-manager-box .lt-block-wrapper .image-box');
        $imagebox.attr('style', '--background: url(' + $imagebox.attr('data-img-src') + ');');
    }
    );
    function ajaxEmbedPage(Url, EmbedPageSeletor, AppendTo, callback) {
        $.ajax({
            url: Url,
            dataType: 'text',
            success: function(data) {
                data = replaceAll(data, "<script", "<div class='script-div' style='display:none'");
                data = replaceAll(data, "</script", "</div");
                function replaceAll(txt, replace, with_this) {
                    return txt.replace(new RegExp(replace,'g'), with_this);
                }
                var menuPageDom = $('<xxx></xxx>').append($.parseHTML(data));
                var scripts = menuPageDom.find(EmbedPageSeletor + ' .script-div');
                menuPageDom.find('.lt-raw-js .script-div').remove();
                var menuBody = menuPageDom.find(EmbedPageSeletor).first();
                $(AppendTo).html(menuBody);
                callback();
                scripts.each(function(i) {
                    $.globalEval($(this).html().replace(/</g, '<').replace(/>/g, '>').replace(/&/g, '&'));
                })
            }
        });
    }
}

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
"use strict";
(function(a, b) {
    if (typeof define === "function" && define.amd) {
        define(b)
    } else {
        if (typeof exports === "object") {
            module.exports = b()
        } else {
            a.ResizeSensor = b()
        }
    }
}(typeof window !== "undefined" ? window : this, function() {
    if (typeof window === "undefined") {
        return null
    }
    var b = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
    var h = b.requestAnimationFrame || b.mozRequestAnimationFrame || b.webkitRequestAnimationFrame || function(i) {
        return b.setTimeout(i, 20)
    }
    ;
    var g = b.cancelAnimationFrame || b.mozCancelAnimationFrame || b.webkitCancelAnimationFrame || function(i) {
        b.clearTimeout(i)
    }
    ;
    function f(n, p) {
        var m = Object.prototype.toString.call(n);
        var o = ("[object Array]" === m || ("[object NodeList]" === m) || ("[object HTMLCollection]" === m) || ("[object Object]" === m) || ("undefined" !== typeof jQuery && n instanceof jQuery) || ("undefined" !== typeof Elements && n instanceof Elements));
        var l = 0
          , k = n.length;
        if (o) {
            for (; l < k; l++) {
                p(n[l])
            }
        } else {
            p(n)
        }
    }
    function c(i) {
        if (!i.getBoundingClientRect) {
            return {
                width: i.offsetWidth,
                height: i.offsetHeight
            }
        }
        var j = i.getBoundingClientRect();
        return {
            width: Math.round(j.width),
            height: Math.round(j.height)
        }
    }
    function e(i, j) {
        Object.keys(j).forEach(function(k) {
            i.style[k] = j[k]
        })
    }
    var d = function(i, m) {
        var k = 0;
        function l() {
            var p = [];
            this.add = function(q) {
                p.push(q)
            }
            ;
            var o, n;
            this.call = function(q) {
                for (o = 0,
                n = p.length; o < n; o++) {
                    p[o].call(this, q)
                }
            }
            ;
            this.remove = function(r) {
                var q = [];
                for (o = 0,
                n = p.length; o < n; o++) {
                    if (p[o] !== r) {
                        q.push(p[o])
                    }
                }
                p = q
            }
            ;
            this.length = function() {
                return p.length
            }
        }
        function j(p, D) {
            if (!p) {
                return
            }
            if (p.resizedAttached) {
                p.resizedAttached.add(D);
                return
            }
            p.resizedAttached = new l();
            p.resizedAttached.add(D);
            p.resizeSensor = document.createElement("div");
            p.resizeSensor.dir = "ltr";
            p.resizeSensor.className = "resize-sensor";
            var B = {
                pointerEvents: "none",
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
                overflow: "hidden",
                zIndex: "-1",
                visibility: "hidden",
                maxWidth: "100%"
            };
            var r = {
                position: "absolute",
                left: "0px",
                top: "0px",
                transition: "0s"
            };
            e(p.resizeSensor, B);
            var n = document.createElement("div");
            n.className = "resize-sensor-expand";
            e(n, B);
            var y = document.createElement("div");
            e(y, r);
            n.appendChild(y);
            var x = document.createElement("div");
            x.className = "resize-sensor-shrink";
            e(x, B);
            var E = document.createElement("div");
            e(E, r);
            e(E, {
                width: "200%",
                height: "200%"
            });
            x.appendChild(E);
            p.resizeSensor.appendChild(n);
            p.resizeSensor.appendChild(x);
            p.appendChild(p.resizeSensor);
            var u = window.getComputedStyle(p);
            var H = u ? u.getPropertyValue("position") : null;
            if ("absolute" !== H && "relative" !== H && "fixed" !== H && "sticky" !== H) {
                p.style.position = "relative"
            }
            var v = false;
            var G = 0;
            var z = c(p);
            var q = 0;
            var C = 0;
            var t = true;
            k = 0;
            var o = function() {
                var J = p.offsetWidth;
                var I = p.offsetHeight;
                y.style.width = (J + 10) + "px";
                y.style.height = (I + 10) + "px";
                n.scrollLeft = J + 10;
                n.scrollTop = I + 10;
                x.scrollLeft = J + 10;
                x.scrollTop = I + 10
            };
            var F = function() {
                if (t) {
                    var I = p.offsetWidth === 0 && p.offsetHeight === 0;
                    if (I) {
                        if (!k) {
                            k = h(function() {
                                k = 0;
                                F()
                            })
                        }
                        return
                    } else {
                        t = false
                    }
                }
                o()
            };
            p.resizeSensor.resetSensor = F;
            var s = function() {
                G = 0;
                if (!v) {
                    return
                }
                q = z.width;
                C = z.height;
                if (p.resizedAttached) {
                    p.resizedAttached.call(z)
                }
            };
            var w = function() {
                z = c(p);
                v = z.width !== q || z.height !== C;
                if (v && !G) {
                    G = h(s)
                }
                F()
            };
            var A = function(K, J, I) {
                if (K.attachEvent) {
                    K.attachEvent("on" + J, I)
                } else {
                    K.addEventListener(J, I)
                }
            };
            A(n, "scroll", w);
            A(x, "scroll", w);
            k = h(function() {
                k = 0;
                F()
            })
        }
        f(i, function(n) {
            j(n, m)
        });
        this.detach = function(n) {
            if (!k) {
                g(k);
                k = 0
            }
            d.detach(i, n)
        }
        ;
        this.reset = function() {
            i.resizeSensor.resetSensor()
        }
    };
    d.reset = function(i) {
        f(i, function(j) {
            j.resizeSensor.resetSensor()
        })
    }
    ;
    d.detach = function(i, j) {
        f(i, function(k) {
            if (!k) {
                return
            }
            if (k.resizedAttached && typeof j === "function") {
                k.resizedAttached.remove(j);
                if (k.resizedAttached.length()) {
                    return
                }
            }
            if (k.resizeSensor) {
                if (k.contains(k.resizeSensor)) {
                    k.removeChild(k.resizeSensor)
                }
                delete k.resizeSensor;
                delete k.resizedAttached
            }
        })
    }
    ;
    if (typeof MutationObserver !== "undefined") {
        var a = new MutationObserver(function(k) {
            for (var n in k) {
                if (k.hasOwnProperty(n)) {
                    var l = k[n].addedNodes;
                    for (var m = 0; m < l.length; m++) {
                        if (l[m].resizeSensor) {
                            d.reset(l[m])
                        }
                    }
                }
            }
        }
        );
        document.addEventListener("DOMContentLoaded", function(i) {
            a.observe(document.body, {
                childList: true,
                subtree: true
            })
        })
    }
    return d
}));

!function(e, t) {
    "function" == typeof define && define.amd ? define(["./ResizeSensor.js"], t) : "object" == typeof exports ? module.exports = t(require("./ResizeSensor.js")) : (e.ElementQueries = t(e.ResizeSensor),
    e.ElementQueries.listen())
}("undefined" != typeof window ? window : this, function(e) {
    var t = function() {
        function t(e) {
            e || (e = document.documentElement);
            var t = window.getComputedStyle(e, null).fontSize;
            return parseFloat(t) || 16
        }
        function n(e) {
            if (!e.getBoundingClientRect)
                return {
                    width: e.offsetWidth,
                    height: e.offsetHeight
                };
            var t = e.getBoundingClientRect();
            return {
                width: Math.round(t.width),
                height: Math.round(t.height)
            }
        }
        function i(e, n) {
            var i = n.split(/\d/)
              , r = i[i.length - 1];
            switch (n = parseFloat(n),
            r) {
            case "px":
                return n;
            case "em":
                return n * t(e);
            case "rem":
                return n * t();
            case "vw":
                return n * document.documentElement.clientWidth / 100;
            case "vh":
                return n * document.documentElement.clientHeight / 100;
            case "vmin":
            case "vmax":
                var s = document.documentElement.clientWidth / 100
                  , o = document.documentElement.clientHeight / 100
                  , a = Math["vmin" === r ? "min" : "max"];
                return n * a(s, o);
            default:
                return n
            }
        }
        function r(e, t) {
            this.element = e;
            var r, s, o, a, l, u, d, m, c = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function() {
                o = n(this.element),
                u = {};
                for (r in f[t])
                    f[t].hasOwnProperty(r) && (s = f[t][r],
                    a = i(this.element, s.value),
                    l = "width" === s.property ? o.width : o.height,
                    m = s.mode + "-" + s.property,
                    d = "",
                    "min" === s.mode && l >= a && (d += s.value),
                    "max" === s.mode && a >= l && (d += s.value),
                    u[m] || (u[m] = ""),
                    d && -1 === (" " + u[m] + " ").indexOf(" " + d + " ") && (u[m] += " " + d));
                for (var e in c)
                    c.hasOwnProperty(e) && (u[c[e]] ? this.element.setAttribute(c[e], u[c[e]].substr(1)) : this.element.removeAttribute(c[e]))
            }
        }
        function s(t, n) {
            t.elementQueriesSetupInformation || (t.elementQueriesSetupInformation = new r(t,n)),
            t.elementQueriesSensor || (t.elementQueriesSensor = new e(t,function() {
                t.elementQueriesSetupInformation.call()
            }
            ))
        }
        function o(e, t, n, i) {
            if ("undefined" == typeof f[e]) {
                f[e] = [];
                var r = p.length;
                h.innerHTML += "\n" + e + " {animation: 0.1s element-queries;}",
                h.innerHTML += "\n" + e + " > .resize-sensor {min-width: " + r + "px;}",
                p.push(e)
            }
            f[e].push({
                mode: t,
                property: n,
                value: i
            })
        }
        function a(e) {
            var t;
            if (document.querySelectorAll && (t = e ? e.querySelectorAll.bind(e) : document.querySelectorAll.bind(document)),
            t || "undefined" == typeof $$ || (t = $$),
            t || "undefined" == typeof jQuery || (t = jQuery),
            !t)
                throw "No document.querySelectorAll, jQuery or Mootools's $$ found.";
            return t
        }
        function l(e) {
            var t = a(e);
            for (var n in f)
                if (f.hasOwnProperty(n))
                    for (var i = t(n, e), r = 0, o = i.length; o > r; r++)
                        s(i[r], n)
        }
        function u(t) {
            function n() {
                var e, n = !1;
                for (e in i)
                    i.hasOwnProperty(e) && r[e].minWidth && t.offsetWidth > r[e].minWidth && (n = e);
                if (n || (n = o),
                a !== n)
                    if (l[n])
                        i[a].style.display = "none",
                        i[n].style.display = "block",
                        a = n;
                    else {
                        var u = new Image;
                        u.onload = function() {
                            i[n].src = s[n],
                            i[a].style.display = "none",
                            i[n].style.display = "block",
                            l[n] = !0,
                            a = n
                        }
                        ,
                        u.src = s[n]
                    }
                else
                    i[n].src = s[n]
            }
            var i = []
              , r = []
              , s = []
              , o = 0
              , a = -1
              , l = [];
            for (var u in t.children)
                if (t.children.hasOwnProperty(u) && t.children[u].tagName && "img" === t.children[u].tagName.toLowerCase()) {
                    i.push(t.children[u]);
                    var d = t.children[u].getAttribute("min-width") || t.children[u].getAttribute("data-min-width")
                      , m = t.children[u].getAttribute("data-src") || t.children[u].getAttribute("url");
                    s.push(m);
                    var c = {
                        minWidth: d
                    };
                    r.push(c),
                    d ? t.children[u].style.display = "none" : (o = i.length - 1,
                    t.children[u].style.display = "block")
                }
            a = o,
            t.resizeSensorInstance = new e(t,n),
            n()
        }
        function d() {
            for (var e = a(), t = e("[data-responsive-image],[responsive-image]"), n = 0, i = t.length; i > n; n++)
                u(t[n])
        }
        function m(e) {
            var t, n, i, r;
            for (e = e.replace(/'/g, '"'); null !== (t = y.exec(e)); )
                for (n = t[1] + t[3],
                i = t[2]; null !== (r = g.exec(i)); )
                    o(n, r[1], r[2], r[3])
        }
        function c(e) {
            var t = "";
            if (e)
                if ("string" == typeof e)
                    e = e.toLowerCase(),
                    (-1 !== e.indexOf("min-width") || -1 !== e.indexOf("max-width")) && m(e);
                else
                    for (var n = 0, i = e.length; i > n; n++)
                        1 === e[n].type ? (t = e[n].selectorText || e[n].cssText,
                        -1 !== t.indexOf("min-height") || -1 !== t.indexOf("max-height") ? m(t) : (-1 !== t.indexOf("min-width") || -1 !== t.indexOf("max-width")) && m(t)) : 4 === e[n].type ? c(e[n].cssRules || e[n].rules) : 3 === e[n].type && e[n].styleSheet.hasOwnProperty("cssRules") && c(e[n].styleSheet.cssRules)
        }
        var h, f = {}, p = [], y = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/gim, g = /\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/gim, v = !1;
        this.init = function() {
            var t = "animationstart";
            "undefined" != typeof document.documentElement.style.webkitAnimationName ? t = "webkitAnimationStart" : "undefined" != typeof document.documentElement.style.MozAnimationName ? t = "mozanimationstart" : "undefined" != typeof document.documentElement.style.OAnimationName && (t = "oanimationstart"),
            document.body.addEventListener(t, function(t) {
                var n = t.target
                  , i = n && window.getComputedStyle(n, null)
                  , r = i && i.getPropertyValue("animation-name")
                  , o = r && -1 !== r.indexOf("element-queries");
                if (o) {
                    n.elementQueriesSensor = new e(n,function() {
                        n.elementQueriesSetupInformation && n.elementQueriesSetupInformation.call()
                    }
                    );
                    var a = window.getComputedStyle(n.resizeSensor, null)
                      , l = a.getPropertyValue("min-width");
                    l = parseInt(l.replace("px", "")),
                    s(t.target, p[l])
                }
            }),
            v || (h = document.createElement("style"),
            h.type = "text/css",
            h.innerHTML = "[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img {width: 100%;}",
            h.innerHTML += "\n@keyframes element-queries { 0% { visibility: inherit; } }",
            document.getElementsByTagName("head")[0].appendChild(h),
            v = !0);
            for (var n = 0, i = document.styleSheets.length; i > n; n++)
                try {
                    document.styleSheets[n].href && 0 === document.styleSheets[n].href.indexOf("file://") && console.warn("CssElementQueries: unable to parse local css files, " + document.styleSheets[n].href),
                    c(document.styleSheets[n].cssRules || document.styleSheets[n].rules || document.styleSheets[n].cssText)
                } catch (r) {}
            d()
        }
        ,
        this.findElementQueriesElements = function(e) {
            l(e)
        }
        ,
        this.update = function() {
            this.init()
        }
    };
    t.update = function() {
        t.instance.update()
    }
    ,
    t.detach = function(e) {
        e.elementQueriesSetupInformation ? (e.elementQueriesSensor.detach(),
        delete e.elementQueriesSetupInformation,
        delete e.elementQueriesSensor) : e.resizeSensorInstance && (e.resizeSensorInstance.detach(),
        delete e.resizeSensorInstance)
    }
    ,
    t.init = function() {
        t.instance || (t.instance = new t),
        t.instance.init()
    }
    ;
    var n = function(e) {
        if (document.addEventListener)
            document.addEventListener("DOMContentLoaded", e, !1);
        else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent))
            var t = setInterval(function() {
                /loaded|complete/i.test(document.readyState) && (e(),
                clearInterval(t))
            }, 10);
        else
            window.onload = e
    };
    return t.findElementQueriesElements = function(e) {
        t.instance.findElementQueriesElements(e)
    }
    ,
    t.listen = function() {
        n(t.init)
    }
    ,
    t
});

/**
 * sticky-sidebar - A JavaScript plugin for making smart and high performance.
 * @version v3.3.1
 * @link https://github.com/abouolia/sticky-sidebar
 * @author Ahmed Bouhuolia
 * @license The MIT License (MIT)
**/
!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e() : "function" == typeof define && define.amd ? define(e) : e()
}(0, function() {
    "use strict";
    function t(t, e) {
        if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function")
    }
    var e = function() {
        function t(t, e) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, i, n) {
            return i && t(e.prototype, i),
            n && t(e, n),
            e
        }
    }()
      , i = function() {
        var i = ".stickySidebar"
          , n = {
            topSpacing: 0,
            bottomSpacing: 0,
            containerSelector: !1,
            innerWrapperSelector: ".inner-wrapper-sticky",
            stickyClass: "is-affixed",
            resizeSensor: !0,
            minWidth: !1
        };
        return function() {
            function s(e) {
                var i = this
                  , o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (t(this, s),
                this.options = s.extend(n, o),
                this.sidebar = "string" == typeof e ? document.querySelector(e) : e,
                void 0 === this.sidebar)
                    throw new Error("There is no specific sidebar element.");
                this.sidebarInner = !1,
                this.container = this.sidebar.parentElement,
                this.affixedType = "STATIC",
                this.direction = "down",
                this.support = {
                    transform: !1,
                    transform3d: !1
                },
                this._initialized = !1,
                this._reStyle = !1,
                this._breakpoint = !1,
                this._resizeListeners = [],
                this.dimensions = {
                    translateY: 0,
                    topSpacing: 0,
                    lastTopSpacing: 0,
                    bottomSpacing: 0,
                    lastBottomSpacing: 0,
                    sidebarHeight: 0,
                    sidebarWidth: 0,
                    containerTop: 0,
                    containerHeight: 0,
                    viewportHeight: 0,
                    viewportTop: 0,
                    lastViewportTop: 0
                },
                ["handleEvent"].forEach(function(t) {
                    i[t] = i[t].bind(i)
                }),
                this.initialize()
            }
            return e(s, [{
                key: "initialize",
                value: function() {
                    var t = this;
                    if (this._setSupportFeatures(),
                    this.options.innerWrapperSelector && (this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector),
                    null === this.sidebarInner && (this.sidebarInner = !1)),
                    !this.sidebarInner) {
                        var e = document.createElement("div");
                        for (e.setAttribute("class", "inner-wrapper-sticky"),
                        this.sidebar.appendChild(e); this.sidebar.firstChild != e; )
                            e.appendChild(this.sidebar.firstChild);
                        this.sidebarInner = this.sidebar.querySelector(".inner-wrapper-sticky")
                    }
                    if (this.options.containerSelector) {
                        var i = document.querySelectorAll(this.options.containerSelector);
                        if ((i = Array.prototype.slice.call(i)).forEach(function(e, i) {
                            e.contains(t.sidebar) && (t.container = e)
                        }),
                        !i.length)
                            throw new Error("The container does not contains on the sidebar.")
                    }
                    "function" != typeof this.options.topSpacing && (this.options.topSpacing = parseInt(this.options.topSpacing) || 0),
                    "function" != typeof this.options.bottomSpacing && (this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0),
                    this._widthBreakpoint(),
                    this.calcDimensions(),
                    this.stickyPosition(),
                    this.bindEvents(),
                    this._initialized = !0
                }
            }, {
                key: "bindEvents",
                value: function() {
                    window.addEventListener("resize", this, {
                        passive: !0,
                        capture: !1
                    }),
                    window.addEventListener("scroll", this, {
                        passive: !0,
                        capture: !1
                    }),
                    this.sidebar.addEventListener("update" + i, this),
                    this.options.resizeSensor && "undefined" != typeof ResizeSensor && (new ResizeSensor(this.sidebarInner,this.handleEvent),
                    new ResizeSensor(this.container,this.handleEvent))
                }
            }, {
                key: "handleEvent",
                value: function(t) {
                    this.updateSticky(t)
                }
            }, {
                key: "calcDimensions",
                value: function() {
                    if (!this._breakpoint) {
                        var t = this.dimensions;
                        t.containerTop = s.offsetRelative(this.container).top,
                        t.containerHeight = this.container.clientHeight,
                        t.containerBottom = t.containerTop + t.containerHeight,
                        t.sidebarHeight = this.sidebarInner.offsetHeight,
                        t.sidebarWidth = this.sidebar.offsetWidth,
                        t.viewportHeight = window.innerHeight,
                        this._calcDimensionsWithScroll()
                    }
                }
            }, {
                key: "_calcDimensionsWithScroll",
                value: function() {
                    var t = this.dimensions;
                    t.sidebarLeft = s.offsetRelative(this.sidebar).left,
                    t.viewportTop = document.documentElement.scrollTop || document.body.scrollTop,
                    t.viewportBottom = t.viewportTop + t.viewportHeight,
                    t.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                    t.topSpacing = this.options.topSpacing,
                    t.bottomSpacing = this.options.bottomSpacing,
                    "function" == typeof t.topSpacing && (t.topSpacing = parseInt(t.topSpacing(this.sidebar)) || 0),
                    "function" == typeof t.bottomSpacing && (t.bottomSpacing = parseInt(t.bottomSpacing(this.sidebar)) || 0),
                    "VIEWPORT-TOP" === this.affixedType ? t.topSpacing < t.lastTopSpacing && (t.translateY += t.lastTopSpacing - t.topSpacing,
                    this._reStyle = !0) : "VIEWPORT-BOTTOM" === this.affixedType && t.bottomSpacing < t.lastBottomSpacing && (t.translateY += t.lastBottomSpacing - t.bottomSpacing,
                    this._reStyle = !0),
                    t.lastTopSpacing = t.topSpacing,
                    t.lastBottomSpacing = t.bottomSpacing
                }
            }, {
                key: "isSidebarFitsViewport",
                value: function() {
                    return this.dimensions.sidebarHeight < this.dimensions.viewportHeight
                }
            }, {
                key: "observeScrollDir",
                value: function() {
                    var t = this.dimensions;
                    if (t.lastViewportTop !== t.viewportTop) {
                        var e = "down" === this.direction ? Math.min : Math.max;
                        t.viewportTop === e(t.viewportTop, t.lastViewportTop) && (this.direction = "down" === this.direction ? "up" : "down")
                    }
                }
            }, {
                key: "getAffixType",
                value: function() {
                    var t = this.dimensions
                      , e = !1;
                    this._calcDimensionsWithScroll();
                    var i = t.sidebarHeight + t.containerTop
                      , n = t.viewportTop + t.topSpacing
                      , s = t.viewportBottom - t.bottomSpacing;
                    return "up" === this.direction ? n <= t.containerTop ? (t.translateY = 0,
                    e = "STATIC") : n <= t.translateY + t.containerTop ? (t.translateY = n - t.containerTop,
                    e = "VIEWPORT-TOP") : !this.isSidebarFitsViewport() && t.containerTop <= n && (e = "VIEWPORT-UNBOTTOM") : this.isSidebarFitsViewport() ? t.sidebarHeight + n >= t.containerBottom ? (t.translateY = t.containerBottom - i,
                    e = "CONTAINER-BOTTOM") : n >= t.containerTop && (t.translateY = n - t.containerTop,
                    e = "VIEWPORT-TOP") : t.containerBottom <= s ? (t.translateY = t.containerBottom - i,
                    e = "CONTAINER-BOTTOM") : i + t.translateY <= s ? (t.translateY = s - i,
                    e = "VIEWPORT-BOTTOM") : t.containerTop + t.translateY <= n && (e = "VIEWPORT-UNBOTTOM"),
                    t.translateY = Math.max(0, t.translateY),
                    t.translateY = Math.min(t.containerHeight, t.translateY),
                    t.lastViewportTop = t.viewportTop,
                    e
                }
            }, {
                key: "_getStyle",
                value: function(t) {
                    if (void 0 !== t) {
                        var e = {
                            inner: {},
                            outer: {}
                        }
                          , i = this.dimensions;
                        switch (t) {
                        case "VIEWPORT-TOP":
                            e.inner = {
                                position: "fixed",
                                top: i.topSpacing,
                                left: i.sidebarLeft - i.viewportLeft,
                                width: i.sidebarWidth
                            };
                            break;
                        case "VIEWPORT-BOTTOM":
                            e.inner = {
                                position: "fixed",
                                top: "auto",
                                left: i.sidebarLeft,
                                bottom: i.bottomSpacing,
                                width: i.sidebarWidth
                            };
                            break;
                        case "CONTAINER-BOTTOM":
                        case "VIEWPORT-UNBOTTOM":
                            var n = this._getTranslate(0, i.translateY + "px");
                            e.inner = n ? {
                                transform: n
                            } : {
                                position: "absolute",
                                top: i.translateY,
                                width: i.sidebarWidth
                            }
                        }
                        switch (t) {
                        case "VIEWPORT-TOP":
                        case "VIEWPORT-BOTTOM":
                        case "VIEWPORT-UNBOTTOM":
                        case "CONTAINER-BOTTOM":
                            e.outer = {
                                height: i.sidebarHeight,
                                position: "relative"
                            }
                        }
                        return e.outer = s.extend({
                            height: "",
                            position: ""
                        }, e.outer),
                        e.inner = s.extend({
                            position: "relative",
                            top: "",
                            left: "",
                            bottom: "",
                            width: "",
                            transform: this._getTranslate()
                        }, e.inner),
                        e
                    }
                }
            }, {
                key: "stickyPosition",
                value: function(t) {
                    if (!this._breakpoint) {
                        t = this._reStyle || t || !1;
                        var e = this.getAffixType()
                          , n = this._getStyle(e);
                        if ((this.affixedType != e || t) && e) {
                            var o = "affix." + e.toLowerCase().replace("viewport-", "") + i;
                            s.eventTrigger(this.sidebar, o),
                            "STATIC" === e ? s.removeClass(this.sidebar, this.options.stickyClass) : s.addClass(this.sidebar, this.options.stickyClass);
                            for (var r in n.outer)
                                this.sidebar.style[r] = n.outer[r];
                            for (var a in n.inner) {
                                var c = "number" == typeof n.inner[a] ? "px" : "";
                                this.sidebarInner.style[a] = n.inner[a] + c
                            }
                            var p = "affixed." + e.toLowerCase().replace("viewport-", "") + i;
                            s.eventTrigger(this.sidebar, p)
                        } else
                            this._initialized && (this.sidebarInner.style.left = n.inner.left);
                        this.affixedType = e
                    }
                }
            }, {
                key: "_widthBreakpoint",
                value: function() {
                    window.innerWidth <= this.options.minWidth ? (this._breakpoint = !0,
                    this.affixedType = "STATIC",
                    this.sidebar.removeAttribute("style"),
                    s.removeClass(this.sidebar, this.options.stickyClass),
                    this.sidebarInner.removeAttribute("style")) : this._breakpoint = !1
                }
            }, {
                key: "updateSticky",
                value: function() {
                    var t = this
                      , e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    this._running || (this._running = !0,
                    function(e) {
                        requestAnimationFrame(function() {
                            switch (e) {
                            case "scroll":
                                t._calcDimensionsWithScroll(),
                                t.observeScrollDir(),
                                t.stickyPosition();
                                break;
                            case "resize":
                            default:
                                t._widthBreakpoint(),
                                t.calcDimensions(),
                                t.stickyPosition(!0)
                            }
                            t._running = !1
                        })
                    }(e.type))
                }
            }, {
                key: "_setSupportFeatures",
                value: function() {
                    var t = this.support;
                    t.transform = s.supportTransform(),
                    t.transform3d = s.supportTransform(!0)
                }
            }, {
                key: "_getTranslate",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
                      , e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
                      , i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                    return this.support.transform3d ? "translate3d(" + t + ", " + e + ", " + i + ")" : !!this.support.translate && "translate(" + t + ", " + e + ")"
                }
            }, {
                key: "destroy",
                value: function() {
                    window.removeEventListener("resize", this, {
                        caption: !1
                    }),
                    window.removeEventListener("scroll", this, {
                        caption: !1
                    }),
                    this.sidebar.classList.remove(this.options.stickyClass),
                    this.sidebar.style.minHeight = "",
                    this.sidebar.removeEventListener("update" + i, this);
                    var t = {
                        inner: {},
                        outer: {}
                    };
                    t.inner = {
                        position: "",
                        top: "",
                        left: "",
                        bottom: "",
                        width: "",
                        transform: ""
                    },
                    t.outer = {
                        height: "",
                        position: ""
                    };
                    for (var e in t.outer)
                        this.sidebar.style[e] = t.outer[e];
                    for (var n in t.inner)
                        this.sidebarInner.style[n] = t.inner[n];
                    this.options.resizeSensor && "undefined" != typeof ResizeSensor && (ResizeSensor.detach(this.sidebarInner, this.handleEvent),
                    ResizeSensor.detach(this.container, this.handleEvent))
                }
            }], [{
                key: "supportTransform",
                value: function(t) {
                    var e = !1
                      , i = t ? "perspective" : "transform"
                      , n = i.charAt(0).toUpperCase() + i.slice(1)
                      , s = ["Webkit", "Moz", "O", "ms"]
                      , o = document.createElement("support").style;
                    return (i + " " + s.join(n + " ") + n).split(" ").forEach(function(t, i) {
                        if (void 0 !== o[t])
                            return e = t,
                            !1
                    }),
                    e
                }
            }, {
                key: "eventTrigger",
                value: function(t, e, i) {
                    try {
                        var n = new CustomEvent(e,{
                            detail: i
                        })
                    } catch (t) {
                        (n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, i)
                    }
                    t.dispatchEvent(n)
                }
            }, {
                key: "extend",
                value: function(t, e) {
                    var i = {};
                    for (var n in t)
                        void 0 !== e[n] ? i[n] = e[n] : i[n] = t[n];
                    return i
                }
            }, {
                key: "offsetRelative",
                value: function(t) {
                    var e = {
                        left: 0,
                        top: 0
                    };
                    do {
                        var i = t.offsetTop
                          , n = t.offsetLeft;
                        isNaN(i) || (e.top += i),
                        isNaN(n) || (e.left += n),
                        t = "BODY" === t.tagName ? t.parentElement : t.offsetParent
                    } while (t);
                    return e
                }
            }, {
                key: "addClass",
                value: function(t, e) {
                    s.hasClass(t, e) || (t.classList ? t.classList.add(e) : t.className += " " + e)
                }
            }, {
                key: "removeClass",
                value: function(t, e) {
                    s.hasClass(t, e) && (t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)","gi"), " "))
                }
            }, {
                key: "hasClass",
                value: function(t, e) {
                    return t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)","gi").test(t.className)
                }
            }]),
            s
        }()
    }();
    window.StickySidebar = i,
    function() {
        if ("undefined" != typeof window) {
            var t = window.$ || window.jQuery || window.Zepto;
            if (t) {
                t.fn.stickySidebar = function(e) {
                    return this.each(function() {
                        var n = t(this)
                          , s = t(this).data("stickySidebar");
                        if (s || (s = new i(this,"object" == typeof e && e),
                        n.data("stickySidebar", s)),
                        "string" == typeof e) {
                            if (void 0 === s[e] && -1 === ["destroy", "updateSticky"].indexOf(e))
                                throw new Error('No method named "' + e + '"');
                            s[e]()
                        }
                    })
                }
                ,
                t.fn.stickySidebar.Constructor = i;
                var e = t.fn.stickySidebar;
                t.fn.stickySidebar.noConflict = function() {
                    return t.fn.stickySidebar = e,
                    this
                }
            }
        }
    }()
});

// Скрываем счётчик уведомлений если нажата кнопка "Отметить прочитанными"
$(document).ajaxSuccess(function(event, xhr, settings) {
    if (settings.url.indexOf("/notifications/notifications/viewedAll") > -1) {
        let json = JSON.parse(xhr?.responseText);
        if (json.groups?.count?.new === "0") {
            setTimeout( () => {
                $('.menu-item-notifications_button_small .notify-count').hide();
            }
            );
        }
    }
});

$( () => {
    setTimeout( () => {
        $(document).trigger('remake-left-menu-ready');
    }
    )
}
);
