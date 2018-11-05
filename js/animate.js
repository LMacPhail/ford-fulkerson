
function animateGraph(steps){
  console.log("animating...");
  var i = 0, id = setInterval(frame, 500);
  console.log(steps);
  function frame() {
    // console.log(steps[i]);
    if(i == steps.length){
      clearInterval(id);
    } else {

      var edge_id = steps[i].edge_id;
      var changingNetwork = steps[i].network;

      switch(steps[i].action){
        // case("buildRes"):
        //   resNodes.update(nodes);
        //   break;
        case("destroyRes"):
          resEdges.clear();
          break;
        case("highlight"):
          var edge_color = steps[i].colour;
          if(changingNetwork == "topGraph"){
            topEdges.update([{id:edge_id, color:edge_color}]);
          } else if (changingNetwork == "residualGraph"){
            resEdges.update([{id:edge_id, color:edge_color}]);
          }
          break;
        case("label"):
          var label = steps[i].label;
          topEdges.update([{id: edge_id, label: label}]);
          break;
        case("add"):
          var label = steps[i].label, from = steps[i].from, to = steps[i].to;
          resEdges.add([{
            id: edge_id,
            label: label,
            from: from,
            to: to,
            arrows: {
              to: {enabled: true}
            }
          }]);
          break;
      }
      i++;
    }
  }
}

function highlightAugmentingPath(path){
  var edge_id, colour;
  // console.log("in highlight path");

  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID(algResData, path[i-1], path[i]);
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
