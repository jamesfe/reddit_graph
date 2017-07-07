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

});

