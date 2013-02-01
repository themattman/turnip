var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});

/*var data1 = [ { x: 0, y: 30 }, { x: 1, y: 43 }, { x: 2, y: 17 }, { x: 3, y: 32 } ];
var data2 = [ { x: 0, y: 40 }, { x: 1, y: 42 }, { x: 2, y: 27 }, { x: 3, y: 5 } ];
var item1 =  {
    name: "data1",
    color: palette.color(),
    data: data2.reverse()
  };
var item2 =  {
    name: "data2",
    color: palette.color(),
    data: data2
  };*/

var graph;

function createGraph() {
  console.log('creating');
  if(graph){
    delete graph;
    $('#chart').hide();
    $('#chart').empty();
    $('#y_axis').empty();
    $('#legend').empty();
  }
  graph = new Rickshaw.Graph({
    element: document.querySelector('#chart'),
    width: 800,
    height: 250,
    renderer: 'area',
    stroke: true,
    series:  window.graph_data//[ item2, item1 ]//window.graph_data//seriesData 
  });
  graph.render();
  $('#chart').show();
  otherGraphStuff();
}

function otherGraphStuff() {  
  var detail = new Rickshaw.Graph.HoverDetail({ graph: graph });
  var legend = new Rickshaw.Graph.Legend( {
    element: document.getElementById('legend'),
    graph: graph
  });
  var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    legend: legend
  });
  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
  });
  var order = new Rickshaw.Graph.Behavior.Series.Order({
    graph: graph,
    legend: legend
  });

  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph,
    orientation: 'left',
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    element: document.getElementById('y_axis'),
  });
  yAxis.render();
}

var offsetForm = document.getElementById('offset_form');
$('#btn0').click(function(a){
  graph.renderer.unstack = true;
  graph.render();
});
$('#btn1').click(function(a){
  graph.renderer.unstack = false;
  graph.render();
});

// Require everyone to enter their repo name before the competition
// Store global file on server with samples taken every x seconds (well, on Mongo)
// Have Otto take form data and write it to Mongo correctly when someone adds their account
// Each client constructs graph from server
// Require sockets? That way node server can push updates to graph instead of getting flooded by requests

// Calculate UNIX timestamp of beginning of hackathon
// Issue Github API requests every x seconds and check if latest commit timestamp > mostRecentTimeStamp
//var lastRequestTimeStamp = 0 //Defaulted to beginning of hackathon, updated in setInterval

// ----WORKS----
// CLIENT-SIDE
// On connect, emit some event ('gimme_all_ur_datas')
// Server then sends everything

// After that, server only sends top ten data
// Client expects to overwrite everything with new update


// Get data when page is first loaded
// Use Socket.io on connect to push the correct data (most logic server-side)
//loadGraph();
// Will change once socket.io is up and running
//setInterval(updateGraph(), 1000);
//addDataStream('joyent', 'node');


// Server-side socket does the computation to find the delta
// One x and y sent for each repo (with number of commits and the current unified unix timestamp)

// Server-side computation
// Hooks get the commit data
////https://help.github.com/articles/post-receive-hooks
// Process the object and throw the new x's and y's into DB (This will take logic)
// Compare the latest? incoming timestamp (depends if they all have the same timestamp or just one per push)
// Increment counter in DB for the y accordingly for the next timestamp

// At set time intervals, blindly broadcast JSON deltas to all clients
