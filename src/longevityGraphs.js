/*
 * Graphs that tell a story about how long users stay in this reddit.
 * */

var utils = require('./utils');

function renderLongevityGraph(targetElement, dataFile) {
  /* Quite frankly, this graph is not very informative although it was a nice effort at something
   * artistic and pretty, it does not tell a story.  Once I have a better graph to replace it,
   * I'm deleting this code. */
  /* Generate a line graph of the selected data. */
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  /* We set the domains for both of these once we know more about the data. */
  var x = d3.scaleTime().range([1, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]).domain([0, height]); // 1:1 mapping
  var xFromData = utils.dateFromStringWithScale(x);
  var randGenerator = d3.randomUniform(0, height);
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  d3.json(dataFile, function(err, data) {
    /* here what we are going to do here is this:
     * Load the data, start plotting lines.  It should be in a fairly usable format.
     * */
    if (err) throw err;

    // TODO: Calculate this
    x.domain([utils.betterDate(2015, 12, 1), utils.betterDate(2017, 8, 1)]);

    var vline = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

    function makeLine(item) {
      var maxRand = randGenerator();

      return [
        {
          x: xFromData({ date: item.start_date}),
          y: maxRand
        },
        {
          x: xFromData({ date: item.end_date}),
          y: maxRand
        }
      ];
    }

    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

    data.forEach(function (i) {
      g.append("path")
        .data([makeLine(i)])
        .attr("class", "longevityLine")
        .attr("d", vline)
        .style("stroke", "black")
        .style("opacity", "0.01");
    });

    // Put a title on the graph
    g.append("g")
      .attr("transform", "translate(0, " + margin.top + ")")
      .append("text")
        .attr("font-size", "20")
        .attr("text-anchor", "beginning")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .text("Commenter Longevity");
   });
}

function processToCountEndDates(data) {
  /* our data looks like "[{start_date: dd-mm-yyyy, end_date: dd-mm-yyyy},...]"
   * and we want to output something nicer. */
  var dayArray = {};
  data.forEach(function(a) {
    if (dayArray[a.end_date] === undefined) {
      dayArray[a.end_date] = 1;
    } else {
      dayArray[a.end_date]++;
    }
  });
  var dataAsArray = [];
  for (var key in dayArray) {
    if(dayArray.hasOwnProperty(key)) {
      dataAsArray.push({"date": key, "value": dayArray[key]});
    }
  }
  return dataAsArray;
  // TODO: Get rid of last element of array, optimize this?
  // TODO: Find median time of last posting, possibly delete that
}

function renderLastDayGraph(targetElement, dataFile) {
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  /* We set the domains for both of these once we know more about the data. */
  var x = d3.scaleTime().range([1, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]); // 1:1 mapping
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  var scaleFromText = utils.dateFromStringWithScale(x);

  // TODO: Fix this "majorly"
  x.domain([utils.betterDate(2015, 12, 1), utils.betterDate(2017, 8, 1)]);
  y.domain([0, 10000]);

  d3.json(dataFile, function(err, data) {
    /* We want to find the earliest day someone leaves and the latest, create an array with the
     * number of entries we are putting on the graph between them, and then increment counters up for every
     * time somebody leaves.
     *
     * Dependency: May depend on the splitting function we do. */
    var dataArray = processToCountEndDates(data);
    var bandwidth = (width / dataArray.length) - 1;

    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

   // Data
    g.selectAll(".blackFill")
      .data(dataArray)
      .enter()
      .append("rect")
        .attr("class", "blackFill")
        .attr("x", scaleFromText)
        .attr("y", function(d) { return y(d.value); } )
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - y(d.value); });

    // TODO: Put in red dotted line with median posting

    // Y Axis
    g.append("g")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(y))
      .append("text")
        .attr("transform", "rotate(270)")
        .attr("text-anchor", "end")
        .attr("font-size", "14")
        .attr("y", -6)
        .attr("fill", "#000000")
        .text("Departures Per Day");
  });
}


module.exports = {
  renderLongevityGraph: renderLongevityGraph,
  renderLastDayGraph: renderLastDayGraph

};
