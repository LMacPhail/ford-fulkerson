var test = false;

var mainContainer = document.getElementById('top_graph');
var resContainer = document.getElementById('res_graph');

var options = {
  layout: {
    improvedLayout:true,
    hierarchical: { enabled: false, nodeSpacing: 300}
  },
  interaction: { hover: true },
  manipulation: { enabled: false },
  physics: { stabilization: { fit: true }}
};

// generateDefaultGraph();
generateRandomGraph();

var topGraph = new vis.Network(mainContainer, topData, options);
topGraph.storePositions();
var resGraph = new vis.Network(resContainer, resData, options);

addDragListener();
animationSteps.push({ network: TOP, action: "reveal", pStep: 0});

fordFulkerson();
