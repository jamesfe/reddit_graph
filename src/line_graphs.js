
var utils = require('./utils');

function renderDeletedLineGraph(targetElement, dataFile) {
  /* Generate a line graph of the selected data. */
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().range([1, width]), // TODO: Change domain dynamically
    y = d3.scaleLinear().rangeRound([height, 0]); // We will change the domain for this later.

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // TODO: Move this to it's end-use area
  function calcPercent(d) {
    return y(d.value.total_deleted / d.value.total * 100);
  }

  d3.json(dataFile, function(err, data) {
    // Here we have a file with multiple streams of data - we should iterate over each one we want to show and display it. 
    if (err) throw err;

    var max = d3.max(Object.values(data).map(function(c) { return (c.total_deleted/c.total * 100) + 4; }));
    y.domain([0, max]); // this is for percentages now

    // Somewhere around here I should throw away data outside the boundaries of my scale
    // Otherwise we can have junky looking graphs.
    var newData = [];
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        newData.push({"date": key, "value": data[key]});
      }
    }
    var extents = d3.extent(newData, function(d) { return utils.dateFromWeekString(d.date); });
    extents[1] = extents[1].getTime() + (7 * 3600 * 24 * 1000); // add a week as buffer
    x.domain(extents);
    var scaleFromText = utils.dateFromWeekStringWithScale(x);

    var bandwidth = (width / newData.length) - 1;
    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

    // now we write some deleted bars on top
    g.selectAll(".deleted")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "deleted_weekly")
        .attr("x", scaleFromText)
        .attr("y", calcPercent)
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - calcPercent(d); } );

    g.append("g")
      .attr("transform", "translate(0, " + margin.top + ")")
      .append("text")
        .attr("font-size", "20")
        .attr("text-anchor", "beginning")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .text("Deleted Comments by Week: Percentage of Comments Deleted in /r/The_Donald");

    // Y Axis
    g.append("g")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(y).tickFormat(function(d) { return d + '%'; }))
      .append("text")
        .attr("transform", "rotate(270)")
        .attr("text-anchor", "end")
        .attr("font-size", "14")
        .attr("y", -6)
        .attr("fill", "#000000")
        .text("Comments Deleted");

  });

}

module.exports = {
  renderDeletedLineGraph: renderDeletedLineGraph
};
