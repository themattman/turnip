var mongo     = require("./database.js")
	, email     = require("./email.js")
	, colors    = require('colors')
	, collection
	, fs        = require('fs')
	, process   = require('./process.js');

mongo.connect(function(msg, coltn) {
	if(msg == null) {
		console.log("Mongo Connected!".yellow);
		collection = coltn;
	} else 
		console.log(msg);
});

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
	console.log(req);
	console.log(req.body);
	console.log('INSERT');
	console.log(req.body.payload);
	var data = JSON.parse(req.body.payload);
	process.pushIntoDatabase(data, function(record){
		collection.insert(record, function(err, docs){
			if(err) throw err
			res.send(docs);
		});
	});
};

// main page
exports.index = function(req, res){
	res.render('index', { title: 'Turnip' });
};

// graph page
exports.rickshaw = function(req, res){
  res.render('rickshaw', { title: "Rickshaw" });
};