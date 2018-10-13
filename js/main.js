
// create a network
var mainContainer = document.getElementById('main_graph');
var resContainer = document.getElementById('residual_graph');

var N = 6, E = 10;

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

var newFlow, capacity;

// for(i = 0; i < data.edges.length; i++){
//     capacity = getCapacity(data.edges[i].label);
//     newFlow = Math.random() * capacity | 0;
//     data.edges[i].label = setFlow(data.edges[i].label, newFlow);
//     // console.log("edge " + i + " new flow: " + data.edges[i].label);
// }



// fordFulkerson(data);

