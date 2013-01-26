
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http');

// setup here
config(app);


// ---------------------------------------------------------- //
// define API routes here
// ---------------------------------------------------------- //
// GET
app.get('/',               router.index   );
app.get('/rickshaw',       router.rickshaw);
app.get('/db',             router.db      );
app.get('/admin',          router.admin   );
app.get('/admin/accounts', router.accounts);

// POST
app.post('/hook', router.hook);
// ---------------------------------------------------------- //
// ---------------------------------------------------------- //


// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port:".blue, app.get('port'));
});

