var assert = require('assert');

var utils = require('../src/utils');
var d3 = require('d3');

// Clearly I need to write functions that are more testable.

describe('Utils', function() {
  describe('betterDate creates valid dates', function() {
    it('creates a date with 1 less month', function() {
      assert.equal(new Date(Date.UTC(2017, 0, 1)).toString(), utils.betterDate(2017, 1, 1).toString());
      assert.equal(new Date(Date.UTC(2017, 12, 1)).toString(), utils.betterDate(2017, 13, 1).toString());
    });
  });

  describe('test dateFromStringWithScale func', function() {
    it('should return a function on a scale', function() {
      var x = d3.scaleTime().domain([utils.betterDate(2016, 1, 1), utils.betterDate(2017, 5, 1)]).range([0, 100]);
      var item = utils.dateFromStringWithScale(x)
      assert.equal("function", typeof(item));
    });
  });

  describe('dateFromWeekString tests', function() {
    it('should return a date', function() {
      var result = utils.dateFromWeekString('9-2017');
      assert.equal(typeof(result), 'object');
      assert.equal(result instanceof Date, true);
    });

    it('should take only a string', function() {
      assert.throws(
        () => {
          utils.dateFromWeekString(1);
        },
        "not a string"
      );
    });
  });

  describe('compareDates tests', function() {
    it('should return -1 when first date happens earlier', function() {
      assert.equal(-1, utils.compareDates(new Date(2017, 6, 1), new Date(2019, 6, 1)));
    });

    it('should return 1 when second date happens earlier', function() {
      assert.equal(1, utils.compareDates(new Date(2019, 6, 1), new Date(2017, 6, 1)));
    });

    it('should return 0 when dates are equal', function() {
      assert.equal(0, utils.compareDates(new Date(2019, 6, 1), new Date(2019, 6, 1)));
    });

  });

  describe('isSameDay tests', function() {
    it('should find the same dates to be the same day', function() {
      assert.equal(true, utils.isSameDay(new Date(2017, 1, 1), new Date(2017, 1, 1)), "2017-1-1");
      assert.equal(true, utils.isSameDay(new Date(2017, 1, 1), new Date(2017, 1, 1, 2)));
      assert.equal(true, utils.isSameDay(new Date(2017, 1, 1), new Date(2017, 1, 1, 23)));
      assert.equal(true, utils.isSameDay(new Date(2017, 1, 2), new Date(2017, 1, 1, 25)), "adding 25 hours");
    });

    it('should return false for different days', function() {
      assert.equal(false, utils.isSameDay(new Date(2017, 1, 1), new Date(2017, 1, 2)), "2017-1-1");
      assert.equal(false, utils.isSameDay(new Date(2017, 1, 1), new Date(2017, 1, 2)), "2017-1-1");
      assert.equal(false, utils.isSameDay(new Date(2016, 1, 1), new Date(2017, 1, 1, 25)), "adding 25 hours, false");
      assert.equal(false, utils.isSameDay(new Date(2017, 2, 1), new Date(2017, 1, 1, 25)), "adding 25 hours, false");
    });
  });

  describe('dateFromString tests', function() {
    it('should make a date from a string', function() {
      var result = utils.dateFromString("22-1-1985")
      assert.equal(typeof(result), 'object');
      assert.equal(result instanceof Date, true);
    });

    it('should take only a string', function() {
      assert.throws(
        () => {
          utils.dateFromString(1);
        },
        "not a string"
      );
    });

    it('should return the right day', function() {
      assert.equal(true, utils.isSameDay(utils.dateFromString("22-1-1985"), new Date(1985, 0, 22)));
    });
  });

  describe('numberOfDaysBetween tests', function() {
    it('should return the right number of days', function() {
      var res = utils.numberOfDaysBetween(new Date(2017, 1, 1), new Date(2017, 1, 14));
      assert.equal(res, 13);
    });
    it('should return 0 for the same day', function() {
      var res = utils.numberOfDaysBetween(new Date(2017, 1, 1), new Date(2017, 1, 1));
      assert.equal(res, 0);
    });
    it('should return positive for the previous days', function() {
      var res = utils.numberOfDaysBetween(new Date(2017, 1, 15), new Date(2017, 1, 1));
      assert.equal(res, 14);
    });

  });

});

