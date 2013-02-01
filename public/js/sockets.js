$('#messages').hide(); // .show() the latest messages after they load
$('.btn').hide();

var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});
window.graph_data  = [];
window.leaderboard = [];

function updatePageData(serverUpdate) {
  // Construct new hidden table body
  // Fadeout the old and in the new
  // Delete the old leaderboard

  // ---------------------------------------------------------- //
  // Update Graph
  // ---------------------------------------------------------- //
  console.log('new serverUpdate');
  console.log(serverUpdate);
  delete window.graph_data;
  window.graph_data = serverUpdate;
  console.log(window.graph_data);
  updateGraph();

  // ---------------------------------------------------------- //
  // Update Leaderboard
  // ---------------------------------------------------------- //
  var fresh_tbody = document.createElement('tbody');
  fresh_tbody = updateLeaderboard(serverUpdate, fresh_tbody);
  $('#leaders_tbody').fadeOut('fast', function(){
    document.getElementById('leaders').appendChild(fresh_tbody);
    $('#leaders_tbody').remove();
    $(fresh_tbody).fadeIn('fast');
    fresh_tbody.setAttribute("id", "leaders_tbody");
  });
}

function sanitizeDataPoints(serverUpdate){
  console.log(serverUpdate);
  console.log('serverUpdate');
  console.log(serverUpdate.length);
  if(!serverUpdate || serverUpdate.length < 1){
    setTimeout(function(){
      console.log('woops')
      $('#loader').hide();
      var err_msg = document.createElement('div');
      err_msg.style.display = "none";
      document.getElementById('chart_container').appendChild(err_msg);
      $(err_msg).text('Sorry, no graph data.');
      $(err_msg).css('margin-left', '360px');
      $(err_msg).css('margin-top', '90px');
      $(err_msg).show();
    }, 1000);
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
    setTimeout(function(){
      $('#loader').hide();
      createGraph();
    }, 1000);
  }
}

var socket = io.connect('/');
socket.on('connect', function(){
  console.log('on_connect');
});
socket.on('graph_load', function(load_data){
  console.log('on_graph_load');
  console.log(load_data)
  sanitizeDataPoints(load_data);
  updateLeaderboard(window.leaderboard, document.getElementById('leaders_tbody'));
  $('.btn-group').show();
  $('.btn-group').css('display', 'inline-block');
});
socket.on('graph_update', function(delta){
  console.log('on_graph_update');
  console.log(delta);
  //if(window.leaderboard.length > 0){
    updatePageData(delta);
  //}
});
socket.on('feed_update', function(commit){
  console.log('on_feed');
  console.log(commit);
  updateFeed(commit);
});
socket.on('feed_load', function(commit){
  commit.splice(10, (commit.length-10));
  commit.reverse();
  for(var i in commit){
    updateFeed(commit[i]);
  }
  $('#messages').fadeIn('slow');
});

function updateFeed(commit){
  if(!commit){return;}
  console.log(commit);
  var td0 = document.createElement('td');
  td0.innerHTML = commit.userName;
  var td1 = document.createElement('td');
  td1.innerHTML = commit.message;
  var new_row = document.createElement('tr');
  new_row.appendChild(td0);
  new_row.appendChild(td1);
  $('#messages_tbody').prepend(new_row);
  if($('#messages_tbody tr').length > 10){
    var num_trs = $('#messages_tbody tr').length-10;
    for(var i = 0; i < num_trs; i++){
      $('#messages_tbody tr:last-child').remove();
    }
  }
  $(td0).effect('highlight', {}, 1000);
  $(td1).effect('highlight', {}, 1000);
}

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
  return tbody_handle;
}