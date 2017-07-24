
var utils = require('./utils');


function renderLongevityGraph(targetElement, dataFile) {
  /* Generate a line graph of the selected data. */
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  /* We set the domains for both of these once we know more about the data. */
  var x = d3.scaleTime().range([1, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  d3.json(dataFile, function(err, data) {
    /* here what we are goto do is 
     * */

    if (err) throw err;
    
    if (data.reddits !== undefined) { data = data.reddits; }
    else { throw 'no reddit data.'; }
    /* We have here the goal of loading the big JSON file and creating various streams of data.
     * The data file is a set of dicts like so: "reddits" => subreddits => "dates" => [WW-YYYY] => [obj]
     * Where OBJ looks like {total: x+y, total_deleted: x, total_not_delted: y}
     *
     * What we want is:
     * [reddits] => [date, value]
     * */

    // pd == processed data
    pd = processMultiSubredditData(data);
    // y.domain([0, pd.maxPercent]);
    y.domain([0, 35]);
    x.domain([pd.minDate, pd.maxDate]);
    var vline = d3.line()
      .x(function(d) { return x(d.datetime); })
      .y(function(d) { return y(d.percentDeleted); });

    // To enable us to come back to this data later.
    window.vdata = {
      streams: pd.streams,
      reddits: pd.reddits,
      x: x,
      y: y,
      vline: vline
    };

    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

    for (var i = 0; i < window.vdata.reddits.length; i++) {
      g.append("path")
        .data([window.vdata.streams[window.vdata.reddits[i]]])
        .attr("class", "line")
        .attr("d", vline)
        .attr("id", "_"+window.vdata.reddits[i])
        .style("stroke", colorScale(i % 20))
        .style("opacity", "0.5");
    }

    // Put a title on the graph
    g.append("g")
      .attr("transform", "translate(0, " + margin.top + ")")
      .append("text")
        .attr("font-size", "20")
        .attr("text-anchor", "beginning")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .text("Proportions of Deleted Comments by Week");

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
        .text("Percent Comments Deleted");
  });
}

module.exports = {
  renderLongevityGraph: renderLongevityGraph
}
