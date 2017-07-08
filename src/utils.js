function betterDate(y, m, d) {
  /* It turns out that for JS, 0 is January and 1 is Feb, etc. so this adjusts for that oddity.  */
  return new Date(y, m-1, d);
}

function dateFromStringWithScale(x) {
  /* Create a function that transforms dates in form DD-MM-YYYY -> scaled values */
  return function(d) {
    d = d.date.split('-');
    var b = x(betterDate(d[2], d[1], d[0]));
    return b;
  }
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

function dateFromWeekStringWithScale(x) {
  /* Create a function that transforms dates in form WW-YYYY -> scaled values */
  return function(d) {
    d = d.date.split('-');
    return x(getDateOfISOWeek(d[1], d[0]));
  }
}

module.exports = {
  betterDate: betterDate,
  dateFromStringWithScale: dateFromStringWithScale,
  dateFromWeekStringWithScale: dateFromWeekStringWithScale
};
