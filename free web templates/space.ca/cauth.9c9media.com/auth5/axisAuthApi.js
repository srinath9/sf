/*! axisAuthApi r5  build P 14.2.12l5

contact: Mariusz dot Maurer at Bellmedia dot Ca
*/
window.axisAuthApi = {},
axisAuthApi.name = "axisAuthApi",
axisAuthApi.ver = "R5P 14.2.12l5",
window.axisAuthApi.consoleLog = function(sourceModule)
{
    var me = this;
    return me.sourceModule = sourceModule, me.enable = document.location.search.indexOf("alfadebug") > -1 | document.location.search.indexOf("aginc0urt") > -1 ? !0 : !1, document.cookie.indexOf("alFadEbUg=125") > -1 && (me.enable = !0), function(messageText, logCode, options)
            {
                if (typeof console != "undefined")
                {
                    logCode && typeof logCode == "string" && (logCode = logCode.toUpperCase(), "EWID".indexOf(logCode) == -1 && console.log("not valid logcode: " + logCode)),
                    logCode && typeof logCode != "string" && console.log("not valid logcode: " + logCode),
                    options = options ? options : {};
                    var sourceModule = me.sourceModule ? "[" + me.sourceModule + "] " : "";
                    if (options.sourceFn = options.sourceFn ? options.sourceFn : "", logCode == "E" & options.hide != !0)
                    {
                        console.error(sourceModule + messageText);
                        return
                    }
                    if (logCode == "E" & me.enable)
                    {
                        console.error(sourceModule + messageText);
                        return
                    }
                    options.force | me.enable && (logCode == "W" ? console.warn(sourceModule + messageText) : logCode == "I" ? console.info(sourceModule + messageText) : logCode == "D" ? (options.extraDescr = options.extraDescr ? options.extraDescr : "", console.log(sourceModule + options.sourceFn + " " + options.extraDescr), console.dir(messageText)) : console.log(sourceModule + messageText))
                }
            }
},
function(parent)
{
    var me = {},
        log;
    me.ver = "13.10.23",
    me.name = "cfg",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.debug = document.location.search.indexOf("alfadebug") > -1 | document.location.search.indexOf("aginc0urt") > -1 ? !0 : !1,
    document.cookie.indexOf("alFadEbUg=125") > -1 && (me.debug = !0),
    me.baseApiUrl = "http://cauth.9c9media.com/auth5/",
    me.axisConfigUrl = "http://capi.9c9media.com/config/",
    me.devNote = "",
    me.baseApiUrl.indexOf("localhost") > -1 && (me.devNote = "DEV server!  - localhost"),
    me.baseApiUrl.indexOf("etsdev.ctv.ca") > -1 && (me.devNote = "STAGING server!  - etsdev.ctv.ca"),
    me.baseApiUrl.indexOf("esi2.ctv.ca") > -1 && (me.devNote = "STAGING server!  - esi2.ctv.ca"),
    me.baseApiUrl.indexOf("cauth.9c9media") > -1 && (me.devNote = ""),
    me.baseApiUrl.indexOf("wivx_videohub_dev") > -1 && (me.devNote = "test - wivx_videohub_dev.cms.9c9media.net"),
    me.axisConfigUrl.indexOf("stage") > -1 && (me.devNote = "STAGING Axis Config"),
    me.devNote != "" && log("WARNING: " + me.devNote, "E"),
    me.screenDoor = {},
    me.screenDoor.cookieExpiresDays = 30,
    me.configFromAxis
}(axisAuthApi),
function(parent)
{
    function convert2boolean(obj)
    {
        for (var prop in obj)
            typeof obj[prop] == "string" && obj[prop].toLowerCase() == "true" && (obj[prop] = !0),
            typeof obj[prop] == "string" && obj[prop].toLowerCase() == "false" && (obj[prop] = !1),
            parent.lib.isObject(obj[prop]) && convert2boolean(obj[prop]);
        return obj
    }
    function supportedVer()
    {
        var sv = parent.cfg.supportedVer,
            found = !1,
            prop;
        if (sv)
        {
            for (prop in sv)
                parent.cfg.baseApiUrl.indexOf(prop) > -1 && (found = !0, sv[prop] != axisAuthApi.ver && log("Release build out of date. Latest build: " + sv[prop], "E"));
            found || log(" O B S O L E T E  UNSUPPORTED VERSION - " + parent.cfg.baseApiUrl, "E")
        }
        return found
    }
    var me = {},
        log;
    me.ver = "13.10.23",
    me.name = "configFromAxis",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.get = function(fnCallback)
    {
        if (parent.cfg.configFromAxis)
        {
            fnCallback();
            return
        }
        var destCode = parent.vhBrand.destinationCode ? parent.vhBrand.destinationCode + "/Web" : "/global/Web",
            url = parent.cfg.axisConfigUrl + destCode + ".jsonp";
        parent.retry.init("get", 1, arguments, 1),
        parent.lib.getAjax(url, function(result)
        {
            var err,
                obj1,
                obj2,
                dest_platform_id,
                dest_responsetarget;
            parent.cfg.configFromAxis = result,
            err = !1;
            try
            {
                obj1 = convert2boolean(result.Configuration.GlobalConfiguration.axisAuthApi.Settings),
                $.extend(parent.cfg, obj1)
            }
            catch(ex)
            {
                log("AXIS Global Configuration: " + ex.message, "E"),
                err = !0
            }
            try
            {
                obj2 = convert2boolean(result.Configuration.DestinationConfiguration.axisAuthApi.Settings),
                $.extend(parent.vhBrand, obj2)
            }
            catch(ex)
            {
                log("AXIS Destination Configuration for " + destCode + " " + ex.message, "E"),
                err = !0
            }
            try
            {
                dest_platform_id = result.Configuration.DestinationConfiguration.axisAuthApi.Settings.Akamai.platform_id
            }
            catch(ex)
            {
                log("AXIS Destination Configuration Akamai for " + destCode + " " + ex.message, "E", {hide: !0})
            }
            finally
            {
                err || (typeof dest_platform_id == "string" && (result.Configuration.GlobalConfiguration.axisAuthApi.Settings.Akamai.platform_id = dest_platform_id), typeof dest_responsetarget == "string" && (result.Configuration.GlobalConfiguration.axisAuthApi.Settings.Akamai.responsetarget = dest_responsetarget))
            }
            if (err)
            {
                parent.ui.closeWithMessage(null, {
                    text: {
                        en: "config oops!",
                        fr: "config oups!"
                    },
                    timer: 2500
                }),
                fnCallback({error: !0});
                return
            }
            parent.cfg.Akamai.platform_id.indexOf("test") > -1 && (parent.cfg.devNote = parent.cfg.devNote + " Akamai TEST configuration!"),
            parent.cfg.Akamai.responsetarget == "dev" && (parent.cfg.devNote = parent.cfg.devNote + " Akamai responsetarget=DEV !"),
            supportedVer(),
            fnCallback()
        }, function(e)
        {
            log("get(" + url + ") " + e.errorThrown + " - " + e.textStatus + ". Attempting to retry.", "E", {hide: !0}),
            parent.retry.go("get") || fnCallback({error: !0})
        }, {jsonpCallback: "axisConfigFn"}, {caller: "configFromAxis()"})
    }
}(axisAuthApi),
function(parent)
{
    var me = {},
        log;
    me.ver = "13.10.22",
    me.name = "retry",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.list = {},
    me.init = function(methodName, maxTries, args, optionsIndex)
    {
        args[optionsIndex] && args[optionsIndex].retry == !0 || (me.list[methodName] = {
            maxTries: maxTries,
            methodArgs: args,
            optionsIndex: optionsIndex
        })
    },
    me.go = function(methodName)
    {
        if (me.list[methodName] && me.list[methodName].maxTries <= 0)
            return log("go(" + methodName + ") max tries exceeded.", "E"), !1;
        var mthd = me.list[methodName],
            options = mthd.methodArgs[mthd.optionsIndex];
        return typeof options == "undefined" && log("go(" + methodName + ") does not have 'options' argument!", "E"), $.extend(options, {retry: !0}), mthd.methodArgs.callee(mthd.methodArgs[0], mthd.methodArgs[1], mthd.methodArgs[2], mthd.methodArgs[3], mthd.methodArgs[4], mthd.methodArgs[5], mthd.methodArgs[6], mthd.methodArgs[7]), log("go(" + methodName + ") try " + mthd.maxTries), mthd.maxTries = mthd.maxTries - 1, !0
    }
}(axisAuthApi),
function(){}(axisAuthApi),
function(){}(axisAuthApi),
function(parent)
{
    function getEvName(caller, methodName, chainedCallback)
    {
        var idx = typeof chainedCallback == "number" ? chainedCallback.toString() : "";
        return methodName + "(" + caller + ")" + idx
    }
    var me = {},
        log,
        callbacks;
    me.ver = "13.7.31",
    me.name = "callbackManager",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    callbacks = {},
    me.add = function(caller, methodName, callback, options)
    {
        if (typeof callback == "function")
        {
            options = options ? options : {};
            var evname = getEvName(caller, methodName, options.chainedCallback);
            callbacks[evname] || (callbacks[evname] = $.Callbacks()),
            callbacks[evname].add(callback)
        }
    },
    me.call = function(caller, methodName, callback, ev, options)
    {
        if (typeof callback == "function")
        {
            options = options ? options : {};
            var evname = getEvName(caller, methodName, options.chainedCallback);
            callbacks[evname] ? (callbacks[evname].fire(ev, options), callbacks[evname].remove(callback)) : log(evname + " : callback was not registered!", "E"),
            evname = getEvName(caller, methodName + "_ERR", options.chainedCallback),
            typeof options.onError == "function" && callbacks[evname].remove(options.onError)
        }
    },
    me.remove = function(caller, methodName, callback, options)
    {
        if (typeof callback == "function")
        {
            options = options ? options : {};
            var evname = getEvName(caller, methodName, options.chainedCallback);
            callbacks[evname] ? callbacks[evname].remove(callback) : log(evname + " : callback was not registered!", "E")
        }
    }
}(axisAuthApi),
function(parent)
{
    var me = {},
        log;
    me.ver = "13.8.23a",
    me.name = "lib",
    parent[me.name] = me,
    me.parent = parent,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.getAjax = function(url, onSuccess, onError, optAjaxParams, options)
    {
        options = options ? options : {};
        try
        {
            var ajaxParams = {
                    url: url,
                    timeout: 1e4,
                    cache: parent.cfg.debug ? !1 : !0,
                    contentType: "application/javascript",
                    dataType: "jsonp",
                    success: function(result)
                    {
                        onSuccess && onSuccess(result, options.passThruValue)
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown)
                    {
                        var errmode = null;
                        onError ? onError({
                            XMLHttpRequest: XMLHttpRequest,
                            textStatus: textStatus,
                            errorThrown: errorThrown,
                            errmode: errmode
                        }) : log(errorThrown + " - lib.getAjax(" + url + ")  calling object: " + options.caller, "E", {hide: !0})
                    }
                };
            $.extend(ajaxParams, optAjaxParams),
            log("lib.getAjax(" + ajaxParams.url + ")  calling object: " + options.caller),
            $.ajax(ajaxParams)
        }
        catch(err)
        {
            log(err + " catch lib.getAjax(" + url + ")  calling object: " + options.caller, "E", {hide: !0})
        }
    },
    me.getInterFrameMessage = function(event)
    {
        var data = event.data;
        try
        {
            return data = JSON.parse(decodeURIComponent(data)), data.messageSender ? data : null
        }
        catch(ex)
        {
            return log("getInterFrameMessage(origin: " + event.origin + ") unrecognized message format."), null
        }
    },
    me.parseUrlDomain = function(url)
    {
        var a = document.createElement("a"),
            domain;
        return a.href = url, domain = a.hostname, a = null, domain
    },
    me.isNumeric = function(n)
    {
        return !isNaN(parseFloat(n)) && isFinite(n)
    },
    me.isAlphaNumeric = function(txt)
    {
        return /^[a-zA-Z0-9]+$/.test(txt)
    },
    me.isEmptyObject = function(obj)
    {
        for (var prop in obj)
            if (Object.prototype.hasOwnProperty.call(obj, prop))
                return !1;
        return !0
    },
    me.isArray = function(arr)
    {
        return Object.prototype.toString.call(arr) == "[object Array]"
    },
    me.isObject = function(obj)
    {
        return Object.prototype.toString.call(obj) == "[object Object]"
    },
    me.getObjectProperties = function(obj)
    {
        return Object.keys || (Object.keys = function(obj)
            {
                var keys = [],
                    k;
                for (k in obj)
                    Object.prototype.hasOwnProperty.call(obj, k) && keys.push(k);
                return keys
            }), Object.keys(obj)
    },
    me.getParameterByName = function(name)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
    },
    me.randomString = function(length, chars)
    {
        for (var result = "", i = length; i > 0; --i)
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result
    },
    function(t, e)
    {
        typeof exports == "object" ? module.exports = e() : typeof define == "function" && define.amd && define("spinjs", [], e),
        t.Spinner = e()
    }(me, function()
    {
        "use strict";
        function o(t, e)
        {
            var i = document.createElement(t || "div"),
                o;
            for (o in e)
                i[o] = e[o];
            return i
        }
        function n(t)
        {
            for (var e = 1, i = arguments.length; e < i; e++)
                t.appendChild(arguments[e]);
            return t
        }
        function s(t, o, n, s)
        {
            var a = ["opacity", o, ~~(t * 100), n, s].join("-"),
                f = .01 + n / s * 100,
                l = Math.max(1 - (1 - t) / o * (100 - f), t),
                d = i.substring(0, i.indexOf("Animation")).toLowerCase(),
                u = d && "-" + d + "-" || "";
            return e[a] || (r.insertRule("@" + u + "keyframes " + a + "{0%{opacity:" + l + "}" + f + "%{opacity:" + t + "}" + (f + .01) + "%{opacity:1}" + (f + o) % 100 + "%{opacity:" + t + "}100%{opacity:" + l + "}}", r.cssRules.length), e[a] = 1), a
        }
        function a(e, i)
        {
            var o = e.style,
                n,
                r;
            if (o[i] !== undefined)
                return i;
            for (i = i.charAt(0).toUpperCase() + i.slice(1), r = 0; r < t.length; r++)
                if (n = t[r] + i, o[n] !== undefined)
                    return n
        }
        function f(t, e)
        {
            for (var i in e)
                t.style[a(t, i) || i] = e[i];
            return t
        }
        function l(t)
        {
            for (var i, o, e = 1; e < arguments.length; e++)
            {
                i = arguments[e];
                for (o in i)
                    t[o] === undefined && (t[o] = i[o])
            }
            return t
        }
        function d(t)
        {
            for (var e = {
                    x: t.offsetLeft,
                    y: t.offsetTop
                }; t = t.offsetParent; )
                e.x += t.offsetLeft,
                e.y += t.offsetTop;
            return e
        }
        function p(t)
        {
            if (typeof this == "undefined")
                return new p(t);
            this.opts = l(t || {}, p.defaults, u)
        }
        function c()
        {
            function t(t, e)
            {
                return o("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', e)
            }
            r.addRule(".spin-vml", "behavior:url(#default#VML)"),
            p.prototype.lines = function(e, i)
            {
                function s()
                {
                    return f(t("group", {
                            coordsize: r + " " + r,
                            coordorigin: -o + " " + -o
                        }), {
                            width: r,
                            height: r
                        })
                }
                function u(e, r, a)
                {
                    n(l, n(f(s(), {
                        rotation: 360 / i.lines * e + "deg",
                        left: ~~r
                    }), n(f(t("roundrect", {arcsize: i.corners}), {
                        width: o,
                        height: i.width,
                        left: i.radius,
                        top: -i.width >> 1,
                        filter: a
                    }), t("fill", {
                        color: i.color,
                        opacity: i.opacity
                    }), t("stroke", {opacity: 0}))))
                }
                var o = i.length + i.width,
                    r = 2 * o,
                    a = -(i.width + i.length) * 2 + "px",
                    l = f(s(), {
                        position: "absolute",
                        top: a,
                        left: a
                    }),
                    d;
                if (i.shadow)
                    for (d = 1; d <= i.lines; d++)
                        u(d, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                for (d = 1; d <= i.lines; d++)
                    u(d);
                return n(e, l)
            },
            p.prototype.opacity = function(t, e, i, o)
            {
                var n = t.firstChild;
                o = o.shadow && o.lines || 0,
                n && e + o < n.childNodes.length && (n = n.childNodes[e + o], n = n && n.firstChild, n = n && n.firstChild, n && (n.opacity = i))
            }
        }
        var t = ["webkit", "Moz", "ms", "O"],
            e = {},
            i,
            r = function()
            {
                var t = o("style", {type: "text/css"});
                return n(document.getElementsByTagName("head")[0], t), t.sheet || t.styleSheet
            }(),
            u = {
                lines: 12,
                length: 7,
                width: 5,
                radius: 10,
                rotate: 0,
                corners: 1,
                color: "#000",
                direction: 1,
                speed: 1,
                trail: 100,
                opacity: 1 / 4,
                fps: 20,
                zIndex: 2e9,
                className: "spinner",
                top: "auto",
                left: "auto",
                position: "relative"
            },
            h;
        return p.defaults = {}, l(p.prototype, {
                spin: function(t)
                {
                    this.stop();
                    var e = this,
                        n = e.opts,
                        r = e.el = f(o(0, {className: n.className}), {
                            position: n.position,
                            width: 0,
                            zIndex: n.zIndex
                        }),
                        s = n.radius + n.length + n.width,
                        a,
                        l;
                    if (t && (t.insertBefore(r, t.firstChild || null), l = d(t), a = d(r), f(r, {
                            left: (n.left == "auto" ? l.x - a.x + (t.offsetWidth >> 1) : parseInt(n.left, 10) + s) + "px",
                            top: (n.top == "auto" ? l.y - a.y + (t.offsetHeight >> 1) : parseInt(n.top, 10) + s) + "px"
                        })), r.setAttribute("role", "progressbar"), e.lines(r, e.opts), !i)
                    {
                        var u = 0,
                            p = (n.lines - 1) * (1 - n.direction) / 2,
                            c,
                            h = n.fps,
                            m = h / n.speed,
                            y = (1 - n.opacity) / (m * n.trail / 100),
                            g = m / n.lines;
                        (function v()
                        {
                            u++;
                            for (var t = 0; t < n.lines; t++)
                                c = Math.max(1 - (u + (n.lines - t) * g) % m * y, n.opacity),
                                e.opacity(r, t * n.direction + p, c, n);
                            e.timeout = e.el && setTimeout(v, ~~(1e3 / h))
                        })()
                    }
                    return e
                },
                stop: function()
                {
                    var t = this.el;
                    return t && (clearTimeout(this.timeout), t.parentNode && t.parentNode.removeChild(t), this.el = undefined), this
                },
                lines: function(t, e)
                {
                    function d(t, i)
                    {
                        return f(o(), {
                                position: "absolute",
                                width: e.length + e.width + "px",
                                height: e.width + "px",
                                background: t,
                                boxShadow: i,
                                transformOrigin: "left",
                                transform: "rotate(" + ~~(360 / e.lines * r + e.rotate) + "deg) translate(" + e.radius + "px,0)",
                                borderRadius: (e.corners * e.width >> 1) + "px"
                            })
                    }
                    for (var r = 0, a = (e.lines - 1) * (1 - e.direction) / 2, l; r < e.lines; r++)
                        l = f(o(), {
                            position: "absolute",
                            top: 1 + ~(e.width / 2) + "px",
                            transform: e.hwaccel ? "translate3d(0,0,0)" : "",
                            opacity: e.opacity,
                            animation: i && s(e.opacity, e.trail, a + r * e.direction, e.lines) + " " + 1 / e.speed + "s linear infinite"
                        }),
                        e.shadow && n(l, f(d("#000", "0 0 4px #000"), {top: "2px"})),
                        n(t, n(l, d(e.color, "0 0 1px rgba(0,0,0,.1)")));
                    return t
                },
                opacity: function(t, e, i)
                {
                    e < t.childNodes.length && (t.childNodes[e].style.opacity = i)
                }
            }), h = f(o("group"), {behavior: "url(#default#VML)"}), !a(h, "transform") && h.adj ? c() : i = a(h, "animation"), p
    }),
    me.axisLog = function(txt, LogLevel, options)
    {
        switch (LogLevel)
        {
            case"Error":
                $.ajax({
                    url: parent.cfg.axisLogger,
                    data: {
                        LogLevel: "Error",
                        Message: txt,
                        ApplicationName: "axisAuthApi"
                    },
                    dataType: "jsonp"
                });
                break;
            case"Info":
                $.ajax({
                    url: parent.cfg.axisLogger,
                    data: {
                        LogLevel: "Info",
                        Message: txt,
                        ApplicationName: "axisAuthApi",
                        DataValues: JSON.stringify([{
                                Key: options.name,
                                Value: options.time
                            }, {
                                Key: "platform",
                                Value: options.platform
                            }])
                    },
                    dataType: "jsonp"
                });
                break;
            case"Log":
                $.ajax({
                    url: parent.cfg.axisLogger,
                    data: {
                        LogLevel: "Info",
                        Message: txt,
                        ApplicationName: "axisAuthApi"
                    },
                    dataType: "jsonp"
                })
        }
    },
    me.browser = {},
    me.browser.isIE11 = function()
    {
        return navigator.appName == "Netscape" && navigator.product == "Gecko" && navigator.userAgent.indexOf("Trident") > -1 ? (log(".browser() IE11"), !0) : !1
    }
}(axisAuthApi),
function(parent)
{
    var me = function(name, value, options)
        {
            var msPerDay = 864e5,
                returnValue,
                cookies = [],
                path,
                domain,
                expires,
                opts = {},
                secure,
                date,
                defaults = {
                    expires: "",
                    domain: "",
                    path: "",
                    secure: !1
                };
            return arguments.length === 1 ? (document.cookie && document.cookie !== "" && (cookies = document.cookie.split(";"), $.each(cookies, function(i, cookie)
                {
                    return cookie = $.trim(cookie), cookie.substring(0, name.length + 1) === name + "=" ? (returnValue = decodeURIComponent(cookie.substring(name.length + 1)), !1) : void 0
                })), returnValue) : ($.extend(opts, defaults, me.settings, options), value === null && (value = "", opts.expires = -1), path = opts.path ? ";path=" + opts.path : "", domain = opts.domain ? ";domain=" + opts.domain : "", expires = opts.expires ? function(opts)
                    {
                        return typeof opts.expires == "number" ? (date = new Date, date.setTime(date.getTime() + opts.expires * msPerDay)) : $.type(opts.expires) === "date" ? date = opts.expires : (date = new Date, date.setTime(date.getTime() + msPerDay)), expires = ";expires=" + date.toUTCString()
                    }(opts) : "", secure = opts.secure ? ";secure" : "", document.cookie = name + "=" + encodeURIComponent(value) + expires + path + domain + secure, document.cookie.indexOf(name))
        };
    parent.cookie = me
}(axisAuthApi.lib),
function(parent)
{
    var me = {};
    me.ver = "13.6.14a",
    me.name = "cookieSupport",
    parent[me.name] = me,
    me.test = function()
    {
        var persist = !0,
            c;
        do
            if (c = "gCStest=" + Math.floor(Math.random() * 1e8), document.cookie = persist ? c + ";expires=Tue, 01-Jan-2030 00:00:00 GMT" : c, document.cookie.indexOf(c) !== -1)
                return document.cookie = c + ";expires=Sat, 01-Jan-2000 00:00:00 GMT", persist;
        while (!(persist = !persist));
        return null
    }
}(axisAuthApi.lib),
function(parent)
{
    function getAlfacdcUrl()
    {
        return _alfacdcPath.slice(-1) != "/" && (_alfacdcPath = _alfacdcPath + "/"), _alfacdcPath + _alfacdc
    }
    var me = {},
        log,
        _herrFrame,
        _herrForm,
        _alfacdcPath,
        _alfacdc,
        _t;
    me.ver = "13.6.21c",
    me.name = "alfaCrossCookie",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    _alfacdc = "alfacdc.aspx",
    me.fnCallback,
    me.update = function(urlArg, fnCallback, alfacdcPath)
    {
        log("update(" + urlArg + ")"),
        _t = +new Date,
        _alfacdcPath = alfacdcPath,
        urlArg = urlArg.indexOf("?") == 0 ? urlArg : "?" + urlArg;
        var alfacdcUrl = getAlfacdcUrl() + urlArg;
        me.fnCallback = fnCallback,
        _herrFrame == undefined | _herrFrame == null && (_herrFrame = $('<iframe name="ifrEts42herring" id="ifrEts42herring" frameborder="0" width="0" height="0" />'), $("body").append(_herrFrame)),
        _herrForm == undefined ? (_herrForm = $('<form action="' + getAlfacdcUrl() + urlArg + '" target="ifrEts42herring" method="POST" /><\/form>'), $("body").append(_herrForm)) : $(_herrForm).attr("action", getAlfacdcUrl() + urlArg);
        try
        {
            _herrForm.submit()
        }
        catch(ex)
        {
            log("update() form.submit(" + alfacdcUrl + ") " + ex.message, "E")
        }
    },
    me.clear = function(urlArg, fnCallback, alfacdcPath)
    {
        if (_t = +new Date, urlArg = urlArg ? urlArg + "&ciasteczka_zjedz=tak" : "?ciasteczka_zjedz=all", fnCallback = fnCallback ? fnCallback : me.fnCallback, fnCallback || log("clear(fnCallback) arg is unknown!", "W"), alfacdcPath = alfacdcPath ? alfacdcPath : _alfacdcPath, !alfacdcPath)
        {
            log("clear(alfacdcPath) arg is needed!", "W");
            return
        }
        me.update(urlArg, fnCallback, alfacdcPath)
    },
    me.read = function(fnCallback, alfacdcPath)
    {
        if (_t = +new Date, fnCallback = fnCallback ? fnCallback : me.fnCallback, fnCallback || log("read(fnCallback) arg is needed!", "W"), alfacdcPath = alfacdcPath ? alfacdcPath : _alfacdcPath, !alfacdcPath)
        {
            log("read(alfacdcPath) arg is needed!", "W");
            return
        }
        me.update("ciasteczka_czytaj=tak", fnCallback, alfacdcPath)
    },
    me.msgCallback = function(messageData)
    {
        messageData && messageData.messageSender != "alfacdc" || (_t = +new Date - _t, me.fnCallback ? (messageData.error && log("[alfacdc.aspx] " + messageData.error, "E"), me.fnCallback(messageData.data, messageData.error, {time: _t})) : log("fnCallback undefined"), $(_herrFrame).remove(), _herrFrame = null, $(_herrForm).remove(), _herrForm = null)
    }
}(axisAuthApi),
function(parent, iframeSrc)
{
    var me = {},
        _t;
    me.ver = "13.6.17b",
    me.name = "alfaThirdPartyCookie",
    parent[me.name] = me;
    var log = new parent.consoleLog(parent.name + "." + me.name),
        _try = 0,
        _maxTry = 3;
    me.isSupported,
    me.iframe,
    me.iframeSrc = iframeSrc,
    me.customCallback,
    me.checkSupport = function(customCallback, iframeSrc2)
    {
        function plantCookie()
        {
            _try++;
            var cacheBust = "?" + Math.random().toString(36).substring(2, 10);
            me.iframe == undefined | me.iframe == null ? (me.iframe = $('<iframe src="' + me.iframeSrc + cacheBust + '" frameborder="0" width="0" height="0" />'), $("body").append(me.iframe)) : ($(me.iframe).remove(), me.iframe = null, _try--, me.checkSupport(customCallback)),
            log("checkSupport(" + _try + ") waiting for cross frame message ...")
        }
        if ((_t = +new Date, customCallback && (me.customCallback = customCallback), iframeSrc2 && (me.iframeSrc = iframeSrc2), typeof me.isSupported == "boolean" && me.isSupported === !0) || typeof me.isSupported == "boolean" && _try >= _maxTry)
            return me.customCallback && me.customCallback(me.isSupported), log("checkSupport(" + _try + ")=" + me.isSupported), me.isSupported;
        plantCookie()
    },
    me.msgCallback = function(messageData)
    {
        if (!messageData || messageData.messageSender == "alfatpc")
        {
            var isSupported = !1;
            _t = +new Date - _t;
            try
            {
                messageData.data.planted == messageData.data.read && (isSupported = !0)
            }
            catch(ex)
            {
                log("msgCallback() - " + ex.message, "W")
            }
            if (isSupported == !1 ? log("third party cookie not supported. " + _t + "ms") : log("third party cookie: TRUE " + _t + "ms"), me.isSupported = isSupported, isSupported == !1 && _try <= _maxTry)
            {
                setTimeout(function()
                {
                    me.checkSupport(me.customCallback)
                }, 500);
                return
            }
            me.customCallback && me.customCallback(me.isSupported, {time: _t}),
            $(me.iframe).remove(),
            me.iframe = null
        }
    }
}(axisAuthApi),
function(parent)
{
    var me = {},
        log;
    me.ver = "14.1.13",
    me.name = "mobileApp",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.send = function(cmd, infoObj)
    {
        if (typeof infoObj == "undefined")
        {
            log("send() - missing argument: infoObj", "E");
            return
        }
        log(cmd);
        var message = {};
        if (cmd == "close" && (infoObj.closer && infoObj.closer == "btnX" && (message.cancel = !0), infoObj.options && infoObj.options.authN && infoObj.options.authN == !0 && (message.authN = !0), parent.selectedBdu.AkamaiName && (message.selectedBdu = parent.selectedBdu)), cmd == "authenticationStateChange")
            if (infoObj.options && infoObj.options.source && infoObj.options.source == "performLogout")
                message.source = "performLogout",
                message.authN = infoObj.authenticated;
            else
                return;
        message = JSON.stringify(message),
        typeof axisAuthApiAndroid != "undefined" && axisAuthApiAndroid.axAuth(cmd, message),
        typeof axisAuthApiApple != "undefined" && axisAuthApiApple.axAuth(cmd, message)
    }
}(axisAuthApi),
function($)
{
    $.fn.alfaAutoSuggest = function(data, options)
    {
        var defaults = {
                asHtmlID: !1,
                startText: "Enter Name Here",
                emptyText: "No Results Found",
                preFill: {},
                limitText: "No More Selections Are Allowed",
                selectedItemProp: "value",
                selectedValuesProp: "value",
                searchObjProps: "value",
                queryParam: "q",
                retrieveLimit: !1,
                extraParams: "",
                matchCase: !1,
                minChars: 1,
                keyDelay: 400,
                resultsHighlight: !0,
                neverSubmit: !1,
                selectionLimit: !1,
                showResultList: !0,
                start: function(){},
                selectionClick: function(){},
                selectionAdded: function(){},
                selectionRemoved: function(elem)
                {
                    elem.remove()
                },
                formatList: !1,
                beforeRetrieve: function(string)
                {
                    return string
                },
                retrieveComplete: function(data)
                {
                    return data
                },
                resultClick: function(){},
                resultsComplete: function(){}
            },
            opts = $.extend(defaults, options),
            d_type = "object",
            d_count = 0,
            req_string,
            org_data;
        if (typeof data == "string")
            d_type = "string",
            req_string = data;
        else
        {
            org_data = data;
            for (k in data)
                data.hasOwnProperty(k) && d_count++
        }
        if (d_type == "object" && d_count > 0 || d_type == "string")
            return this.each(function(x)
                {
                    function keyChange()
                    {
                        var string,
                            limit;
                        if (lastKeyPressCode == 46 || lastKeyPressCode > 8 && lastKeyPressCode < 32)
                            return results_holder.hide();
                        (string = input.val().replace(/[\\]+|[\/]+/g, ""), string != prev) && (prev = string, string.length >= opts.minChars ? (selections_holder.addClass("loading"), d_type == "string" ? (limit = "", opts.retrieveLimit && (limit = "&limit=" + encodeURIComponent(opts.retrieveLimit)), opts.beforeRetrieve && (string = opts.beforeRetrieve.call(this, string)), $.getJSON(req_string + "?" + opts.queryParam + "=" + encodeURIComponent(string) + limit + opts.extraParams, function(data)
                            {
                                d_count = 0;
                                var new_data = opts.retrieveComplete.call(this, data);
                                for (k in new_data)
                                    new_data.hasOwnProperty(k) && d_count++;
                                processData(new_data, string)
                            })) : (opts.beforeRetrieve && (string = opts.beforeRetrieve.call(this, string)), processData(org_data, string))) : (selections_holder.removeClass("loading"), results_holder.hide()))
                    }
                    function processData(data, query)
                    {
                        var matchCount,
                            i,
                            num,
                            forward,
                            str,
                            names,
                            y,
                            name,
                            formatted,
                            this_data,
                            regx;
                        for (opts.matchCase || (query = query.toLowerCase()), matchCount = 0, results_holder.html(results_ul.html("")).hide(), i = 0; i < d_count; i++)
                        {
                            if (num = i, num_count++, forward = !1, opts.searchObjProps == "value")
                                str = data[num].value;
                            else
                                for (str = "", names = opts.searchObjProps.split(","), y = 0; y < names.length; y++)
                                    name = $.trim(names[y]),
                                    str = str + data[num][name] + " ";
                            if (str && (opts.matchCase || (str = str.toLowerCase()), str.search(query) != -1 && values_input.val().search("," + data[num][opts.selectedValuesProp] + ",") == -1 && (forward = !0)), forward && (formatted = $('<li class="as-result-item" id="as-result-item-' + num + '"><\/li>').click(function()
                            {
                                var raw_data = $(this).data("data"),
                                    number = raw_data.num,
                                    data;
                                $("#as-selection-" + number, selections_holder).length <= 0 && !tab_press && (data = raw_data.attributes, input.val("").focus(), prev = "", add_selected_item(data, number), opts.resultClick.call(this, raw_data), results_holder.hide()),
                                tab_press = !1
                            }).mousedown(function()
                            {
                                input_focus = !1
                            }).mouseover(function()
                            {
                                $("li", results_ul).removeClass("active"),
                                $(this).addClass("active")
                            }).data("data", {
                                attributes: data[num],
                                num: num_count
                            }), this_data = $.extend({}, data[num]), regx = opts.matchCase ? new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "g") : new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "gi"), opts.resultsHighlight && (this_data[opts.selectedItemProp] = this_data[opts.selectedItemProp].replace(regx, "<em>$1<\/em>")), formatted = opts.formatList ? opts.formatList.call(this, this_data, formatted) : formatted.html(this_data[opts.selectedItemProp]), results_ul.append(formatted), delete this_data, matchCount++, opts.retrieveLimit && opts.retrieveLimit == matchCount))
                                break
                        }
                        selections_holder.removeClass("loading"),
                        matchCount <= 0 && results_ul.html('<li class="as-message">' + opts.emptyText + "<\/li>"),
                        results_ul.css("width", selections_holder.outerWidth()),
                        results_holder.show(),
                        opts.resultsComplete.call(this)
                    }
                    function add_selected_item(data, num)
                    {
                        values_input.val(values_input.val() + data[opts.selectedValuesProp] + ",");
                        var item = $('<li class="as-selection-item" id="as-selection-' + num + '"><\/li>').click(function()
                            {
                                opts.selectionClick.call(this, $(this)),
                                selections_holder.children().removeClass("selected"),
                                $(this).addClass("selected")
                            }).mousedown(function()
                            {
                                input_focus = !1
                            }),
                            close = $('<a class="as-close">&times;<\/a>').click(function()
                            {
                                return values_input.val(values_input.val().replace("," + data[opts.selectedValuesProp] + ",", ",")), opts.selectionRemoved.call(this, item), input_focus = !0, input.focus(), !1
                            });
                        org_li.before(item.html(data[opts.selectedItemProp]).prepend(close)),
                        opts.selectionAdded.call(this, org_li.prev())
                    }
                    function moveSelection(direction)
                    {
                        var lis,
                            start,
                            active;
                        $(":visible", results_holder).length > 0 && (lis = $("li", results_holder), start = direction == "down" ? lis.eq(0) : lis.filter(":last"), active = $("li.active:first", results_holder), active.length > 0 && (start = direction == "down" ? active.next() : active.prev()), lis.removeClass("active"), start.addClass("active"))
                    }
                    var x_id,
                        input,
                        input_focus,
                        vals,
                        v_data,
                        prefill_count,
                        i,
                        new_v,
                        lastChar,
                        num_count;
                    opts.asHtmlID ? (x = opts.asHtmlID, x_id = x) : (x = x + "" + Math.floor(Math.random() * 100), x_id = "as-input-" + x),
                    opts.start.call(this),
                    input = $(this),
                    input.attr("autocomplete", "off").addClass("as-input").attr("id", x_id).val(opts.startText),
                    input_focus = !1,
                    input.wrap('<ul class="as-selections" id="as-selections-' + x + '"><\/ul>').wrap('<li class="as-original" id="as-original-' + x + '"><\/li>');
                    var selections_holder = $("#as-selections-" + x),
                        org_li = $("#as-original-" + x),
                        results_holder = $('<div class="as-results" id="as-results-' + x + '"><\/div>').hide(),
                        results_ul = $('<ul class="as-list"><\/ul>'),
                        values_input = $('<input type="hidden" class="as-values" name="as_values_' + x + '" id="as-values-' + x + '" />'),
                        prefill_value = "";
                    if (typeof opts.preFill == "string")
                    {
                        for (vals = opts.preFill.split(","), i = 0; i < vals.length; i++)
                            v_data = {},
                            v_data[opts.selectedValuesProp] = vals[i],
                            vals[i] != "" && add_selected_item(v_data, "000" + i);
                        prefill_value = opts.preFill
                    }
                    else
                    {
                        prefill_value = "",
                        prefill_count = 0;
                        for (k in opts.preFill)
                            opts.preFill.hasOwnProperty(k) && prefill_count++;
                        if (prefill_count > 0)
                            for (i = 0; i < prefill_count; i++)
                                new_v = opts.preFill[i][opts.selectedValuesProp],
                                new_v == undefined && (new_v = ""),
                                prefill_value = prefill_value + new_v + ",",
                                new_v != "" && add_selected_item(opts.preFill[i], "000" + i)
                    }
                    prefill_value != "" && (input.val(""), lastChar = prefill_value.substring(prefill_value.length - 1), lastChar != "," && (prefill_value = prefill_value + ","), values_input.val("," + prefill_value), $("li.as-selection-item", selections_holder).addClass("blur").removeClass("selected")),
                    input.after(values_input),
                    selections_holder.click(function()
                    {
                        input_focus = !0,
                        input.focus()
                    }).mousedown(function()
                    {
                        input_focus = !1
                    }).after(results_holder);
                    var timeout = null,
                        prev = "",
                        totalSelections = 0,
                        tab_press = !1;
                    input.focus(function()
                    {
                        return $(this).val() == opts.startText && values_input.val() == "" ? $(this).val("") : input_focus && ($("li.as-selection-item", selections_holder).removeClass("blur"), $(this).val() != "" && (results_ul.css("width", selections_holder.outerWidth()), results_holder.show())), input_focus = !0, !0
                    }).blur(function()
                    {
                        $(this).val() == "" && values_input.val() == "" && prefill_value == "" ? $(this).val(opts.startText) : input_focus && ($("li.as-selection-item", selections_holder).addClass("blur").removeClass("selected"), results_holder.hide())
                    }).keydown(function(e)
                    {
                        var last,
                            active;
                        lastKeyPressCode = e.keyCode,
                        first_focus = !1;
                        switch (e.keyCode)
                        {
                            case 38:
                                e.preventDefault(),
                                moveSelection("up");
                                break;
                            case 40:
                                e.preventDefault(),
                                moveSelection("down");
                                break;
                            case 8:
                                input.val() == "" && (last = values_input.val().split(","), last = last[last.length - 2], selections_holder.children().not(org_li.prev()).removeClass("selected"), org_li.prev().hasClass("selected") ? (values_input.val(values_input.val().replace("," + last + ",", ",")), opts.selectionRemoved.call(this, org_li.prev())) : (opts.selectionClick.call(this, org_li.prev()), org_li.prev().addClass("selected"))),
                                input.val().length == 1 && (results_holder.hide(), prev = ""),
                                $(":visible", results_holder).length > 0 && (timeout && clearTimeout(timeout), timeout = setTimeout(function()
                                {
                                    keyChange()
                                }, opts.keyDelay));
                                break;
                            case 9:
                            case 188:
                                break;
                            case 13:
                                tab_press = !1,
                                active = $("li.active:first", results_holder),
                                active.length > 0 && (active.click(), results_holder.hide()),
                                (opts.neverSubmit || active.length > 0) && e.preventDefault();
                                break;
                            default:
                                opts.showResultList && (opts.selectionLimit && $("li.as-selection-item", selections_holder).length >= opts.selectionLimit ? (results_ul.html('<li class="as-message">' + opts.limitText + "<\/li>"), results_holder.show()) : (timeout && clearTimeout(timeout), timeout = setTimeout(function()
                                {
                                    keyChange()
                                }, opts.keyDelay)))
                        }
                    }),
                    num_count = 0
                })
    }
}(jQuery),
function()
{
    /*!
        M A I N   M O D U L E
    */
    function checkAfterLogin()
    {
        var maxTries,
            interval,
            url;
        if (log("checkAfterLogin(" + _checkAuthCount + ") _isAuthenticated=" + _isAuthenticated), _performAuthentication_isPending = !1, _checkAfterLoginLoop != !1)
        {
            if (me.cfg.pinging == !1)
            {
                _checkAfterLoginLoop = !1;
                return
            }
            if (maxTries = 20, interval = 2e3, _isAuthenticated)
            {
                authenticationResult("checkAfterLogin() loop");
                return
            }
            if (_checkAuthCount++, _checkAuthCount > maxTries)
            {
                me.messaging.show("ERM-02"),
                log("checkAfterLogin() timeout after " + maxTries * interval / 1e3 + "s.", "E");
                return
            }
            url = getServiceUrl("/init/"),
            aisGET(url, function(result)
            {
                authenticationStateChange(result.authenticated, {
                    source: "checkAfterLogin",
                    debug: "checkAfterLogin() callback"
                }),
                result.authenticated && log("authenticated after " + (me.cfg.pingingDelay + _checkAuthCount * interval) / 1e3 + "s.")
            }, null, {cache: !1}, {caller: caller}),
            setTimeout(checkAfterLogin, interval)
        }
    }
    function authenticationResult(debugFrom)
    {
        log("authenticationResult(" + debugFrom + ")"),
        me.ui.showItem("_message_box"),
        _isAuthenticated ? (_checkAfterLoginLoop = !1, me.ui.closeWithMessage(null, {
            text: {
                en: "Video Sign In successful",
                fr: "Video Connexion réussie"
            },
            timer: 300,
            authN: !0
        })) : me.messaging.show("ERM-02"),
        me.events.triggerEvent("on_authentication_result", _isAuthenticated)
    }
    function authenticationStateChange(newState, options)
    {
        _isAuthenticated !== newState && (_isAuthenticated = newState, _isAuthenticated !== !0 && (_identity = undefined, me.storage("identity", null)), me.storage(null, null, {checkIfSupported: !0}) && me.storage("isAuthenticated", _isAuthenticated), me.events.triggerEvent("on_authentication_state_change", newState, options), me.mobileApp.send("authenticationStateChange", {
                authenticated: newState,
                options: options
            }), log("on_authentication_state_change : " + newState), _isAuthenticated == !0 && me.selectedBdu.Id && me.tracking.storeAuthentication && me.tracking.storeAuthentication(me.selectedBdu.Id))
    }
    function logCallTimer(t, name, options)
    {
        t = +new Date - t;
        var LogLevel;
        LogLevel = options.result == "error" ? "Error" : "Info",
        me.lib.axisLog("Akamai response time", LogLevel, {
            name: name,
            time: t,
            platform: me.cfg.Akamai.platform_id
        })
    }
    function checkCallerID(methodName, caller)
    {
        var txt,
            isOK = !0;
        return typeof caller != "string" && (txt = 'missing argument: "caller"', isOK = !1), me.lib.isAlphaNumeric(caller) || (txt = ' "caller" argumant is not alphanumeric.', isOK = !1), txt && (caller = typeof caller == "undefined" ? "*undefined*" : caller, log(methodName + "(" + caller + ") " + txt, "E")), isOK
    }
    function getServiceUrl(restApi)
    {
        return me.cfg.configFromAxis || log("getServiceUrl(" + restApi + ") - config from Axis not ready.", "W", {force: !0}), me.cfg.Akamai.apiUrl + me.cfg.Akamai.platform_id + restApi
    }
    function aisGET(serviceURL, onSuccess, onError, optAjaxParams, ajaxManager, options)
    {
        var ajaxParams,
            url;
        options = options ? options : {};
        var timeStamp = (+new Date).toString().slice(-5),
            callTimer = +new Date,
            jsonpCallback = me.lib.randomString(5, "ABCDEFGHIJKLMNOPQRSTUWXYZ") + timeStamp;
        try
        {
            ajaxParams = {
                timeout: 15e3,
                url: serviceURL + "?format=jsonp&responsefield=" + jsonpCallback,
                contentType: "application/javascript",
                cache: !0,
                dataType: "jsonp",
                jsonpCallback: jsonpCallback,
                success: function(result)
                {
                    logCallTimer(callTimer, options.akamaiService, {result: "success"}),
                    onSuccess && onSuccess(result)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    XMLHttpRequest.responseText && (XMLHttpRequest.responseText = XMLHttpRequest.responseText.length > 80 ? XMLHttpRequest.responseText.substr(0, 80) + " ..." : XMLHttpRequest.responseText),
                    errObj = {
                        caller: options.caller,
                        href: document.location.href,
                        jQver: $.fn.jquery,
                        url: ajaxParams.url,
                        jqXHR: XMLHttpRequest,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    },
                    me.lib.axisLog("Akamai request error " + JSON.stringify(errObj), "Error");
                    var errmode = "E",
                        errMsg = errorThrown && errorThrown.message ? errorThrown.message : errorThrown;
                    onError ? onError({
                        XMLHttpRequest: XMLHttpRequest,
                        textStatus: textStatus,
                        errorThrown: errorThrown,
                        errmode: errmode
                    }) : log(errorThrown + " - aisGet(" + serviceURL + ") ", errmode, {force: !0})
                },
                complete: function(){}
            },
            $.extend(ajaxParams, optAjaxParams),
            log(timeStamp + " aisGET(" + ajaxParams.url + ")"),
            $.ajax(ajaxParams)
        }
        catch(err)
        {
            url = ajaxParams.url ? ajaxParams.url : serviceURL,
            log(timeStamp + " " + err + " aisGET(" + url + ")", "E")
        }
    }
    function cerberus()
    {
        var cerberusId,
            cerberusScale;
        me.cfg.watchdogDisable != !0 && (cerberusId = me.lib.getParameterByName("cerberus"), cerberusId = cerberusId == null ? "" : cerberusId, cerberusScale = me.lib.getParameterByName("cerberusScale"), cerberusScale != null && $("body").css({transform: "scale(0.5, 0.5) !important"}), window.top.postMessage(encodeURIComponent(cerberusInfo(cerberusId)), "*"))
    }
    function cerberusInfo(cerberusId)
    {
        function findUrlinScriptTag(scrTag)
        {
            var url = "",
                P;
            try
            {
                var innerTxt = $(scrTag)[0].text,
                    txtTl = innerTxt.toLowerCase(),
                    idx = txtTl.indexOf("axisauthapi.js");
                idx > -1 && (P = txtTl.lastIndexOf("http://", idx), P > -1 && (url = txtTl.substring(P, idx + 14)))
            }
            catch(e)
            {
                log("cerberus.findUrlinScriptTag()")
            }
            return url
        }
        var apiUrl,
            info;
        try
        {
            return apiUrl = "", $("script").each(function()
                {
                    var src = $(this).attr("src"),
                        sr1;
                    typeof src != "undefined" && src != "" ? (sr1 = src.toLowerCase(), sr1.indexOf("axisauthapi.js") > -1 && (apiUrl = src)) : apiUrl == "" & apiUrl != "*" && (apiUrl = findUrlinScriptTag(this) + "*")
                }), info = {
                        messageSender: "cerberus",
                        data: {
                            id: cerberusId,
                            destinationCode: vhBrand.destinationCode,
                            ver: me.ver,
                            ms: me.timeStat,
                            jquery: $.fn.jquery,
                            apiUrl: apiUrl,
                            baseApiUrl: me.cfg.baseApiUrl,
                            axisConfigUrl: me.cfg.axisConfigUrl,
                            href: document.location.href,
                            vhBrand: vhBrand
                        }
                    }, JSON.stringify(info)
        }
        catch(e)
        {
            info = {
                messageSender: "cerberus",
                data: {id: cerberusId},
                error: e
            };
            try
            {
                return JSON.stringify(info)
            }
            catch(e)
            {
                log("JSON lib error, IE7 not supported.", "E")
            }
        }
    }
    var me = window.axisAuthApi,
        log = new me.consoleLog(me.name),
        _isAuthenticated,
        _authenticatedResponse,
        _identity,
        _checkAuthCount,
        _checkAfterLoginLoop,
        _isReady,
        auth,
        identity,
        configErr;
    log("ver.: " + me.ver, "i", {force: !0}),
    me.info = function()
    {
        var inf = {};
        return inf.ver = me.ver, inf.name = me.name, inf._isAuthenticated = _isAuthenticated, inf._identity = _identity, inf.selectedBdu = me.selectedBdu, inf.vhBrand = me.vhBrand, inf.allowedResources = {}, inf.allowedResources.list = me.allowedResources.list, inf
    },
    me.possibleIdps,
    me.selectedBdu = {},
    Date.now = Date.now || function()
    {
        return +new Date
    },
    me.isAuthenticated = function(caller, options)
    {
        if (checkCallerID("isAuthenticated", caller) && (options = options ? options : {}, options.firstCall == !0 || me.isReady({
            caller: caller,
            methodName: "isAuthenticated"
        })))
        {
            if (log("isAuthenticated(caller:" + caller + ", performAuthentication:" + (options.performAuthentication ? options.performAuthentication : "no") + ")  status:" + _isAuthenticated), typeof _isAuthenticated == "boolean" && !options.redirectAfterLogin)
            {
                if (_isAuthenticated)
                {
                    if (typeof options.onSuccess == "function")
                        options.onSuccess({authenticated: !0});
                    return !0
                }
                if (options.performAuthentication != !0)
                {
                    if (typeof options.onSuccess == "function")
                        options.onSuccess({authenticated: !1});
                    return !1
                }
            }
            options.performAuthentication && me.messaging.show(null, {spinner: !0}),
            me.callbackManager.add(caller, "isAuthenticated", options.onSuccess),
            me.callbackManager.add(caller, "isAuthenticated_ERR", options.onError);
            var url = getServiceUrl("/init/");
            return aisGET(url, function(result)
                {
                    result.authenticated ? _authenticatedResponse = result : me.possibleIdps = result.possible_idps;
                    var source = options.redirectAfterLogin ? "redirectAfterLogin" : "isAuthenticated";
                    if (authenticationStateChange(result.authenticated, {source: source}), options.redirectAfterLogin)
                    {
                        authenticationResult("redirectAfterLogin");
                        return
                    }
                    me.callbackManager.call(caller, "isAuthenticated", options.onSuccess, result),
                    options.performAuthentication && result.authenticated == !1 && me.bduChooser.open(result, "auth")
                }, function(e)
                {
                    log("isAuthenticated(" + caller + ")  url:" + url + " " + e.textStatus + " - " + e.errorThrown, e.errmode, {force: !0}),
                    me.callbackManager.call(caller, "isAuthenticated_ERR", options.onError, e, options.passThruValue)
                }, null, {
                    methodName: "isAuthenticated",
                    methodArgs: arguments,
                    caller: caller
                }, {
                    akamaiService: "init",
                    caller: caller
                }), "WAITING_FOR_RESPONSE"
        }
    },
    me.getIdentity = function(caller, options)
    {
        function isIdentityExpired()
        {
            if (_identity.jsig_block && _identity.jsig_block.timestamp)
                return Math.floor(Date.now() / 1e3) - _identity.jsig_block.timestamp > 3600 ? (me.storage("identity", null), !0) : !1
        }
        if ((options = options ? options : {}, checkCallerID("getIdentity", caller)) && (options.firstCall == !0 || me.isReady({
            caller: caller,
            methodName: "getIdentity"
        })))
        {
            if (log("getIdentity(" + caller + ")"), typeof _identity == "object" && _identity.authenticated !== !1)
                if (isIdentityExpired())
                    log("cached identity expired.");
                else if (log(_identity, "D", {sourceFn: "cached result: getIdentity(" + caller + ")"}), typeof options.onSuccess == "function")
                {
                    options.onSuccess(_identity, options.passThruValue);
                    return !0
                }
            me.callbackManager.add(caller, "getIdentity", options.onSuccess),
            me.callbackManager.add(caller, "getIdentity_ERR", options.onError);
            var url = getServiceUrl("/identity/");
            return aisGET(url, function(result)
                {
                    result.authenticated !== !1 && (me.storage("identity", result), _identity = result),
                    log(result, "D", {sourceFn: "result: getIdentity(" + caller + ")"}),
                    me.callbackManager.call(caller, "getIdentity", options.onSuccess, result, options.passThruValue)
                }, function(e)
                {
                    log("error: getIdentity(" + caller + ") " + e.errorThrown, "E"),
                    me.callbackManager.call(caller, "getIdentity_ERR", options.onError, e, options.passThruValue)
                }, null, {
                    methodName: "getIdentity",
                    methodArgs: arguments,
                    caller: caller
                }, {
                    akamaiService: "identity",
                    caller: caller
                }), "WAITING_FOR_RESPONSE"
        }
    },
    me.performAuthentication = function(caller, options)
    {
        function performAuthentication()
        {
            var url = getServiceUrl("/init/");
            aisGET(url, function(result)
            {
                authenticationStateChange(result.authenticated, {source: "performAuthentication"}),
                result.authenticated ? me.ui.closeWithMessage(null, {
                    text: {
                        en: "Authenticated.",
                        fr: "Authentifié"
                    },
                    timer: 1e3,
                    authN: !0
                }) : me.bduChooser.open(result, "auth")
            }, function(e)
            {
                log("performAuthentication(" + caller + ") " + e.errorThrown, "E"),
                me.callbackManager.call(caller, "performAuthentication_ERR", options.onError, e, options.passThruValue),
                me.messaging.show("ERM-02")
            }, null, {
                methodName: "performAuthentication",
                methodArgs: arguments,
                caller: caller
            }, {
                akamaiService: "init",
                caller: caller
            })
        }
        if (checkCallerID("performAuthentication", caller) && me.isReady({
            caller: caller,
            methodName: "performAuthentication"
        }))
        {
            if (log("performAuthentication(" + caller + ")"), options = options ? options : {}, _isAuthenticated == !0)
                return !0;
            if (me.possibleIdps !== undefined & !_isAuthenticated)
            {
                me.bduChooser.open(me.possibleIdps, "auth");
                return
            }
            me.messaging.show(null, {spinner: !0}),
            _identity = undefined,
            me.callbackManager.add(caller, "performAuthentication_ERR", options.onError),
            performAuthentication()
        }
    },
    me.performLogout = function(caller, options)
    {
        if (checkCallerID("performLogout", caller) && me.isReady({
            caller: caller,
            methodName: "performLogout"
        }))
        {
            options = options ? options : {},
            log("performLogout(" + caller + ")");
            var url = getServiceUrl("/slo/");
            aisGET(url, function(result)
            {
                if (authenticationStateChange(result.authenticated, {
                    source: "performLogout",
                    caller: caller
                }), options.onSuccess)
                    options.onSuccess(result)
            }, null, {cache: !1}, {
                methodName: "performLogout",
                methodArgs: arguments,
                caller: caller
            }, {
                akamaiService: "slo",
                caller: caller
            }),
            me.allowedResources.clear(),
            _identity = undefined
        }
    },
    me.allowedResources = {},
    me.allowedResources.list = [],
    me.allowedResources.set = function(resourceId, status, akamaiResponse)
    {
        resourceId = resourceId ? resourceId.toString() : "";
        var ndx = me.allowedResources.check(resourceId, !0);
        typeof ndx != "undefined" && ndx > -1 && me.allowedResources.list.splice(ndx, 1),
        me.allowedResources.list.push({
            resource: resourceId,
            authorization: status,
            akamaiResponse: akamaiResponse
        }),
        me.allowedResources.webStorage_push()
    },
    me.allowedResources.check = function(resourceId, returnIndex)
    {
        me.allowedResources.webStorage_pull();
        var retVal;
        return $.each(me.allowedResources.list, function(i)
            {
                this.resource == resourceId && (retVal = returnIndex == !0 ? i : this.akamaiResponse)
            }), retVal
    },
    me.allowedResources.webStorage_push = function()
    {
        me.storage(null, null, {checkIfSupported: !0}) && me.storage("allowedResources", me.allowedResources.list)
    },
    me.allowedResources.webStorage_pull = function()
    {
        if (me.storage(null, null, {checkIfSupported: !0}))
        {
            var storedList = me.storage("allowedResources");
            Object.prototype.toString.call(storedList) === "[object Array]" && (me.allowedResources.list = storedList)
        }
    },
    me.allowedResources.clear = function()
    {
        me.allowedResources.list.length = 0,
        me.storage("allowedResources", "")
    },
    me.isAuthorizedForResource = function(caller, resourceId, options)
    {
        function isAuthorizationExpired()
        {
            if (resourceInfo.jsig_block && resourceInfo.jsig_block.timestamp)
                return Math.floor(Date.now() / 1e3) - resourceInfo.jsig_block.timestamp > 3600 ? (me.allowedResources.clear(), !0) : !1
        }
        var err,
            returnVal,
            resourceInfo,
            url;
        if (checkCallerID("isAuthorizedForResource", caller) && me.isReady({
            caller: caller,
            methodName: "isAuthorizedForResource"
        }))
        {
            if (options = options ? options : {}, err = !1, _isAuthenticated == !1 && (log("isAuthorizedForResource(" + caller + ") - user not authenticated", "e"), err = !0), resourceId || (log("isAuthorizedForResource(" + caller + ") missing resourceId", "E"), err = !0), err)
            {
                if (options.onError)
                    options.onError("ERROR");
                return "ERROR"
            }
            if (log("isAuthorizedForResource(" + caller + ", " + resourceId + ") " + (axisAuthApi.lib.isNumeric(options.chainedCallback) ? "chainedCallback:" + options.chainedCallback : "")), returnVal = "WAITING_FOR_RESPONSE", me.callbackManager.add(caller, "isAuthorizedForResource", options.onSuccess, options), me.callbackManager.add(caller, "isAuthorizedForResource_ERR", options.onError), resourceInfo = me.allowedResources.check(resourceId), typeof resourceInfo == "object" && typeof resourceInfo.authorization == "boolean")
                if (isAuthorizationExpired())
                    log("resource " + resourceId + " expired in session storage");
                else
                    return me.callbackManager.call(caller, "isAuthorizedForResource", options.onSuccess, resourceInfo, options), options.showMessageWhenNotAuthorized & resourceInfo.authorization == !1 && me.messaging.show("ERM-01", {
                            txtVarName: "brand",
                            txtVarValue: resourceId
                        }), resourceInfo.authorization;
            return url = getServiceUrl("/identity/resourceAccess/" + resourceId), aisGET(url, function(result)
                {
                    result.authenticated == !1 ? authenticationStateChange(result.authenticated) : (authenticationStateChange(!0), options.showMessageWhenNotAuthorized & result.authorization == !1 && me.messaging.show("ERM-01", {
                        txtVarName: "brand",
                        txtVarValue: resourceId
                    }), me.allowedResources.set(resourceId, result.authorization, result)),
                    me.callbackManager.call(caller, "isAuthorizedForResource", options.onSuccess, result, options)
                }, function(e)
                {
                    log("isAuthorizedForResource(" + caller + ", " + resourceId + ") ptv:" + options.passThruValue + ", ERR: " + e.textStatus + " - " + e.errorThrown, e.errmode, {force: !0}),
                    me.callbackManager.call(caller, "isAuthorizedForResource_ERR", options.onError, e)
                }, null, {
                    methodName: "isAuthorizedForResource",
                    methodArgs: arguments,
                    caller: caller,
                    chainedCallback: options.chainedCallback
                }, {
                    akamaiService: "identity/resourceAccess",
                    caller: caller
                }), returnVal
        }
    },
    me.isAuthorizedForResources = function(caller, resources, options)
    {
        function loopCall()
        {
            me.isAuthorizedForResource(caller, resources[i], {
                onSuccess: function(result)
                {
                    if (processResult(result))
                        options.onSuccess(!0, options.passThruValue, result);
                    else if (i++, i < resources.length)
                        loopCall();
                    else
                    {
                        options.showMessageWhenNotAuthorized && me.messaging.show("ERM-01", {
                            txtVarName: "brand",
                            txtVarValue: listOfResources(resources)
                        });
                        options.onSuccess(!1, options.passThruValue)
                    }
                },
                chainedCallback: i
            })
        }
        function processResult(result)
        {
            return result.authorization == !0 ? !0 : !1
        }
        function listOfResources(resources)
        {
            for (var OR = me.ui.currentLanguage == "fr" ? " ou " : " or ", res = "", j = 0; j < resources.length; j++)
                res = res == "" ? resources[j] + " " : res + OR + resources[j] + " ";
            return res
        }
        var err,
            i;
        if (checkCallerID("isAuthorizedForResources", caller) && me.isReady({methodName: "isAuthorizedForResources"}))
        {
            if (options = options ? options : {}, err = !1, _isAuthenticated || (log("isAuthorizedForResources(" + caller + ") - user not authenticated", "E"), err = !0), resources || (log("isAuthorizedForResources(" + caller + ") missing resources", "E"), err = !0), Object.prototype.toString.call(resources) != "[object Array]" && (log("isAuthorizedForResources(" + caller + ") resources is not JS Array", "E"), err = !0), err)
            {
                if (options.onError)
                    options.onError("ERROR");
                return "ERROR"
            }
            if (options.vcmsFormat = typeof options.vcmsFormat == "boolean" ? options.vcmsFormat : !0, options.vcmsFormat === !0)
                for (i = 0; i < resources.length; i++)
                    typeof resources[i].ResourceCode == "undefined" ? (log("isAuthorizedForResources(" + caller + ") - vcmsFormat ResourceCode==undefined", "E"), log(resources, "D", {force: !0})) : resources[i] = resources[i].ResourceCode;
            return i = 0, loopCall(), "WAITING_FOR_RESPONSE"
        }
    },
    me.akamai = function(caller, key, options)
    {
        if (checkCallerID("akamai", caller) && me.isReady({
            caller: caller,
            methodName: "akamai"
        }))
        {
            if (log("akamai(" + caller + ", " + key + ")"), !key)
                return log("akamai() missing key", "E"), "ERROR";
            var url = getServiceUrl("/" + key + "/");
            return aisGET(url, function(result)
                {
                    if (options.onSuccess)
                        options.onSuccess(result, key, url)
                }, function(e)
                {
                    if (options.onError)
                        options.onError(e)
                }, null, {
                    methodName: "akamai",
                    methodArgs: arguments,
                    caller: caller
                }, {
                    akamaiService: key,
                    caller: caller
                }), "WAITING_FOR_RESPONSE"
        }
    },
    me.bdu = function(encBduData, bduData)
    {
        encBduData && (bduData = JSON.parse(decodeURIComponent(encBduData))),
        me.selectedBdu = bduData,
        log("bdu(" + me.selectedBdu.Id + ") " + me.selectedBdu.DisplayName + " " + bduData.Urn),
        me.events.triggerEvent("on_bdu_selection", me.selectedBdu),
        me.ui.showItem("_bdu_login"),
        me.selectedBdu.AdjustHeight && $("#ifrAxisAuthApi").height(me.selectedBdu.AdjustHeight + "%"),
        me.selectedBdu.Scroll && $("#axAuthApi_main_bduLogin").css({"overflow-y": "scroll"}),
        _checkAuthCount = 0,
        _checkAfterLoginLoop = !0,
        setTimeout(checkAfterLogin, me.cfg.pingingDelay)
    },
    _checkAuthCount = 0,
    _checkAfterLoginLoop = !1,
    me.checkAfterLoginLoopSet = function(val)
    {
        _checkAfterLoginLoop = val
    },
    me.storage = function(key, value, options)
    {
        function isHtml5storage()
        {
            try
            {
                return "sessionStorage" in window && window.sessionStorage !== null
            }
            catch(e)
            {
                return !1
            }
        }
        if (options && options.checkIfSupported)
            return isHtml5storage();
        if (!isHtml5storage())
            return null;
        if (key = me.name + "_" + key, typeof value == "undefined")
            try
            {
                var itm = sessionStorage.getItem(key);
                return itm != "" ? JSON.parse(decodeURIComponent(itm)) : null
            }
            catch(ex)
            {
                log("storage(get, " + key + ") - " + ex.message, "E", {hide: !0})
            }
        else
            value = value == null ? "" : encodeURIComponent(JSON.stringify(value)),
            sessionStorage.setItem(key, value)
    },
    me.getServiceUrl = function(arg)
    {
        return getServiceUrl(arg)
    },
    me.makeBduRedirectUrl = function(bduStr)
    {
        var lang = me.vhBrand.lang.def ? me.vhBrand.lang.def : "";
        return me.getServiceUrl("/init/") + bduStr + "?responsemethod=redirect&responsetarget=" + me.cfg.Akamai.responsetarget + "&lang=" + lang
    },
    me.events = {
        log: document.location.search.indexOf("eventlog") > -1 ? !0 : !1,
        list: {},
        queue: [],
        addEvent: function(evname, callback)
        {
            me.events.list[evname] || (me.events.list[evname] = $.Callbacks()),
            me.events.list[evname].add(callback)
        },
        removeEvent: function(evname, callback)
        {
            me.events.list[evname] && me.events.list[evname].remove(callback)
        },
        triggerEvent: function(evname, ev, options)
        {
            if (options = options ? options : {}, evname != "on_ready" && _isReady == !1)
            {
                me.events.queue.push({
                    evname: evname,
                    ev: ev,
                    options: options
                });
                return
            }
            me.events.list[evname] ? (log(evname + " : event fired, source:" + options.source, "I", {force: !0}), me.events.list[evname].fire(ev, options)) : me.events.log | me.cfg.debug && log(evname + " : event fired before it was registered!", "W", {force: !0})
        },
        processQueue: function()
        {
            for (var i = 0; i < me.events.queue.length; i++)
                log("firing event from queue: " + me.events.queue[i].evname),
                me.events.triggerEvent(me.events.queue[i].evname, me.events.queue[i].ev, me.events.queue[i].options);
            me.events.queue.length = 0
        }
    },
    $(document).ready(function()
    {
        function msgListener(event)
        {
            var originDomain = me.lib.parseUrlDomain(me.cfg.baseApiUrl),
                messageData = me.lib.getInterFrameMessage(event);
            messageData != null && (log("msgListener(origin: " + event.origin + ") crossframe messageSender: " + messageData.messageSender), me.alfaCrossCookie.msgCallback(messageData), me.alfaThirdPartyCookie.msgCallback(messageData), me.forms.msgCallback(messageData), messageData.messageSender == "aisRedirect" && me.getIdentity("aisRedirect", {onSuccess: function(response)
                    {
                        var authN = response.authenticated == !1 ? !1 : !0;
                        authenticationStateChange(authN),
                        authenticationResult("aisRedirect")
                    }}))
        }
        window.addEventListener ? addEventListener("message", msgListener, !1) : attachEvent("onmessage", msgListener),
        log("ver.: " + me.ver + " document.ready() completed")
    }),
    _isReady = !1,
    me.isReady = function(option)
    {
        return option = option ? option : {}, typeof option.forceValue == "boolean" && (_isReady = option.forceValue), option.methodName && _isReady == !1 && log(option.methodName + "(" + option.caller + " )  API not ready.", "E"), _isReady
    },
    me.ready = function(caller, options)
    {
        function fnLoop()
        {
            if (_isReady)
                readyCount = 0,
                makeCall();
            else if (readyCount++, readyCount > 32)
            {
                var e = {errorThrown: "ready() failed after " + (readyCount - 1) * loopInterval / 1e3 + " sec"};
                me.events.triggerEvent("api_ready_timeout"),
                readyCount = 0,
                me.callbackManager.call(caller, "ready_ERR", options.onError, e),
                me.callbackManager.remove(caller, "ready", options.onSuccess),
                log(e.errorThrown, "E")
            }
            else
                log("ready-fnLoop(" + caller + ", " + readyCount + ")"),
                setTimeout(fnLoop, loopInterval)
        }
        function makeCall()
        {
            me.events.processQueue(),
            me.callbackManager.call(caller, "ready", options.onSuccess, null, options)
        }
        me.callbackManager.add(caller, "ready", options.onSuccess, options),
        me.callbackManager.add(caller, "ready_ERR", options.onError);
        var readyCount = 0,
            makeCallCount = 0,
            loopInterval = 500;
        _isReady ? makeCall() : fnLoop()
    },
    me.timeStat = +new Date,
    me.storage(null, null, {checkIfSupported: !0}) && (auth = me.storage("isAuthenticated"), typeof auth == "boolean" && authenticationStateChange(auth, {source: "sessionStorage"}), identity = me.storage("identity"), identity != null && typeof identity == "object" && (_identity = identity)),
    configErr = !1,
    typeof vhBrand != "undefined" && vhBrand ? (me.vhBrand = $.extend({}, vhBrand), typeof vhBrand.destinationCode == "undefined" && (me.vhBrand.lang = {}, configErr = !0, log("vhBrand.destinationCode==undefined ! ERROR: destinationCode not set on hosting page.", "E"))) : (me.vhBrand = {}, me.vhBrand.lang = {}, configErr = !0, log("vhBrand==undefined ! ERROR: vhBrand Is missing at hosting page or declared AFTER this script loads.", "E")),
    me.vhBrand.disabled ? (log("vhBrand.disabled=true ! Authentication is disabled !", "E"), _isReady = !0) : me.configFromAxis.get(function(response)
    {
        response && response.error == !0 || (vhBrand.override && ($.extend(me.vhBrand, vhBrand.override), log("vhBrand settings from Axis Config were overriden on host page!", "W", {force: !0})), me.ui.currentLanguage = me.vhBrand.lang.def, vhBrand.preloadAIS == !0 ? (log("preloadAIS=true", "i"), me.isAuthenticated(me.name, {
                firstCall: !0,
                onSuccess: function(result)
                {
                    result.authenticated ? (me.getIdentity(me.name, {
                        firstCall: !0,
                        onSuccess: function(){},
                        onError: function(){}
                    }), _isReady = !0, me.events.triggerEvent("on_ready")) : (_isReady = !0, me.events.triggerEvent("on_ready")),
                    me.timeStat = +new Date - me.timeStat,
                    log("& [AIS] ready in " + me.timeStat + "ms", "i")
                },
                onError: function(e)
                {
                    log("on startup " + e.errorThrown, "e")
                }
            })) : (_isReady = !0, me.events.triggerEvent("on_ready"), me.timeStat = +new Date - me.timeStat, log("ready in " + me.timeStat + "ms", "i")), cerberus())
    }, {}),
    me.setDebugCookie = function(n)
    {
        return me.lib.cookie("alFadEbUg", n, {
                expires: "#$%",
                path: "/"
            }), n == 125 ? "Reload page after setting cookie." : "uzzzzh!"
    }
}();
/*! AxisAuthApi.ui  13.12.2 */
(function(parent)
{
    function build_HTML()
    {
        var htm = new uiHTML;
        htm.container(),
        htm.waitSpinner(),
        htm.bduChooserList(),
        htm.messageBox(),
        htm.form(),
        switchMode(),
        parent.vhBrand.lang.bilingual == !1 && $(".axAuthApi_header_btm").hide(),
        me.lang(me.currentLanguage)
    }
    function switchMode()
    {
        switch (me.mode)
        {
            case"auth":
                $("#axAuthApi_container .m-auth").show(),
                $("#axAuthApi_container .m-scrn").hide();
                break;
            case"screendoor":
                $("#axAuthApi_container .m-auth").hide(),
                $("#axAuthApi_container .m-scrn").show();
                break;
            case"message":
                $("#axAuthApi_footer .m-auth").hide(),
                $("#axAuthApi_footer .m-scrn").hide(),
                $("#axAuthApi_footer .m-msg").show()
        }
    }
    function makeOverlay()
    {
        if (parent.events.triggerEvent("on_ui_open"), vhBrand.uiOverlay == !1)
        {
            $("#axAuthApi_container").css({
                "-moz-box-shadow": "0 0 0 #fff",
                "-webkit-box-shadow": "0 0 0 #fff",
                "box-shadow": "0 0 0 #fff"
            });
            return
        }
        if (!$("#" + _modalOverlay_id) || !($("#" + _modalOverlay_id).length > 0))
        {
            var divOverlay = document.createElement("div");
            $(divOverlay).attr("id", _modalOverlay_id),
            $(divOverlay).css({
                "background-color": "#000",
                opacity: .5,
                filter: "alpha(opacity=50)",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                "z-index": 2147483645
            }),
            $("body").append(divOverlay)
        }
    }
    var me = {},
        log,
        mainCSS,
        _header,
        _waitMsg,
        _bdu_chooser,
        _bdu_chooser_list,
        _bdu_chooser_autoSuggest,
        _back2_bduchooser,
        _bdu_login,
        _message_box,
        _message_box_txt,
        _form_box,
        _modalOverlay_id,
        _ui_container,
        _ui_inner_container,
        uiHTML,
        _headerText;
    if (me.ver = "13.12.2", me.name = "ui", parent[me.name] = me, log = new parent.consoleLog(parent.name + "." + me.name), me.mode, me.status, typeof vhBrand == "undefined")
        return log("vhBrand is undefined on hosting page", "E"), !1;
    mainCSS = vhBrand.mobile ? parent.cfg.baseApiUrl + "axisAuthApi-320x480.css" : parent.cfg.baseApiUrl + "axisAuthApi-620x480.css",
    $("head").append('<link type="text/css" rel="stylesheet" href="' + mainCSS + '"><\/link>'),
    me.cfg = {},
    me.cfg.loading_spinner_url = parent.cfg.baseApiUrl + "spinner.html",
    me.info = function()
    {
        var inf = {};
        return inf.ver = me.ver, inf.name = me.name, inf.status = me.status, inf.mode = me.mode, inf.currentLanguage = me.currentLanguage, inf.cfg = me.cfg, inf
    },
    _modalOverlay_id = "axAuthApiOvl",
    uiHTML = function()
    {
        $(_ui_container).length != 0 && ($(_ui_container).remove(), log("uiHTML() removed exisitng UI before creating new.", "W"));
        var helpLink1 = "",
            helpLink2 = "",
            helpLink3 = "";
        try
        {
            var helpLink1 = {
                    en: parent.vhBrand.msgbox_needHelp_url_en,
                    fr: parent.vhBrand.msgbox_needHelp_url_fr
                },
                helpLink2 = {
                    en: parent.vhBrand.msgbox_thrdKuki_url_en,
                    fr: parent.vhBrand.msgbox_thrdKuki_url_fr
                },
                helpLink3 = {
                    en: parent.cfg.urls.ie11workaround,
                    fr: parent.cfg.urls.ie11workaround + "?lang=fr"
                }
        }
        catch(e)
        {
            log("Axis config err " + e, "E")
        }
        this.container = function()
        {
            _ui_container = $('<div id="axAuthApi_container" class="axAuthApi_container">'),
            $("body").append(_ui_container),
            $(_ui_container).focus(),
            _ui_header = $('<div id="axAuthApi_header">   <div class="axAuthApi_header_top">       <div class="axAuthApi_header_back">           <div id="axAuthApi_header_back_link" style="line-height: 2.5em !important;">               <div class="axAuthApi_arrow-left axAuthApi-fnt"><\/div><a onclick="axisAuthApi.ui.clk(\'bduchooser\'); return false;" class="axAuthApi-fnt" href="#" data-en="Back" data-fr="Retour">Back<\/a>           <\/div>       <\/div>       <div class="axAuthApi_header_title m-auth axAuthApi-fnt" data-en="Sign In"              data-fr="Se Connecter">Sign In<\/div>       <div class="axAuthApi_header_title m-scrn axAuthApi-fnt" data-en="Before You Continue" data-fr="Avant De Poursuivre" style="display:none;">Before You Continue<\/div>       <div class="axAuthApi_header_close"><a onclick="axisAuthApi.ui.close(\'btnX\'); return false;" class="axAuthApi-fnt" href="#" >&#215;&nbsp;<\/a><\/div>   <\/div>   <div class="axAuthApi_header_btm axAuthApi-fnt">       <a href="#" onclick="axisAuthApi.ui.lang(\'en\');">English<\/a> &nbsp;|&nbsp; <a href="#" onclick="axisAuthApi.ui.lang(\'fr\');">Français<\/a>   <\/div><\/div>'),
            $(_ui_container).append(_ui_header),
            _back2_bduchooser = $("#axAuthApi_header_back_link"),
            _ui_inner_container = $('<div id="axAuthApi_main"><\/div>'),
            $(_ui_container).append(_ui_inner_container),
            _ui_footer = $('<div id="axAuthApi_footer">    <div class="axAuthApi_footer_btns" >        <div class="axAuthApi_footer_btns_1 m-auth">            <div class="axAuthApi_footer_btn axAuthApi-fnt" style="width: 70%; margin: 0 auto;" onclick="axisAuthApi.ui.clk(\'nosvcprov\')" data-en="I do not have a TV service provider" data-fr="Je n’ai pas de fournisseur de services de télévision">I do not have a TV service provider<\/div>        <\/div>        <div class="axAuthApi_footer_btns_2 m-scrn" style="display:none;">            <div style="float:left; width:50%;"><div class="axAuthApi_footer_btn axAuthApi-2ln axAuthApi-fnt" style="float:right; margin-right:5%" onclick="axisAuthApi.ui.clk(\'antenna\')"  data-fr="Aucun fournisseur&nbsp;télé/&lt;br/&gt;Antenne"            data-en="I use antenna service">I use antenna service<\/div><\/div>            <div style="float:right;width:50%;"><div class="axAuthApi_footer_btn axAuthApi-2ln axAuthApi-fnt" style="float:left;  margin-left: 5%" onclick="axisAuthApi.ui.clk(\'internet\')" data-fr="Aucun fournisseur&nbsp;télé/&lt;br/&gt;Internet seulement" data-en="I use internet connection">I use internet connection<\/div><\/div>        <\/div>        <div class="axAuthApi_footer_btns_3 m-msg" style="display:none;">            <div class="axAuthApi_footer_btn axAuthApi-fnt" style="width: 15%; margin: 0 auto;" onclick="axisAuthApi.ui.close(\'btnF\'); return false;" class="" data-en="Close" data-fr="Fermer">Close<\/div>        <\/div>    <\/div>    <div id="axAuthApi_footer_msg" class="axAuthApi_footer_links axAuthApi-2ln" style="">        <a href="' + helpLink1.en + '" target="_blank" class="axAuthApi-fnt" style="display:inline-block;    width: 40%" data-en-href="' + helpLink1.en + '" data-fr-href="' + helpLink1.fr + '" data-en="Need Help?" data-fr="Besoin d’aide?">Need Help?<\/a>        <br />        <a href="' + helpLink2.en + '" target="_blank" class="axAuthApi-fnt" style="display:inline-block;    width:100%" data-en-href="' + helpLink2.en + '" data-fr-href="' + helpLink2.fr + '" data-en="Having trouble? Make sure that 3rd party cookies are enabled. Why?" data-fr="Vous éprouvez des problèmes? Assurez-vous d’activer les cookies tiers.  Pourquoi?">Having trouble? Make sure that 3rd party cookies are enabled. Why? <\/a>        <a href="' + helpLink3.en + '" target="_blank" class="axAuthApi-fnt" style="display:none; color:red !important; width:100%" data-en-href="' + helpLink3.en + '" data-fr-href="' + helpLink3.fr + '" data-en="Having trouble with IE11? Please read this." data-fr="Ayant des problèmes avec IE11? S\'il vous plaît lire ceci.">Having trouble with IE11? Please read this. <\/a>    <\/div><\/div>'),
            $(_ui_container).append(_ui_footer)
        },
        this.bduChooserList = function(onReady)
        {
            if (me.mode == "auth" | me.mode == "screendoor")
            {
                var html = '<div id="axAuthApi_main_bduChooser">   <div style="display: table; height:20%; width:100%">';
                html = me.mode == "screendoor" ? html + '<div class="axAuthApi-fnt bb" style="display:table-cell; vertical-align: middle; text-align: center; height:100%;" data-en="Please select your TV service provider" data-fr="Veuillez sélectionner votre fournisseur de services de télévision.">Please select your TV service provider<\/div>' : html + '       <div class="axAuthApi-fnt bb" style="display:table-cell; vertical-align: middle; text-align: center; height:100%;" >           <div>               <span data-en="If you get ' + parent.vhBrand.displayName + " at home through a participating TV provider, you can watch " + parent.vhBrand.displayName + ' GO at no additional charge."                     data-fr="Si vous avez accès à ' + parent.vhBrand.displayName + " à domicile via un fournisseur de services de télévision participant, vous pouvez aussi profiter de " + parent.vhBrand.displayName + ' GO sur votre ordinateur portable ou appareil mobile sans frais supplémentaires">               <\/span>           <\/div><br/><br/>           <div class="axAuthApi_bdu2"              data-en="Select your TV service provider and login with your subscriber account info:"              data-fr="Connectez-vous avec vos accès:">               Select your TV service provider and login with your subscriber account info.           <\/div><\/div>',
                html = html + '   <\/div>    <div class="axAuthApi_main_bduChooser-list axAuthApi-fnt"><\/div>    <div style="position:absolute; bottom:17%; left:0; width:80%; padding: 0 10%; " class="axAuthApi-fnt" data-en="TV provider not listed above? Search below:" data-fr="Votre fournisseur ne se trouve pas dans la liste?"><\/div>    <div id="axAuthApi_main_bduChooser-autoSuggest" ><\/div><\/div>',
                _bdu_chooser = $(html),
                $(_ui_inner_container).append(_bdu_chooser),
                _bdu_chooser_list = $(".axAuthApi_main_bduChooser-list"),
                _bdu_chooser_autoSuggest = $("#axAuthApi_main_bduChooser-autoSuggest"),
                $(_bdu_chooser).hide(),
                _bdu_login = $('<div id="axAuthApi_main_bduLogin" style="width:90%; padding:0 5%; height:90%;"><iframe src="' + me.cfg.loading_spinner_url + '" name="ifrAxisAuthApi" id="ifrAxisAuthApi" scrolling="no" frameborder="0" style="width:100%; height:100%;"/><\/div>'),
                $(_ui_inner_container).append(_bdu_login)
            }
            onReady && onReady()
        },
        this.messageBox = function(onReady)
        {
            _message_box = $('<div id="axAuthApi_main_msgBox"><div style="display: table; height:100%; width:100%"><div class="axAuthApi_main_msgBox-txt" style="display:table-cell; vertical-align: middle; text-align: center;"><\/div><\/div><\/div>'),
            $(_ui_inner_container).append(_message_box),
            _message_box_txt = $(".axAuthApi_main_msgBox-txt"),
            onReady && onReady()
        },
        this.waitSpinner = function()
        {
            _waitMsg = $('<div class="axAuthApi_spinner" style="width:100%; height:100%;"><\/div>'),
            $(_ui_inner_container).append(_waitMsg);
            var spinner = new parent.lib.Spinner({
                    lines: 12,
                    width: 4,
                    length: 12,
                    radius: 12,
                    color: "#000",
                    trail: 60,
                    shadow: !1,
                    hwaccel: !1,
                    className: "spinner",
                    zIndex: 0,
                    top: 100,
                    left: 100
                }),
                spinnerSize = 27;
            spinner.opts.top = $(_ui_inner_container).height() / 2 - spinnerSize,
            spinner.opts.left = $(_ui_inner_container).width() / 2 - spinnerSize,
            spinner.spin(_waitMsg[0])
        },
        this.form = function()
        {
            _form_box = $('<div id="axAuthApi_main_form" style="height:120%;"><iframe src="' + me.cfg.loading_spinner_url + '" name="ifrAxisAuthApiFr" id="ifrAxisAuthApiFr" scrolling="no" frameborder="0" style="width:100%; height:100%;"/><\/div>'),
            $(_form_box).hide(),
            $(_ui_inner_container).append(_form_box)
        }
    },
    me.htmlOfBduChooser = function(html)
    {
        $(_bdu_chooser_list).html(html)
    },
    me.htmlOfMessage = function(html)
    {
        $(_message_box_txt).html(html)
    },
    me.back2bduChooser = function(mode)
    {
        mode == "show" && $(_back2_bduchooser).css("visibility", "visible"),
        mode == "hide" && $(_back2_bduchooser).css("visibility", "hidden")
    },
    _headerText = {},
    me.headerText = function(txtObj, options)
    {
        var selector;
        switch (me.mode)
        {
            case"auth":
                selector = ".axAuthApi_header_title.m-auth";
                break;
            case"screendoor":
                selector = ".axAuthApi_header_title.m-scrn"
        }
        options && options.restore ? ($(selector).attr("data-en", _headerText.en), $(selector).attr("data-fr", _headerText.fr)) : (_headerText.en = $(selector).attr("data-en"), _headerText.fr = $(selector).attr("data-fr"), $(selector).attr("data-en", txtObj.en), $(selector).attr("data-fr", txtObj.fr)),
        me.lang(me.currentLanguage)
    },
    me.messageBoxClear = function()
    {
        $(_message_box).attr("data-id", ""),
        $(_message_box_txt).css("color", "#808080"),
        $(_message_box_txt).empty()
    },
    me.getElement = function(elem)
    {
        switch (elem)
        {
            case"_bdu_chooser_autoSuggest":
                return _bdu_chooser_autoSuggest
        }
    },
    me.showFooterMsg = function()
    {
        $($("#axAuthApi_footer_msg a")[1]).css("display", "none"),
        $($("#axAuthApi_footer_msg a")[2]).css("display", "inline-block")
    },
    me.show = function(mode, onReady)
    {
        if (log("show(" + mode + ")"), me.status == "CSS_error")
        {
            me.closeWithMessage(null, {text: {
                    en: "Oops",
                    fr: "Oups"
                }});
            return
        }
        if (me.status == "open" && mode == "message")
        {
            onReady();
            return
        }
        me.mode = mode,
        makeOverlay(),
        build_HTML(),
        parent.configFromAxis.get(function()
        {
            me.status = "open",
            onReady()
        })
    },
    me.close = function(closer, options)
    {
        (log("close(" + me.mode + ")"), parent.messaging.messageStack("pull")) || (parent.checkAfterLoginLoopSet(!1), $(_ui_container).remove(), $("#" + _modalOverlay_id).remove(), parent.events.triggerEvent("on_ui_close"), parent.mobileApp.send("close", {
                closer: closer,
                options: options
            }), me.mode == "screendoor" && parent.screenDoor.close(), me.mode == "auth" && closer == "btnX" && parent.events.triggerEvent("on_authentication_cancel"), me.mode = null, parent.bduChooser.mode = null, me.status = "closed")
    },
    me.closeWithMessage = function(msgCode, options)
    {
        var txt,
            timeout;
        if (msgCode)
        {
            log("closeWithMessage() msgCode argument unsupported.");
            return
        }
        if (typeof options == "undefined" || typeof options.text == "undefined")
        {
            log("closeWithMessage() message text is undefined.", "E");
            return
        }
        log("closeWithMessage(" + options.text.en + ")"),
        me.close("closeWithMessage()", options),
        makeOverlay();
        switch (me.currentLanguage)
        {
            case"en":
                txt = options.text.en;
                break;
            case"fr":
                txt = options.text.fr;
                break;
            default:
                txt = options.text.en
        }
        me.currentLanguage,
        timeout = options && options.timer ? options.timer : 5e3,
        $("#" + _modalOverlay_id).html('<div style="position:absolute; top:50%; left:50%; width:400px; margin-left:-200px; height:40px; margin-top:-30px; color:white; text-align:center; font-family:Arial; font-size:20px; ">' + txt + "<\/div>"),
        setTimeout(function()
        {
            $("#" + _modalOverlay_id).remove(),
            parent.events.triggerEvent("on_ui_close")
        }, timeout)
    },
    me.lang = function(lang)
    {
        switch (lang)
        {
            case"en":
                $("#axAuthApi_container [data-en]").each(function()
                {
                    $(this).html($(this).attr("data-en"))
                }),
                $("#axAuthApi_container [data-en-href]").each(function()
                {
                    $(this).attr("href", $(this).attr("data-en-href"))
                });
                break;
            case"fr":
                $("#axAuthApi_container [data-fr]").each(function()
                {
                    $(this).html($(this).attr("data-fr"))
                }),
                $("#axAuthApi_container [data-fr-href]").each(function()
                {
                    $(this).attr("href", $(this).attr("data-fr-href"))
                });
                break;
            default:
                lang = me.currentLanguage
        }
        me.currentLanguage = lang;
        switch (lang)
        {
            case"en":
                $('#axAuthApi_container [lang="en"]').show(),
                $('#axAuthApi_container [lang="fr"]').hide();
                break;
            case"fr":
                $('#axAuthApi_container [lang="en"]').hide(),
                $('#axAuthApi_container [lang="fr"]').show();
                break;
            default:
                lang = me.currentLanguage
        }
        me.mode == "auth" | me.mode == "screendoor" && parent.bduChooser.autoSuggest_build()
    },
    me.showItem = function(item)
    {
        function switchFooter(item)
        {
            switch (item)
            {
                case"_message_box":
                    $("#axAuthApi_footer .m-auth").hide(),
                    $("#axAuthApi_footer .m-scrn").hide(),
                    $("#axAuthApi_footer .m-msg").show();
                    break;
                case"_bdu_chooser":
                    me.mode == "auth" && ($("#axAuthApi_footer .m-auth").show(), $("#axAuthApi_footer .m-scrn").hide(), $("#axAuthApi_footer .m-msg").hide()),
                    me.mode == "screendoor" && ($("#axAuthApi_footer .m-auth").hide(), $("#axAuthApi_footer .m-scrn").show(), $("#axAuthApi_footer .m-msg").hide());
                    break;
                case"_bdu_login":
                    me.mode == "auth" && ($("#axAuthApi_footer .m-auth").hide(), $("#axAuthApi_footer .m-scrn").hide(), $("#axAuthApi_footer .m-msg").hide()),
                    me.mode == "screendoor" && ($("#axAuthApi_footer .m-auth").hide(), $("#axAuthApi_footer .m-scrn").show(), $("#axAuthApi_footer .m-msg").hide());
                    break;
                case"_form_box":
                    $("#axAuthApi_footer .m-auth").hide(),
                    $("#axAuthApi_footer .m-scrn").hide(),
                    $("#axAuthApi_footer .m-msg").hide()
            }
        }
        makeOverlay();
        switch (item)
        {
            case"_bdu_chooser":
                $(_bdu_chooser).show(),
                $(_bdu_login).hide(),
                $(_message_box).hide(),
                $(_back2_bduchooser).css("visibility", "hidden"),
                $(_waitMsg).hide(),
                $(_form_box).hide(),
                parent.messaging.show(null, {clear: !0});
                break;
            case"_bdu_login":
                $(_bdu_chooser).hide(),
                $(_bdu_login).show(),
                $(_message_box).hide(),
                $(_back2_bduchooser).css("visibility", "visible"),
                $(_waitMsg).hide(),
                $(_form_box).hide();
                break;
            case"_message_box":
                $(_bdu_chooser).hide(),
                $(_bdu_login).hide(),
                $(_message_box).show(),
                $(_back2_bduchooser).css("visibility", "hidden"),
                $(_waitMsg).hide(),
                $(_form_box).hide();
                break;
            case"_waitMsg":
                $(_waitMsg).show();
                break;
            case"_form_box":
                $(_bdu_chooser).hide(),
                $(_bdu_login).hide(),
                $(_message_box).hide(),
                $(_back2_bduchooser).css("visibility", "visible"),
                $(_waitMsg).hide(),
                $(_form_box).show()
        }
        switchFooter(item)
    },
    me.clk = function(command)
    {
        switch (command)
        {
            case"bduchooser":
                $("#ifrAxisAuthApi").attr("src", "about:blank"),
                me.headerText(null, {restore: !0}),
                parent.messaging.messageStack("pull"),
                parent.bduChooser.autoSuggest_build(),
                parent.checkAfterLoginLoopSet(!1),
                parent.bduIsPreselected ? (me.close("clk()"), parent.performAuthentication("backBtn", {forceBduChooser: !0})) : me.showItem("_bdu_chooser");
                break;
            case"ndhelp":
                break;
            case"nosvcprov":
                parent.checkAfterLoginLoopSet(!1),
                parent.messaging.show("ERM-11", {
                    txtVarName: "brand",
                    txtVarValue: parent.vhBrand.displayName,
                    back2bduChooser: !0,
                    headerText: {
                        en: "Thank You",
                        fr: ""
                    }
                });
                break;
            case"antenna":
                parent.screenDoor.bdu(null, {
                    Id: 500,
                    Name: "antenna",
                    Order: 1
                }),
                parent.messaging.show("CFM-04", {
                    back2bduChooser: !0,
                    headerText: {
                        en: "Thank You",
                        fr: "Merci"
                    }
                });
                break;
            case"internet":
                parent.screenDoor.bdu(null, {
                    Id: 501,
                    Name: "internet",
                    Order: 1
                }),
                parent.messaging.show("CFM-04", {
                    back2bduChooser: !0,
                    headerText: {
                        en: "Thank You",
                        fr: "Merci"
                    }
                });
                break;
            default:
                log("ui.clk(command) - bad command: " + command, "E")
        }
    }
})(axisAuthApi),
function(parent)
{
    function doLogosHtml()
    {
        function makeChooserItemHtml(bdu)
        {
            var bduData = encodeURIComponent(JSON.stringify(bdu)),
                target = vhBrand.os == "ios" ? "" : "ifrAxisAuthApi",
                url,
                imgStyle,
                name;
            return me.mode == "auth" ? (url = makeBduRedirectUrl(bdu.Urn), imgStyle = bdu.ForceLogoStyle ? bdu.ForceLogoStyle : "width:120px; height:83px;", '<a href="' + url + '" target="' + target + '" onclick="axisAuthApi.bdu(\'' + bduData + '\');" ><img src="' + bdu.LogoUrl + '" + style="' + imgStyle + '" /><\/a>') : me.mode == "screendoor" ? (name = bdu.ScreenDoorName ? bdu.ScreenDoorName : bdu.DisplayName, '<a href="#" onclick="axisAuthApi.screenDoor.bdu(\'' + bduData + '\');" style="font-weight:medium;">' + name + "<\/a>") : void 0
        }
        var htm,
            i,
            bdu;
        if (me.mode == "auth")
        {
            for (htm = '<table style="width:100%; height:100%;"><tr>', i = 0; i < me.bduList_supported.length; i++)
                bdu = me.bduList_supported[i],
                parent.lib.isNumeric(bdu.LogoOrder) & typeof bdu.LogoUrl == "string" ? htm = htm + '<td style="text-align:center;">' + makeChooserItemHtml(bdu) + "<\/td>" : log("LogoOrder=NaN or LogoUrl!=string - " + bdu.AkamaiName, "E", {hide: !0});
            htm = htm + "<\/tr>"
        }
        if (me.mode == "screendoor")
        {
            for (htm = '<table style="width:100%; height:100%;"><tr>', i = 0; i < me.bduList_screenDoorLogos.length; i++)
            {
                if (i > 5)
                {
                    log("doLogosHtml() too many logos in bduList_screenDoorLogos[].", "E");
                    break
                }
                bdu = me.bduList_screenDoorLogos[i],
                htm = htm + '<td style="text-align:center; width:33.33%;">' + makeChooserItemHtml(bdu) + "<\/td>",
                i == 2 && (htm = htm + "<\/tr><tr>")
            }
            htm = htm + "<\/tr>"
        }
        return htm + "<\/table>"
    }
    function makeBduRedirectUrl(bduStr)
    {
        return parent.makeBduRedirectUrl(bduStr)
    }
    function load_BDU_list(onSuccess, options)
    {
        parent.configFromAxis.get(function()
        {
            var bdus;
            try
            {
                bdus = parent.cfg.configFromAxis.Configuration.GlobalConfiguration.axisAuthApi.bduList,
                bdus = JSON.parse(bdus)
            }
            catch(e)
            {
                bdus = undefined,
                log("bdu list reading failed.", "E")
            }
            parent.lib.isArray(bdus) && onSuccess(bdus, options)
        });
        return
    }
    function processBDUs()
    {
        var prop,
            newObject,
            i;
        if (!me.bduList || Object.prototype.toString.apply(me.bduList) !== "[object Array]")
            return log("processBDUs() BDU list is null", "E"), !1;
        if (me.mode == "auth")
        {
            for (me.bduList_supported.length = 0, i = 0; i < me.bduList.length; i++)
            {
                me.bduList[i].Urn && (log("Urn can not be defined in Axis config", "w", {force: !0}), delete me.bduList[i].Urn);
                for (prop in me.possibleIdps)
                    if (me.possibleIdps[prop].name == me.bduList[i].AkamaiName)
                    {
                        prop.indexOf(":") == -1 ? log("processBDUs(" + prop + ")  illegal urn", "e", {hide: !0}) : me.bduList[i].Urn = prop;
                        try
                        {
                            me.bduList[i].LogoUrl = me.possibleIdps[prop].logos.full
                        }
                        catch(e)
                        {
                            parent.lib.isNumeric(me.bduList[i].LogoOrder) && log("processBDUs(" + me.bduList[i].AkamaiName + ") missing/bad logo url.", "E")
                        }
                        newObject = jQuery.extend({}, me.bduList[i]),
                        me.bduList_supported.push(newObject)
                    }
            }
            me.bduList_supported.sort(function(obj1, obj2)
            {
                return obj1.LogoOrder - obj2.LogoOrder
            })
        }
        if (me.mode == "screendoor")
        {
            for (me.bduList_screenDoorLogos.length = 0, i = 0; i < me.bduList.length; i++)
                parent.lib.isNumeric(me.bduList[i].ScreenDoorLogoOrder) && me.bduList_screenDoorLogos.push(me.bduList[i]);
            me.bduList_screenDoorLogos.sort(function(obj1, obj2)
            {
                return obj1.ScreenDoorLogoOrder - obj2.ScreenDoorLogoOrder
            })
        }
    }
    function isBduPreselectedCheck(objFromAkamai)
    {
        var bduID,
            bduList,
            bdu,
            found,
            possibleIdps,
            prop;
        if (parent.tracking && parent.tracking.getLastScreenDoorBdu)
        {
            if ((bduID = parent.tracking.getLastScreenDoorBdu(), bduID == null) || !parent.lib.isNumeric(bduID))
                return !1;
            try
            {
                bduList = parent.cfg.configFromAxis.Configuration.GlobalConfiguration.axisAuthApi.bduList,
                bduList = JSON.parse(bduList)
            }
            catch(e)
            {
                return log("isBduPreselected() " + e.message), !1
            }
            if (!parent.lib.isArray(bduList))
                return log("isBduPreselected() bduList not an array."), !1;
            if (bdu = $.grep(bduList, function(e)
            {
                return e.Id == bduID
            }), bdu.length > 0)
                bdu = bdu[0];
            else
                return log("isBduPreselected() bdu " + bduID + " not found in bduList."), !1;
            found = !1,
            possibleIdps = objFromAkamai;
            for (prop in possibleIdps)
                if (possibleIdps[prop].name == bdu.AkamaiName)
                    if (found = !0, prop.indexOf(":") == -1)
                    {
                        found:!1;
                        log("isBduPreselectedCheck(" + bduID + " - " + prop + ")  illegal urn", "w")
                    }
                    else
                        bdu.Urn = prop;
            return log("isBduPreselected()=true " + bduID), found ? bdu && bdu.Urn ? bdu : !1 : !1
        }
        return !1
    }
    function checkCookieSupport()
    {
        var ret = parent.lib.cookieSupport.test();
        log("lib.cookieSupport.test()=" + ret);
        switch (ret)
        {
            case null:
                parent.messaging.show("", {
                    back2bduChooser: !1,
                    text: {
                        en: "Cookies are blocked in this browser. They are essential for user authentication. Please enable cookies including third party cookies.",
                        fr: "Les cookies sont bloqués dans votre navigateur. Ils sont essentiels pour l'authentification de l'utilisateur. S'il vous plaît activer cette option, y compris les cookies tiers."
                    }
                })
        }
        ret == !0 && (log("check3rdPartyCookie()  "), parent.cfg.check3rdPartyCookieCapability != !1) && parent.alfaThirdPartyCookie.checkSupport(function(isSupported)
        {
            if (parent.lib.browser.isIE11())
            {
                parent.ui.showFooterMsg();
                return
            }
            isSupported || parent.messaging.show("ERM-18", {back2bduChooser: !1})
        }, parent.cfg.th3rdpartyCookie + "alfatpc.aspx")
    }
    var me = {},
        log,
        _is_autoSuggest_build;
    me.ver = "13.7.17",
    me.name = "bduChooser",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.mode,
    me.bduList,
    me.bduList_supported = [],
    me.bduList_screenDoorLogos = [],
    me.possibleIdps,
    me.open = function(objFromAkamai, mode)
    {
        log("open(" + mode + ")");
        switch (mode)
        {
            case"auth":
                if (!objFromAkamai)
                {
                    log("open(auth) possibleIdps from Akamai = null", "E");
                    return
                }
                if (me.possibleIdps = objFromAkamai.possible_idps ? objFromAkamai.possible_idps : objFromAkamai, me.possibleIdps.length == 0)
                {
                    log("open(auth) possibleIdps.len=0"),
                    "E";
                    return
                }
                break;
            case"screendoor":
                break;
            default:
                log("open() missing mode", "E");
                return
        }
        me.mode = mode,
        load_BDU_list(function(response, options)
        {
            if (options = options ? options : {}, options.error)
            {
                log(error.errorThrown, "E");
                return
            }
            if (me.bduList = response, processBDUs() == !1)
            {
                parent.ui.closeWithMessage(null, {text: {
                        en: "Oops",
                        fr: "Oups"
                    }});
                return
            }
            parent.ui.show(mode, function()
            {
                var preselectedBdu,
                    url;
                parent.ui.htmlOfBduChooser(doLogosHtml()),
                parent.ui.showItem("_bdu_chooser"),
                me.autoSuggest_build(),
                checkCookieSupport(),
                preselectedBdu = isBduPreselectedCheck(objFromAkamai),
                mode == "auth" && preselectedBdu && (url = parent.makeBduRedirectUrl(preselectedBdu.Urn), $("#ifrAxisAuthApi").attr("src", url), parent.bdu(null, preselectedBdu))
            })
        })
    },
    _is_autoSuggest_build = !1,
    me.autoSuggest_build = function()
    {
        var bdu_chooser_autoSuggest = parent.ui.getElement("_bdu_chooser_autoSuggest"),
            autoSuggest;
        if (_is_autoSuggest_build && $(bdu_chooser_autoSuggest).empty(), typeof $.fn.alfaAutoSuggest == "undefined")
        {
            log("$.fn.alfaAutoSuggest is undefined.", "E");
            return
        }
        if (me.bduList == null)
        {
            log("autoSuggest_build() me.bduList=null", "E");
            return
        }
        if (me.bduList.length == 0)
        {
            log("autoSuggest_build() me.bduList.length=0", "E");
            return
        }
        autoSuggest = document.createElement("input"),
        $(autoSuggest).attr("type", "text"),
        $(bdu_chooser_autoSuggest).append(autoSuggest),
        $(autoSuggest).alfaAutoSuggest(me.bduList, {
            selectionLimit: 1,
            keyDelay: 200,
            selectedItemProp: "Id",
            selectedItemProp: "DisplayName",
            searchObjProps: "DisplayName",
            startText: parent.ui.currentLanguage == "en" ? "Service provider" : "Fournisseur",
            emptyText: parent.ui.currentLanguage == "en" ? "No results found" : "Aucun résultat trouvé",
            resultClick: function(data)
            {
                var url;
                me.mode == "auth" && (typeof data.attributes.Urn != "undefined" ? (url = parent.makeBduRedirectUrl(data.attributes.Urn), $("#ifrAxisAuthApi").attr("src", url), parent.bdu(null, data.attributes)) : (url = parent.forms.makeUrl_email(data), url == !1 ? parent.messaging.show("ERM-12_OLD", {
                    txtVarName: "brand",
                    txtVarValue: parent.vhBrand.displayName,
                    back2bduChooser: !0
                }) : parent.messaging.show("ERM-12", {
                    txtVarName: "url",
                    txtVarValue: url,
                    back2bduChooser: !0
                }))),
                me.mode == "screendoor" && parent.screenDoor.bdu(null, data.attributes)
            }
        }),
        _is_autoSuggest_build = !0
    }
}(axisAuthApi),
function(parent)
{
    var me = {},
        log,
        _messageStack;
    me.ver = "13.11.15",
    me.name = "messaging",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    _messageStack = [],
    me.show = function(msgCode, options)
    {
        function doHtml(msgCode, options)
        {
            function textVariable(txt, options)
            {
                function loop(txt, options)
                {
                    var found = txt.indexOf("<%" + options.txtVarName + "%>");
                    newText = txt.replace("<%" + options.txtVarName + "%>", options.txtVarValue),
                    found > -1 && loop(newText, options)
                }
                if (typeof txt == "undefined" || txt == null)
                {
                    log("textVariable(" + msgCode + ") text of message is undefined.", "e");
                    return
                }
                var newText;
                return loop(txt, options), newText
            }
            function checkVariables(txt, startIndex, options)
            {
                var P1,
                    P2,
                    testStr;
                txt && ((startIndex = startIndex ? startIndex : 0, txt = txt.substring(startIndex), P1 = txt.indexOf("<%"), P2 = txt.indexOf("%>"), P1 == -1 | P2 == -1) || (options.txtVarName || startIndex == 0 && log("show(" + msgCode + ") message text contains variables, but options.txtVarName is undefined!", "E", {hide: !0}), P1 = P1 + 2, testStr = txt.substring(P1, P2), testStr.indexOf(" ") > -1 && log("show(" + msgCode + ") <%" + testStr + "%> contains spaces!", "E"), checkVariables(txt, P2 + 2, options)))
            }
            var msg,
                currLang,
                messages,
                sEn,
                sFr;
            if (!options.spinner)
            {
                if (msg = {}, currLang = parent.ui.currentLanguage ? parent.ui.currentLanguage : parent.vhBrand.lang.def ? parent.vhBrand.lang.def : "en", options.text)
                    typeof options.text == "string" ? msg[currLang] = options.text : msg = options.text;
                else
                    try
                    {
                        messages = parent.cfg.configFromAxis.Configuration.GlobalConfiguration.Resources.Messages,
                        msg = $.extend({}, messages[msgCode]),
                        parent.lib.isEmptyObject(msg) ? (msg = {}, msg.en = "Error loading message " + msgCode, msg.fr = "Message de chargement d`erreur " + msgCode, log("Message text not found for msgCode=" + msgCode, "E")) : log("show(" + msgCode + ") " + parent.ui.currentLanguage, "I")
                    }
                    catch(ex)
                    {
                        log("show(" + msgCode + ") - " + ex.message, "E"),
                        msg = {},
                        msg.en = "Error loading message...",
                        msg.fr = "Message de chargement d`erreur..."
                    }
                return options.txtVarName && (msg.en = textVariable(msg.en, options), msg.fr = textVariable(msg.fr, options)), checkVariables(msg.en, undefined, options), checkVariables(msg.fr, undefined, options), sEn = parent.ui.currentLanguage == "fr" ? 'style="display:none"' : "", sFr = parent.ui.currentLanguage == "en" ? 'style="display:none"' : "", sEn == "" & msg.en == undefined && (msg.en = "en=undefined"), sFr == "" & msg.fr == undefined && (msg.fr = "fr=undefined"), '<div lang="en" ' + sEn + ' class="axAuthApi_main_msgBox-lang">' + msg.en + '<\/div><div lang="fr" ' + sFr + ' class="axAuthApi_main_msgBox-lang">' + msg.fr + "<\/div>"
            }
        }
        if (options = options ? options : {}, options.clear)
        {
            parent.ui.status == "open" && parent.ui.messageBoxClear();
            return
        }
        me.messageStack("pushing?", {
            msgCode: msgCode,
            options: options
        }) || parent.ui.show("message", function()
        {
            if (parent.ui.htmlOfMessage(doHtml(msgCode, options)), parent.ui.showItem("_message_box"), options.back2bduChooser && parent.ui.back2bduChooser("show"), options.headerText && parent.ui.headerText(options.headerText), options.spinner)
            {
                parent.ui.showItem("_waitMsg");
                return
            }
            options.fromStack == !0 || me.messageStack("push", {
                msgCode: msgCode,
                options: options
            })
        })
    },
    me.messageStack = function(mode, msgObj)
    {
        var returnVal = !1,
            options;
        switch (mode)
        {
            case"pushing?":
                _messageStack.length > 0 && (msgObj.options && msgObj.options.fromStack == !0 || (_messageStack.push(msgObj), returnVal = !0));
                break;
            case"push":
                _messageStack.push(msgObj),
                returnVal = !0;
                break;
            case"pull":
                _messageStack.shift(),
                _messageStack.length > 0 && (msgObj = _messageStack[0], options = $.extend(msgObj.options, {fromStack: !0}), me.show(msgObj.msgCode, options), returnVal = !0)
        }
        return log("messageStack(" + mode + ", " + (msgObj && msgObj.msgCode ? msgObj.msgCode : "") + ") = " + returnVal + "  stack.len=" + _messageStack.length), returnVal
    }
}(axisAuthApi);
/*! screenDoor.ui  13.7.17 */
(function(parent)
{
    var me = {},
        log,
        _cookieName;
    me.ver = "13.7.17",
    me.name = "screenDoor",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    _cookieName = "screenDoorBduId",
    me.open = function()
    {
        if (parent.vhBrand.screenDoorDisable)
        {
            parent.events.triggerEvent("on_screendoor_complete", !0, {screenDoorDisable: !0}),
            log("screenDoor disabled for destinationCode=" + parent.vhBrand.destinationCode, "i");
            return
        }
        if (parent.isAuthenticated("screendoor") === !0)
        {
            parent.events.triggerEvent("on_screendoor_complete", !0),
            log("open() - user is authN, do not open screen door.");
            return
        }
        var hasCookie = parent.lib.cookie(_cookieName);
        if (hasCookie)
        {
            log("open() - ScreenDoor cokie found " + _cookieName + "=" + hasCookie + " do not open screen door ."),
            me.close({doNotPost: !0});
            return
        }
        log("open() - ScreenDoor shown"),
        parent.selectedBdu = null,
        parent.bduChooser.open(undefined, "screendoor")
    },
    me.close = function(options)
    {
        var hasCookie = parent.lib.cookie(_cookieName);
        if (hasCookie = hasCookie ? !0 : !1, (typeof parent.selectedBdu == "undefined" || parent.selectedBdu == null) && (parent.selectedBdu = {Id: -1}), !options || options.doNotPost != !0)
            try
            {
                parent.selectedBdu && typeof parent.selectedBdu.Id !== undefined ? $.post(parent.cfg.surveyApiUrl + "AddEntry?bduId=" + parent.selectedBdu.Id) : log(".close() - selectedBdu.Id=undefined")
            }
            catch(ex)
            {
                log(".close() - " + ex.message, "E")
            }
        parent.tracking.crossCookies && parent.tracking.crossCookies("sb=" + parent.selectedBdu.Id),
        parent.events.triggerEvent("on_screendoor_complete", hasCookie)
    },
    me.bdu = function(encBduData, bduData)
    {
        encBduData && (bduData = JSON.parse(decodeURIComponent(encBduData))),
        parent.selectedBdu = bduData,
        parent.events.triggerEvent("on_bdu_selection", parent.selectedBdu),
        typeof bduData.Order != "undefined" && bduData.Order > 0 || parent.messaging.show("CFM-03", {
            txtVarName: "BDUName",
            txtVarValue: parent.selectedBdu.DisplayName,
            txtVarClass: "bduSelected",
            back2bduChooser: !0,
            headerText: {
                en: "Thank You",
                fr: "Merci"
            }
        }),
        parent.lib.cookie(_cookieName, parent.selectedBdu.Id, {
            path: "/",
            expires: parent.cfg.screenDoor.cookieExpiresDays
        }),
        log("bdu() ScreenDoor cokie planted: " + _cookieName + "=" + parent.selectedBdu.Id + " expires=" + parent.cfg.screenDoor.cookieExpiresDays)
    },
    me.clearCookie = function()
    {
        parent.lib.cookie(_cookieName, "")
    },
    me.readCookie = function()
    {
        var c = {};
        return c[_cookieName] = parent.lib.cookie(_cookieName), c
    }
})(axisAuthApi),
function(parent)
{
    var me = {},
        log;
    me.ver = "13.11.28",
    me.name = "forms",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.open = function(formName, data)
    {
        switch (formName)
        {
            case"email":
                var url = me.makeUrl_email(data);
                if (typeof url == "boolean" && url == !1)
                    return !1;
                me.show(url)
        }
    },
    me.show = function(url)
    {
        parent.ui.showItem("_form_box"),
        $("#ifrAxisAuthApiFr").attr("src", url),
        log("show(" + url + ") loaded Form.")
    },
    me.msgCallback = function(messageData)
    {
        messageData && messageData.messageSender != "alfaForm" || parent.ui.close()
    },
    me.makeUrl_email = function(data)
    {
        var silverpopId,
            urlArgs;
        try
        {
            silverpopId = parent.cfg.forms.email.silverpopId
        }
        catch(e)
        {
            return log("open() - bad sillverpopId in axis config", "E"), !1
        }
        return typeof data.attributes.email == "undefined" ? !1 : (urlArgs = "bdu=" + encodeURIComponent(data.attributes.DisplayName) + "&e=" + encodeURIComponent(data.attributes.email) + "&i=" + silverpopId + "&brand=" + encodeURIComponent(parent.vhBrand.displayName) + "&lang=" + parent.ui.currentLanguage, parent.cfg.baseApiUrl + "forms/email.html?" + urlArgs)
    }
}(axisAuthApi),
function(parent)
{
    function listManupulation(list, action)
    {
        if (list)
        {
            var arr = list.split("+");
            if (arr.length == 0)
                return null;
            if (action == "first")
                return arr[0];
            if (action == "last")
                return arr[arr.length - 1];
            if (action == "prev")
                return arr.length == 1 ? arr[0] : arr[arr.length - 2]
        }
        return null
    }
    function checkCallerID(methodName, caller)
    {
        var txt,
            isOK = !0;
        return typeof caller != "string" && (txt = 'missing argument: "caller"', isOK = !1), parent.lib.isAlphaNumeric(caller) || (txt = ' "caller" argumant is not alphanumeric.', isOK = !1), txt && (caller = typeof caller == "undefined" ? "*undefined*" : caller, log(methodName + "(" + caller + ") " + txt, "E")), isOK
    }
    var me = {},
        log,
        _crossCookiesReady,
        _documentReady;
    me.ver = "13.7.17",
    me.name = "tracking",
    parent[me.name] = me,
    log = new parent.consoleLog(parent.name + "." + me.name),
    me.cookie = {},
    me.wasAuthenticatedOnOtherSite = function()
    {
        var bdu = me.getLastAuthenticatedBdu(),
            arr,
            found,
            i;
        if (bdu == null)
            return !1;
        for (arr = me.cookie.ab.split("+"), found = !1, i = 0; i < arr.length; i++)
            arr[i] != bdu && (found = !0);
        return found
    },
    me.showCookie = function(pass)
    {
        var LF,
            txt,
            propertyName;
        LF = pass == "alert" ? "\n" : "<br/>",
        txt = "Tracking Cookie" + LF + LF;
        for (propertyName in me.cookie)
            txt = txt + propertyName + " : " + me.cookie[propertyName] + LF;
        pass == "alert" && alert(txt)
    },
    me.getFirstVisitedSite = function()
    {
        return _crossCookiesReady == !1 ? (log("getFirstVisitedSite() called before tracking.crossCookiesReady() ", "E"), null) : listManupulation(me.cookie.ch, "first")
    },
    me.getAllVisitedSites = function()
    {
        return _crossCookiesReady == !1 ? (log("getAllVisitedSites() called before tracking.crossCookiesReady() ", "E"), null) : me.cookie.ch
    },
    me.getLastAuthenticatedBdu = function()
    {
        return _crossCookiesReady == !1 ? (log("getLastAuthenticatedBdu() called before tracking.crossCookiesReady() ", "E"), null) : (log("getLastAuthenticatedBdu()= " + listManupulation(me.cookie.ab, "last")), listManupulation(me.cookie.ab, "last"))
    },
    me.getPrevAuthenticatedBdu = function()
    {
        return _crossCookiesReady == !1 ? (log("getPrevAuthenticatedBdu() called before tracking.crossCookiesReady() ", "E"), null) : listManupulation(me.cookie.ab, "prev")
    },
    me.getFirstAuthenticatedBdu = function()
    {
        return _crossCookiesReady == !1 ? (log("getFirstAuthenticatedBdu() called before tracking.crossCookiesReady() ", "E"), null) : listManupulation(me.cookie.ab, "first")
    },
    me.getLastScreenDoorBdu = function()
    {
        return _crossCookiesReady == !1 ? (log("getLastScreenDoorBdu() called before tracking.crossCookiesReady() ", "E"), null) : listManupulation(me.cookie.sb, "last")
    },
    me.getLastScreenDoorBdu_local = function()
    {
        return _documentReady == !1 ? (log("getLastScreenDoorBdu_local() - called before $(document).ready()", "E"), null) : (log("getLastScreenDoorBdu_local()= " + parent.lib.cookie("screenDoorBduId")), parent.lib.cookie("screenDoorBduId"))
    },
    me.clearCookie = function()
    {
        parent.alfaCrossCookie.clear()
    },
    me.storeAuthentication = function(bduID)
    {
        var id = parent.vhBrand.id ? parent.vhBrand.id : "null";
        me.crossCookies("ab=" + bduID + "-" + parent.vhBrand.id + "&ciasteczka_au=ab")
    },
    me.timeCrossCookie = +new Date,
    _crossCookiesReady = !1,
    me.crossCookies = function(urlArg)
    {
        parent.alfaCrossCookie.update(urlArg, function(cookieData, errMsg)
        {
            me.cookie = cookieData,
            _crossCookiesReady = !0,
            parent.events.triggerEvent("cross_cookie_ready", cookieData, {error: errMsg}),
            errMsg && log("[alfacdc] - " + errMsg),
            me.timeCrossCookie = +new Date - me.timeCrossCookie,
            log("CrossCookie ready in " + me.timeCrossCookie + "ms", "i")
        }, parent.cfg.baseApiUrl)
    },
    me.isCrossCookiesReady = function(option)
    {
        return option = option ? option : {}, typeof option.forceValue == "boolean" && (_crossCookiesReady = option.forceValue), option.methodName && _crossCookiesReady == !1 && log(option.methodName + "(" + option.caller + " )  _crossCookiesReady not ready.", "E"), _crossCookiesReady
    },
    me.crossCookiesReady = function(caller, onSuccess)
    {
        function fnLoop()
        {
            if (_crossCookiesReady)
                tryCount = 0,
                onSuccess();
            else if (tryCount++, tryCount > 50)
            {
                var e = {errorThrown: "crossCookiesReady() failed after " + (tryCount - 1) + " tries"};
                tryCount = 0,
                log(e.errorThrown, "E")
            }
            else
                log("crossCookiesReady-fnLoop(" + caller + ", " + tryCount + ")"),
                setTimeout(fnLoop, 500)
        }
        if (checkCallerID("isAuthorizedForResource", caller))
        {
            var tryCount = 0;
            _crossCookiesReady ? onSuccess() : fnLoop()
        }
    },
    _documentReady = !1,
    $(document).ready(function()
    {
        _documentReady = !0,
        parent.ready("axisAuthApi.tracking", {onSuccess: function()
            {
                parent.vhBrand.disabled || typeof parent.vhBrand.id == "undefined" && log("<id> not set in Axis for :" + vhBrand.destinationCode, "w", {force: !0}),
                me.crossCookies("ch=" + parent.vhBrand.id + "&ciasteczka_au=ch")
            }})
    })
}(axisAuthApi);