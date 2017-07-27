var assert = require('assert');

var lineGraph = require('../src/lineGraphs');
var d3 = require('d3');

describe('lineGraph Tests', function() {
  describe('processMultiSubredditData', function() {

    var sampleData = {
      "blah": {
        "dates": {
          "1-2017": { "total": 200, "total_deleted": 100, "total_not_deleted": 100},
          "2-2017": { "total": 200, "total_deleted": 150, "total_not_deleted": 50},
          "3-2017": { "total": 200, "total_deleted": 50, "total_not_deleted": 150}
        }
      }
    };
              ;
    it('computes its output properly for one reddit', function() {
      var check = lineGraph.processMultiSubredditData(sampleData);
      assert.equal(check.maxPercent, 75);
      assert.equal(check.minPercent, 25);
      assert.ok(check.reddits.includes('blah'));
      assert.equal(check.streams.blah.length, 3);
    });
  });
});
