var mongo = require('./database.js')
  , fs    = require('fs');

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
//exports.pushIntoDatabase = function(data){
function meme(data){
  console.log(data);
  var file = JSON.parse(fs.readFileSync('./server/github.json', 'utf-8'));
  console.log('file'.cyan);
  console.log(file.latest_timestamp);
  var commits_in_push = 0;
  //mongo.db.collection("commits", function(err, col){});
}


// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
function getCommitData(curTime, cb) {
  meme(curTime);
  var data = "t";
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