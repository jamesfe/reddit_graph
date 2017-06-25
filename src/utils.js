function betterDate(y, m, d) {
  /* It turns out that for JS, 0 is January and 1 is Feb, etc. so this adjusts for that oddity.  */
  return new Date(y, m-1, d);
}

module.exports = {
  betterDate: betterDate
};
