module.exports = function (app) {
  return new ChatRemote(app);
};

const ChatRemote = function (app) {
  this.app = app;
  this.channelService = app.get('channelService');
};

const chatRemote = ChatRemote.prototype;

/**
 * Add user into chat channel.
 * 
 * @param {String} uid    unique id for user
 * @param {String} sid    server id
 * @param {String} name   channel name
 * @param {Boolean} flag  channel parameter
 * @param {Function} cb 
 */
chatRemote.add = function (uid, sid, name, flag, cb) {
  const channel = this.channelService.getChannel(name, flag);
  const username = uid.split('*')[0];
  const param = {
    route : 'onAdd',
    user  : username
  };
  channel.pushMessage(param);
  if (!!channel) {
    channel.add(uid, sid);
  }
  cb(this.get(name, flag));
};

/**
 * Get user from chat channel
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 */
chatRemote.get = function (name, flag) {
  let users = [];
  const channel = this.channelService.getChannel(name, flag);
  if (!! channel) {
    users = channel.getMembers();
  }
  for (let i = 0; i < users.length; i++) {
    users[i] = users[i].split('*')[0];
  }
  return users;
};


/**
 * Kick user out chat channel.
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 */
chatRemote.kick = function (uid, sid, name, cb) {
  const channel = this.channelService.getChannel(name ,false);
  if (!!channel) {
    channel.leave(uid, sid);
  }
  const username = uid.split('*')[0];
  const params = {
    route : 'onLeave',
    user  : username
  };
  channel.pushMessage(params);
  cb();
};