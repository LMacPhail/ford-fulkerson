/*****************************************************************************

  File for running and controlling the animation of the algorithm.

  Functions:
  
    (20)  animateGraph(steps)

    (70)  highlightAugmentingPath(path)

******************************************************************************/

var animationSteps = [];
var play = 1;


/*
  Function: animateGraph(steps)

  Purpose:  When given an array of animation steps, iterates through each with
            a given interval, and updates the graphs on the page

*/
function animateGraph(steps){
  console.log("animating...");
  var i = 0, id = setInterval(frame, 500);
  function frame() {
    if(i == steps.length || play == 0){
      clearInterval(id);
    } else {
      var edge_id = steps[i].edge_id,
          network = steps[i].network;

      switch(steps[i].action){
        case("destroyRes"):
          resEdges.clear();
          break;

        case("highlight"):
          var edge_color = steps[i].colour;
          if(network == "topGraph"){
            topEdges.update([{id:edge_id, color:edge_color}]);
          } else if (network == "residualGraph"){
            resEdges.update([{id:edge_id, color:edge_color}]);
          }
          break;

        case("label"):
          var label = steps[i].label;
          topEdges.update([{id: edge_id, label: label}]);
          break;

        case("add"):
          var label = steps[i].label,
              from = steps[i].from,
              to = steps[i].to;
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

        default:
          console.log("Error: Invalid animation step");
          clearInterval(id);
      }
      i++;
    }
  }
}


/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
  var edge_id, colour;

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
      action: "highlight",
      edge_id: edge_id,
      colour: colour,
    });
  }
}
