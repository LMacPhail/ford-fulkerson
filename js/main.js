var mainContainer = document.getElementById('top_graph');
var resContainer = document.getElementById('res_graph');


// generateDefaultGraph();
generateRandomGraph();

// newNodeID = nodes.length - 1;
// newEdgeID = edges.length - 1;
var options = {
  layout: {
    improvedLayout:true,
    hierarchical: {
      enabled: false,
      nodeSpacing: 300,
    }
  },
  interaction: {
    hover: true,
  },
  physics: {
    stabilization: {
      fit: true,
    }
  }
};
var topGraph = new vis.Network(mainContainer, topData, options);
topGraph.storePositions();

var resGraph = new vis.Network(resContainer, resData, options);

topGraph.addEventListener("dragEnd", function(){
    topGraph.storePositions();
    resGraph.storePositions(); 
  });
resGraph.addEventListener("dragEnd", function(){
    topGraph.storePositions();
    resGraph.storePositions(); 
  });

animationSteps.push({
  network: TOP,
  action: "reveal",
  pStep: 0,
});

fordFulkerson();

