/* A class to define a generally average graph that I might build */

var utils = require('./utils');

class NormalGraph {

  this.margin = {top: 20, right: 50,bottom: 20, left: 30}

  constructor(targetId, startDate, endDate) {
    this.svg = d3.select(targetId);
    this.setMargins(); // use the default vals
    this.x = d3.scaleTime().domain([startDate, endDate]).range([1, this.width]);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
    this.scaleFromText = utils.dateFromStringWithScale(x);
  }

  setMargins(margin=self.margin) {
    this.width = this.svg.attr("width") - margin.left - margin.right;
    this.height = this.svg.attr("height") - margin.top - margin.bottom;
  }
}
