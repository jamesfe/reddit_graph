var utils = require('./utils');

function doAuthorGraph() {
  // some declarations
  var svg = d3.select("#authorChart"),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  d3.json("../data/author_count_per_day.json", function(err, data) {
    if (err) throw err;

    data = data.authors_per_day;
    y.domain([0, d3.max(Object.values(data))]);

    var newData = [];
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        newData.push({"date": key, "value": data[key]});
      }
    }
    // create a bar width that has a gap of 1 px
    var bandwidth = (width / newData.length) - 1;

    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

   // Data
    g.selectAll(".blah")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "blah")
        .attr("x", function(d) {
          d = d.date.split('-');
          var b = x(utils.betterDate(d[2], d[1], d[0]));
          return b; })
        .attr("y", function(d) { return y(d.value); } )
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - y(d.value); });

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
        .text("Different Comment Authors");

    console.log("Done");

  });

  console.log("Done making author graph");
}

module.exports = {
  renderAuthorGraph: doAuthorGraph
};
