(function() {

// Make sure jQuery has been loaded!
var jq = jQuery;

// Cookies
var cookies = {
  getItem: function (sKey) {
    return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*)|.*"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd) {
    var sExpires = "",
      date;
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    if (vEnd) {
      date = new Date();
      date.setTime(date.getTime() + vEnd);
      sExpires = "; expires=" + date.toGMTString();
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + "; path=/";
    return true;
  }
};

// Main
(function($) {

  // Default config
  var config = {
    // What to do when an exit is predicted
    onExit: function() {},

    // Delay after mouse has left browser pane
    delayExit: 200,

    // No exit is triggered if y value is above this
    yMax: 100,

    // Cookie
    useCookie: true, // no cookie set if false - all other cookie options ignored
    cookieLifetime: 1e3 * 60 * 60 * 24 * 30, // in ms
    cookieName: "__intervene" // only set if exit was triggered
  };

  var d,
    w,
    timeout,
    pos;

  // Capture mouseposition
  var onMouseMove = function(event) {
    pos = {
      x: event.pageX,
      y: event.pageY
    };
  };

  // When mouse leaves browser pane
  var onMouseLeave = function(event) {
    if (pos.y > config.yMax) {
      return
    }
    timeout = setTimeout(onTrigger, config.delayExit);
    d.one("mouseenter.intervene", onMouseEnter);
  };

  // When mouse comes back into browser pane before exit is assumed
  var onMouseEnter = function(event) {
    clearTimeout(timeout);
  };

  // When triggered
  var onTrigger = function() {
    // Clean up
    w.off("mousemove.intervene");
    d.off("mouseleave.intervene");
    d.off("mouseenter.intervene");

    // Cookie
    if (config.useCookie) {
      cookies.setItem(config.cookieName, "x", config.cookieLifetime);
    }

    // Run configured action
    config.onExit();
  };

  // Public
  window.Intervene = {
    init: function(customConfig) {
      $(function() {
        config = $.extend(config, customConfig);

        // Do not run if cookie exists
        if (config.useCookie) {
          if (cookies.getItem(config.cookieName)) {
            return
          }
        }

        d = $(document);
        w = $(window);
        w.on("mousemove.intervene", onMouseMove);
        d.on("mouseleave.intervene", onMouseLeave);
      })
    }
  };
})(jq);

})();