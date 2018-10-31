var mainContainer = document.getElementById('main_graph');
var resContainer = document.getElementById('residual_graph');


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

var resData = {nodes: nodes, edges:edges};
var residualGraph = new vis.Network(resContainer, resData, options);

function run(){
  fordFulkerson(data);
  // animate(animationSteps);
}
