// Config
var config = {
  // What to do when an exit is predicted
  onExit: function() {}

  // Delay after mouse has left browser pane
  // delayExit: 200,

  // No exit is triggered if y value is above this
  // yMax: 100,

  // Cookie
  // useCookie: true, // no cookie set if false - all other cookie options ignored
  // cookieLifetime: 1e3 * 60 * 60 * 24 * 30, // in ms
  // cookieName: "__intervene" // only set if exit was triggered
};

Intervene.init(config);