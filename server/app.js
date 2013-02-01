var express     = require('express')
  , app         = express()
  , colors      = require('colors')
  , router      = require('./router.js')
  , config      = require('./config.js')
  , http        = require('http')
  , process     = require('./process.js')
  , fs          = require('fs')
  , mongo       = require('./database.js')
  , __timeDelta = require('./secret.js').constants.timeDelta
  , events      = require('events');

// Synchro here
var graphUpdateSignal = function(){};
graphUpdateSignal.prototype = new events.EventEmitter;
graphUpdateSignal.prototype.updateAll = function() {
  console.log('update_graph.emit'.red);
  this.emit('update_graph');
};
var graphUpdater = new graphUpdateSignal();


// setup here
config(app);


// ---------------------------------------------------------- //
// define API routes here
// ---------------------------------------------------------- //
// GET
app.get('/',                router.index     );
app.get('/access',          router.access    );
app.get('/admin/accounts',  router.accounts  );
app.get('/db',              router.db        );
app.get('/github/accounts', router.githubjson);
app.get('/help',            router.help      );
app.get('/messages',        router.messages  );
app.get('/test',            router.test      );

// POST
app.post('/hook',  router.hook );
app.post('/start', router.start);
app.post('/stop',  router.stop );


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
  socket.join('graph');

  var currentTime = new Date().getTime();

  // Change this to get all data
  process.getData(currentTime, function(graph_info){
    console.log('emit_graph_load'.zebra);
    socket.emit('graph_load', graph_info);
  });

  process.getFeed(currentTime, function(commitFeed){
    console.log('emit_feed_load'.zebra);
    socket.emit('feed_load', commitFeed);
  });
});

graphUpdater.on('update_graph', function(){
  var curTime = new Date().getTime();
  process.getLatestDelta(curTime, function(latestDelta){
    console.log('emit_graph_update'.zebra);
    io.sockets.in('graph').emit('graph_update', latestDelta);
  });
});

process.commitFeed.on('update_commits', function(new_commit){
  console.log('emit_feed_update'.zebra);
  io.sockets.in('graph').emit('feed_update', new_commit);
});

exports.daemon = function(){
  // ---------------------------------------------------------- //
  // Increment the timestamp in github.json and the database
  // ---------------------------------------------------------- //
  fs.readFile('./server/github.json', 'utf-8', function(err, file){
    file = JSON.parse(file);
    console.log('file'.cyan, file.latest_timestamp);
    file.latest_timestamp += __timeDelta;
    fs.writeFile('./server/github.json', JSON.stringify(file), function(error){
      if(error){throw error;}
      console.log('done writing timestamp to github.json');
      mongo.db.collection('graph_data', function(err, col){
        if(err){throw err;}
        col.find().toArray(function(err, collection){
          if(err){throw err;}
          for(var row in collection){
            var data_point = {};
            data_point.x = file.latest_timestamp;
            data_point.y = collection[row].numCommits;
            col.update( {'repoName': collection[row].repoName}, { $push: { 'data': data_point } }, function(err, docs){
              if(err){throw err;}
            });
          }
          graphUpdater.updateAll();
        });
      });
    });
  });
  console.log('intervalling', Math.round(new Date().getTime()/1000));
};
