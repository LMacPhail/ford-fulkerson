
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
      var edge_color = steps[i].colour;
      var changingNetwork = steps[i].network;
      if(changingNetwork == "network"){
        topEdges.update([{id:edge_id, color:{color: 'red'}}]);
      } else if (changingNetwork == "residualGraph"){
        resEdges.update([{id:edge_id, color:{color: 'red'}}]);
        // residualGraph.setData(resData);
      }
      i++;
    }
  }
}

function highlightAugmentingPath(path){
  var edge_id, colour;
  console.log("in highlight path");
 
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