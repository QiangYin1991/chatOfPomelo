const pomelo = require('pomelo');
const dispatcher = require('./app/util/dispatcher');
const abuseFilter = require('./app/servers/chat/filter/abuseFilter');

const chatRoute = function (session, msg, app, cb) {
  const chatServers = app.getServersByType('chat');

  if (!chatServers || chatServers.length === 0) {
    cb(new Error('can not find chat servers.'));
    return;
  }

  const res = dispatcher.dispatch(session.get('rid'), chatServers);
  cb(null, res.id);
};

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatPomeloOfMyself');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});

app.configure('production|development', 'gate', function () {
  app.set('connectorConfig', 
  {
    connector   : pomelo.connectors.hybridconnector,
    useDict     : true,
    useProtobuf : true
  });
});

app.configure('production|development', function () {
  app.route('chat', chatRoute);
  //app.filter(pomelo.timeout());
});

app.configure('production|development', 'chat', function () {
  app.filter(abuseFilter());
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
