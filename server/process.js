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
  console.log('emitting the new commit feed prototype'.red);
  this.emit('update_commits', commit);
};

var Updater = new commitFeed();
exports.commitFeed = Updater;

function zeroOutUnusedDataPoints(cb) {
  var numPointsToFill = ((1359273904465 - __startTime) / __timeDelta) / 1000;
  var commits = [];
  for(var i = 0; i < numPointsToFill; ++i) {
    var ith_commit = {};
    ith_commit.x = (__startTime + i*__timeDelta);
    ith_commit.y = Math.round(40*Math.random());
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
  if(!commit_data){return;}
  var sanitized_commit        = {};
  sanitized_commit.pusher     = {};
  sanitized_commit.repository = {};
  sanitized_commit.commits    = [];
  console.log('numCommits=', commit_data.commits.length);

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
    console.log(sanitized_commit);
    col.insert(sanitized_commit);

    Updater.updateAll(sanitized_commit);
  });
}

exports.saveCommitToDatabase = saveCommitToDatabase;

exports.pushIntoDatabase = function(d, cb){
  var record = {};
  console.log('pushIntoDatabase'.magenta);
  console.log(d);
  var file = JSON.parse(fs.readFileSync('./server/github.json', 'utf-8'));
  console.log('file'.cyan, file.latest_timestamp);

  var repoName = d.repository.name;
  console.log('repoName =', repoName);

  // ---------------------------------------------------------- //
  // Write the commit to Mongo
  // ---------------------------------------------------------- //
  saveCommitToDatabase(d);

  mongo.db.collection('graph_data', function(err, col){
    if(err){throw err;}
    col.find({'repoName': repoName}).limit(1).toArray(function(err, results){
      if(err){throw err;}
      console.log('RESULTS');
      console.log(results);
      if(!results || results.length < 1) {

        // ---------------------------------------------------------- //
        // Create a new record for this repo
        // ---------------------------------------------------------- //
        zeroOutUnusedDataPoints(function(c){
          record.repoName = repoName;
          record.userName = d.repository.owner.name;
          record.numCommits = d.commits.length;
          record.data = c;
          record.data.push({'x': file.latest_timestamp, 'y': d.commits.length});
          console.log('record to insert'.green);
          console.log('numCommits of this record'.blue, record.numCommits);
          col.insert(record, function(err, docs){
            if(err){throw err;}
            console.log('inserted a new repo/record'.magenta);
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
        console.log('record'.zebra);

        col.update({'repoName': record.repoName}, { $inc: { 'numCommits': d.commits.length } }, function(err, docs){
          if(err){throw err;}
          console.log('updated a record'.magenta);

          // Remove the last data point
          col.update({'repoName': record.repoName}, { $pop: { data: 1 } }, function(err, docs){
            if(err){throw err;}

            // Push the last data point back on with an updated y value
            col.update({'repoName': record.repoName}, { $push: { data: data_point } }, function(err, docs){
              if(err){throw err;}
              console.log('updated a record'.blue);
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
          var msg = {};
          msg.repoName = results[i].repository.name;
          msg.userName = results[i].pusher.name;
          msg.message  = results[i].head_commit.message;
          to_push.push(msg);
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