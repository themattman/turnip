var mongo     = require("./database.js")
	, colors    = require('colors')
	, collection
	, fs        = require('fs')
	, process   = require('./process.js')
	, loop      = require('./app.js')
	, interval
	, secret    = require('./secret.js').admin;

mongo.connect(function(msg, coltn) {
	if(msg == null) {
		console.log("Mongo Connected!".yellow);
		collection = coltn;
	} else 
		console.log(msg);
});

exports.access = function(req, res){
	res.render('access', { title: "Access" });
};

// Configure data streams from github
exports.accounts = function(req, res){
  res.render('accounts', { title: "Github Accounts" });
};

// db test
exports.db = function(req, res){
	collection.insert({ msg: "hello world" }, function(err, docs){
		if(err) throw err
		res.send(docs);
	});
};

// Expose accounts
exports.githubjson  = function(req, res) {
	fs.readFile('./server/github.json', 'utf-8', function(err, accounts){
		res.json(JSON.parse(accounts));
	})
};

exports.hook = function(req, res) {
	console.log('GOT A HOOK'.cyan);
	var hook_data = JSON.parse(req.body.payload);
	process.pushIntoDatabase(hook_data);
};

// graph page
exports.index = function(req, res){
	res.render('rickshaw', { title: 'Turnip' });
};

exports.messages = function(req, res){
	res.render('messages', { title: 'Turnip' });
};

exports.start = function(req, res){
	console.log(req.body, secret.pass);
	if(req.body.password == secret.pass){
		console.log('start');
		interval = setInterval(loop.daemon, 30000);
	}
};

exports.stop = function(req, res){
	console.log(req.body, secret.pass);
	if(req.body.password == secret.pass){
		console.log('stop');
		clearInterval(interval);
	}
};