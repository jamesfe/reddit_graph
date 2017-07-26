function betterDate(y, m, d) {
  /* It turns out that for JS, 0 is January and 1 is Feb, etc. so this adjusts for that oddity.  */
  return new Date(Date.UTC(y, m-1, d));
}

function dateFromStringWithScale(x) {
  /* Return a function that transforms dates in form DD-MM-YYYY -> scaled values */
  return function(d) {
    if (typeof(d.date) != "string") { throw "not a string"; }
    d = d.date.split('-');
    var b = x(betterDate(d[2], d[1], d[0]));
    return b;
  };
}

function getDateOfISOWeek(w, y) {
  /* https://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number */
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function dateFromWeekString(d) {
  /* Given a WW-YYYY return a date object */
  if (typeof(d) != "string") { throw "not a string"; }
  d = d.split('-').map(function(blah) { return parseInt(blah); });
  return getDateOfISOWeek(d[0], d[1]);
}

function dateFromWeekStringWithScale(x) {
  /* Return a function that transforms dates in form WW-YYYY -> scaled values */
  return function(d) {
    if (typeof(d.date) != "string") { throw "not a string"; }
    d = d.date.split('-').map(function(blah) { return parseInt(blah); });
    return x(getDateOfISOWeek(d[0], d[1]));
  };

}

function compareDTDates(c, d) {
  /* Helper func. to access things. */
  return compareDates(new Date(c.datetime), new Date(d.datetime));
}

function compareDates(keyA, keyB){
  /* From https://stackoverflow.com/a/8837511/974864 */
  // Compare the 2 dates
  if(keyA < keyB) return -1;
  if(keyA > keyB) return 1;
  return 0;
}

  function boldGraphTitle(svgThing, text, margin) {
  /* Add a generic bold title to the target element */
  svgThing.append("g")
    .attr("transform", "translate(0, " + margin.top + ")")
    .append("text")
      .attr("font-size", "20")
      .attr("text-anchor", "beginning")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .text(text);
  return svgThing;
}

module.exports = {
  betterDate: betterDate,
  dateFromStringWithScale: dateFromStringWithScale,
  dateFromWeekStringWithScale: dateFromWeekStringWithScale,
  dateFromWeekString: dateFromWeekString,
  compareDates: compareDates,
  compareDTDates: compareDTDates
  boldGraphTitle: boldGraphTitle
};
