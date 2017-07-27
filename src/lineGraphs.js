var utils = require('./utils');

function processMultiSubredditData(data) {
  /* Take the data we load from the JSON, make it into something
   * worthy of a line graph. */
  var ro = {
    maxPercent: 0,
    minPercent: 100,
    maxDate: new Date(1900, 0, 1),
    minDate: new Date(2300, 0, 1),
    reddits: [],
    streams: {}
  };
 for (var key in data) {
    if (data.hasOwnProperty(key)) {
      // if this thing has a key like so:
      ro.reddits.push(key);
      ro.streams[key] = [];
      for (var dateString in data[key].dates) {
        if (data[key].dates.hasOwnProperty(dateString)) {
          // Convert the dateString to a meaningful one
          // Convert the data into a percentage
          var obj = data[key].dates[dateString];
          var dt = utils.dateFromWeekString(dateString);
          var pct = (obj.total_deleted / obj.total) * 100;
          if (dt < ro.minDate) { ro.minDate = dt; }
          if (dt > ro.maxDate) { ro.maxDate = dt; }
          if (pct < ro.minPercent) { ro.minPercent = pct; }
          if (pct > ro.maxPercent) { ro.maxPercent = pct; }
          ro.streams[key].push({
            datetime: dt,
            percentDeleted: pct
          });
        }
      }
      // Sort the array by the date value
      ro.streams[key].sort(utils.compareDTDates);
    }
  }
  return ro;
}

function renderDeletedLineGraph(targetElement, dataFile) {
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
    // Here we have a file with multiple streams of data - we should iterate over each one we want to show and display it.
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
    y.domain([0, pd.maxPercent]);
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

    window.vdata.reddits.forEach(function(c, i) {
      g.append("path")
        .data([window.vdata.streams[c]])
        .attr("class", "line")
        .attr("d", vline)
        .attr("id", "_"+c)
        .style("stroke", colorScale(i % 20))
        .style("opacity", "0.5");
    });

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
  renderDeletedLineGraph: renderDeletedLineGraph,
  processMultiSubredditData: processMultiSubredditData
};
