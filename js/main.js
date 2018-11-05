var mainContainer = document.getElementById('main_graph');
var resContainer = document.getElementById('residual_graph');


generateGraphData();
// defaultGraphData();
var options = {
  layout: {
    improvedLayout:true,
    hierarchical: {
      enabled: false,
      nodeSpacing: 300,
    //   direction: 'LR',
    }
  },
  physics: {
    stabilization: {
      // onlyDynamicEdges: true,
      fit: true,
    }
  }
  // physics: false,
};
console.log(topData);
var topGraph = new vis.Network(mainContainer, topData, options);
topGraph.storePositions();

var residualGraph = new vis.Network(resContainer, resData, options);

fordFulkerson();
