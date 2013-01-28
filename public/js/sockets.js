var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});
window.graph_data  = [];
window.leaderboard = [];

function updatePageData(serverUpdate) {
  // Construct new hidden table body
  // Fadeout the old and in the new
  // Delete the old leaderboard
  var fresh_tbody = document.createElement('tbody');
  updateLeaderboard(serverUpdate, fresh_tbody);
  $('#leaders_tbody').fadeOut('fast', function(){
    $(fresh_tbody).fadeIn('fast');
    fresh_tbody.setAttribute("id", "leaders_tbody");
  });


  /*for(var i in serverUpdate){
    var curName = serverUpdate[i].repoName
    var notOnList = true;
    for(var j in leaderboard){
      if(serverUpdate[i] == window.leaderboard){
        notOnList = false;
      }
    }
    if(!notOnList){
      for(var k = 10; k < window.leaderboard.length; k++){
        delete window.leaderboard[k];
      }
      updateLeaderboard(serverUpdate[i]);
    }
  }
  updateGraph();*/
}

function sanitizeDataPoints(serverUpdate){
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

  createGraph();
  updateLeaderboard(window.leaderboard, $('#leaders_tbody'));
}

var socket = io.connect('/');
socket.on('connect', function(){
  console.log('on_connect');
  socket.on('update', function(delta){
    updatePageData(delta);
  });
});
socket.on('gimme_all_ur_datas', function(update){
  console.log('on_gimme');
  sanitizeDataPoints(update);
});

function updateLeaderboard(c, tbody_handle) {
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
    tbody_handle.appendChild(new_row);
  }
}