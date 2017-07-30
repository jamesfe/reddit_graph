/*
 * Graphs that tell a story about how long users stay in this reddit.
 * */

var utils = require('./utils');

function processToCountEndDates(data, coolOff) {
  /* our data looks like "[{start_date: dd-mm-yyyy, end_date: dd-mm-yyyy},...]"
   * and we want to output something nicer. 
  * coolOff is the number of elements we should cut off the back of the array since everyone makes a last post 
  * toward the end of the dataset (we cannot see the future)
  * */
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
  dataAsArray = dataAsArray.sort(function(d1, d2) {
    return utils.compareDates(utils.dateFromString(d1.date), utils.dateFromString(d2.date));
  });
  return dataAsArray.slice(0, coolOff * -1);
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

  d3.json(dataFile, function(err, data) {
    /* We want to find the earliest day someone leaves and the latest, create an array with the
     * number of entries we are putting on the graph between them, and then increment counters up for every
     * time somebody leaves.
     *
     * Dependency: May depend on the splitting function we do. */
    var dataArray = processToCountEndDates(data, 30);
    var bandwidth = (width / dataArray.length) - 1;
    x.domain(d3.extent(dataArray, function(b) { return(utils.dateFromString(b.date)); }));
    y.domain([0, d3.max(dataArray, function(b) { return(b.value); })]);

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

    g.append("g")
      .attr("transform", "translate(0, " + margin.top + ")")
      .append("text")
        .attr("font-size", "20")
        .attr("text-anchor", "beginning")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .text("Number of Users Making Last Post on This Day");

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
        .text("Number of Users");
  });
}

module.exports = {
  renderLastDayGraph: renderLastDayGraph
};
