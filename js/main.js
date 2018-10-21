
// create a network
var mainContainer = document.getElementById('main_graph');
var resContainer = document.getElementById('residual_graph');

var animationSteps;

var nodes = [], edges = [];
var N = 6, E = 13;
// var residualGraph = new vis.Network(mainContainer, null, options);
var data = generateGraphData(N, E);
// var data = defaultGraphData();
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
var network = new vis.Network(mainContainer, data, options);
network.storePositions();

var emptyData = {nodes: nodes, edges:edges};
var residualGraph = new vis.Network(resContainer, emptyData, options);
