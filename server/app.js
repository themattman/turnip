
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  , process   = require('./process.js');

// setup here
config(app);


// ---------------------------------------------------------- //
// define API routes here
// ---------------------------------------------------------- //
// GET
app.get('/',                router.index     );
app.get('/rickshaw',        router.rickshaw  );
app.get('/db',              router.db        );
app.get('/admin',           router.admin     );
app.get('/admin/accounts',  router.accounts  );
app.get('/github/accounts', router.githubjson);

// POST
app.post('/hook', router.hook);
// ---------------------------------------------------------- //
// ---------------------------------------------------------- //


// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port:".blue, app.get('port'));
});

// start socket.io after the server
var io = require('socket.io').listen(httpApp);

io.sockets.on('connection', function(socket){
  console.log('SOCKET CONNECTED'.green);
  var currentTime = new Date().getTime();
  process.getLatestDelta(currentTime, function(latestDelta){
    console.log('emitting datas');
    socket.emit('gimme_all_ur_datas', latestDelta);
  });
});

setInterval(function(){
  var curTime = new Date().getTime();
  process.getLatestDelta(curTime, function(latestDelta){
    //socket.broadcast.emit
  });
  onsole.log('intervalling', new Date().getTime());
}, 10000);