
var utils = require('./utils');


function renderLongevityGraph(targetElement, dataFile) {
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

module.exports = {
  renderLongevityGraph: renderLongevityGraph
};
