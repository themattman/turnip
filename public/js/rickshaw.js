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
});

console.log(graph);
console.log(document.querySelector('#slider'));

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
var list = [];
list.push(document.querySelector('#slider'));
var argu = {
  element: list,
  graph: graph
};
console.log(argu);
var slider = new Rickshaw.Graph.RangeSlider(argu);











/*function sliderController() {
  console.log('custom func');
                this.sliderCreate = function(element, graph) {
                    var self = this;
                    self.graph = graph;
                    var rangeSlider = new dojox.form.HorizontalRangeSlider(
                    {
                        name : "rangeSlider",
                        value : [ graph.dataDomain()[0], graph.dataDomain()[1] ],
                        minimum : graph.dataDomain()[0],
                        maximum : graph.dataDomain()[1],
                        intermediateChanges : true,
                        onChange : function(value) {
                            self.graph.window.xMin = this.value[0];
                            self.graph.window.xMax = this.value[1];
                            // if we're at an extreme, stick there
                            if (self.graph.dataDomain()[0] == this.value[0]) {
                                self.graph.window.xMin = undefined;
                            }
                            if (self.graph.dataDomain()[1] == this.value[1]) {
                                self.graph.window.xMax = undefined;
                            }
                            console.log(this.__redraw__);
                            if (this.__redraw__) {
                                self.graph.update();
                            } else {
                                this.__redraw__ = true;
                            }
                        }
                    }, element);
                    this.slider = rangeSlider;
                    this.slider.__redraw__ = true;
                }
 
                this.sliderUpdate = function() {
                    var value = this.slider.get('value');
                    console.log('sliderUpdate')
                    this.slider.set('minimum', this.graph.dataDomain()[0]);
                    this.slider.set('maximum', this.graph.dataDomain()[1]);
 
                    if (this.graph.window.xMin == undefined) {
                        value[0] = this.graph.dataDomain()[0];
                    }
                    if (this.graph.window.xMax == undefined) {
                        value[1] = this.graph.dataDomain()[1];
                    }
                    // chart was updated - do not force redraw on slider change 
                    this.slider.__redraw__ = false;
                    this.slider.set('value', value);
                }
            }
            var slider = new Rickshaw.Graph.RangeSlider({
                graph : graph,
                element : argu,
                controller : new sliderController(document
                .getElementById('slider'), graph)
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

var yAxis = new Rickshaw.Graph.Axis.Y({
  graph: graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('y_axis'),
});
yAxis.render();
graph.render();

/*var order = new Rickshaw.Graph.Behavior.Series.Order({
    graph: graph,
    legend: legend
});*/


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