var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});

function sanitizeDataPoints(serverUpdate){
  var leaderboard = [];
  for(var i in serverUpdate){
    var team = {};
    team.repoName   = serverUpdate[i].repoName;
    team.numCommits = serverUpdate[i].numCommits;
    leaderboard.push(team);
    delete serverUpdate[i].userName;
    delete serverUpdate[i].numCommits;
    delete serverUpdate[i]._id;
    serverUpdate.color = palette.color();
  }
  console.log(leaderboard);
  console.log(serverUpdate);
}

var socket = io.connect('http://localhost');
socket.on('update', function(d){
  sanitizeDataPoints(d);
  socket.emit('ACK');
});