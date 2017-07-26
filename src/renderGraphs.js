// Include some internal modules and run the graphs

var authorGraph = require('./authorgraph');
var deletedGraph = require('./deletedgraph');
var lineGraphs = require('./lineGraphs');

function renderMainGraphs() {
  authorGraph.renderAuthorGraph();
  deletedGraph.renderDeletedGraph();
  deletedGraph.renderDeletedPercentGraph('#deletedDonaldPercent', '../data/total_by_deleted.json', null);
  deletedGraph.doDeletedPercentGraphByWeek('#deletedDonaldPercentWeek', '../data/deleted_r_donald_1-2016_to_22-2017_by_week.json', null);

  lineGraphs.renderDeletedLineGraph('#bigLineGraph', '../data/political_subreddits_deleted_by_week_19july2017.json');

  function drawDeletedLine(redditName, color) {
    /* Draw a thicker, more visible line on top when the mouse is over.. */
    d3.select("#bigLineGraph")
      .select("g")
        .append("path")
          .data([window.vdata.streams[redditName]])
          .attr("class", "line")
          .attr("d", window.vdata.vline)
          .attr("id", "_temp_" + redditName)
          .style("stroke-width", 5)
          .style("stroke", color);
  }

  function drawSubLabel(rName, color) {
    /* Put a label out there with the name of the subreddit. */
    d3.select("#bigLineGraph")
      .select("g")
      .append("text")
        .attr("id", "subLabel")
        .attr("transform", "translate(0, 50)")
        .attr("font-size", "20")
        .attr("text-anchor", "beginning")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .style("fill", color)
        .text(rName);
  }

  function lineMouseOver() {
    /* Draw a bold line and label the highlighted segment. */
    var target = this.id.slice(1, this.id.length);
    drawDeletedLine(target, this.style.stroke);
    drawSubLabel(target, this.style.stroke);
  }

  function lineMouseOut() {
    /* When the mouse leaves, we delete the elements we had just created to highlight the lines. */
    var target = this.id.slice(1, this.id.length);
    d3.selectAll("#_temp_" + target).remove();
    d3.selectAll("#subLabel").remove();
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
}

function renderLongevityGraphs() {
  var l = require('./longevityGraphs');
  l.renderLongevityGraph("#longevityGraph", "../data/large_longevity.json");
}

// TODO: Fix this horrible mess down here by importing specific library.  Will have to modify webpack config. :-(
if (window.location.pathname === "/public/") {
  renderMainGraphs();
} else if (window.location.pathname === "/public/longevity.html") {
  renderLongevityGraphs();
}
