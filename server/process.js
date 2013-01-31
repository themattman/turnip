var mongo       = require('./database.js')
  , fs          = require('fs')
  , events      = require('events')
  , __startTime = require('./secret.js').constants.startTime
  , __timeDelta = require('./secret.js').constants.timeDelta;

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
var commitFeed = function(){};
commitFeed.prototype = new events.EventEmitter;
commitFeed.prototype.updateAll = function(commit) {
  console.log('update_commits.emit'.red);
  this.emit('update_commits', commit);
};

var Updater = new commitFeed();
exports.commitFeed = Updater;

function zeroOutUnusedDataPoints(latest_timestamp, cb) {
  var numPointsToFill = ((latest_timestamp - __startTime) / __timeDelta);
  var commits = [];
  for(var i = 0; i < numPointsToFill; ++i) {
    var ith_commit = {};
    ith_commit.x = (__startTime + i*__timeDelta);
    ith_commit.y = 0;//Math.round(40*Math.random());
    commits.push(ith_commit);
  }
  console.log('commits Zerod'.yellow, i);
  cb(commits);
}

function updateCommitsFeed(){
  mongo.db.collection('commits', function(err, col){
    if(err){throw err;}
    col.find().sort({_id:1}).limit(1).toArray(function(err, results){
      if(err){throw err;}
      console.log(results);
    });
  });
}

var saveCommitToDatabase = function (commit_data){
  console.log('saveCommitToDatabase()'.zebra);
  if(!commit_data){return;}
  var sanitized_commit        = {};
  sanitized_commit.pusher     = {};
  sanitized_commit.repository = {};
  sanitized_commit.commits    = [];

  mongo.db.collection('commits', function(err, col){
    if(err){throw err;}
    sanitized_commit.pusher.name            = commit_data.pusher.name;
    sanitized_commit.pusher.email           = commit_data.pusher.email;
    sanitized_commit.repository.name        = commit_data.repository.name;
    sanitized_commit.repository.description = commit_data.repository.description;
    sanitized_commit.repository.created_at  = commit_data.repository.created_at;
    sanitized_commit.repository.private     = commit_data.repository.private;
    for(var i in commit_data.commits){
      var this_commit       = {};
      this_commit.committer = {};
      this_commit.timestamp      = commit_data.commits[i].timestamp;
      this_commit.message        = commit_data.commits[i].message;
      this_commit.committer.name = commit_data.commits[i].committer.name;
      sanitized_commit.commits.push(this_commit);
    }
    col.insert(sanitized_commit);

    Updater.updateAll(sanitized_commit);
  });
}

exports.saveCommitToDatabase = saveCommitToDatabase;

exports.pushIntoDatabase = function(d, cb){
  console.log('pushIntoDatabase()'.zebra);
  var file     = JSON.parse(fs.readFileSync('./server/github.json', 'utf-8'));
  var repoName = d.repository.name;
  var record   = {};

  // ---------------------------------------------------------- //
  // Write the commit to Mongo
  // ---------------------------------------------------------- //
  saveCommitToDatabase(d);

  mongo.db.collection('graph_data', function(err, col){
    if(err){throw err;}
    col.find({'repoName': repoName}).limit(1).toArray(function(err, results){
      if(err){throw err;}
      console.log('A RESULT'.green);
      if(!results || results.length < 1) {

        // ---------------------------------------------------------- //
        // Create a new record for this repo
        // ---------------------------------------------------------- //
        zeroOutUnusedDataPoints(file.latest_timestamp, function(c){
          record.repoName = repoName;
          record.userName = d.repository.owner.name;
          record.numCommits = d.commits.length;
          record.data = c;
          record.data.push({'x': file.latest_timestamp, 'y': d.commits.length});
          col.insert(record, function(err, docs){
            if(err){throw err;}
            console.log('created a new repo record'.magenta);
          });
        });
      } else {
        // ---------------------------------------------------------- //
        // Append new data point to existing repo
        // ---------------------------------------------------------- //
        record = results[0];
        var data_point = {};
        data_point.x = file.latest_timestamp;
        data_point.y = record.numCommits + d.commits.length;

        col.update({'repoName': record.repoName}, { $inc: { 'numCommits': d.commits.length } }, function(err, docs){
          if(err){throw err;}
          console.log('updated a graph_data record, numCommits'.magenta);

          // Remove the last data point
          col.update({'repoName': record.repoName}, { $pop: { data: 1 } }, function(err, docs){
            if(err){throw err;}
            // Push the last data point back on with an updated y value
            col.update({'repoName': record.repoName}, { $push: { data: data_point } }, function(err, docs){
              if(err){throw err;}
              console.log('updated a graph_data record, last x val'.blue);
            });
          });

        });

      }
    });
  });
};

// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
exports.getData = function(curTime, cb) {
  mongo.db.collection('graph_data', function(err, collection) {
    if(err){throw err;}
    // Sort the results and take the top 10 teams
    collection.find().sort({ 'numCommits': -1 }).limit(10).toArray(function(err, results) {
      if(err){throw err;}
      cb(results);
    });
  });
};

exports.getFeed = function(curTime, cb){
  mongo.db.collection('commits', function(err, collection) {
    if(err){throw err;}
    // Sort the results and take the top 10 teams
    collection.find().sort({ '_id': 1 }).limit(10).toArray(function(err, results) {
      if(err){throw err;}
      var to_push = [];
      if(results){
        for(var i in results){
          for(var j in results[i].commits){
            var msg = {};
            msg.repoName = results[i].repository.name;
            msg.userName = results[i].pusher.name;
            msg.message  = results[i].commits[j].message;
            to_push.push(msg);
          }
        }
      }
      cb(to_push);
    });
  });
};

exports.getLatestDelta = function(curTime, cb) {
  mongo.db.collection('graph_data', function(err, collection) {
    if(err){throw err;}
    // Sort the results and take the top 10 teams
    collection.find().sort({ 'numCommits': -1 }).limit(10).toArray(function(err, results) {
      if(err){throw err;}
      console.log('getLatestDelta'.red, results.length);

      // Only send the most recent 10 items
      for(var i in results){
        if(results[i].data.length > 10){
          results[i].data = results[i].data.slice(results[i].data.length - 10, 10);
        }
      }
      cb(results);
    });
  });
};