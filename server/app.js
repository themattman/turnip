
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http');

// setup here
config(app);


// define API routes here
app.get('/', router.index);
app.post('/hook', router.hook);
app.get('/hook', router.hook); // for testing
app.get('/rickshaw', router.rickshaw);



app.get('/db', router.db);
app.get('/admin', router.admin);


// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port:".blue, app.get('port'));
});

