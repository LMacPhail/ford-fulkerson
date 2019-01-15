var mainContainer = document.getElementById('top_graph');
var resContainer = document.getElementById('res_graph');


defaultGraphData();
// generateGraphData();
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
fordFulkerson();

function setNewGraph(){
  topGraph.setData(topData);
  topGraph.storePositions();
  resGraph.setData(resData);
  animationSteps = [];
  fordFulkerson();
  step = 0;
}

topGraph.addEventListener("dragEnd",  
  function(){
    topGraph.storePositions();
    resGraph.storePositions(); 
  });
resGraph.addEventListener("dragEnd",
  function(){
    topGraph.storePositions();
    resGraph.storePositions(); 
  });
