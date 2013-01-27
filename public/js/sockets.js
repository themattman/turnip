var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});
window.graph_data  = [];
window.leaderboard = [];

function sanitizeDataPoints(serverUpdate){
  for(var i in serverUpdate){
    var team = {};
    team.repoName   = serverUpdate[i].repoName;
    team.numCommits = serverUpdate[i].numCommits;

    console.log({'numCommits': serverUpdate[i].numCommits, 'repoName': team.repoName} == window.leaderboard[0]);
    console.log(window.leaderboard.indexOf({ 'repoName': team.repoName, 'numCommits': team.numCommits}));
    if(window.leaderboard.indexOf({ 'repoName': team.repoName, 'numCommits': team.numCommits}) == -1){
      console.log("WOOOT!!!!");
      window.graph_data.push(serverUpdate[i]);
      window.leaderboard.push(team);
    }

    serverUpdate[i].name = serverUpdate[i].repoName;
    delete serverUpdate[i].repoName;
    delete serverUpdate[i].userName;
    delete serverUpdate[i].numCommits;
    delete serverUpdate[i]._id;
    serverUpdate[i].color = palette.color();
  }
  console.log(window.leaderboard);
  console.log(serverUpdate);

}

var socket = io.connect('http://localhost');
socket.on('update', function(d){
  sanitizeDataPoints(d);
  socket.emit('ACK');
});