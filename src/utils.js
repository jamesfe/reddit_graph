function betterDate(y, m, d) {
  /* It turns out that for JS, 0 is January and 1 is Feb, etc. so this adjusts for that oddity.  */
  return new Date(y, m-1, d);
}

function dateFromStringWithScale(x) {
  return function(d) {
    d = d.date.split('-');
    var b = x(betterDate(d[2], d[1], d[0]));
    return b;
  };
}

module.exports = {
  betterDate: betterDate,
  dateFromStringWithScale: dateFromStringWithScale
};
