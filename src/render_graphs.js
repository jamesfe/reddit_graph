// Include some internal modules and run the graphs

var authorGraph = require('./authorgraph');
var deletedGraph = require('./deletedgraph');
var lineGraphs = require('./line_graphs');

authorGraph.renderAuthorGraph();
deletedGraph.renderDeletedGraph();
deletedGraph.renderDeletedPercentGraph('#deletedDonaldPercent', '../data/total_by_deleted.json', null);
deletedGraph.doDeletedPercentGraphByWeek('#deletedDonaldPercentWeek', '../data/deleted_r_donald_1-2016_to_22-2017_by_week.json', null);

// TODO: Load line graph
