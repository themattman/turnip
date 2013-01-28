var mongo       = require('./database.js')
  , fs          = require('fs')
  , __startTime = require('./secret.js').constants.startTime
  , __timeDelta = require('./secret.js').constants.timeDelta;

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
function zeroOutUnusedDataPoints(cb) {
  //var currentTime = new Date().getTime();
  //var numPointsToFill = (currentTime - __startTime) / __timeDelta;
  var numPointsToFill = (1359273904465 - __startTime) / __timeDelta;
  var commits = [];
  for(var i = 0; i < numPointsToFill; ++i) {
    var ith_commit = {};
    ith_commit.x = (__startTime + i*__timeDelta);///1000;
    ith_commit.y = Math.round(40*Math.random());
    commits.push(ith_commit);
  }
  console.log('commits Zerod'.yellow, i);
  cb(commits);
}

function saveCommitToDatabase(commit_data){
  mongo.db.collection('commits', function(err, col){
    console.log('in da commits collection');
    col.insert(commit_data);
  });
}

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
    col.find({'repoName': repoName}).limit(1).toArray(function(err, results){
      console.log('RESULTS');
      console.log(results);
      if(!results) {

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
        data_point.y = results[0].numCommits;
        data_point.y += d.commits.length;
        console.log('NEW COMMIT LENGTH'.yellow)
        console.log(data_point.y);
        console.log('record'.zebra);
        console.log(data_point);

        var last_data_spot = record.data[record.data.length];
        console.log(last_data_spot);
        last_data_spot = 'data.' + last_data_spot;

        col.update({'repoName': record.repoName}, { $set: { 'numCommits': data_point.y } }, function(err, docs){
          if(err){throw err;}
          console.log('updated a record'.magenta);
          col.update({'repoName': record.repoName}, { $set: { last_data_spot: data_point.x } }, function(err, docs){
            if(err){throw err;}
            console.log('updated a record'.blue);
          });
        });
      }
    });
  });
}


// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
exports.getData = function(curTime, cb) {
  mongo.db.collection('graph_data', function(err, collection) {
    // Sort the results and take the top 10 teams
    collection.find().sort({ 'numCommits': -1 }).limit(10).toArray(function(err, results) {
      console.log('getData'.red, results.length)
      cb(results);
    });
  });
};

exports.getLatestDelta = function(curTime, cb) {
  mongo.db.collection('graph_data', function(err, collection) {
    // Sort the results and take the top 10 teams
    collection.find().sort({ 'numCommits': -1 }).limit(10).toArray(function(err, results) {
      //console.log(results)
      console.log('getLatestDelta'.red, results.length)
      cb(results);
    });
  });
};