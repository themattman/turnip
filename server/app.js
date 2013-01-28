
var express     = require('express')
  , app         = express()
  , colors      = require('colors')
  , router      = require('./router.js')
  , config      = require('./config.js')
  , http        = require('http')
  , process     = require('./process.js')
  , fs          = require('fs')
  , __timeDelta = require('./secret.js').constants.timeDelta;

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


// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port:".blue, app.get('port'));
});

// ---------------------------------------------------------- //
// Socket.io
// ---------------------------------------------------------- //
// start socket.io after the server
var io = require('socket.io').listen(httpApp).set('log level', 1);

io.sockets.on('connection', function(socket){
  console.log('SOCKET CONNECTED'.green);
  var currentTime = new Date().getTime();
  // Change this to get all data
  process.getData(currentTime, function(graph_info){
    console.log('emitting all_ur_datas');
    socket.emit('gimme_all_ur_datas', graph_info);
  });

  setInterval(function(){
    var curTime = new Date().getTime();
    process.getLatestDelta(curTime, function(latestDelta){
      socket.broadcast.emit('update', latestDelta);
    });
    fs.readFile('./server/github.json', 'utf-8', function(err, file){
      file = JSON.parse(file);
      console.log('file'.cyan, file.latest_timestamp);
      file.latest_timestamp += __timeDelta;
      fs.writeFile('./server/github.json', JSON.stringify(file), function(error){
        if(error) throw error;
        console.log('done writing timestamp to github.json');
      });
    });
    console.log('intervalling', new Date().getTime());
  }, 10000);
});