Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[ k ]) : (("00" + o[ k ]).substr(("" + o[ k ]).length)));
  return fmt;
};
+function () {
  "use strict";
  var e = /\[([^\[]*)\]$/, n = /^(?:([a-z]*):)?(?:\/\/)?(?:([^:@]*)(?::([^@]*))?@)?([0-9a-z-._]+)?(?::([0-9]*))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i, t = [ "mailto", "bitcoin" ], o = {
    get: function (n, t) {
      n = n || "", "undefined" == typeof t && (t = {}), "undefined" == typeof t.full && (t.full = !1), "undefined" == typeof t.array && (t.array = !1), t.full === !0 && (n = o.parse(n, { get: !1 }).query || "");
      for (var u = {}, d = n.split("&"), r = 0; r < d.length; r++)if (d[ r ].length) {
        var f = d[ r ].indexOf("="), i = d[ r ], s = !0;
        if (f >= 0 && (i = d[ r ].substr(0, f), s = d[ r ].substr(f + 1), s = decodeURIComponent(s)), t.array) {
          for (var a, p = [], y = u, c = i; a = c.match(e);)c = c.substr(0, a.index), p.unshift(decodeURIComponent(a[ 1 ]));
          if (c = decodeURIComponent(c), p.some(function (e) {return "undefined" == typeof y[ c ] && (y[ c ] = []), Array.isArray(y[ c ]) ? (y = y[ c ], "" === e && (e = y.length), void(c = e)) : !0}))continue;
          y[ c ] = s
        } else i = decodeURIComponent(i), u[ i ] = s
      }
      return u
    }, buildget: function (e, n) {
      var t = [];
      for (var u in e) {
        var d = encodeURIComponent(u);
        "undefined" != typeof n && (d = n + "[" + d + "]");
        var r = e[ u ];
        switch (typeof r) {
          case"boolean":
            r && t.push(d);
            break;
          case"number":
            r = r.toString();
          case"string":
            t.push(d + "=" + encodeURIComponent(r));
            break;
          case"object":
            t.push(o.buildget(r, d))
        }
      }
      return t.join("&")
    }, parse: function (e, t) {
      "undefined" == typeof t && (t = {});
      var u = e.match(n) || [], d = {
        url: e,
        scheme: u[ 1 ],
        user: u[ 2 ],
        pass: u[ 3 ],
        host: u[ 4 ],
        port: u[ 5 ] && +u[ 5 ],
        path: u[ 6 ],
        query: u[ 7 ],
        hash: u[ 8 ]
      };
      return t.get !== !1 && (d.get = d.query && o.get(d.query, t.get)), d
    }, build: function (e, n) {
      n = n || {};
      var u = "";
      if ("undefined" != typeof e.scheme && (u += e.scheme, u += t.indexOf(e.scheme) >= 0 ? ":" : "://"), "undefined" != typeof e.user && (u += e.user, "undefined" == typeof e.pass && (u += "@")), "undefined" != typeof e.pass && (u += ":" + e.pass + "@"), "undefined" != typeof e.host && (u += e.host), "undefined" != typeof e.port && (u += ":" + e.port), "undefined" != typeof e.path && (u += e.path), n.useemptyget) "undefined" != typeof e.get ? u += "?" + o.buildget(e.get) : "undefined" != typeof e.query && (u += "?" + e.query); else {
        var d = e.get && o.buildget(e.get) || e.query;
        d && (u += "?" + d)
      }
      return "undefined" != typeof e.hash && (u += "#" + e.hash), u || e.url || ""
    }
  };
  window.url = o
}();
