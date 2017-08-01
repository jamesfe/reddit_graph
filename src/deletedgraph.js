var utils = require('./utils');


function doDeletedPercentGraph(targetId, dataFile, dates) {
  /* Draw a deleted  percent graph on the target id with the given filename */
  var svg = d3.select(targetId),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([1, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var scaleFromText = utils.dateFromStringWithScale(x);
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var sampleFile = "../data/sampled_deleted_posts.json";

  function calcPercent(d) {
    return y(d.value.total_deleted / d.value.total * 100);
  }

  d3.json(dataFile, function(err, data) {
    if (err) throw err;

    var max = d3.max(Object.values(data).map(function(c) { return (c.total_deleted/c.total * 100) + 4; }));
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
          .attr("x", scaleFromText)
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
        .attr("fill", "#000000");
  });

  console.log("Done making deleted percentage graph");

}

function doDeletedGraph(targetElement, dataFile) {
  // some declarations
  var svg = d3.select(targetElement),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;
  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([1, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var scaleFromText = utils.dateFromStringWithScale(x);
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  d3.json(dataFile, function(err, data) {
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

   // Show all the comments, then next we will overlay this with the deleted values.
    g.selectAll(".blackFill")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "blackFill")
        .attr("x", scaleFromText)
        .attr("y", function(d) { return y(d.value.total); } )
        .attr("width", bandwidth)
        .attr("height", function(d) { return height - y(d.value.total); });

    // Show all the comments, then next we will overlay this with the deleted values.
    g.selectAll(".deleted")
      .data(newData)
      .enter()
      .append("rect")
        .attr("class", "deleted")
        .attr("x", scaleFromText)
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
  });
}

function doDeletedPercentGraphByWeek(targetId, dataFile, dates) {
  /* Draw a deleted  percent graph on the target id with the given filename */
  var svg = d3.select(targetId),
    margin = {top: 20, right: 50,bottom: 20, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([1, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  function calcPercent(d) {
    return y(d.value.total_deleted / d.value.total * 100);
  }

  d3.json(dataFile, function(err, data) {
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

    var minCheckDate = new Date(2200, 1, 1);
    var minDate = "";
    var maxCheckDate = new Date(2000, 1, 1);
    var maxDate = "";

    newData.forEach(function(d) {
      var dt = utils.dateFromWeekString(d.date);
      if (dt < minCheckDate) {
        minCheckDate = dt;
        minDate = d.date;
      }
      if (dt > maxCheckDate) {
        maxCheckDate = dt;
        maxDate = d.date;
      }
    });

    maxCheckDate = maxCheckDate.getTime() + (7 * 3600 * 24 * 1000); // add a week as buffer
    x.domain([minCheckDate, maxCheckDate]);

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
        .attr("x", utils.dateFromWeekStringWithScale(x))
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

  console.log("Finished with weekly graph");
}


module.exports = {
  renderDeletedGraph: doDeletedGraph,
  renderDeletedPercentGraph: doDeletedPercentGraph,
  doDeletedPercentGraphByWeek: doDeletedPercentGraphByWeek
};
