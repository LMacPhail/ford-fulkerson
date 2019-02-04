var mainContainer = document.getElementById('top_graph');
var resContainer = document.getElementById('res_graph');


generateDefaultGraph();
// generateRandomGraphData();

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
    },
    deleteNode: function (data, callback) {
      var nodeIds = data.nodes, i;
      nodes.splice(nodeIds[0] + 1, 1);
      for(i = nodeIds[0] + 1; i < nodes.length; i++){
        nodes[i].id = i - 1;
        nodes[i].label = "n" + (i-1);
        topNodes.remove(i);
      }
      newNodeID--;
      topNodes.update(nodes);
      callback(data);
    },
    deleteEdge: function (data, callback) {
      var  edgeIds = data.edges, i;
      for(i = edgeIds[0] + 1; i < edges.length; i++){
        edges[i].id = i - 1;
        topEdges.remove(i);
      }
      edges.splice(edgeIds[0], 1);
      topEdges.update(edges);
      newEdgeID--;
      console.log(data);
      callback(data);
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


animationSteps.push({
  network: TOP,
  action: "reveal",
  pStep: 0,
});

fordFulkerson();

function resetFlowCounter(){
  document.getElementById("flow_counter").innerHTML = "Current flow: 0";
}

function resetTraceback(){
  document.getElementById("traceback").innerHTML = '<p class="caption traceback_line">press play to begin.</p>';
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

(function(){
  function onChange(event) {
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
      try {
          var data = JSON.parse(event.target.result);
      } catch(err) {
          alert("Parsing error: " + err);
          document.getElementById("uploadFile").val = '';
          return;
      }
      var validGraph = checkValidGraph(data.nodes, data.edges);
      if (validGraph){ 
          loadNewGraph(createGraphFromUpload, data.nodes, data.edges);
      } else {
          document.getElementById("uploadFile").val = '';
      }
  }
  
  document.getElementById("uploadFile").addEventListener('change', onChange);

}());
// draw();