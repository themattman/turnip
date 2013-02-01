$('#messages').hide(); // .show() the latest messages after they load

var socket = io.connect('/');
socket.on('connect', function(){
  console.log('on_connect');
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
  td0.innerHTML = commit.repoName;
  var td1 = document.createElement('td');
  td1.innerHTML = commit.userName
  var td2 = document.createElement('td');
  td2.innerHTML = commit.message;
  var new_row = document.createElement('tr');
  new_row.appendChild(td0);
  new_row.appendChild(td1);
  new_row.appendChild(td2);
  $('#messages_tbody').prepend(new_row);
  $(td0).effect('highlight', {}, 1000);
  $(td1).effect('highlight', {}, 1000);
  $(td2).effect('highlight', {}, 1000);
}