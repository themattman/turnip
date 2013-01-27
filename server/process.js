var mongo = require('./database.js')
  , fs    = require('fs');

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
//exports.pushIntoDatabase = function(data, cb){
function meme(data){
  var record = {};
  console.log('meme'.magenta);
  console.log(data);
  var file = JSON.parse(fs.readFileSync('./server/github.json', 'utf-8'));
  console.log('file'.cyan);
  console.log(file.latest_timestamp);
  //var commits_in_push = data.commits.length;
  var repoName = data.repository.name;
  console.log('repoName =', repoName);
  mongo.db.collection("graph_data", function(err, col){
    col.findOne({'accounts.name': repoName}).toArray(function(err, results){
      console.log('RESULTS');
      console.log(results);
      record.repoName = repoName;
      record.userName = data.repository.owner.name;
      if(results.length < 1) {
        console.log('UNDEF'.magenta);
        record.commits = [];
        records.commits.push({'x': file.latest_timestamp, 'y': data.commits.length});
        console.log('record to insert'.green);
        console.log(record);
        // Create an entry
        col.insert(record, function(err, docs){
          if(err){throw err;}
          console.log('inserted a new repo/record'.magenta);
        });
      } else {
        record
        col.update(record, function(err, docs){
          if(err){throw err;}
          console.log('updated a record'.blue);
        });
      }
    });
  });
    /*col.insert(record, function(err, docs){
      if(err) throw err
      //cb(record);
    });
  });*/
}


// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
function getCommitData(curTime, cb) {
  mongo.db.collection("commits", function(err, col){
    col.find({commits: { $exists: true } }).toArray(function(err, results){
      console.log('SECONDS'.yellow);
      console.log(results[0]);
      meme(results[0]);
    });
  });
  //console.log(mongo);
  //mongo.db.collectionNames(function(err, collections) {
  mongo.db.collection("commits", function(err, collection) {
    console.log('querying'.red);
    //console.log(collection);
    collection.find().toArray(function(err, results) {
      //var ite = JSON.parse(results[0]);
      //console.log(ite);
      //console.log(typeof(results[0].payload));
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

      //cb(results[0].payload);
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