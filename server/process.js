var mongo = require('./database.js');

// ---------------------------------------------------------- //
// Process data before DB insert
// ---------------------------------------------------------- //
exports.pushIntoDatabase = function(data){
  console.log(data);

}


// ---------------------------------------------------------- //
// Pushing Data out to Sockets
// ---------------------------------------------------------- //
function getCommitData(curTime, cb) {
  var data = "t";
  console.log(mongo);
  //mongo.db.collectionNames(function(err, collections) {
  mongo.db.collection("commits", function(err, collection) {
    console.log('querying'.red);
    console.log(collection);
    collection.find().toArray(function(err, results) {
      console.log('results'.red)
      console.log(results[0].payload);
      /*for(var i in results) {
        console.log(results[i].payload);
        /*if(results[i].payload.repository != 'undefined') {
          console.log(results[i].payload.repository.name);
        }
      }*/


      //cb(results);
      
      cb(results[0].payload);
    });
  });
}

exports.getLatestDelta = function(curTime, cb) {
  console.log('getLatestDelta', curTime);
  getCommitData(curTime, function(r){
    cb(r);
  });
}