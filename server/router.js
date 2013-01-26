var mongo = require("./database.js"),
	email = require("./email.js"),
	colors = require('colors'),
	collection;

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

exports.hook = function(req, res) {
	var data = JSON.parse(req.params.payload);
	collection.insert(data, function(err, docs){
		if(err) throw err
		res.send(docs);
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