function parseDate(jsonDate, debug) {

  var date = jsonDate.match(/([^-]+)/g);

  var year  = date[0];
  var month = parseInt(date[1]);
  var day   = parseInt(date[2].substr(0,2));

  if(debug) console.log(month, day, year);
  date = date[2].substr(3, date[2].length-4);
  date = date.match(/([^:]+)/g);

  var hour  = parseInt(date[0]);
  var min   = parseInt(date[1]);
  var sec   = parseInt(date[2]);
  if(debug) console.log(hour, min, sec);

  // Find seconds since beginning of the year
  var monthDays = 0;
  if(month == 2) {
    monthDays = 31;
  } else if(month == 3) {
    monthDays = 59;
  }
  var seconds = sec + 60*min + 3600*hour + 24*3600*day + 24*3600*monthDays;
  if(debug) console.log(seconds);
  return seconds;

}

var palette = new Rickshaw.Color.Palette();

new Rickshaw.Graph.JSONP({
  element: document.querySelector('#chart'),
  width: 550,
  height: 250,
  dataURL: 'https://api.github.com/repos/joyent/node/commits',
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

    var graph = transport.graph;
    var detail = new Rickshaw.Graph.HoverDetail({ graph: graph });

    var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );

    var y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis'),
    } );

    var legend = new Rickshaw.Graph.Legend( {
            element: document.querySelector('#legend'),
            graph: graph
    } );

    //graph.render();
  }
});

/*$.get('https://api.github.com/repos/joyent/node/commits', function(d) {
        d.forEach(function(com){
                console.log(com.commit.committer.date);
        })
        console.log(d)
})*/