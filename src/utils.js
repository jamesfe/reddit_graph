function betterDate(y, m, d) {
  return new Date(y, m-1, d);
}

module.exports = {
  betterDate: betterDate
};
