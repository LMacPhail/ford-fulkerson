
function animateGraph(steps){
  console.log("animating...");
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
        data.edges.update([{id:edge_id, color:{color:steps[i].colour}}])
      } else if (changingNetwork == "residualGraph"){
        resData.edges.update([{id:edge_id, color:{color:steps[i].colour}}])
        // resData.edges[edge_id].label = "0";
        console.log(resData);
        // residualGraph.setData(resData);
      }
      i++;
    }
  }
}

function highlightAugmentingPath(path){
  var edge_id, colour;
 
  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID(resData, path[i-1], path[i]);
    edge_id = edgeData.id;
    if(edgeData.direction == 1){
      colour = {color:'red'};
    }
    if(edgeData.direction == 0){
      colour = {color:'green'};
    }
    animationSteps.push({
      network: "residualGraph",
      edge_id: edge_id,
      colour: colour,
    });
  }
}