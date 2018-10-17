module.exports = function (app) {
  return new Handler(app);
};

const Handler = function (app) {
  this.app = app;
};

const handler = Handler.prototype;

/**
 * Gate Handler that dispatch user to connectors.
 * 
 * @param {Object} msg message from client
 * @param {Object} session 
 * @param {Function} next next stemp callback
 */
handler.queryEntry = function (msg, session, next) {
  const uid = msg.uid;
  if (!uid) {
    next(null, {code : 500});
    return;
  }
  // get all connectors
  let connectors = this.app.getServersByType('connector');
  if (!connectors || connectors.length === 0) {
    next(null, {code : 500});
    return;
  }

  let res = connectors[0];
  next(null, {code : 200, host : res.host, port : res.clientPort});
};