// Include some internal modules and run the graphs

var authorGraph = require('./authorgraph');
var deletedGraph = require('./deletedgraph');
authorGraph.renderAuthorGraph();
deletedGraph.renderDeletedGraph();
