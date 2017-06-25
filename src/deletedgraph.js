var utils = require('./utils');


function doDeletedPercentGraph(targetId, dataFile, dates) {
  /* Draw a deleted  percent graph on the target id with the given filename */
  var svg = d3.select(targetId),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([1, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var sampleFile = "../data/sampled_deleted_posts.json";

  function calcPercent(d) {
    return y(d.value.total_deleted / d.value.total * 100);
  }

  d3.json(dataFile, function(err, data) {
    if (err) throw err;

    var max = d3.max(Object.values(data).map(function(c) { return (c.total_deleted/c.total * 100) + 4; }))
    // debugger;
    y.domain([0, max]); // this is for percentages now

    var newData = [];
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        newData.push({"date": key, "value": data[key]});
      }
    }

    var bandwidth = (width / newData.length) - 1;
    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));
       // now we write some deleted bars on top
  // ------------------------------------------------------------
    d3.json(sampleFile, function(err, data) {

      var sampleData = [];
      for (var key in data) {
        if(data.hasOwnProperty(key)) {
          sampleData.push({"date": key, "value": data[key]});
        }
      }

      g.selectAll(".sampled")
        .data(sampleData)
        .enter()
        .append("rect")
          .attr("class", "sampled")
          .attr("x", function(d) {
            d = d.date.split('-');
            var b = x(utils.betterDate(d[2], d[1], d[0]));
            return b; })
          .attr("y", calcPercent)
          .attr("width", bandwidth)
          .attr("height", function(d) { return height - calcPercent(d); } );
    });
  // ------------------------------------------------------------

    g.selectAll(".deleted")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "deleted")
        .attr("x", function(d) {
          d = d.date.split('-');
          var b = x(utils.betterDate(d[2], d[1], d[0]));
          return b; })
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
        .text("Deleted Comments: Randomly Sampled (green) vs r/The_Donald/ (red)");

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
  });

  console.log("Done making deleted percentage graph");

}

function doDeletedGraph() {
// some declarations
  var svg = d3.select("#commentCount"),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([1, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  d3.json("../data/total_by_deleted.json", function(err, data) {
    if (err) throw err;

    y.domain([0, d3.max(Object.values(data).map(function(c) { return c.total; }))]);

    var newData = [];
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        newData.push({"date": key, "value": data[key]});
      }
    }

    var bandwidth = (width / newData.length) - 1;
    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));
    // I don't know why we have to use the "bad axis" here but it seems d3 is off by 1 for axis labels.


   // Show all the comments, then next we will overlay this with the deleted values.
    g.selectAll(".blah")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "blah")
        .attr("x", function(d) {
          d = d.date.split('-');
          var b = x(utils.betterDate(d[2], d[1], d[0]));
          return b; })
        .attr("y", function(d) { return y(d.value.total); } )
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - y(d.value.total); });

    // Show all the comments, then next we will overlay this with the deleted values.
    g.selectAll(".deleted")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "deleted")
        .attr("x", function(d) {
          d = d.date.split('-');
          var b = x(utils.betterDate(d[2], d[1], d[0]));
          return b; })
        .attr("y", function(d) { return y(d.value.total_deleted); } )
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - y(d.value.total_deleted); });

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
        .text("Deleted Comments Per Day");

    console.log("Done w/ comments");

  });

  console.log("Done making deleted comments graph");
}

module.exports = {
  renderDeletedGraph: doDeletedGraph,
  renderDeletedPercentGraph: doDeletedPercentGraph
};
