function parseDate(jsonDate, debug) {

  var date = jsonDate.match(/([^-]+)/g);

  var year  = parseInt(date[0]);
  var month = parseInt(date[1]);
  var day   = parseInt(date[2].substr(0,2));

  if(debug) console.log(month, day, year);
  date = date[2].substr(3, date[2].length-4);
  date = date.match(/([^:]+)/g);

  var hour  = parseInt(date[0]);
  var min   = parseInt(date[1]);
  var sec   = parseInt(date[2]);
  if(debug) console.log(hour, min, sec);

  var leapDelta = year-1970;

  // Find seconds since beginning of the year
  var monthDays = 0;
  switch(month) {
    case month == 2:
      monthDays = 31;
      break;
    case month == 3:
      monthDays = 59;
      break;
    case month == 4:
      monthDays = 90;
      break;
    case month == 5:
      monthDays = 120;
      break;
    case month == 6:
      monthDays = 151;
      break;
    case month == 7:
      monthDays = 181;
      break;
    case month == 8:
      monthDays = 212;
      break;
    case month == 9:
      monthDays = 243;
      break;
    case month == 10:
      monthDays = 273;
      break;
    case month == 11:
      monthDays = 304;
      break;
    case month == 12:
      monthDays = 334;
      break;
  }

  var seconds = sec + 60*min + 3600*hour + 24*3600*day + 24*3600*monthDays + 24*3600*365*leapDelta + (leapDelta/4)*24*3600;
  if(debug) console.log(seconds);
  return seconds;

}

var palette = new Rickshaw.Color.Palette({"scheme": "spectrum2001"});


var data1 = [ { x: 0, y: 30 }, { x: 1, y: 43 }, { x: 2, y: 17 }, { x: 3, y: 32 } ];


var data2 = [ { x: 0, y: 40 }, { x: 1, y: 42 }, { x: 2, y: 27 }, { x: 3, y: 5 } ];
var item2 =  {
    name: "data2",
    color: palette.color(),
    data: data1
  };

var graph;

function createGraph(seriesData) {
  console.log('creating');
  console.log(seriesData);
  graph = new Rickshaw.Graph({
    element: document.querySelector('#chart'),
    width: 800,
    height: 250,
    renderer: 'area',
    stroke: true,
    series:  seriesData 
  });
  console.log('graph before render');
  console.log(graph.series[0]);
  graph.render();
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

  var time = new Rickshaw.Fixtures.Time();
  var seconds = time.unit('second');
  //console.log(time);
  console.log('TIIIME');
  console.log(seconds);

  var xAxis = new Rickshaw.Graph.Axis.X({ 
    graph: graph,
    TimeUnit: seconds 
  });
  //var x_axis = new Rickshaw.Graph.Axis.X( { graph: graph } );
  //x_axis.render();
  xAxis.render();

  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph,
    orientation: 'left',
    //tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    element: document.getElementById('y_axis'),
  });
  yAxis.render();
}
//graph.render();


/*setTimeout(function(){
  graph.series.push(item2);
  graph.update();
}, 3000);*/


// Require everyone to enter their repo name before the competition
// Store global file on server with samples taken every x seconds (well, on Mongo)
// Have Otto take form data and write it to Mongo correctly when someone adds their account
// Each client constructs graph from server
// Require sockets? That way node server can push updates to graph instead of getting flooded by requests

// Calculate UNIX timestamp of beginning of hackathon
// Issue Github API requests every x seconds and check if latest commit timestamp > mostRecentTimeStamp
var lastRequestTimeStamp = 0 //Defaulted to beginning of hackathon, updated in setInterval


var currentAccountData = [];

var lock = 0;

function pushNewDataPoints() {

}

function addDataStream(userName, repoName, cb) {  
  $.get('https://api.github.com/repos/' + userName + '/' + repoName + '/commits', function(d) {
    var pusher = {};
    pusher.color = palette.color();
    pusher.name = repoName;
    pusher.data = [];
    console.log(pusher);
    var repoCommits = 0;
    for(var i in d) {
        if(repoCommits < 25) {
          var commit = parseDate(d[i].commit.committer.date);
          commit %= 100000000;
          console.log(commit);
          var datapoint = {};
          datapoint.x = commit;
          datapoint.y = repoCommits;
          //console.log(datapoint);
          pusher.data.push(datapoint);
        }
        repoCommits++;
    }
    currentAccountData.push(pusher);
    cb();
  });
}

function iterateOverRepos() {
  $.get('/github/accounts', function(d) {
    console.log('github');
    console.log(d);
    d.accounts.forEach(function(p){
      p.repos.forEach(function(r){
        console.log('name: ', p.name ,'|repo:', r.name);
        addDataStream(p.name, r.name, function(){
          lock++;
          if(lock == 3) {
            setTimeout(function(){
              createGraph(currentAccountData);
              otherGraphStuff()
            }, 2000);
          } else if(lock > 3) {
            pushNewDataPoints();
            graph.update();
          }
        });
      });
    });
  });
}

//setTimeout(
setInterval(
iterateOverRepos(), 1000);






/*$.get('https://api.github.com/repos/joyent/node/commits', function(d) {
        d.forEach(function(com){
                console.log(com.commit.committer.date);
        })
        console.log(d)
})*/