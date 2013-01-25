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
        dataURL: 'https://api.github.com/repos/joyent/node/commits',
        onData: function(d) {
                var commitDates = [];
                console.log(d.data);
                console.log(d);
                var totCommits = 0;
                d.data.reverse();
                d.data.forEach(function(com){
                        //commitDates.push(com.commit.committer.date)
                        ++totCommits;
                        var x = parseDate(com.commit.committer.date, false);
                        var y = totCommits;
                        var data_pt = {};
                        data_pt.x = x;
                        data_pt.y = y;
                        console.log(data_pt);
                        commitDates.push(data_pt);
                        //console.log(com.commit.committer.date);
                        //console.log(parseJsonDate(d.data[0].commit.committer.date).valueOf());
                        //console.log('--------');
                        //parseDate(com.commit.committer.date)
                })

                var series = [];
                var obj = {};
                obj.name = "Node";
                obj.data = commitDates;
                obj.color = palette.color();

                series.push(obj);

                console.log(series);
                //console.log(commitDates);

                //console.log(d);
                //console.log(d.data[0]);
                //console.log(d.data[0].commit.committer.date.parseJsonDate());

                /*console.log(parseJsonDate(d.data[0].commit.committer.date));
                console.log(typeof(parseJsonDate(d.data[0].commit.committer.date)));
                console.log(parseJsonDate(d.data[0].commit.committer.date).valueOf());*/

                //console.log(d.data[0].commit.committer.date);
                //console.log(d.data[0].commit)
                //console.log(d.data[0].commit.committer)
                //console.log(d.data[0].commit.committer.date)
                //d[0].data[0].y += 1;
                //return d.data[0].commit.committer.date;
                return series;
        },
        onComplete: function(transport) {
                console.log('transport')
                console.log(transport)
                var graph = transport.graph;
                var detail = new Rickshaw.Graph.HoverDetail({ graph: graph });
        }
});

/*$.get('https://api.github.com/repos/joyent/node/commits', function(d) {
        d.forEach(function(com){
                console.log(com.commit.committer.date);
        })
        console.log(d)
})*/