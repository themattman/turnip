var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});
window.graph_data  = [];
window.leaderboard = [];
var graph_created = 0;

function sanitizeDataPoints(serverUpdate){

  if(window.leaderboard.length > 0){
    for(var i in serverUpdate){
      var curName = serverUpdate[i].repoName
      var notOnList = true;
      for(var j in leaderboard){
        if(serverUpdate[i] == window.leaderboard){
          notOnList = false;
        }
      }
      if(!notOnList){
        for(var k = 10; k < window.leaderboard.length; k++){
          console.log('LEADERBOARD');
          delete window.leaderboard[k];
        }
        updateLeaderboard(serverUpdate[i], i);
      }
    }
  } else {
    for(var i in serverUpdate){
      var team = {};
      team.repoName   = serverUpdate[i].repoName;
      team.userName   = serverUpdate[i].userName;
      team.numCommits = serverUpdate[i].numCommits;

      window.graph_data.push(serverUpdate[i]);
      window.leaderboard.push(team);

      serverUpdate[i].name = serverUpdate[i].repoName;
      delete serverUpdate[i].repoName;
      delete serverUpdate[i].userName;
      delete serverUpdate[i].numCommits;
      delete serverUpdate[i]._id;
      serverUpdate[i].color = palette.color();
    }
  }

  if(graph_created == 0) {
    graph_created = 1;
    createGraph();
    //console.log(window);
    updateLeaderboard(window.leaderboard);
  } else {
    updateGraph();
  }
}

var socket = io.connect('/');
socket.on('update', function(d){
  sanitizeDataPoints(d);
  socket.emit('ACK');
});


// UNTESTED!
function updateLeaderboard(c, indexToInsert) {
  for(var i in c){
    var new_row = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');

    td0.innerHTML = i;
    td1.innerHTML = c[i].repoName;
    td2.innerHTML = c[i].userName;
    td3.innerHTML = c[i].numCommits;
    new_row.appendChild(td0);
    new_row.appendChild(td1);
    new_row.appendChild(td2);
    new_row.appendChild(td3);
    if(indexToInsert){
      var child = '#leaders_tbody tr:eq(' + indexToInsert + ')';
      //$('#leaders_tbody').insertBefore(new_row, $(child));
    }else{
      document.getElementById('leaders_tbody').appendChild(new_row);
    }
  }
}