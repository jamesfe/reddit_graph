var utils = require('./utils');

function renderDeletedLineGraph(targetElement, dataFile) {
  /* Generate a line graph of the selected data. */
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  /* We set the domains for both of these once we know more about the data. */
  var x = d3.scaleTime().range([1, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

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

    // TODO: Refactor to function, write some unit tests.
    var streams = {};
    var maxPercent = 0,
      minPercent = 100,
      maxDate = new Date(2000, 0, 1),
      minDate = new Date(2020, 0, 1),
      reddits = [];

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        // if this thing has a key like so:
        reddits.push(key);
        streams[key] = [];
        for (var dateString in data[key].dates) {
          if (data[key].dates.hasOwnProperty(dateString)) {
            // Convert the dateString to a meaningful one
            // Convert the data into a percentage
            var obj = data[key].dates[dateString];
            var dt = utils.dateFromWeekString(dateString);
            var pct = (obj.total_deleted / obj.total) * 100;
            if (dt < minDate) { minDate = dt; }
            else if (dt > maxDate) { maxDate = dt; }
            if (pct < minPercent) { minPercent = pct; }
            else if (pct > maxPercent) { maxPercent = pct; }
            streams[key].push({
              datetime: dt,
              percentDeleted: pct
            });
          }
        }
        // Sort the array by the date value
        streams[key].sort(utils.compareDTDates);
      }
    }

    y.domain([0, maxPercent]);
    x.domain([minDate, maxDate]);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    // X Axis
    g.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));

    var vline = d3.line()
      .x(function(d) { return x(d.datetime); })
      .y(function(d) { return y(d.percentDeleted); });

    for (var i = 0; i < reddits.length; i++) {
      g.append("path")
        .data([streams[reddits[i]]])
        .attr("class", "line")
        .attr("d", vline)
        .style("stroke", colorScale(i % 20));
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
  renderDeletedLineGraph: renderDeletedLineGraph
};
