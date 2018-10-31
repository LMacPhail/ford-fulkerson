function animate(steps){
  var i = 0, id = setInterval(frame, 2000);
  console.log(steps);
  function frame() {
    console.log(steps[i]);
    if(i == steps.length){
      clearInterval(id);
    } else {
      var edge_id = steps[i].edge_id;
      var changingNetwork = steps[i].network;
      if(changingNetwork == "network"){
        data.edges[edge_id].color = steps[i].colour; 
        console.log(data);
        network.setData(data);
      } else if (changingNetwork == "residualGraph"){
        // resData.edges[edge_id].color = steps[i].colour;
        resData.edges[edge_id].label = "0";
        console.log(resData);
        residualGraph.setData(resData);
      }
      i++;
    }
  }
}

function highlightAugmentingPath(path){
  var steps = [], edges = resData.edges;
  var edge_id, colour;
 
  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID(resData, path[i-1], path[i]);
    edge_id = edgeData.id;
    if(edgeData.direction == 1){
      // colour = 'red';
      edges[edge_id].color = {color: 'red'};
      console.log(resData);
    }
    if(edgeData.direction == 0){
      //  colour = 'green';
      edges[edge_id].color = {color: 'green'};
    }
    steps.push({
      network: "residualGraph",
      edge_id: edge_id,
      colour: colour,
    });
  }
  // console.log(steps);
  var graph_data = {
    nodes: resData.nodes,
    edges: edges,
  };
  return graph_data;
  // animate(steps);
}