var mongo       = require('./database.js')
  , fs          = require('fs')
  , __startTime = require('./secret.js').constants.startTime
  , __timeDelta = require('./secret.js').constants.timeDelta;

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
function zeroOutUnusedDataPoints(cb) {
  var currentTime = new Date().getTime();
  var numPointsToFill = (currentTime - __startTime) / __timeDelta;
  var commits = [];
  for(var i = 0; i < numPointsToFill; ++i) {
    var ith_commit = {};
    ith_commit.x = __startTime + i*__timeDelta;
    ith_commit.y = 0;
    commits.push(ith_commit);
  }
  console.log('commits Zerod'.yellow, i);
  cb(commits);
}

exports.pushIntoDatabase = function(data, cb){
  var record = {};
  console.log('pushIntoDatabase'.magenta);
  console.log(data);
  var file = JSON.parse(fs.readFileSync('./server/github.json', 'utf-8'));
  console.log('file'.cyan, file.latest_timestamp);

  var repoName = data.repository.name;
  console.log('repoName =', repoName);

  mongo.db.collection('graph_data', function(err, col){
    col.find({'repoName': repoName}).toArray(function(err, results){
      console.log('RESULTS');
      console.log(results);
      if(results.length < 1) {

        // Create a new record for this repo
        zeroOutUnusedDataPoints(function(c){
          record.repoName = repoName;
          record.userName = data.repository.owner.name;
          record.commits = c;
          record.commits.push({'x': file.latest_timestamp, 'y': data.commits.length});
          console.log('record to insert'.green);
          //console.log(record);
          col.insert(record, function(err, docs){
            if(err){throw err;}
            console.log('inserted a new repo/record'.magenta);
          });
        });
      } else {

        // Append new data point to existing repo
        record = results[0];
        var data_point = {};
        data_point.x = file.latest_timestamp;
        data_point.y = results[0].commits[results[0].commits.length-1].y
        data_point.y += data.commits.length;
        console.log('record'.zebra);
        console.log(data_point);
        col.update({'repoName': record.repoName}, { $push: { 'commits': data_point } }, function(err, docs){
          if(err){throw err;}
          console.log('updated a record'.blue);
        });
      }
    });
  });
}


// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
function getCommitData(curTime, cb) {
  mongo.db.collection('graph_data', function(err, collection) {
    console.log('querying'.red);

    // Don't forget to sort the results and take the top 10 teams
    collection.find().toArray(function(err, results) {

      console.log('results'.red)
      console.log(results)
      //console.log(results[0].payload);
      /*for(var i in results) {
        console.log(results[i].payload);
        /*if(results[i].payload.repository != 'undefined') {
          console.log(results[i].payload.repository.name);
        }
      }*/


      //cb(results);

    });
  });
}

exports.getLatestDelta = function(curTime, cb) {
  console.log('getLatestDelta', curTime);
  getCommitData(curTime, function(r){
    console.log('red'.red)
    console.log(r.commits);
    cb(r);
  });
}