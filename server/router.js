var mongo     = require("./database.js")
	, email     = require("./email.js")
	, colors    = require('colors')
	, collection
	, fs        = require('fs')
	, process   = require('./process.js')
	, loop      = require('./app.js')
	, interval
	, events    = require('events')
	, secret    = require('./secret.js').admin;

mongo.connect(function(msg, coltn) {
	if(msg == null) {
		console.log("Mongo Connected!".yellow);
		collection = coltn;
	} else 
		console.log(msg);
});

var commitFeed = function(){};
commitFeed.prototype = new events.EventEmitter;
commitFeed.prototype.updateAll = function(commit) {
	this.emit('update_commits', commit);
};

var Updater = new commitFeed();
exports.commitFeed = Updater;

exports.access = function(req, res){
	res.render('access', { title: "Access" });
};

// Configure data streams from github
exports.accounts = function(req, res){
  res.render('accounts', { title: "Github Accounts" });
};

// admin page
exports.admin = function(req, res){
	res.send("<h3> You must be and admin! </h3>");
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
	console.log(hook_data);
	process.pushIntoDatabase(hook_data);
};

// main page
exports.index = function(req, res){
	//console.log(loop.events);
	mongo.db.collection('commits', function(err, col){
		col.find().limit(1).toArray(function(err, r){
			//console.log(r);
			console.log(r[0]);
			//process.pushIntoDatabase(r[0]);
			Updater.updateAll(r[0]);
			res.render('index', { title: 'Turnip' });
		});
	});
	//res.render('index', { title: 'Turnip' });
};

// graph page
exports.rickshaw = function(req, res){
  res.render('rickshaw', { title: 'Turnip' });
};

exports.start = function(req, res){
	console.log(req.body, secret.pass);
	if(req.body.password == secret.pass){
		console.log('start');
		interval = setInterval(loop.daemon, 10000);
	}
};

exports.stop = function(req, res){
	console.log(req.body, secret.pass);
	if(req.body.password == secret.pass){
		console.log('stop');
		clearInterval(interval);
	}
};