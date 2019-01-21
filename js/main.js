var mainContainer = document.getElementById('top_graph');
var resContainer = document.getElementById('res_graph');


generateDefaultGraph();
// generateRandomGraph();

newNodeID = nodes.length - 1;
newEdgeID = edges.length - 1;
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
  manipulation: {
    enabled: false,
    addNode: function (data, callback) {
      data.id = newNodeID;
      data.label = "n" + newNodeID;
      data.physics = false;
      callback(data);
      nodes = addNode(nodes, newNodeID, data.label, data.x, data.y);
      newNodeID++;
    },
    addEdge: function (data, callback) {
      data.id = newEdgeID;
      data.arrows = {to: {enabled: true}};
      var capacity = prompt("Please enter capacity of new edge (whole number)", 4);
      if(Number.isInteger(parseInt(capacity))){
          data.label = 0 + '/' + capacity;
          if (data.from == data.to) {
              var r = confirm("Do you want to connect the node to itself?");
              if (r == true) {
                  callback(data);
                  edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
              }
          } else {
              callback(data);
              edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
          }
      }
      newEdgeID++;
    }
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
  document.getElementById("flow_counter").innerHTML = "Current flow: 0";
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


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, options);
});


// draw();