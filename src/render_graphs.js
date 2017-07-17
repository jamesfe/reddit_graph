// Include some internal modules and run the graphs

var authorGraph = require('./authorgraph');
var deletedGraph = require('./deletedgraph');
var lineGraphs = require('./line_graphs');

authorGraph.renderAuthorGraph();
deletedGraph.renderDeletedGraph();
deletedGraph.renderDeletedPercentGraph('#deletedDonaldPercent', '../data/total_by_deleted.json', null);
deletedGraph.doDeletedPercentGraphByWeek('#deletedDonaldPercentWeek', '../data/deleted_r_donald_1-2016_to_22-2017_by_week.json', null);

lineGraphs.renderDeletedLineGraph('#bigLineGraph', '../data/top_100_subreddits_deleted_by_week.json');

function drawDeletedLine(redditName, color) {
  var vline = d3.line()
    .x(function(d) { return window.vdata.x(d.datetime); })
    .y(function(d) { return window.vdata.y(d.percentDeleted); });

  d3.select("#bigLineGraph")
    .select("g")
      .append("path")
        .data([window.vdata.streams[redditName]])
        .attr("class", "line")
        .attr("d", vline)
        .attr("id", "_temp_" + redditName)
        .style("stroke-width", 5)
        .style("stroke", color);
}

/* Line graph is rendered, let's create hooks for all the lines. */
function lineMouseOver() {
  var target = this.id.slice(1, this.id.length);
  drawDeletedLine(target, this.style.stroke);
}

function lineMouseOut() {
  var target = this.id.slice(1, this.id.length);
  d3.selectAll("#_temp_" + target).remove();
}


function setEventHandlers() {
  /* Set some event handlers for the window. */
  for (var r in window.vdata.reddits) {
    d3.select("#_" + window.vdata.reddits[r])
      .on("mouseover", lineMouseOver)
      .on("mouseout", lineMouseOut);
  }
}

/* Wait a second until the graph has been rendered.  #hack */
window.setTimeout(setEventHandlers, 1000);
