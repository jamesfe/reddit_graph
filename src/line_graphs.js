
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

  // TODO: Move this to it's end-use area
  function calcPercent(d) {
    return y(d.value.total_deleted / d.value.total * 100);
  }

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
    debugger;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        // if this thing has a key like so:
        streams[key] = [];
        for (var dateString in data[key].dates) {
          if (data[key].dates.hasOwnProperty(dateString)) {
            // Convert the dateString to a meaningful one
            // Convert the data into a percentage
            var obj = data[key].dates[dateString];
            streams[key].push({
              datetime: utils.dateFromWeekString(dateString),
              percentDeleted: (obj.total_deleted / obj.total) * 100;
            });
          }
        }
        // Sort the array by the date value
        streams[key].sort(function(a, b){
          /* From https://stackoverflow.com/a/8837511/974864
           * TODO: Needs Testing
           * */
            var keyA = new Date(a.datetime),
                keyB = new Date(b.datetime);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
      }
    }
    /*
    var max = d3.max(Object.values(data).map(function(c) { return (c.total_deleted/c.total * 100) + 4; }));
    y.domain([0, max]); // this is for percentages now

    // Somewhere around here I should throw away data outside the boundaries of my scale
    // Otherwise we can have junky looking graphs.
    var newData = [];
    for (key in data) {
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
*/

    /*
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
    */

    // Put a nice title on the graph
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
