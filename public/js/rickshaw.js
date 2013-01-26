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


var data1 = [ { x: 0, y: 30 }, { x: 1, y: 43 }, { x: 2, y: 17 }, { x: 3, y: 32 } ];
var data2 = [ { x: 0, y: 40 }, { x: 1, y: 42 }, { x: 2, y: 27 }, { x: 3, y: 5 } ];


var palette = new Rickshaw.Color.Palette();

var graph = new Rickshaw.Graph({
  element: document.querySelector('#chart'),
  width: 550,
  height: 250,
  renderer: 'area',
  stroke: true,
  series: [ {
    name: "data1",
    color: palette.color(),
    data: data1
  },
  {
    name: "data2",
    color: palette.color(),
    data: data2
  }
  ]

  /*dataURL: 'https://api.github.com/repos/joyent/node/commits',
  onData: function(d) {
    var commitDates = [];
    console.log(d.data);
    console.log(d);
    var totCommits = 0;

    d.data.reverse();
    d.data.forEach(function(com){
      ++totCommits;
      var x = parseDate(com.commit.committer.date, false);
      var y = totCommits;
      var data_pt = {};
      data_pt.x = x;
      data_pt.y = y;
      console.log(data_pt);
      commitDates.push(data_pt);
    });

    var series = [];
    var obj = {};
    obj.name = "Node";
    obj.data = commitDates;
    obj.color = palette.color();
    series.push(obj);
    console.log(series);

    return series;
  },
  onComplete: function(transport) {
    console.log('transport')
    console.log(transport)
  }*/
});

console.log(graph);




var legend = new Rickshaw.Graph.Legend( {
        element: document.querySelector('#legend'),
        graph: graph
});
var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    legend: legend
});
/*var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
});*/


graph.render();

//var graph = transport.graph;
var detail = new Rickshaw.Graph.HoverDetail({ graph: graph });
/*var y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'right',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis'),
});*/

var time = new Rickshaw.Fixtures.Time();
var seconds = time.unit('15 second');
console.log(time);
console.log(seconds);

var xAxis = new Rickshaw.Graph.Axis.X({ 
  graph: graph,
  TimeUnit: seconds 
});
xAxis.render();

var yAxis = new Rickshaw.Graph.Axis.Y({ graph: graph });
yAxis.render();



/*var slider = new Rickshaw.Graph.RangeSlider({
    graph: graph,
    element: document.querySelector('#slider')
});*/

//console.log(Rickshaw);









/*$.get('https://api.github.com/repos/joyent/node/commits', function(d) {
        d.forEach(function(com){
                console.log(com.commit.committer.date);
        })
        console.log(d)
})*/