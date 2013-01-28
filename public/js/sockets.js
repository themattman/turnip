var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});
window.graph_data  = [];
window.leaderboard = [];
var graph_created = 0;

function sanitizeDataPoints(serverUpdate){
  for(var i in serverUpdate){
    var team = {};
    team.repoName   = serverUpdate[i].repoName;
    team.userName   = serverUpdate[i].userName;
    team.numCommits = serverUpdate[i].numCommits;

    if(serverUpdate[i].numCommits > 5) {
    //if(graph_created == 0) {
      console.log("ADDED");
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
  console.log(window.graph_data);
  if(graph_created == 0) {
    graph_created = 1;
    createGraph();
    updateLeaderboard();
  } else {
    updateGraph();
  }
}

var socket = io.connect('/');
socket.on('update', function(d){
  sanitizeDataPoints(d);
  socket.emit('ACK');
});


function updateLeaderboard() {
  for(var i in window.leaderboard){
    var new_row = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    td0.innerHTML = i;
    td1.innerHTML = window.leaderboard[i].repoName;
    td2.innerHTML = window.leaderboard[i].userName;
    new_row.appendChild(td0);
    new_row.appendChild(td1);
    new_row.appendChild(td2);
    console.log('new_rw');
    console.log(new_row);
    document.getElementById('leaders_tbody').appendChild(new_row);
  }
}