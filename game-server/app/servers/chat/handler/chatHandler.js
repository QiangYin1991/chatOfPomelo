const chatRemote = require('../remote/chatRemote');

module.exports = function (app) {
  return new Handler(app);
};

const Handler = function (app) {
  this.app = app;
};

const handler = Handler.prototype;

handler.send = function (msg, session, next) {
  const rid = session.get('rid');
  const username = session.uid.split('*')[0];
  const channelService = this.app.get('channelService');
  const param = {
    msg    : msg.content,
    from   : username,
    target : msg.target
  };
  channel = channelService.getChannel(rid, false);

  // all users
  if (msg.target === '*') {
    channel.pushMessage('onChat', param);
  } else {
    const tuid = msg.target + '*' + rid;
    const tsid = channel.getMember(tuid)['sid'];
    channelService.pushMessageByUids('onChat', param, [{
      uid : tuid,
      sid : tsid
    }]);
  }
  next(null, {route : msg.route});
};